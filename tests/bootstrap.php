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

if (!function_exists('wp_get_theme')) {
    function wp_get_theme($stylesheet = null) {
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

if (!function_exists('get_template_directory_uri')) {
    function get_template_directory_uri() {
        return 'http://localhost/wp-content/themes/test-theme';
    }
}

if (!function_exists('get_stylesheet_directory_uri')) {
    function get_stylesheet_directory_uri() {
        return 'http://localhost/wp-content/themes/test-theme';
    }
}

if (!function_exists('wp_enqueue_style')) {
    function wp_enqueue_style($handle, $src = false, $deps = array(), $ver = false, $media = 'all') {
        // Mock implementation
    }
}

if (!function_exists('wp_register_style')) {
    function wp_register_style($handle, $src, $deps = array(), $ver = false, $media = 'all') {
        // Mock implementation
    }
}

if (!function_exists('AUTH_KEY')) {
    if (!defined('AUTH_KEY')) {
        define('AUTH_KEY', 'test-key');
    }
}

// Mock WordPress functions
if (!function_exists('wp_cache_get')) {
    function wp_cache_get($key, $group = 'default') {
        return false;
    }
}

if (!function_exists('wp_cache_set')) {
    function wp_cache_set($key, $value, $group = 'default', $ttl = 0) {
        return true;
    }
}

if (!function_exists('wp_cache_flush_group')) {
    function wp_cache_flush_group($group) {
        return true;
    }
}

if (!function_exists('crc32')) {
    function crc32($string) {
        return hash('crc32', $string);
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

if (!function_exists('esc_url')) {
    function esc_url($url) {
        return filter_var($url, FILTER_SANITIZE_URL);
    }
}

if (!function_exists('get_template_directory')) {
    function get_template_directory() {
        return '/path/to/template';
    }
}

if (!function_exists('register_block_type')) {
    function register_block_type($block_name, $args = array()) {
        return true;
    }
}

if (!function_exists('register_rest_route')) {
    function register_rest_route($namespace, $route, $args = array()) {
        return true;
    }
}

if (!function_exists('rest_ensure_response')) {
    function rest_ensure_response($data) {
        return new WP_REST_Response($data);
    }
}

if (!class_exists('WP_REST_Response')) {
    class WP_REST_Response {
        private $data;

        public function __construct($data) {
            $this->data = $data;
        }

        public function get_data() {
            return $this->data;
        }
    }
}

if (!class_exists('WP_REST_Request')) {
    class WP_REST_Request {
        private $params = [];

        public function get_param($key) {
            return $this->params[$key] ?? null;
        }

        public function set_param($key, $value) {
            $this->params[$key] = $value;
        }
    }
}

if (!class_exists('WP_Widget')) {
    class WP_Widget {
        public $id_base;
        public $name;
        public $widget_options;

        public function __construct() {
            $this->id_base = 'widget';
            $this->name = 'Widget';
            $this->widget_options = ['description' => 'A widget'];
        }

        public function widget($args, $instance) {
            // Mock widget rendering
        }
    }
}

// Mock widget classes
if (!class_exists('WP_Widget_Text')) {
    class WP_Widget_Text extends WP_Widget {
        public function __construct() {
            parent::__construct();
            $this->id_base = 'text';
            $this->name = 'Text';
            $this->widget_options = ['description' => 'Arbitrary text or HTML.'];
        }
    }
}

if (!class_exists('WP_Widget_Search')) {
    class WP_Widget_Search extends WP_Widget {
        public function __construct() {
            parent::__construct();
            $this->id_base = 'search';
            $this->name = 'Search';
            $this->widget_options = ['description' => 'A search form for your site.'];
        }
    }
}

if (!class_exists('WP_Widget_Recent_Posts')) {
    class WP_Widget_Recent_Posts extends WP_Widget {
        public function __construct() {
            parent::__construct();
            $this->id_base = 'recent-posts';
            $this->name = 'Recent Posts';
            $this->widget_options = ['description' => 'Your site&#8217;s most recent Posts.'];
        }
    }
}

// Mock global variables
global $wp_widget_factory;
$wp_widget_factory = new stdClass();
$wp_widget_factory->widgets = [
    'text' => 'WP_Widget_Text',
    'search' => 'WP_Widget_Search',
    'recent-posts' => 'WP_Widget_Recent_Posts'
];

// Set up test environment
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('JANKX_ABSPATH', __DIR__ . '/../');