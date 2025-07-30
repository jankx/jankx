<?php

namespace Jankx\CLI\Commands;

use WP_CLI;
use WP_CLI_Command;
use Jankx\Helpers\CLIHelper;

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
        $this->themePath = \get_template_directory();
        $this->themeName = \get_template();
        $this->loadExcludePatterns(false); // Default to false in constructor
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
     * [--verbose]
     * : Show detailed information about exclude patterns and files
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
     *     # Show detailed information
     *     wp jankx release --verbose
     *
     * @since 2.0.0
     */
    public function __invoke($args, $assoc_args)
    {
        $version = isset($assoc_args['version']) ? $assoc_args['version'] : $this->getThemeVersion();
        $outputDir = isset($assoc_args['output']) ? $assoc_args['output'] : './releases';
        $force = isset($assoc_args['force']);
        $dryRun = isset($assoc_args['dry-run']);
        $verbose = isset($assoc_args['verbose']);

        CLIHelper::log("Creating Jankx Framework Release Package", 'create');
        CLIHelper::log("Theme: {$this->themeName}", 'theme');
        CLIHelper::log("Version: {$version}", 'version');
        CLIHelper::log("Output: {$outputDir}", 'output');
        WP_CLI::log("");

        // Validate theme path
        if (!CLIHelper::checkDirectory($this->themePath, 'Theme directory')) {
            return;
        }

        // Create output directory
        if (!$dryRun && !CLIHelper::createDirectory($outputDir, 'Output directory')) {
            return;
        }

        // Reload exclude patterns with verbose flag if needed
        if ($verbose) {
            $this->loadExcludePatterns($verbose);
        }

        // Get files to include
        $files = $this->getFilesToInclude();

        if ($verbose) {
            CLIHelper::log("Theme path: {$this->themePath}", 'folder');
            CLIHelper::log("Files found: " . count($files), 'file');
        }

        if (empty($files)) {
            CLIHelper::error("No files to include in release package. Please check your exclude patterns and .gitattributes.");
            if ($verbose) {
                CLIHelper::log("Debug info:", 'debug');
                CLIHelper::log("   - Theme path: {$this->themePath}", 'folder');
                CLIHelper::log("   - Exclude patterns: " . count($this->excludePatterns), 'total');
            }
            return;
        }

        if ($dryRun) {
            $this->displayDryRun($files, $verbose);
            return;
        }

        // Create release package
        $packageName = "{$this->themeName}-{$version}.zip";
        $packagePath = rtrim($outputDir, '/') . '/' . $packageName;

        // Check if file exists
        if (file_exists($packagePath) && !$force) {
            CLIHelper::error("Release package already exists: {$packagePath}");
            WP_CLI::log("Use --force to overwrite");
            return;
        }

        // Create ZIP package
        if ($this->createZipPackage($files, $packagePath, $verbose)) {
            // Check if file exists before getting size
            if (file_exists($packagePath)) {
                $size = CLIHelper::formatBytes(filesize($packagePath));
                CLIHelper::success("Release package created successfully!");
                CLIHelper::log("Package: {$packagePath}", 'package');
                CLIHelper::log("Size: {$size}", 'stats');
                CLIHelper::log("Files included: " . count($files), 'file');
            } else {
                CLIHelper::error("Release package created but file not found: {$packagePath}");
            }
        } else {
            CLIHelper::error("Failed to create release package (no files added or error during zipping)");
        }
    }

    /**
     * Load exclude patterns from .gitattributes
     *
     * @param bool $verbose
     * @since 2.0.0
     */
    private function loadExcludePatterns($verbose = false)
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

        // Only show verbose info if --verbose flag is set
        $verbose = isset($assoc_args['verbose']);
        if ($verbose) {
            WP_CLI::log("📖 Reading exclude patterns from .gitattributes...");
        }

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
                        if ($verbose) {
                            WP_CLI::log("   - Excluding: {$pattern}");
                        }
                    } else {
                        if ($verbose) {
                            WP_CLI::log("   - Including: {$pattern} (vendor directory)");
                        }
                    }
                }
            }
        }

        // Luôn ignore .git directory dù có khai báo hay không
        if (!in_array('/.git', $this->excludePatterns)) {
            $this->excludePatterns[] = '/.git';
            if ($verbose) {
                WP_CLI::log("   - Excluding: /.git (always ignored)");
            }
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
                if ($verbose) {
                    WP_CLI::log("   - Excluding: {$systemFile} (system file)");
                }
            }
        }

        if ($verbose) {
            WP_CLI::log("📋 Total exclude patterns loaded: " . count($this->excludePatterns));
        }
    }

    /**
     * Get files to include in release package
     *
     * @return array
     * @since 2.0.0
     */
    private function getFilesToInclude()
    {
        return CLIHelper::getFilesRecursively($this->themePath, $this->excludePatterns);
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
     * @param bool $verbose
     * @since 2.0.0
     */
    private function displayDryRun($files, $verbose = false)
    {
        CLIHelper::log("DRY RUN - Files that would be included:", 'dry_run');
        CLIHelper::log("Total files: " . count($files), 'file');

        if ($verbose) {
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
                CLIHelper::log("{$dir}/ (" . count($dirFiles) . " files)", 'folder');
                foreach (array_slice($dirFiles, 0, 5) as $file) {
                    CLIHelper::log("   - {$file}", 'file');
                }
                if (count($dirFiles) > 5) {
                    CLIHelper::log("   ... and " . (count($dirFiles) - 5) . " more files", 'file');
                }
                WP_CLI::log("");
            }
        }

        CLIHelper::success("Dry run completed. Use --force to create actual package.");
    }

    /**
     * Create ZIP package
     *
     * @param array $files
     * @param string $packagePath
     * @param bool $verbose
     * @return bool
     * @since 2.0.0
     */
    private function createZipPackage($files, $packagePath, $verbose = false)
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
                    if ($verbose) {
                        CLIHelper::log(" - {$file}", 'file');
                    }
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

        if ($verbose) {
            CLIHelper::log("Total files added to zip: {$addedFiles}", 'total');
        }
        return $zip->close();
    }


}
