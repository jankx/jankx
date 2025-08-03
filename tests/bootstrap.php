<?php

// Mock WP CLI classes for testing
if (!class_exists('WP_CLI_Command')) {
    class WP_CLI_Command
    {
        public function __construct()
        {
        }
    }
}

if (!class_exists('WP_CLI')) {
    class WP_CLI
    {
        public static function log($message)
        {
        }
        public static function success($message)
        {
        }
        public static function error($message)
        {
        }
        public static function warning($message)
        {
        }
    }
}

// Mock WordPress functions
if (!function_exists('wp_get_theme')) {
    function wp_get_theme($stylesheet = null)
    {
        return new class {
            public function get_stylesheet()
            {
                return 'child-theme';
            }
            public function get_template()
            {
                return 'parent-theme';
            }
            public function get($key)
            {
                return $key === 'Name' ? 'Child Theme' : 'child-theme';
            }
        };
    }
}

if (!function_exists('get_template_directory')) {
    function get_template_directory()
    {
        return '/path/to/parent-theme';
    }
}

if (!function_exists('get_stylesheet_directory')) {
    function get_stylesheet_directory()
    {
        return '/path/to/child-theme';
    }
}

if (!function_exists('wp_cache_flush_group')) {
    function wp_cache_flush_group($group)
    {
        return true;
    }
}

// Mock Environment and Log static methods
if (!class_exists('Jankx\Helper\Environment')) {
    class_alias('stdClass', 'Jankx\Helper\Environment');
}

if (!class_exists('Jankx\Facades\Log')) {
    class_alias('stdClass', 'Jankx\Facades\Log');
}
