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

// Define WP_Error class first
if (!class_exists('WP_Error')) {
    class WP_Error {
        private $code;
        private $message;
        private $data;

        public function __construct($code = '', $message = '', $data = '') {
            $this->code = $code;
            $this->message = $message;
            $this->data = $data;
        }

        public function get_error_message($code = '') {
            return $this->message;
        }

        public function get_error_data($code = '') {
            return $this->data;
        }
    }
}

// Load WordPress test framework if available
if (file_exists(__DIR__ . '/../vendor/wordpress/wordpress-tests-lib/includes/bootstrap.php')) {
    require_once __DIR__ . '/../vendor/wordpress/wordpress-tests-lib/includes/bootstrap.php';
}

// Set up test environment
define('WP_ENV', 'testing');
define('APP_ENV', 'testing');

// Mock WP_CLI classes
if (!class_exists('WP_CLI_Command')) {
    class WP_CLI_Command {
        public function __construct() {
            // Mock constructor
        }
    }
}

if (!class_exists('WP_CLI')) {
    class WP_CLI {
        public static function add_command($name, $callable) {
            // Mock implementation
        }
    }
}

// Mock WordPress functions
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

// Mock WordPress user functions
if (!function_exists('get_user_by')) {
    function get_user_by($field, $value) {
        return (object) [
            'ID' => 1,
            'user_login' => 'testuser',
            'user_email' => 'test@example.com',
            'display_name' => 'Test User',
            'user_nicename' => 'testuser',
            'user_url' => '',
            'user_registered' => '2023-01-01 00:00:00',
            'user_activation_key' => '',
            'user_status' => 0,
            'user_pass' => 'hashed_password'
        ];
    }
}

if (!function_exists('get_users')) {
    function get_users($args = array()) {
        return [
            (object) [
                'ID' => 1,
                'user_login' => 'user1',
                'user_email' => 'user1@example.com',
                'display_name' => 'User 1'
            ],
            (object) [
                'ID' => 2,
                'user_login' => 'user2',
                'user_email' => 'user2@example.com',
                'display_name' => 'User 2'
            ]
        ];
    }
}

if (!function_exists('wp_get_current_user')) {
    function wp_get_current_user() {
        return (object) [
            'ID' => 1,
            'user_login' => 'currentuser',
            'user_email' => 'current@example.com',
            'display_name' => 'Current User'
        ];
    }
}

// Mock WordPress cache functions
if (!function_exists('wp_cache_flush_group')) {
    function wp_cache_flush_group($group) {
        return true;
    }
}

if (!function_exists('wp_cache_get')) {
    function wp_cache_get($key, $group = 'default') {
        return false;
    }
}

if (!function_exists('wp_cache_set')) {
    function wp_cache_set($key, $data, $group = 'default', $expire = 0) {
        return true;
    }
}

if (!function_exists('wp_cache_delete')) {
    function wp_cache_delete($key, $group = 'default') {
        return true;
    }
}

// Mock WordPress post functions
if (!function_exists('get_posts')) {
    function get_posts($args = array()) {
        return [
            (object) [
                'ID' => 1,
                'post_title' => 'Test Post 1',
                'post_content' => '<!-- wp:paragraph --><p>Test content</p><!-- /wp:paragraph -->',
                'post_status' => 'publish',
                'post_type' => 'post'
            ],
            (object) [
                'ID' => 2,
                'post_title' => 'Test Post 2',
                'post_content' => '<!-- wp:heading --><h2>Test heading</h2><!-- /wp:heading -->',
                'post_status' => 'publish',
                'post_type' => 'post'
            ]
        ];
    }
}

if (!function_exists('get_post_meta')) {
    function get_post_meta($post_id, $key = '', $single = false) {
        return [
            'total_blocks' => 2,
            'block_types' => ['core/paragraph', 'core/heading'],
            'nested_blocks' => 0
        ];
    }
}

// Mock WordPress block functions
if (!function_exists('has_blocks')) {
    function has_blocks($content) {
        return strpos($content, '<!-- wp:') !== false;
    }
}

if (!function_exists('parse_blocks')) {
    function parse_blocks($content) {
        return [
            [
                'blockName' => 'core/paragraph',
                'attrs' => [],
                'innerBlocks' => [],
                'innerContent' => ['<p>Test content</p>']
            ]
        ];
    }
}

// Mock WordPress admin functions - only define if not already defined by tests
if (!function_exists('is_admin')) {
    function is_admin() {
        return false;
    }
}

// Mock WordPress option functions
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

// Mock WordPress transient functions
if (!function_exists('get_transient')) {
    function get_transient($transient) {
        return false;
    }
}

if (!function_exists('set_transient')) {
    function set_transient($transient, $value, $expiration = 0) {
        return true;
    }
}

if (!function_exists('delete_transient')) {
    function delete_transient($transient) {
        return true;
    }
}

// Mock WordPress capability functions
if (!function_exists('current_user_can')) {
    function current_user_can($capability, ...$args) {
        return true;
    }
}

// Mock WordPress sanitization functions
if (!function_exists('sanitize_text_field')) {
    function sanitize_text_field($str) {
        return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('sanitize_email')) {
    function sanitize_email($email) {
        return filter_var($email, FILTER_SANITIZE_EMAIL);
    }
}

// Mock WordPress URL functions
if (!function_exists('home_url')) {
    function home_url($path = '', $scheme = null) {
        return 'http://localhost';
    }
}

if (!function_exists('site_url')) {
    function site_url($path = '', $scheme = null) {
        return 'http://localhost';
    }
}

// Mock WordPress debug functions
if (!function_exists('wp_debug_backtrace_summary')) {
    function wp_debug_backtrace_summary($ignore_class = null, $skip_frames = 0, $pretty = false) {
        return 'Mock backtrace';
    }
}

// Mock WordPress logging functions
if (!function_exists('error_log')) {
    function error_log($message, $message_type = 0, $destination = null, $extra_headers = null) {
        // Mock implementation - do nothing in tests
    }
}

// Mock WordPress memory functions
if (!function_exists('memory_get_usage')) {
    function memory_get_usage($real_usage = false) {
        return 1024 * 1024; // 1MB
    }
}

if (!function_exists('memory_get_peak_usage')) {
    function memory_get_peak_usage($real_usage = false) {
        return 2 * 1024 * 1024; // 2MB
    }
}

if (!function_exists('ini_get')) {
    function ini_get($varname) {
        switch ($varname) {
            case 'memory_limit':
                return '256M';
            case 'max_execution_time':
                return '30';
            default:
                return '';
        }
    }
}

// Mock WordPress time functions
if (!function_exists('microtime')) {
    function microtime($as_float = false) {
        return $as_float ? 1234567890.123 : '1234567890 123456';
    }
}

// Mock WordPress CLI functions
if (!function_exists('WP_CLI')) {
    function WP_CLI() {
        return false;
    }
}

if (!function_exists('WP_CLI\Utils\get_flag_value')) {
    if (!class_exists('WP_CLI\Utils')) {
        class WP_CLI_Utils {
            public static function get_flag_value($assoc_args, $flag, $default = null) {
                return $default;
            }
        }
        class_alias('WP_CLI_Utils', 'WP_CLI\Utils');
    }
    function get_flag_value($assoc_args, $flag, $default = null) {
        return $default;
    }
}

// Mock WordPress cron functions
if (!function_exists('wp_schedule_event')) {
    function wp_schedule_event($timestamp, $recurrence, $hook, $args = array()) {
        return true;
    }
}

if (!function_exists('wp_clear_scheduled_hook')) {
    function wp_clear_scheduled_hook($hook, $args = array()) {
        return true;
    }
}

// Mock WordPress theme functions
if (!function_exists('wp_is_block_theme')) {
    function wp_is_block_theme() {
        return false;
    }
}

if (!function_exists('get_block_template_parts')) {
    function get_block_template_parts() {
        return [];
    }
}

if (!function_exists('is_active_sidebar')) {
    function is_active_sidebar($index) {
        return false;
    }
}

// Mock WordPress cache functions
if (!function_exists('wp_using_ext_object_cache')) {
    function wp_using_ext_object_cache() {
        return false;
    }
}

if (!function_exists('wp_cache_get_stats')) {
    function wp_cache_get_stats() {
        return [];
    }
}

// Mock WordPress plugin functions
if (!function_exists('is_plugin_active')) {
    function is_plugin_active($plugin) {
        return false;
    }
}

if (!function_exists('parse_blocks')) {
    function parse_blocks($content) {
        return [];
    }
}

if (!function_exists('has_blocks')) {
    function has_blocks($content) {
        return false;
    }
}

// Mock WordPress content functions
if (!function_exists('get_the_content')) {
    function get_the_content($more_link_text = null, $strip_teaser = false) {
        return '';
    }
}

if (!function_exists('get_the_excerpt')) {
    function get_the_excerpt($post = null) {
        return '';
    }
}

if (!function_exists('get_current_screen')) {
    function get_current_screen() {
        return null;
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

// Set up error reporting for tests
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Make WordPress functions available globally
if (!function_exists('wp_cache_get')) {
    function wp_cache_get($key, $group = 'default') {
        return false;
    }
}

if (!function_exists('wp_cache_set')) {
    function wp_cache_set($key, $data, $group = 'default', $expire = 0) {
        return true;
    }
}

if (!function_exists('wp_cache_delete')) {
    function wp_cache_delete($key, $group = 'default') {
        return true;
    }
}

if (!function_exists('wp_cache_flush_group')) {
    function wp_cache_flush_group($group) {
        return true;
    }
}

if (!function_exists('wp_using_ext_object_cache')) {
    function wp_using_ext_object_cache() {
        return false;
    }
}

if (!function_exists('wp_cache_get_stats')) {
    function wp_cache_get_stats() {
        return [];
    }
}

if (!function_exists('is_plugin_active')) {
    function is_plugin_active($plugin) {
        return false;
    }
}

if (!function_exists('parse_blocks')) {
    function parse_blocks($content) {
        return [];
    }
}

if (!function_exists('has_blocks')) {
    function has_blocks($content) {
        return false;
    }
}

if (!function_exists('get_the_content')) {
    function get_the_content($more_link_text = null, $strip_teaser = false) {
        return '';
    }
}

if (!function_exists('get_the_excerpt')) {
    function get_the_excerpt($post = null) {
        return '';
    }
}

if (!function_exists('is_admin')) {
    function is_admin() {
        return false;
    }
}

if (!function_exists('get_option')) {
    function get_option($option, $default = false) {
        return $default;
    }
}

if (!function_exists('get_user_by')) {
    function get_user_by($field, $value) {
        return (object) [
            'ID' => 1,
            'user_login' => 'testuser',
            'user_email' => 'test@example.com',
            'display_name' => 'Test User'
        ];
    }
}

if (!function_exists('get_users')) {
    function get_users($args = []) {
        return [];
    }
}

if (!function_exists('wp_get_current_user')) {
    function wp_get_current_user() {
        $user = new stdClass();
        $user->ID = 1;
        $user->exists = function() { return true; };
        return $user;
    }
}

if (!function_exists('apply_filters')) {
    function apply_filters($tag, $value, ...$args) {
        return $value;
    }
}

if (!function_exists('do_action')) {
    function do_action($tag, ...$args) {
        return;
    }
}

if (!function_exists('get_transient')) {
    function get_transient($key) {
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

if (!function_exists('get_block_template_parts')) {
    function get_block_template_parts() {
        return [];
    }
}

// Ensure functions are available in global scope
global $wp_cache_get, $wp_cache_set, $wp_cache_delete, $wp_cache_flush_group;
global $wp_using_ext_object_cache, $wp_cache_get_stats, $is_plugin_active;
global $parse_blocks, $has_blocks, $get_the_content, $get_the_excerpt;
global $is_admin, $get_option;