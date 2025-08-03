<?php

/**
 * Bootstrap file for PHPUnit tests
 */

// Load Composer autoloader
require_once __DIR__ . '/../vendor/autoload.php';

// Set up test environment
define('IS_TESTING', true);
define('JANKX_CONFIG_PATH', __DIR__ . '/config');
define('JANKX_CHILD_CONFIG_PATH', __DIR__ . '/config/child');

// Mock WordPress functions for testing
if (!function_exists('wp_die')) {
    function wp_die($message = '', $title = '', $args = array())
    {
        throw new Exception($message);
    }
}

if (!function_exists('add_action')) {
    function add_action($hook, $callback, $priority = 10, $accepted_args = 1)
    {
        // Mock implementation
    }
}

if (!function_exists('add_filter')) {
    function add_filter($hook, $callback, $priority = 10, $accepted_args = 1)
    {
        // Mock implementation
    }
}

if (!function_exists('apply_filters')) {
    function apply_filters($hook, $value, ...$args)
    {
        return $value;
    }
}

if (!function_exists('do_action')) {
    function do_action($hook, ...$args)
    {
        // Mock implementation
    }
}

if (!function_exists('get_user_by')) {
    function get_user_by($field, $value)
    {
        // Mock user object
        return (object) [
            'ID' => 1,
            'user_login' => 'admin',
            'user_email' => 'admin@example.com',
            'display_name' => 'Administrator',
            'roles' => ['administrator'],
            'user_registered' => '2024-01-01 00:00:00',
            'user_status' => 0
        ];
    }
}

if (!function_exists('is_admin')) {
    function is_admin()
    {
        return false;
    }
}

if (!function_exists('is_user_logged_in')) {
    function is_user_logged_in()
    {
        return false;
    }
}

if (!function_exists('has_nav_menu')) {
    function has_nav_menu($location)
    {
        return false;
    }
}

if (!function_exists('function_exists')) {
    function function_exists($function_name)
    {
        return \function_exists($function_name);
    }
}

if (!function_exists('class_exists')) {
    function class_exists($class_name, $autoload = true)
    {
        return \class_exists($class_name, $autoload);
    }
}

if (!function_exists('method_exists')) {
    function method_exists($object, $method_name)
    {
        return \method_exists($object, $method_name);
    }
}

if (!function_exists('error_log')) {
    function error_log($message)
    {
        // Mock implementation for testing
        echo "[ERROR_LOG] $message\n";
    }
}

if (!function_exists('microtime')) {
    function microtime($as_float = false)
    {
        return \microtime($as_float);
    }
}

if (!function_exists('memory_get_usage')) {
    function memory_get_usage($real_usage = false)
    {
        return \memory_get_usage($real_usage);
    }
}

// Set up error reporting for tests
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Create test directories if they don't exist
$testDirs = [
    __DIR__ . '/reports',
    __DIR__ . '/reports/coverage',
    __DIR__ . '/config',
    __DIR__ . '/config/child'
];

foreach ($testDirs as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}
