<?php

namespace Jankx\CLI\Commands;

use WP_CLI;
use WP_CLI_Command;

/**
 * WP CLI Command to create release package for Jankx Framework
 *
 * @package Jankx\CLI\Commands
 * @since 2.0.0
 */
class ReleaseCommand extends WP_CLI_Command
{
    /**
     * @var array
     * @since 2.0.0
     */
    private $excludePatterns = [];

    /**
     * @var string
     * @since 2.0.0
     */
    private $themePath;

    /**
     * @var string
     * @since 2.0.0
     */
    private $themeName;

    /**
     * Constructor
     *
     * @since 2.0.0
     */
    public function __construct()
    {
        $this->themePath = get_template_directory();
        $this->themeName = get_template();
        $this->loadExcludePatterns();
    }

    /**
     * Create release package for Jankx Framework
     *
     * ## OPTIONS
     *
     * [--version=<version>]
     * : Version number for the release (default: auto-detect from style.css)
     *
     * [--output=<output>]
     * : Output directory for the release package (default: ./releases)
     *
     * [--force]
     * : Force overwrite existing release file
     *
     * [--dry-run]
     * : Show what would be included without creating the package
     *
     * ## EXAMPLES
     *
     *     # Create release with auto-detected version
     *     wp jankx release
     *
     *     # Create release with specific version
     *     wp jankx release --version=2.0.0
     *
     *     # Create release with custom output directory
     *     wp jankx release --output=/path/to/releases
     *
     *     # Dry run to see what would be included
     *     wp jankx release --dry-run
     *
     * @since 2.0.0
     */
    public function __invoke($args, $assoc_args)
    {
        $version = isset($assoc_args['version']) ? $assoc_args['version'] : $this->getThemeVersion();
        $outputDir = isset($assoc_args['output']) ? $assoc_args['output'] : './releases';
        $force = isset($assoc_args['force']);
        $dryRun = isset($assoc_args['dry-run']);

        WP_CLI::log("🎯 Creating Jankx Framework Release Package");
        WP_CLI::log("📦 Theme: {$this->themeName}");
        WP_CLI::log("🏷️  Version: {$version}");
        WP_CLI::log("📁 Output: {$outputDir}");
        WP_CLI::log("");

        // Validate theme path
        if (!is_dir($this->themePath)) {
            WP_CLI::error("Theme directory not found: {$this->themePath}");
            return;
        }

        // Create output directory
        if (!$dryRun && !is_dir($outputDir)) {
            if (!mkdir($outputDir, 0755, true)) {
                WP_CLI::error("Failed to create output directory: {$outputDir}");
                return;
            }
        }

        // Get files to include
        $files = $this->getFilesToInclude();

        WP_CLI::log("📁 Theme path: {$this->themePath}");
        WP_CLI::log("📄 Files found: " . count($files));

        if (empty($files)) {
            WP_CLI::error("No files to include in release package. Please check your exclude patterns and .gitattributes.");
            WP_CLI::log("🔍 Debug info:");
            WP_CLI::log("   - Theme path: {$this->themePath}");
            WP_CLI::log("   - Exclude patterns: " . count($this->excludePatterns));
            return;
        }

        if ($dryRun) {
            $this->displayDryRun($files);
            return;
        }

        // Create release package
        $packageName = "{$this->themeName}-{$version}.zip";
        $packagePath = rtrim($outputDir, '/') . '/' . $packageName;

        // Check if file exists
        if (file_exists($packagePath) && !$force) {
            WP_CLI::error("Release package already exists: {$packagePath}");
            WP_CLI::log("Use --force to overwrite");
            return;
        }

        // Create ZIP package
        if ($this->createZipPackage($files, $packagePath)) {
            // Check if file exists before getting size
            if (file_exists($packagePath)) {
                $size = $this->formatBytes(filesize($packagePath));
                WP_CLI::success("Release package created successfully!");
                WP_CLI::log("📦 Package: {$packagePath}");
                WP_CLI::log("📊 Size: {$size}");
                WP_CLI::log("📄 Files included: " . count($files));
            } else {
                WP_CLI::error("Release package created but file not found: {$packagePath}");
            }
        } else {
            WP_CLI::error("Failed to create release package (no files added or error during zipping)");
        }
    }

    /**
     * Load exclude patterns from .gitattributes
     *
     * @since 2.0.0
     */
    private function loadExcludePatterns()
    {
        $gitattributesPath = $this->themePath . '/.gitattributes';

        if (!file_exists($gitattributesPath)) {
            WP_CLI::warning(".gitattributes file not found, using default excludes");
            $this->excludePatterns = [
                '/tests',
                '/examples',
                '/coverage-report',
                '/docs',
                '/node_modules',
                '/.git',
                '/.github',
                '/.gitignore',
                '/.gitattributes',
                '/phpunit.xml',
                '/TESTING.md',
                '/docker-compose.yml',
                '/Dockerfile',
                '/package-lock.json',
                '/composer.lock',
                '/.DS_Store',
                '/Thumbs.db',
                '/Desktop.ini',
                '/.vscode',
                '/.idea',
                '*.log',
                '*.tmp',
                '*.temp',
                '*.swp',
                '*.swo',
                '*~',
                '/.sass-cache',
                '/style.js*',
                '/coverage.xml',
                '/.phpunit.cache',
                '/.phpunit.result.cache'
            ];
            return;
        }

        $content = file_get_contents($gitattributesPath);
        $lines = explode("\n", $content);

        WP_CLI::log("📖 Reading exclude patterns from .gitattributes...");

        foreach ($lines as $line) {
            $line = trim($line);
            if (empty($line) || strpos($line, '#') === 0) {
                continue;
            }

            if (strpos($line, 'export-ignore') !== false) {
                $pattern = trim(str_replace('export-ignore', '', $line));
                if (!empty($pattern)) {
                    // Đảm bảo vendor directory được include (không loại trừ)
                    if ($pattern !== '/vendor' && $pattern !== 'vendor/') {
                        $this->excludePatterns[] = $pattern;
                        WP_CLI::log("   - Excluding: {$pattern}");
                    } else {
                        WP_CLI::log("   - Including: {$pattern} (vendor directory)");
                    }
                }
            }
        }

        // Luôn ignore .git directory dù có khai báo hay không
        if (!in_array('/.git', $this->excludePatterns)) {
            $this->excludePatterns[] = '/.git';
            WP_CLI::log("   - Excluding: /.git (always ignored)");
        }

        // Luôn ignore system files dù có khai báo hay không
        $systemFiles = [
            // Windows
            '/Thumbs.db',
            '/ehthumbs.db',
            '/Desktop.ini',
            // macOS
            '/.DS_Store',
            '/.AppleDouble',
            '/.LSOverride',
            // Linux
            '/.Trash-*',
            '/.nfs*',
            // Common
            '*.tmp',
            '*.temp',
            '*.swp',
            '*.swo',
            '*~'
        ];

        foreach ($systemFiles as $systemFile) {
            if (!in_array($systemFile, $this->excludePatterns)) {
                $this->excludePatterns[] = $systemFile;
                WP_CLI::log("   - Excluding: {$systemFile} (system file)");
            }
        }

        WP_CLI::log("📋 Total exclude patterns loaded: " . count($this->excludePatterns));
    }

    /**
     * Get files to include in release package
     *
     * @return array
     * @since 2.0.0
     */
    private function getFilesToInclude()
    {
        $files = [];
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($this->themePath, \RecursiveDirectoryIterator::SKIP_DOTS)
        );

        foreach ($iterator as $file) {
            $relativePath = str_replace($this->themePath . '/', '', $file->getPathname());

            if ($this->shouldIncludeFile($relativePath)) {
                $files[] = $relativePath;
            }
        }

        return $files;
    }

    /**
     * Check if file should be included in release
     *
     * @param string $relativePath
     * @return bool
     * @since 2.0.0
     */
    private function shouldIncludeFile($relativePath)
    {
        foreach ($this->excludePatterns as $pattern) {
            $pattern = trim($pattern, '/');

            // Handle wildcard patterns
            if (strpos($pattern, '*') !== false) {
                $regex = str_replace(['*', '.'], ['.*', '\.'], $pattern);
                if (preg_match('/' . $regex . '/', $relativePath)) {
                    return false;
                }
            }
            // Handle directory patterns
            elseif (strpos($pattern, '/') !== false) {
                if (strpos($relativePath, $pattern) === 0) {
                    return false;
                }
            }
            // Handle file patterns
            else {
                if (basename($relativePath) === $pattern) {
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Get theme version from style.css
     *
     * @return string
     * @since 2.0.0
     */
    private function getThemeVersion()
    {
        $stylePath = $this->themePath . '/style.css';

        if (!file_exists($stylePath)) {
            return '1.0.0';
        }

        $content = file_get_contents($stylePath);

        if (preg_match('/Version:\s*([^\n\r]+)/i', $content, $matches)) {
            return trim($matches[1]);
        }

        return '1.0.0';
    }

    /**
     * Display dry run information
     *
     * @param array $files
     * @since 2.0.0
     */
    private function displayDryRun($files)
    {
        WP_CLI::log("🔍 DRY RUN - Files that would be included:");
        WP_CLI::log("📄 Total files: " . count($files));
        WP_CLI::log("");

        // Group files by directory
        $groupedFiles = [];
        foreach ($files as $file) {
            $dir = dirname($file);
            if ($dir === '.') {
                $dir = 'root';
            }
            $groupedFiles[$dir][] = $file;
        }

        foreach ($groupedFiles as $dir => $dirFiles) {
            WP_CLI::log("📁 {$dir}/ (" . count($dirFiles) . " files)");
            foreach (array_slice($dirFiles, 0, 5) as $file) {
                WP_CLI::log("   - {$file}");
            }
            if (count($dirFiles) > 5) {
                WP_CLI::log("   ... and " . (count($dirFiles) - 5) . " more files");
            }
            WP_CLI::log("");
        }

        WP_CLI::log("✅ Dry run completed. Use --force to create actual package.");
    }

    /**
     * Create ZIP package
     *
     * @param array $files
     * @param string $packagePath
     * @return bool
     * @since 2.0.0
     */
    private function createZipPackage($files, $packagePath)
    {
        $zip = new \ZipArchive();

        if ($zip->open($packagePath, \ZipArchive::CREATE | \ZipArchive::OVERWRITE) !== true) {
            return false;
        }

        $progressBar = null;
        if (count($files) > 10) {
            $progressBar = \WP_CLI\Utils\make_progress_bar('Creating package', count($files));
        }

        $addedFiles = 0;
        foreach ($files as $filePath) {
            $file = str_replace($this->themePath, '', $filePath);


            if (file_exists($filePath)) {
                if ($zip->addFile($filePath, $file)) {
                    $addedFiles++;
                    WP_CLI::log(" - {$file}");
                } else {
                    WP_CLI::warning('Can add "' . $file . '" to ZIP');
                }
            }

            if ($progressBar) {
                $progressBar->tick();
            }
        }

        if ($progressBar) {
            $progressBar->finish();
        }

        // Nếu không add được file nào thì xóa file zip và trả về false
        if ($addedFiles === 0) {
            $zip->close();
            if (file_exists($packagePath)) {
                @unlink($packagePath);
            }
            WP_CLI::warning("No files were added to the zip archive.");
            return false;
        }

        WP_CLI::log("🗂️  Total files added to zip: {$addedFiles}");
        return $zip->close();
    }

    /**
     * Format bytes to human readable format
     *
     * @param int $bytes
     * @return string
     * @since 2.0.0
     */
    private function formatBytes($bytes)
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);

        $bytes /= pow(1024, $pow);

        return round($bytes, 2) . ' ' . $units[$pow];
    }
}