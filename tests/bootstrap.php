<?php

/**
 * Bootstrap file for PHPUnit tests
 */

// Load Composer autoloader
require_once __DIR__ . '/../vendor/autoload.php';

// Define ABSPATH if not defined
if (!defined('ABSPATH')) {
    define('ABSPATH', __DIR__ . '/../');
}

// Load WordPress test framework if available
if (file_exists(__DIR__ . '/../vendor/wordpress/wordpress-tests-lib/includes/bootstrap.php')) {
    require_once __DIR__ . '/../vendor/wordpress/wordpress-tests-lib/includes/bootstrap.php';
}

// Set up test environment
define('WP_ENV', 'testing');
define('APP_ENV', 'testing');

// Mock WordPress functions if not available
if (!function_exists('wp_die')) {
    function wp_die($message = '', $title = '', $args = array()) {
        throw new Exception($message);
    }
}

if (!function_exists('__')) {
    function __($text, $domain = 'default') {
        return $text;
    }
}

if (!function_exists('_e')) {
    function _e($text, $domain = 'default') {
        echo $text;
    }
}

if (!function_exists('esc_html')) {
    function esc_html($text) {
        return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('esc_attr')) {
    function esc_attr($text) {
        return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('wp_enqueue_script')) {
    function wp_enqueue_script($handle, $src = false, $deps = array(), $ver = false, $in_footer = false) {
        // Mock implementation
    }
}

if (!function_exists('wp_enqueue_style')) {
    function wp_enqueue_style($handle, $src = false, $deps = array(), $ver = false, $media = 'all') {
        // Mock implementation
    }
}

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

if (!function_exists('apply_filters')) {
    function apply_filters($hook, $value, ...$args) {
        return $value;
    }
}

if (!function_exists('do_action')) {
    function do_action($hook, ...$args) {
        // Mock implementation
    }
}

if (!function_exists('get_template_directory')) {
    function get_template_directory() {
        return __DIR__ . '/../';
    }
}

if (!function_exists('get_template_directory_uri')) {
    function get_template_directory_uri() {
        return 'http://localhost/wp-content/themes/bookix';
    }
}

if (!function_exists('wp_parse_url')) {
    function wp_parse_url($url, $component = -1) {
        return parse_url($url, $component);
    }
}

if (!function_exists('wp_remote_get')) {
    function wp_remote_get($url, $args = array()) {
        return array(
            'body' => '',
            'response' => array('code' => 200),
            'headers' => array()
        );
    }
}

if (!function_exists('wp_remote_post')) {
    function wp_remote_post($url, $args = array()) {
        return array(
            'body' => '',
            'response' => array('code' => 200),
            'headers' => array()
        );
    }
}

if (!function_exists('is_wp_error')) {
    function is_wp_error($thing) {
        return false;
    }
}

if (!function_exists('wp_error')) {
    function wp_error($code = '', $message = '', $data = '') {
        return new WP_Error($code, $message, $data);
    }
}

// Mock WP_Error class if not available
if (!class_exists('WP_Error')) {
    class WP_Error {
        public $errors = array();
        public $error_data = array();

        public function __construct($code = '', $message = '', $data = '') {
            if (!empty($code)) {
                $this->errors[$code][] = $message;
                if (!empty($data)) {
                    $this->error_data[$code] = $data;
                }
            }
        }

        public function get_error_message($code = '') {
            if (empty($code)) {
                $codes = array_keys($this->errors);
                $code = reset($codes);
            }
            return isset($this->errors[$code]) ? $this->errors[$code][0] : '';
        }

        public function get_error_data($code = '') {
            if (empty($code)) {
                $codes = array_keys($this->errors);
                $code = reset($codes);
            }
            return isset($this->error_data[$code]) ? $this->error_data[$code] : null;
        }
    }
}

// Set up error reporting for tests
error_reporting(E_ALL);
ini_set('display_errors', 1);