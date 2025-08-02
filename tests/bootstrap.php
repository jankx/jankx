<?php

// Mock WordPress functions for testing
if (!function_exists('add_filter')) {
    function add_filter($hook, $callback, $priority = 10, $accepted_args = 1) {
        return true;
    }
}

if (!function_exists('add_action')) {
    function add_action($hook, $callback, $priority = 10, $accepted_args = 1) {
        return true;
    }
}

if (!function_exists('remove_all_actions')) {
    function remove_all_actions($hook) {
        return true;
    }
}

if (!function_exists('remove_action')) {
    function remove_action($hook, $callback) {
        return true;
    }
}

if (!function_exists('wp_enqueue_script')) {
    function wp_enqueue_script($handle, $src = '', $deps = array(), $ver = false, $in_footer = false) {
        return true;
    }
}

if (!function_exists('wp_enqueue_style')) {
    function wp_enqueue_style($handle, $src = '', $deps = array(), $ver = false, $media = 'all') {
        return true;
    }
}

if (!function_exists('register_nav_menus')) {
    function register_nav_menus($locations = array()) {
        return true;
    }
}

if (!function_exists('register_sidebar')) {
    function register_sidebar($args = array()) {
        return true;
    }
}

if (!function_exists('add_theme_support')) {
    function add_theme_support($feature, ...$args) {
        return true;
    }
}

if (!function_exists('get_option')) {
    function get_option($option, $default = false) {
        return $default;
    }
}

if (!function_exists('get_user_by')) {
    function get_user_by($field, $value) {
        return null;
    }
}

if (!function_exists('wp_get_current_user')) {
    function wp_get_current_user() {
        return null;
    }
}

if (!function_exists('wp_cache_get')) {
    function wp_cache_get($key, $group = '') {
        return false; // Default: no cache
    }
}

if (!function_exists('wp_cache_set')) {
    function wp_cache_set($key, $value, $group = '', $expire = 0) {
        return true;
    }
}

if (!function_exists('wp_cache_delete')) {
    function wp_cache_delete($key, $group = '') {
        return true;
    }
}

if (!function_exists('wp_cache_flush_group')) {
    function wp_cache_flush_group($group) {
        return true;
    }
}

if (!function_exists('crc32')) {
    function crc32($str) {
        return hash('crc32', $str);
    }
}

if (!function_exists('wp_cache_flush')) {
    function wp_cache_flush() {
        return true;
    }
}

if (!function_exists('wp_get_theme')) {
    function wp_get_theme($stylesheet = null, $theme_root = null) {
        return new class {
            public function get($key) {
                $data = [
                    'Name' => 'Test Theme',
                    'Version' => '1.0.0',
                    'TextDomain' => 'test-theme',
                    'Template' => 'test-theme',
                    'Stylesheet' => 'test-theme'
                ];
                return $data[$key] ?? '';
            }

            public function get_stylesheet() {
                return 'test-theme';
            }

            public function get_template() {
                return 'test-theme';
            }
        };
    }
}

if (!function_exists('get_template_directory_uri')) {
    function get_template_directory_uri() {
        return '/wp-content/themes/test';
    }
}

if (!function_exists('get_stylesheet_directory_uri')) {
    function get_stylesheet_directory_uri() {
        return '/wp-content/themes/test';
    }
}

if (!function_exists('is_admin')) {
    function is_admin() {
        return false;
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

if (!function_exists('get_current_screen')) {
    function get_current_screen() {
        return null;
    }
}

if (!function_exists('error_log')) {
    function error_log($message, $message_type = 0, $destination = null, $extra_headers = null) {
        // Do nothing in tests
    }
}

if (!function_exists('get_template')) {
    function get_template() {
        return 'test-theme';
    }
}

if (!function_exists('get_stylesheet')) {
    function get_stylesheet() {
        return 'test-theme';
    }
}

if (!function_exists('apply_filters')) {
    function apply_filters($hook, $value, ...$args) {
        return $value;
    }
}

if (!function_exists('do_action')) {
    function do_action($hook, ...$args) {
        // Do nothing in tests
    }
}

if (!function_exists('get_template_directory')) {
    function get_template_directory() {
        return __DIR__ . '/../config';
    }
}
if (!function_exists('get_stylesheet_directory')) {
    function get_stylesheet_directory() {
        return __DIR__ . '/../config';
    }
}