<?php

namespace Jankx\Debug;

/**
 * Debug Information Manager for Jankx Framework
 *
 * Displays response time, cache information, and other debug data
 * when JANKX_DEBUG is enabled.
 *
 * @package Jankx\Debug
 * @since 2.0.1
 */
class DebugInfo
{
    /**
     * @var float
     * @since 2.0.1
     */
    private static $startTime;

    /**
     * @var array
     * @since 2.0.1
     */
    private static $cacheInfo = [];

    /**
     * @var array
     * @since 2.0.1
     */
    private static $pluginCacheInfo = [];

    /**
     * @var array
     * @since 2.0.1
     */
    private static $objectCacheInfo = [];

    /**
     * @var int
     * @since 2.0.1
     */
    private static $initialQueryCount = 0;

    /**
     * @var int
     * @since 2.0.1
     */
    private static $queryCount = 0;

    /**
     * Initialize debug tracking
     *
     * @since 2.0.1
     */
    public static function init()
    {
        if (!defined('JANKX_DEBUG') || !JANKX_DEBUG) {
            return;
        }

        self::$startTime = microtime(true);

        // Capture initial query count when functions.php is loaded
        self::captureInitialQueryCount();

        // Hook into WordPress to capture cache information
        add_action('wp_footer', [self::class, 'displayDebugInfo'], 999);
        add_action('admin_footer', [self::class, 'displayDebugInfo'], 999);

        // Capture cache information
        self::captureCacheInfo();

        // Hook into database queries to count them
        add_filter('query', [self::class, 'countQuery'], 10, 1);

        // Also hook into wpdb query method
        if (isset($GLOBALS['wpdb'])) {
            add_action('wpdb_query', [self::class, 'countWpdbQuery'], 10, 2);
        }

        // Enable query logging
        if (!defined('SAVEQUERIES')) {
            define('SAVEQUERIES', true);
        }
    }

        /**
     * Capture initial query count when functions.php is loaded
     *
     * @since 2.0.1
     */
    private static function captureInitialQueryCount()
    {
        global $wpdb;

        // Enable query logging if not already enabled
        if (!defined('SAVEQUERIES')) {
            define('SAVEQUERIES', true);
        }

        if ($wpdb && method_exists($wpdb, 'num_queries')) {
            self::$initialQueryCount = $wpdb->num_queries;
        } else {
            // Fallback: count queries from $wpdb->queries if available
            if ($wpdb && isset($wpdb->queries) && is_array($wpdb->queries)) {
                self::$initialQueryCount = count($wpdb->queries);
            }
        }
    }

    /**
     * Capture cache information from various sources
     *
     * @since 2.0.1
     */
    private static function captureCacheInfo()
    {
        // WordPress Object Cache
        global $wp_object_cache;
        if ($wp_object_cache && method_exists($wp_object_cache, 'getStats')) {
            self::$cacheInfo['object_cache'] = $wp_object_cache->getStats();
        }

        // Transients
        self::$cacheInfo['transients'] = self::getTransientsInfo();

        // Plugin cache information
        self::capturePluginCacheInfo();

        // Object cache information
        self::captureObjectCacheInfo();
    }

        /**
     * Get transients information
     *
     * @return array
     * @since 2.0.1
     */
    private static function getTransientsInfo()
    {
        global $wpdb;

        // Check if $wpdb is available and has get_results method
        if (!$wpdb || !method_exists($wpdb, 'get_results')) {
            return [
                'count' => 0,
                'autoload_count' => 0,
                'total_size' => 0
            ];
        }

        $transients = $wpdb->get_results(
            "SELECT option_name, option_value, autoload
             FROM {$wpdb->options}
             WHERE option_name LIKE '_transient_%'
             ORDER BY option_name"
        );

        $info = [
            'count' => count($transients),
            'autoload_count' => 0,
            'total_size' => 0
        ];

        foreach ($transients as $transient) {
            if ($transient->autoload === 'yes') {
                $info['autoload_count']++;
            }
            $info['total_size'] += strlen($transient->option_value);
        }

        return $info;
    }

        /**
     * Get query count since functions.php was loaded
     *
     * @return array
     * @since 2.0.1
     */
    private static function getQueryCountSinceInit()
    {
        global $wpdb;

        // Use our custom query counter as primary method
        $currentQueryCount = self::$queryCount;

        // Fallback to wpdb methods if our counter is 0
        if ($currentQueryCount == 0 && $wpdb) {
            if (method_exists($wpdb, 'num_queries')) {
                $currentQueryCount = $wpdb->num_queries;
            } elseif (isset($wpdb->queries) && is_array($wpdb->queries)) {
                $currentQueryCount = count($wpdb->queries);
            } elseif (defined('SAVEQUERIES') && SAVEQUERIES && isset($wpdb->queries)) {
                $currentQueryCount = count($wpdb->queries);
            }
        }

        $queriesSinceInit = $currentQueryCount - self::$initialQueryCount;

        return [
            'total_queries' => $currentQueryCount,
            'queries_since_init' => $queriesSinceInit,
            'initial_count' => self::$initialQueryCount
        ];
    }

    /**
     * Debug method to check query counting status
     *
     * @return array
     * @since 2.0.1
     */
    private static function debugQueryCounting()
    {
        global $wpdb;

        $debug = [
            'wpdb_exists' => isset($wpdb),
            'wpdb_class' => $wpdb ? get_class($wpdb) : 'null',
            'num_queries_method' => $wpdb && method_exists($wpdb, 'num_queries'),
            'queries_property' => $wpdb && isset($wpdb->queries),
            'queries_is_array' => $wpdb && isset($wpdb->queries) && is_array($wpdb->queries),
            'savequeries_defined' => defined('SAVEQUERIES'),
            'savequeries_value' => defined('SAVEQUERIES') ? SAVEQUERIES : 'undefined',
            'initial_count' => self::$initialQueryCount,
            'current_queries' => $wpdb ? (method_exists($wpdb, 'num_queries') ? $wpdb->num_queries : 'method_not_exists') : 'wpdb_null'
        ];

        return $debug;
    }

    /**
     * Count database queries
     *
     * @param string $query
     * @return string
     * @since 2.0.1
     */
    public static function countQuery($query)
    {
        self::$queryCount++;
        return $query;
    }

    /**
     * Count wpdb queries
     *
     * @param string $query
     * @param string $query_type
     * @since 2.0.1
     */
    public static function countWpdbQuery($query, $query_type)
    {
        self::$queryCount++;
    }

    /**
     * Capture object cache information
     *
     * @since 2.0.1
     */
    private static function captureObjectCacheInfo()
    {
        // OPcache
        if (function_exists('opcache_get_status')) {
            $opcache_status = opcache_get_status();
            if ($opcache_status) {
                self::$objectCacheInfo['opcache'] = [
                    'enabled' => true,
                    'memory_usage' => $opcache_status['memory_usage'] ?? [],
                    'opcache_statistics' => $opcache_status['opcache_statistics'] ?? [],
                    'interned_strings_usage' => $opcache_status['interned_strings_usage'] ?? [],
                    'jit' => $opcache_status['jit'] ?? []
                ];
            } else {
                self::$objectCacheInfo['opcache'] = ['enabled' => false];
            }
        } else {
            self::$objectCacheInfo['opcache'] = ['enabled' => false, 'reason' => 'function_not_exists'];
        }

        // Redis
        if (class_exists('Redis')) {
            try {
                $redis = new Redis();
                if ($redis->connect('127.0.0.1', 6379, 1)) {
                    $info = $redis->info();
                    self::$objectCacheInfo['redis'] = [
                        'enabled' => true,
                        'version' => $info['redis_version'] ?? 'unknown',
                        'used_memory' => $info['used_memory'] ?? 0,
                        'used_memory_human' => $info['used_memory_human'] ?? '0B',
                        'connected_clients' => $info['connected_clients'] ?? 0,
                        'total_commands_processed' => $info['total_commands_processed'] ?? 0
                    ];
                    $redis->close();
                } else {
                    self::$objectCacheInfo['redis'] = ['enabled' => false, 'reason' => 'connection_failed'];
                }
            } catch (Exception $e) {
                self::$objectCacheInfo['redis'] = ['enabled' => false, 'reason' => 'exception', 'error' => $e->getMessage()];
            }
        } else {
            self::$objectCacheInfo['redis'] = ['enabled' => false, 'reason' => 'class_not_exists'];
        }

        // Memcached
        if (class_exists('Memcached')) {
            try {
                $memcached = new Memcached();
                if ($memcached->addServer('127.0.0.1', 11211)) {
                    $stats = $memcached->getStats();
                    if ($stats) {
                        $server_stats = reset($stats); // Get first server stats
                        self::$objectCacheInfo['memcached'] = [
                            'enabled' => true,
                            'version' => $server_stats['version'] ?? 'unknown',
                            'curr_items' => $server_stats['curr_items'] ?? 0,
                            'total_items' => $server_stats['total_items'] ?? 0,
                            'bytes' => $server_stats['bytes'] ?? 0,
                            'bytes_read' => $server_stats['bytes_read'] ?? 0,
                            'bytes_written' => $server_stats['bytes_written'] ?? 0
                        ];
                    } else {
                        self::$objectCacheInfo['memcached'] = ['enabled' => false, 'reason' => 'no_stats'];
                    }
                } else {
                    self::$objectCacheInfo['memcached'] = ['enabled' => false, 'reason' => 'connection_failed'];
                }
            } catch (Exception $e) {
                self::$objectCacheInfo['memcached'] = ['enabled' => false, 'reason' => 'exception', 'error' => $e->getMessage()];
            }
        } else {
            self::$objectCacheInfo['memcached'] = ['enabled' => false, 'reason' => 'class_not_exists'];
        }

        // APC/APCu
        if (function_exists('apcu_enabled') && apcu_enabled()) {
            $apcu_info = apcu_cache_info();
            $apcu_sma_info = apcu_sma_info();
            self::$objectCacheInfo['apcu'] = [
                'enabled' => true,
                'version' => phpversion('apcu'),
                'cache_hits' => $apcu_info['cache_hits'] ?? 0,
                'cache_misses' => $apcu_info['cache_misses'] ?? 0,
                'num_entries' => $apcu_info['num_entries'] ?? 0,
                'memory_usage' => $apcu_sma_info['avail_mem'] ?? 0
            ];
        } elseif (function_exists('apc_cache_info')) {
            $apc_info = apc_cache_info();
            $apc_sma_info = apc_sma_info();
            self::$objectCacheInfo['apc'] = [
                'enabled' => true,
                'version' => phpversion('apc'),
                'cache_hits' => $apc_info['cache_hits'] ?? 0,
                'cache_misses' => $apc_info['cache_misses'] ?? 0,
                'num_entries' => $apc_info['num_entries'] ?? 0,
                'memory_usage' => $apc_sma_info['avail_mem'] ?? 0
            ];
        } else {
            self::$objectCacheInfo['apcu'] = ['enabled' => false, 'reason' => 'not_available'];
        }

        // WordPress Object Cache
        global $wp_object_cache;
        if ($wp_object_cache) {
            $wp_cache_class = get_class($wp_object_cache);
            self::$objectCacheInfo['wordpress_object_cache'] = [
                'enabled' => true,
                'class' => $wp_cache_class,
                'is_persistent' => method_exists($wp_object_cache, 'getStats'),
                'has_stats' => method_exists($wp_object_cache, 'getStats')
            ];

            // Try to get stats if available
            if (method_exists($wp_object_cache, 'getStats')) {
                try {
                    $wp_stats = $wp_object_cache->getStats();
                    self::$objectCacheInfo['wordpress_object_cache']['stats'] = $wp_stats;
                } catch (Exception $e) {
                    self::$objectCacheInfo['wordpress_object_cache']['stats_error'] = $e->getMessage();
                }
            }
        } else {
            self::$objectCacheInfo['wordpress_object_cache'] = ['enabled' => false, 'reason' => 'not_available'];
        }
    }

    /**
     * Capture plugin cache information
     *
     * @since 2.0.1
     */
    private static function capturePluginCacheInfo()
    {
        // WooCommerce cache
        if (class_exists('WC_Cache_Helper')) {
            self::$pluginCacheInfo['woocommerce'] = [
                'cache_enabled' => wc_get_cache_helper()->get_transient_version('product') !== false,
                'cache_version' => wc_get_cache_helper()->get_transient_version('product')
            ];
        }

        // WP Rocket cache
        if (function_exists('rocket_get_option')) {
            self::$pluginCacheInfo['wp_rocket'] = [
                'cache_enabled' => rocket_get_option('cache_logged_user'),
                'minify_enabled' => rocket_get_option('minify_html'),
                'cdn_enabled' => rocket_get_option('cdn')
            ];
        }

        // W3 Total Cache
        if (class_exists('W3_Config')) {
            $w3_config = new \W3_Config();
            self::$pluginCacheInfo['w3_total_cache'] = [
                'page_cache_enabled' => $w3_config->get_boolean('pgcache.enabled'),
                'database_cache_enabled' => $w3_config->get_boolean('dbcache.enabled'),
                'object_cache_enabled' => $w3_config->get_boolean('objectcache.enabled')
            ];
        }

        // WP Super Cache
        if (function_exists('wp_cache_get_option')) {
            self::$pluginCacheInfo['wp_super_cache'] = [
                'cache_enabled' => wp_cache_get_option('wp_cache_enabled'),
                'mod_rewrite' => wp_cache_get_option('wp_cache_mod_rewrite')
            ];
        }
    }

    /**
     * Display debug information in HTML
     *
     * @since 2.0.1
     */
    public static function displayDebugInfo()
    {
        if (!defined('JANKX_DEBUG') || !JANKX_DEBUG) {
            return;
        }

        $responseTime = microtime(true) - self::$startTime;
        $memoryUsage = memory_get_peak_usage(true);
        $memoryLimit = ini_get('memory_limit');

        $debugHtml = self::generateDebugHtml($responseTime, $memoryUsage, $memoryLimit);

        echo $debugHtml;
    }

        /**
     * Generate debug HTML
     *
     * @param float $responseTime
     * @param int $memoryUsage
     * @param string $memoryLimit
     * @return string
     * @since 2.0.1
     */
    private static function generateDebugHtml($responseTime, $memoryUsage, $memoryLimit)
    {
                // CSS Styles with higher specificity to avoid conflicts with Gutenberg
        $css = '
        <style>
        /* Jankx Debug System - High specificity to avoid Gutenberg conflicts */
        body:not(.wp-admin) #jankx-debug-info,
        body.wp-admin:not(.gutenberg-editor-page) #jankx-debug-info {
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
            color: #ffffff !important;
            font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace !important;
            font-size: 12px !important;
            line-height: 1.4 !important;
            padding: 15px !important;
            z-index: 999999 !important;
            max-height: 350px !important;
            overflow-y: auto !important;
            border-top: 3px solid #0073aa !important;
            box-shadow: 0 -5px 20px rgba(0,0,0,0.3) !important;
            backdrop-filter: blur(10px) !important;
            -webkit-backdrop-filter: blur(10px) !important;
            transition: transform 0.3s ease-in-out, max-height 0.3s ease-in-out !important;
        }

        body:not(.wp-admin) #jankx-debug-info.minimized,
        body.wp-admin:not(.gutenberg-editor-page) #jankx-debug-info.minimized {
            transform: translateY(calc(100% - 40px)) !important;
            max-height: 40px !important;
            overflow: hidden !important;
            cursor: pointer !important;
        }

        body:not(.wp-admin) #jankx-debug-info.minimized:hover,
        body.wp-admin:not(.gutenberg-editor-page) #jankx-debug-info.minimized:hover {
            transform: translateY(calc(100% - 50px)) !important;
            max-height: 50px !important;
        }

        body:not(.wp-admin) #jankx-debug-info::-webkit-scrollbar,
        body.wp-admin:not(.gutenberg-editor-page) #jankx-debug-info::-webkit-scrollbar {
            width: 8px !important;
        }

        body:not(.wp-admin) #jankx-debug-info::-webkit-scrollbar-track,
        body.wp-admin:not(.gutenberg-editor-page) #jankx-debug-info::-webkit-scrollbar-track {
            background: #2d2d2d !important;
        }

        body:not(.wp-admin) #jankx-debug-info::-webkit-scrollbar-thumb,
        body.wp-admin:not(.gutenberg-editor-page) #jankx-debug-info::-webkit-scrollbar-thumb {
            background: #0073aa !important;
            border-radius: 4px !important;
        }

        body:not(.wp-admin) #jankx-debug-info::-webkit-scrollbar-thumb:hover,
        body.wp-admin:not(.gutenberg-editor-page) #jankx-debug-info::-webkit-scrollbar-thumb:hover {
            background: #005a87 !important;
        }

        body:not(.wp-admin) .jankx-debug-header,
        body.wp-admin:not(.gutenberg-editor-page) .jankx-debug-header {
            display: flex !important;
            justify-content: space-between !important;
            align-items: center !important;
            margin-bottom: 15px !important;
            padding-bottom: 10px !important;
            border-bottom: 1px solid #444 !important;
        }

        body:not(.wp-admin) .jankx-debug-title,
        body.wp-admin:not(.gutenberg-editor-page) .jankx-debug-title {
            font-weight: bold !important;
            font-size: 14px !important;
            color: #0073aa !important;
        }

        body:not(.wp-admin) .jankx-debug-close,
        body.wp-admin:not(.gutenberg-editor-page) .jankx-debug-close {
            background: #0073aa !important;
            color: white !important;
            border: none !important;
            padding: 6px 12px !important;
            cursor: pointer !important;
            border-radius: 4px !important;
            font-size: 11px !important;
            transition: background 0.2s !important;
        }

        body:not(.wp-admin) .jankx-debug-close:hover,
        body.wp-admin:not(.gutenberg-editor-page) .jankx-debug-close:hover {
            background: #005a87 !important;
        }

        body:not(.wp-admin) .jankx-debug-toggle,
        body.wp-admin:not(.gutenberg-editor-page) .jankx-debug-toggle {
            background: #ff9800 !important;
            color: white !important;
            border: none !important;
            padding: 6px 12px !important;
            cursor: pointer !important;
            border-radius: 4px !important;
            font-size: 11px !important;
            transition: background 0.2s !important;
            margin-right: 8px !important;
        }

        body:not(.wp-admin) .jankx-debug-toggle:hover,
        body.wp-admin:not(.gutenberg-editor-page) .jankx-debug-toggle:hover {
            background: #f57c00 !important;
        }

        body:not(.wp-admin) .jankx-debug-fullscreen,
        body.wp-admin:not(.gutenberg-editor-page) .jankx-debug-fullscreen {
            background: #9c27b0 !important;
            color: white !important;
            border: none !important;
            padding: 6px 12px !important;
            cursor: pointer !important;
            border-radius: 4px !important;
            font-size: 11px !important;
            transition: background 0.2s !important;
            margin-right: 8px !important;
        }

        body:not(.wp-admin) .jankx-debug-fullscreen:hover,
        body.wp-admin:not(.gutenberg-editor-page) .jankx-debug-fullscreen:hover {
            background: #7b1fa2 !important;
        }

        body:not(.wp-admin) #jankx-debug-info.fullscreen,
        body.wp-admin:not(.gutenberg-editor-page) #jankx-debug-info.fullscreen {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            bottom: 0 !important;
            max-height: none !important;
            height: 100vh !important;
            z-index: 999999 !important;
            transform: none !important;
        }

        body:not(.wp-admin) #jankx-debug-info.fullscreen .jankx-debug-header,
        body.wp-admin:not(.gutenberg-editor-page) #jankx-debug-info.fullscreen .jankx-debug-header {
            position: sticky !important;
            top: 0 !important;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%) !important;
            z-index: 10 !important;
            padding: 15px !important;
            margin: -15px -15px 15px -15px !important;
            border-bottom: 2px solid #0073aa !important;
        }

        body:not(.wp-admin) #jankx-debug-info.fullscreen .jankx-debug-content,
        body.wp-admin:not(.gutenberg-editor-page) #jankx-debug-info.fullscreen .jankx-debug-content {
            height: calc(100vh - 80px) !important;
            overflow-y: auto !important;
            padding: 0 15px !important;
        }

        body:not(.wp-admin) .jankx-debug-section,
        body.wp-admin:not(.gutenberg-editor-page) .jankx-debug-section {
            margin-bottom: 12px !important;
            padding: 8px !important;
            background: rgba(255,255,255,0.05) !important;
            border-radius: 4px !important;
            border-left: 3px solid #0073aa !important;
        }

        body:not(.wp-admin) .jankx-debug-section-title,
        body.wp-admin:not(.gutenberg-editor-page) .jankx-debug-section-title {
            font-weight: bold !important;
            margin-bottom: 5px !important;
            color: #00d4aa !important;
        }

        body:not(.wp-admin) .jankx-debug-item,
        body.wp-admin:not(.gutenberg-editor-page) .jankx-debug-item {
            margin: 3px 0 !important;
            padding: 2px 0 !important;
        }

        body:not(.wp-admin) .jankx-debug-list,
        body.wp-admin:not(.gutenberg-editor-page) .jankx-debug-list {
            margin: 5px 0 !important;
            padding-left: 20px !important;
        }

        body:not(.wp-admin) .jankx-debug-list li,
        body.wp-admin:not(.gutenberg-editor-page) .jankx-debug-list li {
            margin: 2px 0 !important;
            padding: 1px 0 !important;
        }

        body:not(.wp-admin) .jankx-debug-grid,
        body.wp-admin:not(.gutenberg-editor-page) .jankx-debug-grid {
            display: grid !important;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
            gap: 10px !important;
            margin-top: 10px !important;
        }

        body:not(.wp-admin) .jankx-debug-metric,
        body.wp-admin:not(.gutenberg-editor-page) .jankx-debug-metric {
            background: rgba(0,115,170,0.1) !important;
            padding: 8px !important;
            border-radius: 4px !important;
            border: 1px solid rgba(0,115,170,0.3) !important;
        }

        body:not(.wp-admin) .jankx-debug-metric-label,
        body.wp-admin:not(.gutenberg-editor-page) .jankx-debug-metric-label {
            font-weight: bold !important;
            color: #00d4aa !important;
            font-size: 11px !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
        }

        body:not(.wp-admin) .jankx-debug-metric-value,
        body.wp-admin:not(.gutenberg-editor-page) .jankx-debug-metric-value {
            font-size: 13px !important;
            color: #ffffff !important;
            margin-top: 2px !important;
        }

        body:not(.wp-admin) .jankx-debug-mini-bar,
        body.wp-admin:not(.gutenberg-editor-page) .jankx-debug-mini-bar {
            display: none !important;
            position: fixed !important;
            bottom: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: 40px !important;
            background: linear-gradient(135deg, #0073aa 0%, #005a87 100%) !important;
            color: white !important;
            font-family: "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace !important;
            font-size: 12px !important;
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 0 15px !important;
            z-index: 999999 !important;
            border-top: 2px solid #00d4aa !important;
            cursor: pointer !important;
            transition: height 0.3s ease-in-out !important;
        }

        body:not(.wp-admin) .jankx-debug-mini-bar:hover,
        body.wp-admin:not(.gutenberg-editor-page) .jankx-debug-mini-bar:hover {
            height: 50px !important;
        }

        body:not(.wp-admin) .jankx-debug-mini-title,
        body.wp-admin:not(.gutenberg-editor-page) .jankx-debug-mini-title {
            font-weight: bold !important;
            color: #ffffff !important;
        }

        body:not(.wp-admin) .jankx-debug-mini-stats,
        body.wp-admin:not(.gutenberg-editor-page) .jankx-debug-mini-stats {
            display: flex !important;
            gap: 20px !important;
            font-size: 11px !important;
            opacity: 0.9 !important;
        }

        body:not(.wp-admin) .jankx-debug-mini-stat,
        body.wp-admin:not(.gutenberg-editor-page) .jankx-debug-mini-stat {
            display: flex !important;
            align-items: center !important;
            gap: 5px !important;
        }

        /* Hide debug panel in Gutenberg editor to avoid conflicts */
        body.gutenberg-editor-page #jankx-debug-info,
        body.gutenberg-editor-page .jankx-debug-mini-bar {
            display: none !important;
        }

        @media (max-width: 768px) {
            body:not(.wp-admin) #jankx-debug-info,
            body.wp-admin:not(.gutenberg-editor-page) #jankx-debug-info {
                font-size: 11px !important;
                padding: 10px !important;
                max-height: 250px !important;
            }

            body:not(.wp-admin) .jankx-debug-grid,
            body.wp-admin:not(.gutenberg-editor-page) .jankx-debug-grid {
                grid-template-columns: 1fr !important;
                gap: 5px !important;
            }

            body:not(.wp-admin) .jankx-debug-mini-stats,
            body.wp-admin:not(.gutenberg-editor-page) .jankx-debug-mini-stats {
                gap: 10px !important;
                font-size: 10px !important;
            }
        }
        </style>';

                // JavaScript
        $js = '
        <script>
        function jankxMinimizeDebug() {
            const debugInfo = document.getElementById("jankx-debug-info");
            const miniBar = document.getElementById("jankx-debug-mini-bar");
            const toggleBtn = document.getElementById("jankx-debug-toggle-btn");

            debugInfo.classList.add("minimized");
            miniBar.style.display = "flex";
            toggleBtn.textContent = "□";

            localStorage.setItem("jankx-debug-state", "minimized");
        }

        function jankxMaximizeDebug() {
            const debugInfo = document.getElementById("jankx-debug-info");
            const miniBar = document.getElementById("jankx-debug-mini-bar");
            const toggleBtn = document.getElementById("jankx-debug-toggle-btn");

            debugInfo.classList.remove("minimized");
            miniBar.style.display = "none";
            toggleBtn.textContent = "−";

            localStorage.setItem("jankx-debug-state", "maximized");
        }

        function jankxToggleDebug() {
            const debugInfo = document.getElementById("jankx-debug-info");
            const miniBar = document.getElementById("jankx-debug-mini-bar");
            const toggleBtn = document.getElementById("jankx-debug-toggle-btn");

            // If in fullscreen mode, exit fullscreen first
            if (debugInfo.classList.contains("fullscreen")) {
                jankxExitFullscreen();
            }

            if (debugInfo.classList.contains("minimized")) {
                jankxMaximizeDebug();
            } else {
                jankxMinimizeDebug();
            }
        }

        function jankxToggleFullscreen() {
            const debugInfo = document.getElementById("jankx-debug-info");
            const miniBar = document.getElementById("jankx-debug-mini-bar");

            if (debugInfo.classList.contains("fullscreen")) {
                jankxExitFullscreen();
            } else {
                jankxEnterFullscreen();
            }
        }

        function jankxEnterFullscreen() {
            const debugInfo = document.getElementById("jankx-debug-info");
            const miniBar = document.getElementById("jankx-debug-mini-bar");

            debugInfo.classList.remove("minimized");
            debugInfo.classList.add("fullscreen");
            miniBar.style.display = "none";

            localStorage.setItem("jankx-debug-state", "fullscreen");
        }

        function jankxExitFullscreen() {
            const debugInfo = document.getElementById("jankx-debug-info");
            const miniBar = document.getElementById("jankx-debug-mini-bar");
            const toggleBtn = document.getElementById("jankx-debug-toggle-btn");

            debugInfo.classList.remove("fullscreen");
            miniBar.style.display = "none";
            toggleBtn.textContent = "−";

            localStorage.setItem("jankx-debug-state", "maximized");
        }

        // Check localStorage on load
        document.addEventListener("DOMContentLoaded", function() {
            const debugInfo = document.getElementById("jankx-debug-info");
            const miniBar = document.getElementById("jankx-debug-mini-bar");
            const toggleBtn = document.getElementById("jankx-debug-toggle-btn");
            const state = localStorage.getItem("jankx-debug-state");

            if (state === "minimized") {
                debugInfo.classList.add("minimized");
                miniBar.style.display = "flex";
                toggleBtn.textContent = "□";
            } else if (state === "fullscreen") {
                debugInfo.classList.add("fullscreen");
                miniBar.style.display = "none";
                toggleBtn.textContent = "−";
            }
        });

        // Click on minimized debug to maximize
        document.addEventListener("click", function(e) {
            const debugInfo = document.getElementById("jankx-debug-info");
            const miniBar = document.getElementById("jankx-debug-mini-bar");

            if (e.target === miniBar || miniBar.contains(e.target)) {
                jankxMaximizeDebug();
            }
        });
        </script>';

                $html = $css . $js . '<div id="jankx-debug-info">';

        // Header
        $html .= '<div class="jankx-debug-header">';
        $html .= '<div class="jankx-debug-title">🔍 JANKX DEBUG INFO</div>';
        $html .= '<div>';
        $html .= '<button class="jankx-debug-fullscreen" onclick="jankxToggleFullscreen()" title="Fullscreen">⛶</button>';
        $html .= '<button class="jankx-debug-toggle" onclick="jankxToggleDebug()" title="Toggle Debug Panel" id="jankx-debug-toggle-btn">−</button>';
        $html .= '</div>';
        $html .= '</div>';

        // Content wrapper
        $html .= '<div class="jankx-debug-content">';

        // Metrics Grid
        $html .= '<div class="jankx-debug-grid">';

        // Response Time
        $html .= '<div class="jankx-debug-metric">';
        $html .= '<div class="jankx-debug-metric-label">⏱️ Response Time</div>';
        $html .= '<div class="jankx-debug-metric-value">' . number_format($responseTime * 1000, 2) . 'ms</div>';
        $html .= '</div>';

        // Memory Usage
        $html .= '<div class="jankx-debug-metric">';
        $html .= '<div class="jankx-debug-metric-label">💾 Memory Usage</div>';
        $html .= '<div class="jankx-debug-metric-value">' . self::formatBytes($memoryUsage) . ' / ' . $memoryLimit . '</div>';
        $html .= '</div>';

                // Database Queries
        $queryInfo = self::getQueryCountSinceInit();
        $html .= '<div class="jankx-debug-metric">';
        $html .= '<div class="jankx-debug-metric-label">🗄️ Database</div>';
        $html .= '<div class="jankx-debug-metric-value">';
        $html .= $queryInfo['total_queries'] . ' total queries';
        if ($queryInfo['queries_since_init'] > 0) {
            $html .= '<br><small style="color: #00d4aa;">+' . $queryInfo['queries_since_init'] . ' since functions.php</small>';
        }
        $html .= '</div>';
        $html .= '</div>';

        $html .= '</div>'; // End grid

        // Database Query Details
        $queryInfo = self::getQueryCountSinceInit();
        $debugInfo = self::debugQueryCounting();
        $html .= '<div class="jankx-debug-section">';
        $html .= '<div class="jankx-debug-section-title">🗄️ Database Queries</div>';
        $html .= '<ul class="jankx-debug-list">';
        $html .= '<li>Total Queries: ' . $queryInfo['total_queries'] . '</li>';
        $html .= '<li>Since functions.php: +' . $queryInfo['queries_since_init'] . ' queries</li>';
        $html .= '<li>Initial Count: ' . $queryInfo['initial_count'] . ' queries</li>';
        $html .= '</ul>';

        // Debug information (only show if queries = 0 and in debug mode)
        if ($queryInfo['total_queries'] == 0 && defined('WP_DEBUG') && WP_DEBUG) {
            $html .= '<div style="margin-top: 10px; padding: 8px; background: rgba(255,0,0,0.1); border-radius: 4px; font-size: 10px;">';
            $html .= '<strong>Debug Info:</strong><br>';
            $html .= 'Custom counter: ' . self::$queryCount . '<br>';
            $html .= 'wpdb exists: ' . ($debugInfo['wpdb_exists'] ? '✅' : '❌') . '<br>';
            $html .= 'num_queries method: ' . ($debugInfo['num_queries_method'] ? '✅' : '❌') . '<br>';
            $html .= 'queries property: ' . ($debugInfo['queries_property'] ? '✅' : '❌') . '<br>';
            $html .= 'SAVEQUERIES: ' . ($debugInfo['savequeries_defined'] ? '✅' : '❌') . '<br>';
            $html .= 'Current queries: ' . $debugInfo['current_queries'];
            $html .= '</div>';
        }

        $html .= '</div>';

        // WordPress Cache Info
        if (!empty(self::$cacheInfo)) {
            $html .= '<div class="jankx-debug-section">';
            $html .= '<div class="jankx-debug-section-title">🗄️ WordPress Cache</div>';
            $html .= '<ul class="jankx-debug-list">';

            if (isset(self::$cacheInfo['transients'])) {
                $transients = self::$cacheInfo['transients'];
                $html .= '<li>Transients: ' . $transients['count'] . ' items (' . self::formatBytes($transients['total_size']) . ')</li>';
            }

            if (isset(self::$cacheInfo['object_cache'])) {
                $html .= '<li>Object Cache: Available</li>';
            }

            $html .= '</ul>';
            $html .= '</div>';
        }

        // Plugin Cache Info
        if (!empty(self::$pluginCacheInfo)) {
            $html .= '<div class="jankx-debug-section">';
            $html .= '<div class="jankx-debug-section-title">🔌 Plugin Cache</div>';
            $html .= '<ul class="jankx-debug-list">';

            foreach (self::$pluginCacheInfo as $plugin => $info) {
                $status = [];
                foreach ($info as $key => $value) {
                    if (is_bool($value)) {
                        $status[] = $key . ': ' . ($value ? '✅' : '❌');
                    } else {
                        $status[] = $key . ': ' . $value;
                    }
                }
                $html .= '<li>' . ucfirst(str_replace('_', ' ', $plugin)) . ': ' . implode(', ', $status) . '</li>';
            }

            $html .= '</ul>';
            $html .= '</div>';
        }

        // Object Cache Info
        if (!empty(self::$objectCacheInfo)) {
            $html .= '<div class="jankx-debug-section">';
            $html .= '<div class="jankx-debug-section-title">⚡ Object Cache</div>';
            $html .= '<ul class="jankx-debug-list">';

            foreach (self::$objectCacheInfo as $cache_type => $info) {
                if ($info['enabled']) {
                    $status = [];

                    switch ($cache_type) {
                        case 'opcache':
                            if (isset($info['opcache_statistics'])) {
                                $stats = $info['opcache_statistics'];
                                $status[] = 'Hits: ' . number_format($stats['hits'] ?? 0);
                                $status[] = 'Misses: ' . number_format($stats['misses'] ?? 0);
                                $status[] = 'Hit Rate: ' . round(($stats['opcache_hit_rate'] ?? 0), 2) . '%';
                            }
                            if (isset($info['memory_usage'])) {
                                $mem = $info['memory_usage'];
                                $status[] = 'Memory: ' . self::formatBytes($mem['used_memory'] ?? 0) . ' / ' . self::formatBytes($mem['free_memory'] ?? 0);
                            }
                            break;

                        case 'redis':
                            $status[] = 'Version: ' . ($info['version'] ?? 'unknown');
                            $status[] = 'Memory: ' . ($info['used_memory_human'] ?? '0B');
                            $status[] = 'Clients: ' . ($info['connected_clients'] ?? 0);
                            $status[] = 'Commands: ' . number_format($info['total_commands_processed'] ?? 0);
                            break;

                        case 'memcached':
                            $status[] = 'Version: ' . ($info['version'] ?? 'unknown');
                            $status[] = 'Items: ' . number_format($info['curr_items'] ?? 0);
                            $status[] = 'Memory: ' . self::formatBytes($info['bytes'] ?? 0);
                            $status[] = 'Total Items: ' . number_format($info['total_items'] ?? 0);
                            break;

                        case 'apcu':
                        case 'apc':
                            $status[] = 'Version: ' . ($info['version'] ?? 'unknown');
                            $status[] = 'Hits: ' . number_format($info['cache_hits'] ?? 0);
                            $status[] = 'Misses: ' . number_format($info['cache_misses'] ?? 0);
                            $status[] = 'Entries: ' . number_format($info['num_entries'] ?? 0);
                            $status[] = 'Memory: ' . self::formatBytes($info['memory_usage'] ?? 0);
                            break;

                        case 'wordpress_object_cache':
                            $status[] = 'Class: ' . ($info['class'] ?? 'unknown');
                            $status[] = 'Persistent: ' . ($info['is_persistent'] ? '✅' : '❌');
                            $status[] = 'Stats Available: ' . ($info['has_stats'] ? '✅' : '❌');
                            break;
                    }

                    $html .= '<li>' . ucfirst(str_replace('_', ' ', $cache_type)) . ': ' . implode(', ', $status) . '</li>';
                } else {
                    $reason = $info['reason'] ?? 'disabled';
                    $html .= '<li>' . ucfirst(str_replace('_', ' ', $cache_type)) . ': ❌ (' . $reason . ')</li>';
                }
            }

            $html .= '</ul>';
            $html .= '</div>';
        }

        // Server Info
        $html .= '<div class="jankx-debug-section">';
        $html .= '<div class="jankx-debug-section-title">🖥️ Server Info</div>';
        $html .= '<div class="jankx-debug-item">PHP ' . PHP_VERSION . ' | ' . ($_SERVER['SERVER_SOFTWARE'] ?? 'Unknown') . '</div>';
        $html .= '</div>';

        // Plugin Debug Info (via action hooks)
        $pluginDebugInfo = self::getPluginDebugInfo();
        if (!empty($pluginDebugInfo)) {
            $html .= '<div class="jankx-debug-section">';
            $html .= '<div class="jankx-debug-section-title">🔌 Plugin Debug Info</div>';
            $html .= '<ul class="jankx-debug-list">';

            foreach ($pluginDebugInfo as $plugin => $info) {
                $html .= '<li><strong>' . esc_html($plugin) . ':</strong> ' . esc_html($info) . '</li>';
            }

            $html .= '</ul>';
            $html .= '</div>';
        }

        $html .= '</div>'; // End content wrapper
        $html .= '</div>'; // End main div

        // Mini Bar (shown when minimized)
        $html .= '<div id="jankx-debug-mini-bar" style="display: none;">';
        $html .= '<div class="jankx-debug-mini-title">🔍 JANKX DEBUG</div>';
        $html .= '<div class="jankx-debug-mini-stats">';
        $html .= '<div class="jankx-debug-mini-stat">⏱️ ' . number_format($responseTime * 1000, 0) . 'ms</div>';
        $html .= '<div class="jankx-debug-mini-stat">💾 ' . self::formatBytes($memoryUsage) . '</div>';
        $queryInfo = self::getQueryCountSinceInit();
        $html .= '<div class="jankx-debug-mini-stat">🗄️ ' . $queryInfo['total_queries'] . ' queries</div>';
        $html .= '</div>';
        $html .= '</div>';

        return $html;
    }

    /**
     * Format bytes to human readable format
     *
     * @param int $bytes
     * @param int $precision
     * @return string
     * @since 2.0.1
     */
    private static function formatBytes($bytes, $precision = 2)
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, $precision) . ' ' . $units[$i];
    }

    /**
     * Get debug information as array
     *
     * @return array
     * @since 2.0.1
     */
    public static function getDebugInfo()
    {
        if (!defined('JANKX_DEBUG') || !JANKX_DEBUG) {
            return [];
        }

        return [
            'response_time' => microtime(true) - self::$startTime,
            'memory_usage' => memory_get_peak_usage(true),
            'memory_limit' => ini_get('memory_limit'),
            'cache_info' => self::$cacheInfo,
            'plugin_cache_info' => self::$pluginCacheInfo,
            'object_cache_info' => self::$objectCacheInfo,
            'php_version' => PHP_VERSION,
            'server_software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown'
        ];
    }

    /**
     * Get query count for testing
     *
     * @return array
     * @since 2.0.1
     */
    public static function getQueryCountForTesting()
    {
        return self::getQueryCountSinceInit();
    }

    /**
     * Debug query counting for testing
     *
     * @return array
     * @since 2.0.1
     */
    public static function debugQueryCountingForTesting()
    {
        return self::debugQueryCounting();
    }

    /**
     * Get plugin debug information via action hooks
     *
     * @return array
     * @since 2.0.1
     */
    private static function getPluginDebugInfo()
    {
        $pluginDebugInfo = [];

        // Action hook for plugins to add their debug info
        do_action('jankx/debug/add_info', $pluginDebugInfo);

        // Filter hook for plugins to modify debug info
        $pluginDebugInfo = apply_filters('jankx/debug/modify_info', $pluginDebugInfo);

        return $pluginDebugInfo;
    }

    /**
     * Add plugin debug info (helper method for plugins)
     *
     * @param array $debugInfo Reference to debug info array
     * @param string $pluginName Plugin name
     * @param string $info Debug information
     * @since 2.0.1
     */
    public static function addPluginDebugInfo(&$debugInfo, $pluginName, $info)
    {
        $debugInfo[$pluginName] = $info;
    }
}