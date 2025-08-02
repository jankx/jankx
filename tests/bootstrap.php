<?php

// Load Composer autoloader
require_once __DIR__ . '/../vendor/autoload.php';

// Mock WordPress functions for testing
if (!function_exists('add_action')) {
    function add_action($hook, $callback, $priority = 10, $accepted_args = 1) {
        // Mock implementation
    }
}

if (!function_exists('add_filter')) {
    function add_filter($hook, $callback, $priority = 10, $accepted_args = 1) {
        // Mock implementation
    }
}

if (!function_exists('do_action')) {
    function do_action($hook, ...$args) {
        // Mock implementation
    }
}

if (!function_exists('apply_filters')) {
    function apply_filters($hook, $value, ...$args) {
        return $value;
    }
}

if (!function_exists('wp_parse_url')) {
    function wp_parse_url($url, $component = -1) {
        return parse_url($url, $component);
    }
}

if (!function_exists('wp_doing_ajax')) {
    function wp_doing_ajax() {
        return false;
    }
}

if (!function_exists('wp_doing_cron')) {
    function wp_doing_cron() {
        return false;
    }
}

if (!function_exists('is_admin')) {
    function is_admin() {
        return $GLOBALS['mock_is_admin'] ?? true;
    }
}

if (!function_exists('wp_get_environment_type')) {
    function wp_get_environment_type() {
        return 'production';
    }
}

if (!function_exists('get_option')) {
    function get_option($option, $default = false) {
        return $default;
    }
}

if (!function_exists('update_option')) {
    function update_option($option, $value, $autoload = null) {
        return true;
    }
}

if (!function_exists('delete_option')) {
    function delete_option($option) {
        return true;
    }
}

if (!function_exists('get_site_url')) {
    function get_site_url($blog_id = null, $path = '', $scheme = null) {
        return 'http://localhost';
    }
}

if (!function_exists('get_locale')) {
    function get_locale() {
        return 'en_US';
    }
}

if (!function_exists('AUTH_KEY')) {
    if (!defined('AUTH_KEY')) {
        define('AUTH_KEY', 'test-key');
    }
}

// Set up test environment
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('JANKX_ABSPATH', __DIR__ . '/../');