<?php

/**
 * Bootstrap file for PHPUnit tests with Brain Monkey support
 */

// Load Composer autoloader
require_once __DIR__ . '/../vendor/autoload.php';

// Define ABSPATH if not defined
if (!defined('ABSPATH')) {
    define('ABSPATH', __DIR__ . '/../');
}

// Set up test environment
define('WP_ENV', 'testing');
define('APP_ENV', 'testing');

// Set up error reporting for tests
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Load Brain Monkey
Brain\Monkey\setUp();