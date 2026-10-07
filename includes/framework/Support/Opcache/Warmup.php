<?php

namespace Jankx\Support\Opcache;

/**
 * Builds the file manifest that has to live in OPcache and compiles it.
 *
 * Two callers share this:
 *
 * - `opcache-preload.php` (php.ini `opcache.preload`) — the real warm boot:
 *   the web server compiles every file once at start-up, so the first request
 *   (and every request after a restart) never pays for compilation;
 * - `wp jankx cache warmup` — validates the same manifest and reports the
 *   OPcache state of the current SAPI (CLI usually has OPcache off, which is
 *   why the preload file is the authoritative mechanism).
 *
 * Dev-only packages (PHPUnit, Mockery, php-parser, …) and the extension trees
 * are deliberately left out: they either never run in production or would
 * burn memory for code that loads on demand anyway.
 *
 * @package Jankx\Support\Opcache
 * @since 2.0.0
 */
class Warmup
{
    /**
     * Path fragments that never belong in a warm boot.
     *
     * @var string[]
     */
    const SKIP_MARKERS = [
        '/node_modules/',
        '/tests/',
        '/benchmarks/',
        '/resources/',
        '/scripts/',
        '/vendor/phpunit/',
        '/vendor/sebastian/',
        '/vendor/phar-io/',
        '/vendor/hamcrest/',
        '/vendor/theseer/',
        '/vendor/mockery/',
        '/vendor/brain/',
        '/vendor/yoast/',
        '/vendor/doctrine/',
        '/vendor/myclabs/',
        '/vendor/nikic/',
        '/vendor/deep-copy/',
    ];

    /**
     * Files every request touches before any class is autoloaded.
     *
     * @var string[]
     */
    const ENTRY_FILES = [
        'ajax.php',
        'functions.php',
        'opcache-preload.php',
        'includes/framework.php',
    ];

    /**
     * @var string[]
     */
    private $themeDirs;

    /**
     * @param string|string[] $themeDirs Theme directories to warm (parent and
     *                                   child themes).
     */
    public function __construct($themeDirs)
    {
        $dirs = is_array($themeDirs) ? $themeDirs : [$themeDirs];

        $this->themeDirs = [];
        foreach ($dirs as $dir) {
            $dir = rtrim((string) $dir, '/');
            if ($dir !== '' && is_dir($dir)) {
                $this->themeDirs[] = $dir;
            }
        }
    }

    /**
     * Every theme in `wp-content/themes` that carries its own autoloader —
     * the parent plus whichever child themes ship a composer.json.
     *
     * @param string $parentDir Parent theme directory.
     * @return string[]
     */
    public static function themeDirs(string $parentDir): array
    {
        $dirs = [$parentDir];

        foreach (glob(dirname($parentDir) . '/*', GLOB_ONLYDIR) ?: [] as $sibling) {
            if (basename($sibling) === basename($parentDir)) {
                continue;
            }
            if (is_file($sibling . '/style.css') && is_file($sibling . '/composer.json')) {
                $dirs[] = $sibling;
            }
        }

        return $dirs;
    }

    /**
     * Absolute paths of every file that should be compiled, deduplicated.
     *
     * @return string[]
     */
    public function manifest(): array
    {
        $files = [];

        foreach ($this->themeDirs as $dir) {
            foreach (self::ENTRY_FILES as $relative) {
                $path = $dir . '/' . $relative;
                if (is_file($path)) {
                    $files[$path] = $path;
                }
            }

            foreach ($this->psr4Dirs($dir) as $psr4Dir) {
                foreach ($this->phpFiles($psr4Dir) as $path) {
                    if (!$this->skipped($path)) {
                        $files[$path] = $path;
                    }
                }
            }

            foreach ($this->classMapFiles($dir) as $path) {
                if (!$this->skipped($path)) {
                    $files[$path] = $path;
                }
            }

            foreach ($this->fileFiles($dir) as $path) {
                if (is_file($path) && !$this->skipped($path)) {
                    $files[$path] = $path;
                }
            }

            foreach ($this->phpFiles($dir . '/config') as $path) {
                if (!$this->skipped($path)) {
                    $files[$path] = $path;
                }
            }
        }

        ksort($files);

        return array_values($files);
    }

    /**
     * Compile every file into the shared OPcache.
     *
     * @param string[] $files Manifest.
     * @return array{compiled:int,failed:int,elapsed:float,messages:string[]}
     */
    public function compile(array $files): array
    {
        $compiled = 0;
        $failed = 0;
        $messages = [];
        $start = microtime(true);

        foreach ($files as $file) {
            $result = false;
            try {
                $result = @opcache_compile_file($file);
            } catch (\Throwable $exception) {
                $messages[] = basename($file) . ': ' . $exception->getMessage();
            }

            if ($result) {
                $compiled++;
                continue;
            }

            $failed++;
            if (count($messages) < 5) {
                $last = error_get_last();
                $messages[] = basename($file) . ': ' . (is_array($last) && isset($last['message'])
                    ? $last['message']
                    : 'not compiled');
            }
        }

        return [
            'compiled' => $compiled,
            'failed'   => $failed,
            'elapsed'  => microtime(true) - $start,
            'messages' => $messages,
        ];
    }

    /**
     * Check the manifest without compiling (OPcache may be off in this SAPI).
     *
     * @param string[] $files Manifest.
     * @return array{readable:int,missing:string[]}
     */
    public function validate(array $files): array
    {
        $readable = 0;
        $missing = [];

        foreach ($files as $file) {
            if (is_file($file) && is_readable($file)) {
                $readable++;
            } else {
                $missing[] = $file;
            }
        }

        return ['readable' => $readable, 'missing' => $missing];
    }

    /**
     * Whether OPcache is running in this process/SAPI.
     *
     * @return bool
     */
    public static function isStarted(): bool
    {
        return function_exists('opcache_get_status') && opcache_get_status(false) !== false;
    }

    /**
     * Compact view of the current SAPI's OPcache.
     *
     * @return array<string,mixed>
     */
    public static function status(): array
    {
        if (!function_exists('opcache_get_status')) {
            return ['available' => false, 'started' => false];
        }

        $status = opcache_get_status(false);
        if ($status === false) {
            return ['available' => true, 'started' => false, 'sapi' => PHP_SAPI];
        }

        return [
            'available' => true,
            'started'   => true,
            'sapi'      => PHP_SAPI,
            'enabled'   => !empty($status['opcache_enabled']),
            'scripts'   => isset($status['cached_scripts']) ? (int) $status['cached_scripts'] : 0,
            'used'      => isset($status['memory_usage']['used']) ? (int) $status['memory_usage']['used'] : 0,
            'free'      => isset($status['memory_usage']['free']) ? (int) $status['memory_usage']['free'] : 0,
            'hits'      => isset($status['opcache_statistics']['hits']) ? (int) $status['opcache_statistics']['hits'] : 0,
            'misses'    => isset($status['opcache_statistics']['misses']) ? (int) $status['opcache_statistics']['misses'] : 0,
            'preload'   => (string) ini_get('opcache.preload'),
            'validate'  => (string) ini_get('opcache.validate_timestamps'),
        ];
    }

    /**
     * One line for `wp jankx cache status`.
     *
     * @return string
     */
    public static function summaryLine(): string
    {
        $status = self::status();

        if (empty($status['started'])) {
            return sprintf(
                'not started in SAPI "%s" — warm boot happens in the web SAPI via opcache.preload',
                PHP_SAPI
            );
        }

        $hits = (int) $status['hits'];
        $misses = (int) $status['misses'];
        $ratio = ($hits + $misses) > 0 ? round($hits / ($hits + $misses) * 100, 1) : 0.0;

        return sprintf(
            'enabled | scripts %d | memory %s/%s | hit %s%% | preload %s | validate_timestamps %s',
            $status['scripts'],
            self::bytes($status['used']),
            self::bytes($status['used'] + $status['free']),
            $ratio,
            $status['preload'] !== '' ? basename($status['preload']) : 'not configured',
            $status['validate'] === '0' ? 'off (production)' : $status['validate']
        );
    }

    /**
     * php.ini lines to put the manifest in front of every request.
     *
     * @param string $preloadFile Absolute path of opcache-preload.php.
     * @param int    $fileCount   Size of the manifest (drives max_accelerated_files).
     * @return string[]
     */
    public static function iniSnippet(string $preloadFile, int $fileCount): array
    {
        $maxFiles = (int) (ceil(($fileCount * 1.2) / 100) * 100);

        return [
            'opcache.enable=1',
            'opcache.memory_consumption=128',
            'opcache.max_accelerated_files=' . max(1000, $maxFiles),
            'opcache.preload=' . $preloadFile,
            '; opcache.preload_user=www-data   ; only when the master process runs as root',
            '; opcache.validate_timestamps=0   ; production: stop re-stat' . 'ing files (deploy = restart PHP)',
        ];
    }

    /**
     * @param string $themeDir Theme directory.
     * @return string[]
     */
    private function psr4Dirs(string $themeDir): array
    {
        $map = $this->composerMap($themeDir, 'autoload_psr4.php');

        $dirs = [];
        foreach ($map as $prefix => $paths) {
            if ($prefix === 'Tests\\' || strpos($prefix, 'Tests\\') === 0) {
                continue;
            }

            foreach ((array) $paths as $path) {
                $absolute = $this->absolute($themeDir, $path);
                if ($absolute !== null) {
                    $dirs[$absolute] = $absolute;
                }
            }
        }

        return array_values($dirs);
    }

    /**
     * @param string $themeDir Theme directory.
     * @return string[]
     */
    private function classMapFiles(string $themeDir): array
    {
        $map = $this->composerMap($themeDir, 'autoload_classmap.php');

        $files = [];
        foreach ($map as $path) {
            $absolute = $this->absolute($themeDir, $path);
            if ($absolute !== null) {
                $files[$absolute] = $absolute;
            }
        }

        return array_values($files);
    }

    /**
     * @param string $themeDir Theme directory.
     * @return string[]
     */
    private function fileFiles(string $themeDir): array
    {
        $files = $this->composerMap($themeDir, 'autoload_files.php');

        $resolved = [];
        foreach ($files as $path) {
            $absolute = $this->absolute($themeDir, $path);
            if ($absolute !== null) {
                $resolved[$absolute] = $absolute;
            }
        }

        return array_values($resolved);
    }

    /**
     * @param string $themeDir Theme directory.
     * @param string $file     Composer autoload file name.
     * @return array<string,mixed>
     */
    private function composerMap(string $themeDir, string $file): array
    {
        $path = $themeDir . '/vendor/composer/' . $file;
        if (!is_file($path)) {
            return [];
        }

        $map = require $path;

        return is_array($map) ? $map : [];
    }

    /**
     * @param string $themeDir Theme directory.
     * @param string $path     Path as written by composer (relative or absolute).
     * @return string|null
     */
    private function absolute(string $themeDir, string $path): ?string
    {
        $path = (string) $path;
        if ($path === '') {
            return null;
        }

        if ($path[0] !== '/') {
            $path = $themeDir . '/' . ltrim($path, './');
        }

        $real = realpath($path);

        return $real !== false ? $real : null;
    }

    /**
     * @param string $directory Directory to walk.
     * @return string[]
     */
    private function phpFiles(string $directory): array
    {
        if (!is_dir($directory)) {
            return [];
        }

        $files = [];
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($directory, \FilesystemIterator::SKIP_DOTS)
        );

        foreach ($iterator as $item) {
            if ($item->isFile() && $item->getExtension() === 'php') {
                $files[$item->getPathname()] = $item->getPathname();
            }
        }

        return array_values($files);
    }

    /**
     * @param string $path File path.
     * @return bool
     */
    private function skipped(string $path): bool
    {
        $path = '/' . ltrim($path, '/');

        foreach (self::SKIP_MARKERS as $marker) {
            if (strpos($path, $marker) !== false) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param int $bytes Byte count.
     * @return string
     */
    private static function bytes(int $bytes): string
    {
        if ($bytes >= 1048576) {
            return round($bytes / 1048576, 1) . 'M';
        }

        if ($bytes >= 1024) {
            return round($bytes / 1024, 1) . 'K';
        }

        return (string) $bytes;
    }
}
