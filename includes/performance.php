<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

/**
 * Performance Helper for Jankx Framework
 */

class Jankx_Performance_Helper
{
    private static $instance = null;
    private static $cache = [];
    private static $hooks_registered = [];

    public static function instance()
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        $this->init();
    }

    /**
     * Initialize performance optimizations
     */
    private function init()
    {
        // Prevent duplicate hook registrations
        add_action('init', [$this, 'setup_performance_hooks'], 1);

        // Optimize database queries
        add_action('wp', [$this, 'optimize_queries']);

        // Add browser caching headers
        add_action('send_headers', [$this, 'add_cache_headers']);

        // Optimize asset loading
        add_filter('wp_enqueue_scripts', [$this, 'optimize_asset_loading'], 999);
    }

    /**
     * Setup performance hooks only once
     */
    public function setup_performance_hooks()
    {
        // Prevent duplicate registrations
        if (isset(self::$hooks_registered['performance_hooks'])) {
            return;
        }

        // Optimize WordPress core
        $this->optimize_wordpress_core();

        // Optimize database
        $this->optimize_database();

        // Mark as registered
        self::$hooks_registered['performance_hooks'] = true;
    }

    /**
     * Optimize WordPress core performance
     */
    private function optimize_wordpress_core()
    {
        // Remove unnecessary WordPress features
        if (!is_admin()) {
            // Remove emoji scripts
            if (jankx_get_performance_config('wordpress_optimization')['remove_emoji']) {
                remove_action('wp_head', 'print_emoji_detection_script', 7);
                remove_action('wp_print_styles', 'print_emoji_styles');
            }

            // Remove embed scripts
            if (jankx_get_performance_config('wordpress_optimization')['remove_embed']) {
                remove_action('wp_head', 'wp_oembed_add_discovery_links');
                remove_action('wp_head', 'wp_oembed_add_host_js');
            }

            // Remove REST API links
            if (jankx_get_performance_config('wordpress_optimization')['remove_rest_api_links']) {
                remove_action('wp_head', 'rest_output_link_wp_head');
                remove_action('wp_head', 'wp_resource_hints', 2);
            }
        }

        // Optimize admin performance
        if (is_admin()) {
            // Remove unnecessary admin features
            if (jankx_get_performance_config('wordpress_optimization')['remove_generator']) {
                remove_action('admin_head', 'wp_generator');
            }
        }
    }

    /**
     * Optimize database queries
     */
    private function optimize_database()
    {
        // Optimize post queries
        add_filter('posts_pre_query', [$this, 'optimize_post_queries'], 10, 2);

        // Cache expensive queries
        add_filter('posts_results', [$this, 'cache_query_results'], 10, 2);
    }

    /**
     * Optimize post queries
     */
    public function optimize_post_queries($posts, $query)
    {
        // Only optimize main queries
        if (!$query->is_main_query()) {
            return $posts;
        }

        // Add query optimization
        $query->set('no_found_rows', true);
        $query->set('update_post_meta_cache', false);
        $query->set('update_post_term_cache', false);

        return $posts;
    }

    /**
     * Cache query results
     */
    public function cache_query_results($posts, $query)
    {
        // Cache main query results
        if ($query->is_main_query() && !empty($posts)) {
            $cache_key = 'jankx_main_query_' . md5(serialize($query->query_vars));
            wp_cache_set($cache_key, $posts, 'jankx_queries', 300); // 5 minutes
        }

        return $posts;
    }

    /**
     * Add browser cache headers
     */
    public function add_cache_headers()
    {
        if (!is_admin() && !is_user_logged_in()) {
            $cache_duration = jankx_get_cache_duration('browser');

            // Cache static assets
            if (is_404() || is_search() || is_archive() || is_single()) {
                header('Cache-Control: public, max-age=' . $cache_duration);
            }

            // Cache homepage
            if (is_front_page()) {
                header('Cache-Control: public, max-age=' . $cache_duration);
            }
        }
    }

    /**
     * Optimize asset loading
     */
    public function optimize_asset_loading()
    {
        // Defer non-critical JavaScript
        add_filter('script_loader_tag', [$this, 'defer_js_loading'], 10, 3);

        // Preload critical CSS
        add_action('wp_head', [$this, 'preload_critical_css'], 1);
    }

    /**
     * Defer JavaScript loading
     */
    public function defer_js_loading($tag, $handle, $src)
    {
        // Defer non-critical scripts
        $defer_scripts = jankx_get_performance_config('assets')['defer_scripts'];

        if (in_array($handle, $defer_scripts)) {
            return str_replace('<script ', '<script defer ', $tag);
        }

        return $tag;
    }

    /**
     * Preload critical CSS
     */
    public function preload_critical_css()
    {
        if (!is_admin() && jankx_get_performance_config('assets')['preload_critical_css']) {
            echo '<link rel="preload" href="' . get_stylesheet_uri() . '" as="style" onload="this.onload=null;this.rel=\'stylesheet\'">';
            echo '<noscript><link rel="stylesheet" href="' . get_stylesheet_uri() . '"></noscript>';
        }
    }

    /**
     * Get cached value
     */
    public static function get_cache($key, $callback = null, $expiration = 3600)
    {
        if (isset(self::$cache[$key])) {
            return self::$cache[$key];
        }

        // Try WordPress cache first
        $cached = wp_cache_get($key, 'jankx_performance');
        if (false !== $cached) {
            self::$cache[$key] = $cached;
            return $cached;
        }

        // Execute callback if provided
        if (is_callable($callback)) {
            $result = call_user_func($callback);
            self::$cache[$key] = $result;
            wp_cache_set($key, $result, 'jankx_performance', $expiration);
            return $result;
        }

        return null;
    }

    /**
     * Set cache value
     */
    public static function set_cache($key, $value, $expiration = 3600)
    {
        self::$cache[$key] = $value;
        wp_cache_set($key, $value, 'jankx_performance', $expiration);
    }

    /**
     * Clear cache
     */
    public static function clear_cache($key = null)
    {
        if ($key) {
            unset(self::$cache[$key]);
            wp_cache_delete($key, 'jankx_performance');
        } else {
            self::$cache = [];
            wp_cache_flush_group('jankx_performance');
        }
    }

    /**
     * Optimize queries for specific pages
     */
    public function optimize_queries()
    {
        // Optimize for different page types
        if (is_front_page()) {
            $this->optimize_homepage_queries();
        } elseif (is_single()) {
            $this->optimize_single_queries();
        } elseif (is_archive()) {
            $this->optimize_archive_queries();
        }
    }

    /**
     * Optimize homepage queries
     */
    private function optimize_homepage_queries()
    {
        // Limit posts per page for better performance
        add_filter('pre_get_posts', function($query) {
            if ($query->is_home() && $query->is_main_query()) {
                $posts_limit = jankx_get_posts_limit('homepage');
                $query->set('posts_per_page', $posts_limit);
                $query->set('no_found_rows', true);
            }
        });
    }

    /**
     * Optimize single post queries
     */
    private function optimize_single_queries()
    {
        // Optimize related posts query
        add_filter('pre_get_posts', function($query) {
            if ($query->is_single() && $query->is_main_query()) {
                $query->set('update_post_meta_cache', false);
                $query->set('update_post_term_cache', false);
            }
        });
    }

    /**
     * Optimize archive queries
     */
    private function optimize_archive_queries()
    {
        // Optimize archive queries
        add_filter('pre_get_posts', function($query) {
            if ($query->is_archive() && $query->is_main_query()) {
                $posts_limit = jankx_get_posts_limit('archive');
                $query->set('posts_per_page', $posts_limit);
                $query->set('no_found_rows', true);
            }
        });
    }
}

// Initialize performance helper
Jankx_Performance_Helper::instance();

// Helper functions for backward compatibility
if (!function_exists('jankx_get_cache')) {
    function jankx_get_cache($key, $callback = null, $expiration = 3600)
    {
        return Jankx_Performance_Helper::get_cache($key, $callback, $expiration);
    }
}

if (!function_exists('jankx_set_cache')) {
    function jankx_set_cache($key, $value, $expiration = 3600)
    {
        return Jankx_Performance_Helper::set_cache($key, $value, $expiration);
    }
}

if (!function_exists('jankx_clear_cache')) {
    function jankx_clear_cache($key = null)
    {
        return Jankx_Performance_Helper::clear_cache($key);
    }
}