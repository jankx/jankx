<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

/**
 * Jankx Framework Configuration
 */

class Jankx_Config
{
    // Framework constants
    const FRAMEWORK_VERSION = '1.0.1';
    const MIN_PHP_VERSION = '7.1';
    const MIN_WP_VERSION = '5.0';

    // Security constants
    const NONCE_ACTION_SAVE_OPTIONS = 'save_options_nonce';
    const NONCE_ACTION_SAVE_MENU_ITEM = 'save_menu_item_metas';
    const NONCE_ACTION_SAVE_POST_LAYOUT = 'save_post_layout';

    // Layout constants
    const LAYOUT_FULL_WIDTH = 'jankx-fw';
    const LAYOUT_CONTENT_SIDEBAR = 'jankx-cs';
    const LAYOUT_SIDEBAR_CONTENT = 'jankx-sc';
    const LAYOUT_CONTENT_SIDEBAR_SIDEBAR = 'jankx-css';
    const LAYOUT_SIDEBAR_CONTENT_SIDEBAR = 'jankx-scs';
    const LAYOUT_SIDEBAR_SIDEBAR_CONTENT = 'jankx-ssc';

    // Mobile breakpoints
    const MOBILE_BREAKPOINT = 768;
    const TABLET_BREAKPOINT = 1024;

    // Default settings
    const DEFAULT_POST_TYPES = ['post', 'page'];
    const DEFAULT_LAYOUT = 'jankx-cs';
    const DEFAULT_SIDEBAR = 'primary';

    // Asset settings
    const ASSET_VERSION = '1.0.1';
    const ENABLE_LIVERELOAD = false;

    // Cache settings
    const CACHE_ENABLED = true;
    const CACHE_DURATION = 3600; // 1 hour

    /**
     * Get framework configuration
     *
     * @return array
     */
    public static function get_framework_config()
    {
        return [
            'version' => self::FRAMEWORK_VERSION,
            'min_php_version' => self::MIN_PHP_VERSION,
            'min_wp_version' => self::MIN_WP_VERSION,
            'mobile_breakpoint' => self::MOBILE_BREAKPOINT,
            'tablet_breakpoint' => self::TABLET_BREAKPOINT,
            'default_post_types' => self::DEFAULT_POST_TYPES,
            'default_layout' => self::DEFAULT_LAYOUT,
            'default_sidebar' => self::DEFAULT_SIDEBAR,
            'asset_version' => self::ASSET_VERSION,
            'enable_livereload' => self::ENABLE_LIVERELOAD,
            'cache_enabled' => self::CACHE_ENABLED,
            'cache_duration' => self::CACHE_DURATION,
        ];
    }

    /**
     * Get security configuration
     *
     * @return array
     */
    public static function get_security_config()
    {
        return [
            'nonce_actions' => [
                'save_options' => self::NONCE_ACTION_SAVE_OPTIONS,
                'save_menu_item' => self::NONCE_ACTION_SAVE_MENU_ITEM,
                'save_post_layout' => self::NONCE_ACTION_SAVE_POST_LAYOUT,
            ],
            'allowed_file_types' => ['jpg', 'jpeg', 'png', 'gif', 'svg'],
            'max_file_size' => 5 * 1024 * 1024, // 5MB
        ];
    }

    /**
     * Get layout configuration
     *
     * @return array
     */
    public static function get_layout_config()
    {
        return [
            'layouts' => [
                self::LAYOUT_FULL_WIDTH => __('Full Width', 'jankx'),
                self::LAYOUT_CONTENT_SIDEBAR => __('Content Sidebar', 'jankx'),
                self::LAYOUT_SIDEBAR_CONTENT => __('Sidebar Content', 'jankx'),
                self::LAYOUT_CONTENT_SIDEBAR_SIDEBAR => __('Content Sidebar Sidebar', 'jankx'),
                self::LAYOUT_SIDEBAR_CONTENT_SIDEBAR => __('Sidebar Content Sidebar', 'jankx'),
                self::LAYOUT_SIDEBAR_SIDEBAR_CONTENT => __('Sidebar Sidebar Content', 'jankx'),
            ],
            'default_layout' => self::DEFAULT_LAYOUT,
            'mobile_breakpoint' => self::MOBILE_BREAKPOINT,
        ];
    }

    /**
     * Check if current environment meets requirements
     *
     * @return bool
     */
    public static function check_requirements()
    {
        // Check PHP version
        if (version_compare(PHP_VERSION, self::MIN_PHP_VERSION, '<')) {
            return false;
        }

        // Check WordPress version
        global $wp_version;
        if (version_compare($wp_version, self::MIN_WP_VERSION, '<')) {
            return false;
        }

        return true;
    }

    /**
     * Get error message for requirements
     *
     * @return string
     */
    public static function get_requirements_error()
    {
        $errors = [];

        if (version_compare(PHP_VERSION, self::MIN_PHP_VERSION, '<')) {
            $errors[] = sprintf(
                __('PHP version %s or higher is required. Current version: %s', 'jankx'),
                self::MIN_PHP_VERSION,
                PHP_VERSION
            );
        }

        global $wp_version;
        if (version_compare($wp_version, self::MIN_WP_VERSION, '<')) {
            $errors[] = sprintf(
                __('WordPress version %s or higher is required. Current version: %s', 'jankx'),
                self::MIN_WP_VERSION,
                $wp_version
            );
        }

        return implode('<br>', $errors);
    }
}

// Helper functions for backward compatibility
if (!function_exists('jankx_get_config')) {
    function jankx_get_config($key = null)
    {
        if ($key === null) {
            return Jankx_Config::get_framework_config();
        }

        $config = Jankx_Config::get_framework_config();
        return isset($config[$key]) ? $config[$key] : null;
    }
}

if (!function_exists('jankx_get_security_config')) {
    function jankx_get_security_config($key = null)
    {
        if ($key === null) {
            return Jankx_Config::get_security_config();
        }

        $config = Jankx_Config::get_security_config();
        return isset($config[$key]) ? $config[$key] : null;
    }
}