<?php

/**
 * Config Cache Example
 *
 * Demonstrates the config caching functionality with CRC32 checksum
 *
 * @package Jankx\Examples
 * @since 2.0.0
 */

use Jankx\Facades\Config;

// Example 1: Basic cache usage
echo "=== Config Cache Example ===\n";

// Load config (will be cached automatically)
$themeName = Config::get('theme.info.name');
echo "Theme Name: {$themeName}\n";

// Get cache statistics
$cacheStats = Config::getCacheStats();
echo "Cache Stats: " . print_r($cacheStats, true) . "\n";

// Example 2: Check if file has changed
$configFile = get_template_directory() . '/config/theme.php';
if (Config::hasFileChanged($configFile)) {
    echo "Config file has changed, cache will be invalidated\n";
    Config::clearCache($configFile);
} else {
    echo "Config file unchanged, using cached version\n";
}

// Example 3: Performance comparison
function benchmarkConfigLoading()
{
    $startTime = microtime(true);

    // First load (will parse and cache)
    Config::get('theme.layout.container_width');

    $firstLoadTime = microtime(true) - $startTime;

    // Second load (from cache)
    $startTime = microtime(true);
    Config::get('theme.layout.container_width');

    $secondLoadTime = microtime(true) - $startTime;

    return [
        'first_load' => $firstLoadTime,
        'cached_load' => $secondLoadTime,
        'improvement' => ($firstLoadTime - $secondLoadTime) / $firstLoadTime * 100
    ];
}

$benchmark = benchmarkConfigLoading();
echo "Performance Benchmark:\n";
echo "- First load: {$benchmark['first_load']} seconds\n";
echo "- Cached load: {$benchmark['cached_load']} seconds\n";
echo "- Improvement: {$benchmark['improvement']}%\n";

// Example 4: Cache management
class ConfigCacheManager
{
    /**
     * Clear cache for specific config file
     */
    public static function clearConfigCache(string $configFile): void
    {
        Config::clearCache($configFile);
        echo "Cache cleared for: {$configFile}\n";
    }

    /**
     * Clear all config caches
     */
    public static function clearAllCaches(): void
    {
        Config::clearCache();
        echo "All config caches cleared\n";
    }

    /**
     * Get detailed cache information
     */
    public static function getCacheInfo(): array
    {
        $stats = Config::getCacheStats();

        $info = [
            'total_files' => $stats['total_files'],
            'cached_files' => $stats['cached_files'],
            'cache_hit_rate' => $stats['total_files'] > 0 ?
                ($stats['cached_files'] / $stats['total_files']) * 100 : 0,
            'cache_keys' => array_keys($stats['cache_keys']),
            'checksums' => $stats['checksums']
        ];

        return $info;
    }

    /**
     * Monitor config file changes
     */
    public static function monitorChanges(): array
    {
        $changes = [];
        $stats = Config::getCacheStats();

        foreach ($stats['cache_keys'] as $file => $cacheKey) {
            if (Config::hasFileChanged($file)) {
                $changes[] = [
                    'file' => $file,
                    'action' => 'clear_cache',
                    'reason' => 'file_changed'
                ];

                // Auto-clear cache for changed file
                Config::clearCache($file);
            }
        }

        return $changes;
    }

    /**
     * Optimize cache performance
     */
    public static function optimizeCache(): array
    {
        $optimizations = [];

        // Check for unused cache entries
        $stats = Config::getCacheStats();
        foreach ($stats['cache_keys'] as $file => $cacheKey) {
            if (!file_exists($file)) {
                $optimizations[] = [
                    'action' => 'remove_cache',
                    'file' => $file,
                    'reason' => 'file_deleted'
                ];

                Config::clearCache($file);
            }
        }

        return $optimizations;
    }
}

// Example 5: WordPress hooks integration
add_action('admin_init', function() {
    // Monitor config changes in admin
    $changes = ConfigCacheManager::monitorChanges();

    if (!empty($changes)) {
        foreach ($changes as $change) {
            error_log("Config file changed: {$change['file']}");
        }
    }
});

add_action('wp_ajax_clear_config_cache', function() {
    // AJAX endpoint to clear config cache
    if (current_user_can('manage_options')) {
        $file = $_POST['file'] ?? null;

        if ($file) {
            ConfigCacheManager::clearConfigCache($file);
        } else {
            ConfigCacheManager::clearAllCaches();
        }

        wp_send_json_success(['message' => 'Cache cleared successfully']);
    }
});

// Example 6: Debug cache information
if (Config::get('app.debug', false)) {
    add_action('wp_footer', function() {
        echo '<div style="background: #f0f0f0; padding: 10px; margin: 10px; border: 1px solid #ccc;">';
        echo '<h3>Config Cache Debug:</h3>';

        $cacheInfo = ConfigCacheManager::getCacheInfo();
        echo '<pre>' . print_r($cacheInfo, true) . '</pre>';

        $changes = ConfigCacheManager::monitorChanges();
        if (!empty($changes)) {
            echo '<h4>File Changes Detected:</h4>';
            echo '<pre>' . print_r($changes, true) . '</pre>';
        }

        $optimizations = ConfigCacheManager::optimizeCache();
        if (!empty($optimizations)) {
            echo '<h4>Cache Optimizations:</h4>';
            echo '<pre>' . print_r($optimizations, true) . '</pre>';
        }

        echo '</div>';
    });
}

// Example 7: CLI commands for cache management
if (defined('WP_CLI') && WP_CLI) {
    WP_CLI::add_command('jankx config cache', function($args, $assoc_args) {
        $action = $args[0] ?? 'stats';

        switch ($action) {
            case 'stats':
                $stats = ConfigCacheManager::getCacheInfo();
                WP_CLI::success("Config Cache Statistics:");
                WP_CLI::log("Total files: {$stats['total_files']}");
                WP_CLI::log("Cached files: {$stats['cached_files']}");
                WP_CLI::log("Hit rate: {$stats['cache_hit_rate']}%");
                break;

            case 'clear':
                $file = $args[1] ?? null;
                if ($file) {
                    ConfigCacheManager::clearConfigCache($file);
                    WP_CLI::success("Cache cleared for: {$file}");
                } else {
                    ConfigCacheManager::clearAllCaches();
                    WP_CLI::success("All config caches cleared");
                }
                break;

            case 'monitor':
                $changes = ConfigCacheManager::monitorChanges();
                if (empty($changes)) {
                    WP_CLI::success("No file changes detected");
                } else {
                    WP_CLI::warning("File changes detected:");
                    foreach ($changes as $change) {
                        WP_CLI::log("- {$change['file']}: {$change['reason']}");
                    }
                }
                break;

            case 'optimize':
                $optimizations = ConfigCacheManager::optimizeCache();
                if (empty($optimizations)) {
                    WP_CLI::success("No optimizations needed");
                } else {
                    WP_CLI::warning("Cache optimizations applied:");
                    foreach ($optimizations as $opt) {
                        WP_CLI::log("- {$opt['file']}: {$opt['reason']}");
                    }
                }
                break;

            default:
                WP_CLI::error("Unknown action: {$action}");
                WP_CLI::log("Available actions: stats, clear, monitor, optimize");
                break;
        }
    });
}