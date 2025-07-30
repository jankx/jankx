<?php

namespace Jankx\Helpers;

/**
 * CLI Helper Class
 * 
 * Provides common utilities for CLI commands to avoid code duplication
 * 
 * @package Jankx\Helpers
 * @since 2.0.0
 */
class CLIHelper
{
    /**
     * Common separator characters for CLI output
     */
    const SEPARATORS = [
        'header' => '=',
        'section' => '-',
        'subsection' => '─',
        'thin' => '─'
    ];

    /**
     * Common emoji icons for CLI output
     */
    const ICONS = [
        'success' => '✅',
        'error' => '❌',
        'warning' => '⚠️',
        'info' => 'ℹ️',
        'debug' => '🔍',
        'package' => '📦',
        'file' => '📄',
        'folder' => '📁',
        'settings' => '⚙️',
        'time' => '⏱️',
        'memory' => '💾',
        'stats' => '📊',
        'check' => '🔍',
        'fix' => '🔧',
        'create' => '🎯',
        'generate' => '🎨',
        'release' => '🚀',
        'version' => '🏷️',
        'output' => '📁',
        'theme' => '🎨',
        'plugin' => '🔌',
        'system' => '🖥️',
        'performance' => '⚡',
        'author' => '👤',
        'description' => '📝',
        'dry_run' => '🔍',
        'force' => '💪',
        'verbose' => '📖',
        'exclude' => '🚫',
        'include' => '✅',
        'total' => '📋',
        'progress' => '█',
        'empty' => '░'
    ];

    /**
     * Create a separator line
     * 
     * @param string $type Type of separator (header, section, subsection, thin)
     * @param int $length Length of the separator
     * @return string
     */
    public static function separator($type = 'section', $length = 80)
    {
        $char = self::SEPARATORS[$type] ?? self::SEPARATORS['section'];
        return str_repeat($char, $length);
    }

    /**
     * Log a message with an icon
     * 
     * @param string $message Message to log
     * @param string $icon Icon type
     * @return void
     */
    public static function log($message, $icon = null)
    {
        $iconChar = $icon ? (self::ICONS[$icon] ?? '') : '';
        $prefix = $iconChar ? "{$iconChar} " : '';
        \WP_CLI::log($prefix . $message);
    }

    /**
     * Log a success message
     * 
     * @param string $message Message to log
     * @return void
     */
    public static function success($message)
    {
        \WP_CLI::success($message);
    }

    /**
     * Log an error message
     * 
     * @param string $message Message to log
     * @return void
     */
    public static function error($message)
    {
        \WP_CLI::error($message);
    }

    /**
     * Log a warning message
     * 
     * @param string $message Message to log
     * @return void
     */
    public static function warning($message)
    {
        \WP_CLI::warning($message);
    }

    /**
     * Check if file exists and log appropriate message
     * 
     * @param string $filePath File path to check
     * @param string $description Description of the file
     * @param bool $required Whether the file is required
     * @return bool
     */
    public static function checkFile($filePath, $description = 'File', $required = true)
    {
        if (!file_exists($filePath)) {
            $message = "{$description} not found: {$filePath}";
            if ($required) {
                self::error($message);
                return false;
            } else {
                self::warning($message);
                return false;
            }
        }
        return true;
    }

    /**
     * Check if directory exists and log appropriate message
     * 
     * @param string $dirPath Directory path to check
     * @param string $description Description of the directory
     * @param bool $required Whether the directory is required
     * @return bool
     */
    public static function checkDirectory($dirPath, $description = 'Directory', $required = true)
    {
        if (!is_dir($dirPath)) {
            $message = "{$description} not found: {$dirPath}";
            if ($required) {
                self::error($message);
                return false;
            } else {
                self::warning($message);
                return false;
            }
        }
        return true;
    }

    /**
     * Create directory if it doesn't exist
     * 
     * @param string $dirPath Directory path to create
     * @param string $description Description of the directory
     * @return bool
     */
    public static function createDirectory($dirPath, $description = 'Directory')
    {
        if (!is_dir($dirPath)) {
            if (!mkdir($dirPath, 0755, true)) {
                self::error("Failed to create {$description}: {$dirPath}");
                return false;
            }
        }
        return true;
    }

    /**
     * Format file size in human readable format
     * 
     * @param int $bytes Size in bytes
     * @return string
     */
    public static function formatBytes($bytes)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        $bytes /= pow(1024, $pow);
        return round($bytes, 2) . ' ' . $units[$pow];
    }

    /**
     * Create a progress bar
     * 
     * @param int $current Current progress
     * @param int $total Total items
     * @param int $width Bar width
     * @return string
     */
    public static function progressBar($current, $total, $width = 50)
    {
        $percentage = $total > 0 ? ($current / $total) : 0;
        $filledLength = round($width * $percentage);
        $emptyLength = $width - $filledLength;
        
        $bar = str_repeat(self::ICONS['progress'], $filledLength) . 
               str_repeat(self::ICONS['empty'], $emptyLength);
        
        return sprintf("[%s] %d%%", $bar, round($percentage * 100));
    }

    /**
     * Get files recursively from directory
     * 
     * @param string $directory Directory to scan
     * @param array $excludePatterns Patterns to exclude
     * @param string $relativePath Base path for relative paths
     * @return array
     */
    public static function getFilesRecursively($directory, $excludePatterns = [], $relativePath = '')
    {
        $files = [];
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($directory, \RecursiveDirectoryIterator::SKIP_DOTS)
        );

        foreach ($iterator as $file) {
            $relativePath = str_replace($directory . '/', '', $file->getPathname());
            
            if (self::shouldIncludeFile($relativePath, $excludePatterns)) {
                $files[] = $relativePath;
            }
        }

        return $files;
    }

    /**
     * Check if file should be included based on exclude patterns
     * 
     * @param string $relativePath Relative file path
     * @param array $excludePatterns Patterns to exclude
     * @return bool
     */
    public static function shouldIncludeFile($relativePath, $excludePatterns = [])
    {
        foreach ($excludePatterns as $pattern) {
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
     * Display statistics in a formatted way
     * 
     * @param array $stats Statistics to display
     * @param string $title Title for the statistics
     * @return void
     */
    public static function displayStats($stats, $title = 'Statistics')
    {
        self::log("\n" . self::separator('header'));
        self::log($title, 'stats');
        self::log(self::separator('header'));

        foreach ($stats as $key => $value) {
            $icon = self::getStatIcon($key);
            self::log("   {$icon} {$key}: {$value}");
        }

        self::log(self::separator('header'));
    }

    /**
     * Get appropriate icon for statistic type
     * 
     * @param string $statType Type of statistic
     * @return string
     */
    private static function getStatIcon($statType)
    {
        $iconMap = [
            'time' => self::ICONS['time'],
            'memory' => self::ICONS['memory'],
            'files' => self::ICONS['file'],
            'issues' => self::ICONS['error'],
            'fixed' => self::ICONS['success'],
            'total' => self::ICONS['total'],
            'execution' => self::ICONS['time'],
            'used' => self::ICONS['memory'],
            'processed' => self::ICONS['file'],
            'errors' => self::ICONS['error'],
            'warnings' => self::ICONS['warning'],
            'success' => self::ICONS['success']
        ];

        return $iconMap[$statType] ?? self::ICONS['info'];
    }
} 