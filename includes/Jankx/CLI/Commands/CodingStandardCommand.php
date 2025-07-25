<?php


namespace Jankx\CLI\Commands;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

use WP_CLI;
use WP_CLI_Command;
use Jankx\CLI\Parser\PHPParser;
use Jankx\Jankx;

/**
 * WP CLI Command to check and fix WordPress Coding Standards
 *
 * @package Jankx\CLI\Commands
 * @since 2.0.0
 */
class CodingStandardCommand extends WP_CLI_Command
{
    /**
     * @var PHPParser
     * @since 2.0.0
     */
    private $parser;

    /**
     * @var array
     * @since 2.0.0
     */
    private $issues = [];

    /**
     * @var int
     * @since 2.0.0
     */
    private $totalIssues = 0;

    /**
     * @var int
     * @since 2.0.0
     */
    private $fixedIssues = 0;

    /**
     * @var array
     * @since 2.0.0
     */
    private $spinnerFrames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

    /**
     * @var int
     * @since 2.0.0
     */
    private $spinnerIndex = 0;

    /**
     * @var array
     * @since 2.0.0
     */
    private $issueCheckers = [];

    /**
     * @var array
     * @since 2.0.0
     */
    private $issueFixers = [];

    /**
     * Constructor
     *
     * @since 2.0.0
     */
    public function __construct()
    {
        $this->parser = new PHPParser();
        $this->registerIssueCheckers();
        $this->registerIssueFixers();
    }

    /**
     * Register all issue checkers
     *
     * @since 2.0.0
     */
    private function registerIssueCheckers()
    {
        $this->issueCheckers = [
            'missing_since_tag' => new \Jankx\CLI\Checkers\MissingSinceTagChecker(),
            'improper_exit' => new \Jankx\CLI\Checkers\ExitUsageChecker(),
            'unsanitized_input' => new \Jankx\CLI\Checkers\SanitizationChecker(),
            'missing_abspath_check' => new \Jankx\CLI\Checkers\ABSPATHChecker(),
            // TODO: Add other checkers when they are created
            // 'improper_wp_die' => new \Jankx\CLI\Checkers\WpDieUsageChecker(),
            // 'missing_nonce_verification' => new \Jankx\CLI\Checkers\NonceVerificationChecker(),
            // 'unescaped_output' => new \Jankx\CLI\Checkers\EscapingChecker(),
            // 'improper_hook_name' => new \Jankx\CLI\Checkers\HookUsageChecker(),
            // 'missing_text_domain' => new \Jankx\CLI\Checkers\TextDomainChecker(),
            // 'unsafe_file_inclusion' => new \Jankx\CLI\Checkers\FileInclusionChecker(),
            // 'unsafe_database_query' => new \Jankx\CLI\Checkers\DatabaseQueryChecker(),
            // 'missing_capability_check' => new \Jankx\CLI\Checkers\CapabilityChecker(),
            // 'hardcoded_path' => new \Jankx\CLI\Checkers\ConstantsUsageChecker(),
        ];
    }

    /**
     * Register all issue fixers
     *
     * @since 2.0.0
     */
    private function registerIssueFixers()
    {
        $this->issueFixers = [
            'missing_since_tag' => new \Jankx\CLI\Fixers\MissingSinceTagFixer(),
            'unsanitized_input' => new \Jankx\CLI\Fixers\UnsanitizedInputFixer(),
            'improper_exit' => new \Jankx\CLI\Fixers\ImproperExitFixer(),
            'missing_abspath_check' => new \Jankx\CLI\Fixers\ABSPATHCheckFixer(),
        ];
    }

    /**
     * Show loading spinner
     *
     * @param string $message
     * @since 2.0.0
     */
    private function showSpinner($message)
    {
        $spinner = $this->spinnerFrames[$this->spinnerIndex];
        $this->spinnerIndex = ($this->spinnerIndex + 1) % count($this->spinnerFrames);

        echo "\r{$spinner} {$message}";
    }

    /**
     * Show progress bar
     *
     * @param int $current
     * @param int $total
     * @param string $message
     * @since 2.0.0
     */
    private function showProgress($current, $total, $message)
    {
        $percentage = $total > 0 ? round(($current / $total) * 100) : 0;
        $barLength = 30;
        $filledLength = $total > 0 ? round(($current / $total) * $barLength) : 0;

        $bar = str_repeat('█', $filledLength) . str_repeat('░', $barLength - $filledLength);

        echo "\r[{$bar}] {$percentage}% {$message}";
    }

    /**
     * Clear current line
     *
     * @since 2.0.0
     */
    private function clearLine()
    {
        echo "\r" . str_repeat(' ', 80) . "\r";
    }

    /**
     * Check and optionally fix WordPress Coding Standards
     *
     * ## OPTIONS
     *
     * [--fix]
     * : Fix issues automatically
     *
     * [--file=<file>]
     * : Check a specific file (overrides path parameter)
     *
     * [--exclude=<exclude>]
     * : Comma-separated list of paths to exclude (default: vendor,tests,node_modules,coverage)
     *
     * [--verbose]
     * : Show detailed output
     *
     * [--format=<format>]
     * : Output format (table, csv, json) (default: table)
     *
     * [--table]
     * : Show results in table format (overrides --per-file)
     *
     * ## EXAMPLES
     *
     *     # Check coding standards in current directory (per-file mode)
     *     wp jankx code
     *
     *     # Check coding standards in specific path (per-file mode)
     *     wp jankx code includes/Jankx
     *
     *     # Show results in table format
     *     wp jankx code --table
     *
     *     # Fix coding standards automatically
     *     wp jankx code --fix
     *
     *     # Fix coding standards in specific path
     *     wp jankx code includes/Jankx --fix
     *
     *     # Check specific path
     *     wp jankx code includes/Jankx/Kernel
     *
     *     # Check specific file
     *     wp jankx code --file=includes/Jankx/Jankx.php
     *
     *     # Fix specific file
     *     wp jankx code --file=includes/Jankx/Jankx.php --fix
     *
     *     # Exclude certain paths (overrides default excludes)
     *     wp jankx code --exclude=vendor,tests,node_modules,coverage
     *
     *     # Include all directories (no excludes)
     *     wp jankx code --exclude=
     *
     *     # Show results per file (default mode)
     *     wp jankx code --per-file
     *
     * @since 2.0.0
     */
    public function __invoke($args, $assoc_args)
    {
        $fix = isset($assoc_args['fix']);
        $path = isset($args[0]) ? $args[0] : '.';
        $file = isset($assoc_args['file']) ? $assoc_args['file'] : null;
        $exclude = isset($assoc_args['exclude']) ? explode(',', $assoc_args['exclude']) : [];
        $verbose = isset($assoc_args['verbose']);
        $format = isset($assoc_args['format']) ? $assoc_args['format'] : 'table';
        $tableMode = isset($assoc_args['table']);

        // Mặc định loại bỏ vendor, tests, node_modules nếu không có exclude
        if (empty($exclude)) {
            $exclude = ['vendor', 'tests', 'node_modules', 'coverage'];
        }

        // Header với thông tin chi tiết
        WP_CLI::log("\n" . str_repeat('=', 80));
        WP_CLI::log("🔍 JANKX CODING STANDARDS CHECKER");
        WP_CLI::log(str_repeat('=', 80));

        if ($file) {
            WP_CLI::log("📄 Target: Single file");
            WP_CLI::log("📁 File: $file");
        } else {
            WP_CLI::log("📁 Target: Directory scan");
            $displayPath = $path === '.' ? 'Current directory' : $path;
            WP_CLI::log("📂 Path: $displayPath");
            if (!empty($exclude)) {
                WP_CLI::log("🚫 Exclude: " . implode(', ', $exclude));
            }
        }

        WP_CLI::log("⚙️  Mode: " . ($fix ? 'FIX' : 'CHECK'));
        WP_CLI::log("📊 Format: " . strtoupper($format));
        WP_CLI::log("🔍 Verbose: " . ($verbose ? 'YES' : 'NO'));
        WP_CLI::log("📋 Display: " . ($tableMode ? 'TABLE' : 'PER-FILE'));
        WP_CLI::log(str_repeat('-', 80));

        if ($fix) {
            WP_CLI::warning("🔧 FIX MODE - Issues will be automatically fixed");
        }

        $startTime = microtime(true);
        $startMemory = memory_get_usage();

        if ($file) {
            WP_CLI::log("🚀 Starting single file check...");
            $this->checkSingleFile($file, $fix, $verbose);
        } else {
            WP_CLI::log("🚀 Starting directory scan...");
            if ($tableMode) {
                $this->scanDirectory($path, $exclude, $fix, $verbose);
                $this->displayResults($format);
            } else {
                $this->scanDirectoryPerFile($path, $exclude, $fix, $verbose);
            }
        }

        $endTime = microtime(true);
        $endMemory = memory_get_usage();
        $executionTime = round($endTime - $startTime, 2);
        $memoryUsed = round(($endMemory - $startMemory) / 1024 / 1024, 2);

        // Footer với thống kê
        WP_CLI::log(str_repeat('-', 80));
        WP_CLI::log("📈 STATISTICS:");
        WP_CLI::log("   ⏱️  Execution time: {$executionTime}s");
        WP_CLI::log("   💾 Memory used: {$memoryUsed}MB");
        WP_CLI::log("   📄 Files processed: " . count($this->issues));
        WP_CLI::log("   ❌ Total issues: {$this->totalIssues}");
        if ($fix) {
            WP_CLI::log("   ✅ Fixed issues: {$this->fixedIssues}");
        }
        WP_CLI::log(str_repeat('=', 80));

        if ($this->totalIssues > 0) {
            if ($fix) {
                WP_CLI::success("🎉 Successfully fixed {$this->fixedIssues} issues!");
            } else {
                WP_CLI::error("❌ Found {$this->totalIssues} issues that need attention!");
                exit(1);
            }
        } else {
            WP_CLI::success("🎉 No issues found! Code is clean and follows WordPress standards!");
        }
    }

    /**
     * Check a single file
     *
     * @param string $filePath
     * @param bool $fix
     * @param bool $verbose
     * @since 2.0.0
     */
    private function checkSingleFile($filePath, $fix, $verbose)
    {
        if (!file_exists($filePath)) {
            WP_CLI::error("❌ File not found: $filePath");
            return;
        }

        if ($verbose) {
            WP_CLI::log("🔍 Checking: $filePath");
        } else {
            WP_CLI::log("🔍 Processing single file...");
        }

        $this->checkFile($filePath, $fix);

        if (isset($this->issues[$filePath]) && !empty($this->issues[$filePath])) {
            $this->displayFileResult($filePath, $this->issues[$filePath]);
        } else {
            WP_CLI::log("✅ No issues found in $filePath");
        }

        WP_CLI::log("✅ Single file check completed!");
    }

    /**
     * Scan directory for PHP files
     *
     * @param string $path
     * @param array $exclude
     * @param bool $fix
     * @param bool $verbose
     * @since 2.0.0
     */
    private function scanDirectory($path, $exclude, $fix, $verbose)
    {
        if (!is_dir($path)) {
            WP_CLI::error("❌ Directory not found: $path");
            return;
        }

        // Loading: Scanning for PHP files
        WP_CLI::log("🔍 Scanning for PHP files...");
        $files = $this->getPHPFiles($path, $exclude);
        WP_CLI::log("📂 Found " . count($files) . " PHP files to check");

        $processedCount = 0;
        $totalFiles = count($files);

        foreach ($files as $file) {
            $processedCount++;

            if ($verbose) {
                WP_CLI::log("🔍 [{$processedCount}/{$totalFiles}] Checking: $file");
            } else {
                $this->showProgress($processedCount, $totalFiles, "Processing files...");
            }

            $this->checkFile($file, $fix);

            // Hiển thị kết quả từng file ngay sau khi check xong
            if (isset($this->issues[$file]) && !empty($this->issues[$file])) {
                if (!$verbose) {
                    $this->clearLine();
                }
                $this->displayFileResult($file, $this->issues[$file]);
            } else if ($verbose) {
                WP_CLI::log("   ✅ No issues found");
            }
        }

        if (!$verbose) {
            $this->clearLine();
        }
        WP_CLI::log("✅ Directory scan completed!");
    }

    // Scan directory và show từng file (dùng cho --per-file)
    /**
     * Method scanDirectoryPerFile
     *
     * @since 2.0.0
     */
    private function scanDirectoryPerFile($path, $exclude, $fix, $verbose)
    {
        if (!is_dir($path)) {
            WP_CLI::error("❌ Directory not found: $path");
            return;
        }

        // Loading: Scanning for PHP files
        WP_CLI::log("🔍 Scanning for PHP files...");
        $files = $this->getPHPFiles($path, $exclude);
        WP_CLI::log("📂 Found " . count($files) . " PHP files to check");

        $processedCount = 0;
        $totalFiles = count($files);

        foreach ($files as $file) {
            $processedCount++;

            if ($verbose) {
                WP_CLI::log("🔍 [{$processedCount}/{$totalFiles}] Checking: $file");
            } else {
                $this->showProgress($processedCount, $totalFiles, "Processing files...");
            }

            $this->checkFile($file, $fix);

            if (isset($this->issues[$file]) && !empty($this->issues[$file])) {
                if (!$verbose) {
                    $this->clearLine();
                }
                $this->displayFileResult($file, $this->issues[$file]);
            } else if ($verbose) {
                WP_CLI::log("   ✅ No issues found");
            }
        }

        if (!$verbose) {
            $this->clearLine();
        }
        WP_CLI::log("✅ Per-file scan completed!");
    }

    /**
     * Get all PHP files in directory
     *
     * @param string $path
     * @param array $exclude
     * @return array
     * @since 2.0.0
     */
    private function getPHPFiles($path, $exclude)
    {
        $files = [];
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($path, \RecursiveDirectoryIterator::SKIP_DOTS)
        );

        foreach ($iterator as $file) {
            if ($file->isFile() && $file->getExtension() === 'php') {
                $filePath = $file->getPathname();

                // Check if file should be excluded
                $shouldExclude = false;
                foreach ($exclude as $excludePath) {
                    if (strpos($filePath, $excludePath) !== false) {
                        $shouldExclude = true;
                        break;
                    }
                }

                if (!$shouldExclude) {
                    $files[] = $filePath;
                }
            }
        }

        return $files;
    }

    /**
     * Check a single PHP file
     *
     * @param string $filePath
     * @param bool $fix
     * @since 2.0.0
     */
    private function checkFile($filePath, $fix)
    {
        try {
            // Loading: Reading file
            $this->showSpinner("Reading file: " . basename($filePath));
            $content = file_get_contents($filePath);
            $originalContent = $content;

            // Loading: Parsing PHP code
            $this->showSpinner("Parsing PHP code: " . basename($filePath));
            $parsed = $this->parser->parseContent($content, $filePath);

            // Loading: Checking WordPress standards
            $this->showSpinner("Checking standards: " . basename($filePath));
            $fileIssues = $this->checkWordPressStandards($parsed, $content);

            if (!empty($fileIssues)) {
                $this->issues[$filePath] = $fileIssues;
                $this->totalIssues += count($fileIssues);

                if ($fix) {
                    // Loading: Fixing issues
                    $this->showSpinner("Fixing issues: " . basename($filePath));
                    $this->fixIssues($filePath, $fileIssues, $content);
                }
            }

            // Clear spinner line
            $this->clearLine();

        } catch (\Exception $e) {
            $this->clearLine();
            WP_CLI::warning("⚠️ Error processing $filePath: " . $e->getMessage());
        }
    }

    /**
     * Check WordPress Coding Standards using Strategy Pattern
     *
     * @param array $parsed
     * @param string $content
     * @return array
     * @since 2.0.0
     */
    private function checkWordPressStandards($parsed, $content)
    {
        $issues = [];

        // Use Strategy Pattern to check each type of issue
        foreach ($this->issueCheckers as $checkerType => $checker) {
            try {
                $checkerIssues = $checker->check($parsed, $content);
                $issues = array_merge($issues, $checkerIssues);
            } catch (\Exception $e) {
                WP_CLI::warning("Warning: Error in {$checkerType} checker: " . $e->getMessage());
            }
        }

        return $issues;
    }

    /**
     * Fix issues in a file
     *
     * @param string $filePath
     * @param array $issues
     * @param string $content
     * @since 2.0.0
     */
    private function fixIssues($filePath, $issues, $content)
    {
        $updatedContent = $content;
        $fixedCount = 0;
        $fixableIssues = [];

        // Tách riêng các issues có thể fix
        foreach ($issues as $issue) {
            if (isset($issue['fixable']) && $issue['fixable'] && isset($issue['fix'])) {
                $fixableIssues[] = $issue;
            }
        }

        if (empty($fixableIssues)) {
            return;
        }

        // Loading: Analyzing fixable issues
        $this->showSpinner("Analyzing " . count($fixableIssues) . " fixable issues...");

        // Sort issues by line number in descending order to avoid line number conflicts
        /**
         * Method showSpinner
         *
         * @since 2.0.0
         */
        usort($fixableIssues, function($a, $b) {
            return $b['fix']['line'] - $a['fix']['line'];
        });

        foreach ($fixableIssues as $index => $issue) {
            $this->showSpinner("Fixing issue " . ($index + 1) . "/" . count($fixableIssues) . "...");
            $updatedContent = $this->applyFix($updatedContent, $issue['fix']);
            $fixedCount++;
        }

        if ($fixedCount > 0) {
            // Loading: Writing updated file
            $this->showSpinner("Writing updated file...");
            file_put_contents($filePath, $updatedContent);
            $this->fixedIssues += $fixedCount;
            $this->clearLine();
            WP_CLI::log("✅ Successfully fixed $fixedCount issues in $filePath");
        }
    }

    /**
     * Apply a fix to content using Strategy Pattern
     *
     * @param string $content
     * @param array $fix
     * @return string
     * @since 2.0.0
     */
    private function applyFix($content, $fix)
    {
        $fixType = $fix['type'];

        if (isset($this->issueFixers[$fixType])) {
            WP_CLI::debug("Applying fixer for type: $fixType");
            return $this->issueFixers[$fixType]->fix($content, $fix);
        }

        // Fallback to old logic for backward compatibility
        if ($fixType === 'add_since_tag') {
            WP_CLI::debug("Using fallback addSinceTag fixer");
            return $this->addSinceTag($content, $fix);
        }

        WP_CLI::debug("No fixer found for type: $fixType");
        return $content;
    }

    /**
     * Add @since tag to docblock
     *
     * @param string $content
     * @param array $fix
     * @return string
     * @since 2.0.0
     */
    private function addSinceTag($content, $fix)
    {
        $docblock = $fix['docblock'];
        // Check if docblock already has @since tag
        if (strpos($docblock, '@since') !== false) {
            return $content;
        }

        // Tìm dòng prefix (khoảng trắng + *) của dòng gần cuối docblock
        $lines = explode("\n", $docblock);
        $prefix = ' * ';
        for ($i = count($lines) - 2; $i >= 0; $i--) {
            $line = $lines[$i];
            if (preg_match('/^(\s*\*)/', $line, $m)) {
                $prefix = $m[1] . ' ';
                break;
            }
        }
        // Chèn dòng @since trước dòng */
        $newDocblock = '';
        for ($i = 0; $i < count($lines); $i++) {
            if (preg_match('/^\s*\*\//', $lines[$i])) {
                $newDocblock .= $prefix . '@since ' . Jankx::getFrameworkVersion() . "\n";
            }
            $newDocblock .= $lines[$i] . "\n";
        }
        // Xóa dòng trống cuối cùng nếu có
        $newDocblock = rtrim($newDocblock, "\n");
        return str_replace($docblock, $newDocblock, $content);
    }

    /**
     * Display results
     *
     * @param string $format
     * @since 2.0.0
     */
    private function displayResults($format)
    {
        if (empty($this->issues)) {
            return;
        }

        WP_CLI::log("\n" . str_repeat('=', 80));
        WP_CLI::log("📊 SUMMARY RESULTS");
        WP_CLI::log(str_repeat('=', 80));

        switch ($format) {
            case 'json':
                $this->displayJSON();
                break;
            case 'csv':
                $this->displayCSV();
                break;
            default:
                $this->displayTable();
                break;
        }
    }

    /**
     * Display results as table
     *
     * @since 2.0.0
     */
    private function displayTable()
    {
        $table = [];

        foreach ($this->issues as $file => $fileIssues) {
            foreach ($fileIssues as $issue) {
                $severityIcon = $issue['severity'] === 'error' ? '❌' : '⚠️';
                $fixableIcon = isset($issue['fixable']) && $issue['fixable'] ? '🔧' : '❌';

                // Icon cho loại issue
                $issueIcon = '📝'; // Default
                if (strpos($issue['type'], 'class') !== false || strpos($issue['message'], 'Class') !== false) {
                    $issueIcon = '🏗️'; // Class icon
                } elseif (strpos($issue['type'], 'method') !== false || strpos($issue['message'], 'Method') !== false) {
                    $issueIcon = '⚙️'; // Method icon
                } elseif (strpos($issue['type'], 'function') !== false || strpos($issue['message'], 'Function') !== false) {
                    $issueIcon = '🔧'; // Function icon
                } elseif (strpos($issue['type'], 'exit') !== false) {
                    $issueIcon = '🚪'; // Exit icon
                } elseif (strpos($issue['type'], 'wp_die') !== false) {
                    $issueIcon = '💀'; // wp_die icon
                } elseif (strpos($issue['type'], 'nonce') !== false) {
                    $issueIcon = '🔐'; // Nonce icon
                } elseif (strpos($issue['type'], 'sanitize') !== false) {
                    $issueIcon = '🧼'; // Sanitize icon
                } elseif (strpos($issue['type'], 'escape') !== false) {
                    $issueIcon = '🛡️'; // Escape icon
                } elseif (strpos($issue['type'], 'hook') !== false) {
                    $issueIcon = '🎣'; // Hook icon
                } elseif (strpos($issue['type'], 'text_domain') !== false) {
                    $issueIcon = '🌐'; // Text domain icon
                } elseif (strpos($issue['type'], 'database') !== false || strpos($issue['type'], 'mysql') !== false) {
                    $issueIcon = '🗄️'; // Database icon
                } elseif (strpos($issue['type'], 'capability') !== false) {
                    $issueIcon = '👤'; // Capability icon
                } elseif (strpos($issue['type'], 'file') !== false || strpos($issue['type'], 'include') !== false) {
                    $issueIcon = '📁'; // File icon
                } elseif (strpos($issue['type'], 'abspath') !== false || strpos($issue['type'], 'constant') !== false) {
                    $issueIcon = '🔧'; // Constants icon
                } elseif (strpos($issue['type'], 'since') !== false) {
                    $issueIcon = '📅'; // Since tag icon
                } elseif (strpos($issue['type'], 'unsanitized') !== false) {
                    $issueIcon = '🧼'; // Sanitization icon
                } elseif (strpos($issue['type'], 'improper') !== false) {
                    $issueIcon = '⚠️'; // Improper usage icon
                } elseif (strpos($issue['type'], 'missing') !== false) {
                    $issueIcon = '❌'; // Missing icon
                } elseif (strpos($issue['type'], 'unsafe') !== false) {
                    $issueIcon = '🚨'; // Unsafe icon
                } elseif (strpos($issue['type'], 'deprecated') !== false) {
                    $issueIcon = '⏰'; // Deprecated icon
                } elseif (strpos($issue['type'], 'hardcoded') !== false) {
                    $issueIcon = '🔒'; // Hardcoded icon
                }

                $table[] = [
                    'File' => $file,
                    'Line' => $issue['line'],
                    'Type' => $issueIcon . ' ' . $issue['type'],
                    'Severity' => $severityIcon . ' ' . strtoupper($issue['severity']),
                    'Message' => $issue['message'],
                    'Fixable' => $fixableIcon . ' ' . (isset($issue['fixable']) && $issue['fixable'] ? 'Yes' : 'No')
                ];
            }
        }

        WP_CLI\Utils\format_items('table', $table, ['File', 'Line', 'Type', 'Severity', 'Message', 'Fixable']);
    }

    /**
     * Display results as JSON
     *
     * @since 2.0.0
     */
    private function displayJSON()
    {
        echo json_encode($this->issues, JSON_PRETTY_PRINT);
    }

    /**
     * Display results as CSV
     *
     * @since 2.0.0
     */
    private function displayCSV()
    {
        $output = "File,Line,Type,Severity,Message,Fixable\n";

        foreach ($this->issues as $file => $fileIssues) {
            foreach ($fileIssues as $issue) {
                $output .= sprintf(
                    '%s,%d,%s,%s,%s,%s',
                    $file,
                    $issue['line'],
                    $issue['type'],
                    $issue['severity'],
                    str_replace(',', ';', $issue['message']),
                    $issue['fixable'] ? 'Yes' : 'No'
                ) . "\n";
            }
        }

        echo $output;
    }

    // Thêm hàm hiển thị kết quả cho từng file
    /**
     * Method displayFileResult
     *
     * @since 2.0.0
     */
    private function displayFileResult($file, $fileIssues)
    {
        $issueCount = count($fileIssues);
        $severityCounts = [
            'error' => 0,
            'warning' => 0
        ];

        foreach ($fileIssues as $issue) {
            $severityCounts[$issue['severity']]++;
        }

        WP_CLI::log("\n" . str_repeat('─', 60));
        WP_CLI::log("📄 File: $file");
        WP_CLI::log("📊 Issues: {$issueCount} total");
        if ($severityCounts['error'] > 0) {
            WP_CLI::log("   ❌ Errors: {$severityCounts['error']}");
        }
        if ($severityCounts['warning'] > 0) {
            WP_CLI::log("   ⚠️  Warnings: {$severityCounts['warning']}");
        }
        WP_CLI::log(str_repeat('─', 60));

        foreach ($fileIssues as $issue) {
            $severityIcon = $issue['severity'] === 'error' ? '❌' : '⚠️';
            $fixableIcon = isset($issue['fixable']) && $issue['fixable'] ? '🔧' : '❌';
            $fixableText = isset($issue['fixable']) && $issue['fixable'] ? 'Auto-fixable' : 'Manual fix required';

            // Icon cho loại issue (class hoặc method)
            $issueIcon = '📝'; // Default
            if (strpos($issue['type'], 'class') !== false || strpos($issue['message'], 'Class') !== false) {
                $issueIcon = '🏗️'; // Class icon
            } elseif (strpos($issue['type'], 'method') !== false || strpos($issue['message'], 'Method') !== false) {
                $issueIcon = '⚙️'; // Method icon
            } elseif (strpos($issue['type'], 'function') !== false || strpos($issue['message'], 'Function') !== false) {
                $issueIcon = '🔧'; // Function icon
            } elseif (strpos($issue['type'], 'exit') !== false) {
                $issueIcon = '🚪'; // Exit icon
            } elseif (strpos($issue['type'], 'wp_die') !== false) {
                $issueIcon = '💀'; // wp_die icon
            } elseif (strpos($issue['type'], 'nonce') !== false) {
                $issueIcon = '🔐'; // Nonce icon
            } elseif (strpos($issue['type'], 'sanitize') !== false) {
                $issueIcon = '🧼'; // Sanitize icon
            } elseif (strpos($issue['type'], 'escape') !== false) {
                $issueIcon = '🛡️'; // Escape icon
            } elseif (strpos($issue['type'], 'hook') !== false) {
                $issueIcon = '🎣'; // Hook icon
            } elseif (strpos($issue['type'], 'text_domain') !== false) {
                $issueIcon = '🌐'; // Text domain icon
            } elseif (strpos($issue['type'], 'database') !== false || strpos($issue['type'], 'mysql') !== false) {
                $issueIcon = '🗄️'; // Database icon
            } elseif (strpos($issue['type'], 'capability') !== false) {
                $issueIcon = '👤'; // Capability icon
            } elseif (strpos($issue['type'], 'file') !== false || strpos($issue['type'], 'include') !== false) {
                $issueIcon = '📁'; // File icon
            } elseif (strpos($issue['type'], 'abspath') !== false || strpos($issue['type'], 'constant') !== false) {
                $issueIcon = '🔧'; // Constants icon
            } elseif (strpos($issue['type'], 'since') !== false) {
                $issueIcon = '📅'; // Since tag icon
            } elseif (strpos($issue['type'], 'unsanitized') !== false) {
                $issueIcon = '🧼'; // Sanitization icon
            } elseif (strpos($issue['type'], 'improper') !== false) {
                $issueIcon = '⚠️'; // Improper usage icon
            } elseif (strpos($issue['type'], 'missing') !== false) {
                $issueIcon = '❌'; // Missing icon
            } elseif (strpos($issue['type'], 'unsafe') !== false) {
                $issueIcon = '🚨'; // Unsafe icon
            } elseif (strpos($issue['type'], 'deprecated') !== false) {
                $issueIcon = '⏰'; // Deprecated icon
            } elseif (strpos($issue['type'], 'hardcoded') !== false) {
                $issueIcon = '🔒'; // Hardcoded icon
            }

            WP_CLI::log(sprintf("   %s %s [Line %d] %s (%s): %s",
                $severityIcon,
                $issueIcon,
                $issue['line'],
                $issue['type'],
                strtoupper($issue['severity']),
                $issue['message']
            ));
            WP_CLI::log(sprintf("      %s %s", $fixableIcon, $fixableText));
        }

        WP_CLI::log(str_repeat('─', 60));

        // Thêm command fix cho file này
        $fixableCount = 0;
        foreach ($fileIssues as $issue) {
            if (isset($issue['fixable']) && $issue['fixable']) {
                $fixableCount++;
            }
        }

        if ($fixableCount > 0) {
            WP_CLI::log("💡 To fix this file, run:");
            WP_CLI::log("   wp jankx code --file=\"{$file}\" --fix");
        } else {
            WP_CLI::log("💡 No auto-fixable issues in this file");
        }

        WP_CLI::log(str_repeat('─', 60));
    }
}
