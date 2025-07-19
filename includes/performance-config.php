<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

/**
 * Performance Configuration for Jankx Framework
 */

class Jankx_Performance_Config
{
    // Cache settings
    const CACHE_DURATION = 3600; // 1 hour
    const QUERY_CACHE_DURATION = 300; // 5 minutes
    const ASSET_CACHE_DURATION = 86400; // 24 hours

    // Query optimization settings
    const HOMEPAGE_POSTS_LIMIT = 10;
    const ARCHIVE_POSTS_LIMIT = 12;
    const SINGLE_POSTS_LIMIT = 5;

    // Asset optimization settings
    const DEFER_SCRIPTS = ['jankx-common', 'scroll-to-smooth', 'flickity'];
    const PRELOAD_CRITICAL_CSS = true;
    const MINIFY_ASSETS = true;

    // Browser cache settings
    const BROWSER_CACHE_DURATION = 3600; // 1 hour
    const STATIC_ASSETS_CACHE = 86400; // 24 hours

    // WordPress optimization settings
    const REMOVE_EMOJI = true;
    const REMOVE_EMBED = true;
    const REMOVE_REST_API_LINKS = true;
    const REMOVE_GENERATOR = true;

    /**
     * Get performance configuration
     */
    public static function get_config()
    {
        return [
            'cache' => [
                'duration' => self::CACHE_DURATION,
                'query_cache_duration' => self::QUERY_CACHE_DURATION,
                'asset_cache_duration' => self::ASSET_CACHE_DURATION,
            ],
            'queries' => [
                'homepage_posts_limit' => self::HOMEPAGE_POSTS_LIMIT,
                'archive_posts_limit' => self::ARCHIVE_POSTS_LIMIT,
                'single_posts_limit' => self::SINGLE_POSTS_LIMIT,
            ],
            'assets' => [
                'defer_scripts' => self::DEFER_SCRIPTS,
                'preload_critical_css' => self::PRELOAD_CRITICAL_CSS,
                'minify_assets' => self::MINIFY_ASSETS,
            ],
            'browser_cache' => [
                'duration' => self::BROWSER_CACHE_DURATION,
                'static_assets_cache' => self::STATIC_ASSETS_CACHE,
            ],
            'wordpress_optimization' => [
                'remove_emoji' => self::REMOVE_EMOJI,
                'remove_embed' => self::REMOVE_EMBED,
                'remove_rest_api_links' => self::REMOVE_REST_API_LINKS,
                'remove_generator' => self::REMOVE_GENERATOR,
            ],
        ];
    }

    /**
     * Get cache duration for specific type
     */
    public static function get_cache_duration($type = 'default')
    {
        $durations = [
            'default' => self::CACHE_DURATION,
            'query' => self::QUERY_CACHE_DURATION,
            'asset' => self::ASSET_CACHE_DURATION,
            'browser' => self::BROWSER_CACHE_DURATION,
            'static' => self::STATIC_ASSETS_CACHE,
        ];

        return isset($durations[$type]) ? $durations[$type] : self::CACHE_DURATION;
    }

    /**
     * Get posts limit for specific page type
     */
    public static function get_posts_limit($page_type = 'default')
    {
        $limits = [
            'homepage' => self::HOMEPAGE_POSTS_LIMIT,
            'archive' => self::ARCHIVE_POSTS_LIMIT,
            'single' => self::SINGLE_POSTS_LIMIT,
            'default' => get_option('posts_per_page', 10),
        ];

        return isset($limits[$page_type]) ? $limits[$page_type] : $limits['default'];
    }

    /**
     * Check if script should be deferred
     */
    public static function should_defer_script($handle)
    {
        return in_array($handle, self::DEFER_SCRIPTS);
    }

    /**
     * Check if WordPress optimization is enabled
     */
    public static function is_wordpress_optimization_enabled($type)
    {
        $config = self::get_config();
        return isset($config['wordpress_optimization'][$type])
            ? $config['wordpress_optimization'][$type]
            : false;
    }

    /**
     * Get browser cache headers
     */
    public static function get_cache_headers($page_type = 'default')
    {
        $headers = [
            'homepage' => 'Cache-Control: public, max-age=' . self::BROWSER_CACHE_DURATION,
            'archive' => 'Cache-Control: public, max-age=' . self::BROWSER_CACHE_DURATION,
            'single' => 'Cache-Control: public, max-age=' . self::BROWSER_CACHE_DURATION,
            'static' => 'Cache-Control: public, max-age=' . self::STATIC_ASSETS_CACHE,
            'default' => 'Cache-Control: public, max-age=' . self::BROWSER_CACHE_DURATION,
        ];

        return isset($headers[$page_type]) ? $headers[$page_type] : $headers['default'];
    }
}

// Helper functions for backward compatibility
if (!function_exists('jankx_get_performance_config')) {
    function jankx_get_performance_config($key = null)
    {
        if ($key === null) {
            return Jankx_Performance_Config::get_config();
        }

        $config = Jankx_Performance_Config::get_config();
        return isset($config[$key]) ? $config[$key] : null;
    }
}

if (!function_exists('jankx_get_cache_duration')) {
    function jankx_get_cache_duration($type = 'default')
    {
        return Jankx_Performance_Config::get_cache_duration($type);
    }
}

if (!function_exists('jankx_get_posts_limit')) {
    function jankx_get_posts_limit($page_type = 'default')
    {
        return Jankx_Performance_Config::get_posts_limit($page_type);
    }
}

if (!function_exists('jankx_should_defer_script')) {
    function jankx_should_defer_script($handle)
    {
        return Jankx_Performance_Config::should_defer_script($handle);
    }
}