<?php
/**
 * Mock WordPress functions for CLI scripts
 */

if (!defined('ABSPATH')) {
    define('ABSPATH', dirname(__DIR__) . '/');
}

// Function Mocks
if (!function_exists('add_action')) { function add_action($tag, $callback, $priority = 10, $accepted_args = 1) { return true; } }
if (!function_exists('add_filter')) { function add_filter($tag, $callback, $priority = 10, $accepted_args = 1) { return true; } }
if (!function_exists('do_action')) { function do_action($tag, ...$args) { return true; } }
if (!function_exists('did_action')) { function did_action($tag) { return 0; } }
if (!function_exists('apply_filters')) { function apply_filters($tag, $value, ...$args) { return $value; } }
if (!function_exists('remove_filter')) { function remove_filter($hook, $callback, $priority = 10) { return true; } }
if (!function_exists('remove_action')) { function remove_action($hook, $callback, $priority = 10) { return true; } }
if (!function_exists('has_filter')) { function has_filter($hook, $callback = false) { return false; } }

if (!function_exists('__')) { function __($text, $domain = 'default') { return $text; } }
if (!function_exists('_e')) { function _e($text, $domain = 'default') { echo $text; } }
if (!function_exists('_x')) { function _x($text, $context, $domain = 'default') { return $text; } }
if (!function_exists('esc_html')) { function esc_html($text) { return htmlspecialchars((string)$text); } }
if (!function_exists('esc_attr')) { function esc_attr($text) { return htmlspecialchars((string)$text, ENT_QUOTES); } }
if (!function_exists('esc_url')) { function esc_url($text) { return $text; } }
if (!function_exists('esc_url_raw')) { function esc_url_raw($text) { return $text; } }
if (!function_exists('esc_html__')) { function esc_html__($text, $domain = 'default') { return $text; } }
if (!function_exists('esc_html_e')) { function esc_html_e($text, $domain = 'default') { echo $text; } }
if (!function_exists('esc_attr__')) { function esc_attr__($text, $domain = 'default') { return $text; } }
if (!function_exists('esc_attr_e')) { function esc_attr_e($text, $domain = 'default') { echo $text; } }

if (!function_exists('get_template_directory')) { function get_template_directory() { return rtrim(ABSPATH, '/'); } }
if (!function_exists('get_stylesheet_directory')) { function get_stylesheet_directory() { return get_template_directory(); } }
if (!function_exists('get_template_directory_uri')) { function get_template_directory_uri() { return ''; } }
if (!function_exists('get_stylesheet_directory_uri')) { function get_stylesheet_directory_uri() { return ''; } }

if (!function_exists('is_admin')) { function is_admin() { return false; } }
if (!function_exists('is_singular')) { function is_singular() { return false; } }
if (!function_exists('is_child_theme')) { function is_child_theme() { return false; } }
if (!function_exists('wp_doing_ajax')) { function wp_doing_ajax() { return false; } }
if (!function_exists('wp_doing_cron')) { function wp_doing_cron() { return false; } }

if (!function_exists('get_option')) { function get_option($option, $default = false) { return $default; } }
if (!function_exists('update_option')) { function update_option($option, $value, $autoload = null) { return true; } }
if (!function_exists('get_the_ID')) { function get_the_ID() { return 1; } }
if (!function_exists('get_post_type')) { function get_post_type($post = null) { return 'post'; } }
if (!function_exists('post_type_exists')) { function post_type_exists($post_type) { return true; } }
if (!function_exists('get_post_meta')) { function get_post_meta($post_id, $key = '', $single = false) { return $single ? '' : array(); } }

if (!function_exists('wp_parse_args')) { 
    function wp_parse_args($args, $defaults = array()) {
        if (is_object($args)) { $args = (array)$args; }
        if (is_object($defaults)) { $defaults = (array)$defaults; }
        if (is_array($args)) { return array_merge($defaults, $args); }
        return $defaults;
    }
}
if (!function_exists('absint')) { function absint($maybeint) { return abs(intval($maybeint)); } }
if (!function_exists('sanitize_key')) { function sanitize_key($key) { return preg_replace('/[^a-z0-9_-]/', '', strtolower((string)$key)); } }
if (!function_exists('sanitize_text_field')) { function sanitize_text_field($str) { return trim((string)$str); } }
if (!function_exists('sanitize_html_class')) { function sanitize_html_class($class, $fallback = '') { return preg_replace('/[^A-Za-z0-9_-]/', '', (string)$class); } }
if (!function_exists('trailingslashit')) { function trailingslashit($string) { return rtrim($string, '/\\') . '/'; } }

if (!function_exists('wp_json_encode')) { function wp_json_encode($data) { return json_encode($data); } }
if (!function_exists('wp_kses_post')) { function wp_kses_post($data) { return $data; } }
if (!function_exists('number_format_i18n')) { function number_format_i18n($number) { return $number; } }

if (!function_exists('home_url')) { function home_url($path = '') { return '/' . ltrim($path, '/'); } }
if (!function_exists('admin_url')) { function admin_url($path = '') { return '/wp-admin/' . ltrim($path, '/'); } }
if (!function_exists('plugins_url')) { function plugins_url($path = '') { return '/wp-content/plugins/' . ltrim($path, '/'); } }
if (!function_exists('content_url')) { function content_url($path = '') { return '/wp-content/' . ltrim($path, '/'); } }

if (!function_exists('add_query_arg')) {
    function add_query_arg(...$args) {
        if (is_array($args[0])) {
            $params = $args[0];
            $url = $args[1] ?? '';
        } else {
            $params = [$args[0] => $args[1]];
            $url = $args[2] ?? '';
        }
        return $url . (strpos($url, '?') === false ? '?' : '&') . http_build_query($params);
    }
}

if (!function_exists('wp_get_referer')) { function wp_get_referer() { return $_SERVER['HTTP_REFERER'] ?? false; } }
if (!function_exists('wp_safe_redirect')) { function wp_safe_redirect($location, $status = 302) { return true; } }
if (!function_exists('wp_verify_nonce')) { function wp_verify_nonce($nonce, $action = -1) { return $GLOBALS['mock_wp_verify_nonce'] ?? true; } }
if (!function_exists('current_user_can')) { function current_user_can($capability) { return $GLOBALS['mock_current_user_can'] ?? true; } }
if (!function_exists('wp_nonce_field')) { function wp_nonce_field($action = -1, $name = "_wpnonce", $referer = true, $echo = true) { return ''; } }

if (!function_exists('get_queried_object')) { function get_queried_object() { return null; } }
if (!function_exists('get_query_var')) { function get_query_var($var, $default = '') { return $default; } }

if (!function_exists('register_block_type')) { function register_block_type($name, $args = array()) { return true; } }
if (!function_exists('register_block_type_from_metadata')) { function register_block_type_from_metadata($path, $args = array()) { return true; } }
if (!function_exists('get_block_wrapper_attributes')) { 
    function get_block_wrapper_attributes($extra = []) { 
        $attr = '';
        foreach((array)$extra as $k => $v) $attr .= sprintf(' %s="%s"', $k, esc_attr($v));
        return $attr; 
    } 
}

// User Mocks
if (!function_exists('get_userdata')) {
    function get_userdata($user_id) {
        $user = new \stdClass();
        $user->ID = $user_id;
        $user->display_name = 'Admin';
        $user->description = 'Admin User';
        return $user;
    }
}
if (!function_exists('get_avatar')) { function get_avatar($id, $size = 96) { return '<img src="" />'; } }

// Constants
if (!defined('WP_CLI')) { define('WP_CLI', true); }
if (!function_exists('get_post')) {
    function get_post($post = null) {
        if (is_numeric($post)) {
            $p = new \stdClass();
            $p->ID = (int)$post;
            $p->post_title = 'Mock Post ' . $post;
            $p->post_content = 'Mock post content';
            $p->post_type = 'post';
            return $p;
        }
        return $post;
    }
}
if (!function_exists('get_post_type_object')) {
    function get_post_type_object($post_type) {
        $obj = new \stdClass();
        $obj->labels = (object)['singular_name' => ucfirst((string)$post_type), 'name' => ucfirst((string)$post_type) . 's'];
        $obj->name = $post_type;
        return $obj;
    }
}
if (!function_exists('get_comments_number')) { function get_comments_number($post_id = 0) { return 0; } }
if (!function_exists('wp_enqueue_script')) { function wp_enqueue_script($handle, $src = '', $deps = array(), $ver = false, $in_footer = false) { return true; } }
if (!function_exists('wp_register_script')) { function wp_register_script($handle, $src, $deps = array(), $ver = false, $in_footer = false) { return true; } }
if (!function_exists('wp_enqueue_style')) { function wp_enqueue_style($handle, $src = '', $deps = array(), $ver = false, $media = 'all') { return true; } }
if (!function_exists('wp_register_style')) { function wp_register_style($handle, $src, $deps = array(), $ver = false, $media = 'all') { return true; } }
if (!function_exists('wp_localize_script')) { function wp_localize_script($handle, $object_name, $l10n) { return true; } }
if (!function_exists('get_the_title')) { function get_the_title($post = 0) { return 'Mock Title'; } }
if (!function_exists('get_permalink')) { function get_permalink($post = 0) { return 'http://example.com/mock-permalink'; } }
if (!function_exists('wp_get_attachment_image_url')) { function wp_get_attachment_image_url($id, $size = 'thumbnail') { return ''; } }

if (!defined('REST_REQUEST')) { define('REST_REQUEST', false); }

// Classes
if (!class_exists('WP_Block')) {
    class WP_Block {
        public $attributes;
        public $inner_blocks = [];
        public function __construct($attributes = [], $inner_blocks = []) {
            $this->attributes = (array)$attributes;
            $this->inner_blocks = (array)$inner_blocks;
        }
        public function render() { return ''; }
    }
}

if (!class_exists('WP_Query')) {
    class WP_Query {
        public $posts = array();
        public $post_count = 0;
        public $found_posts = 0;
        public $max_num_pages = 0;
        public $query_vars = array();
        public function __construct($args = array()) { $this->query_vars = $args; }
        public function have_posts() { return false; }
        public function the_post() {}
        public function reset_postdata() {}
    }
}

if (!class_exists('WP_Term_Query')) {
    class WP_Term_Query {
        public $terms = array();
        public function __construct($args = array()) {}
        public function get_terms() { return array(); }
    }
}

if (!class_exists('WP_Block_Type_Registry')) {
    class WP_Block_Type_Registry {
        private static $instance = null;
        private $registered_block_types = array();
        public static function get_instance() {
            if (self::$instance === null) { self::$instance = new self(); }
            return self::$instance;
        }
        public function get_registered($name) { return null; }
        public function is_registered($name) { return false; }
    }
}
