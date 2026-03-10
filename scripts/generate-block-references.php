<?php

/**
 * Script to generate block HTML output references
 */

// Define ABSPATH and other constants
if (!defined('ABSPATH')) {
    define('ABSPATH', dirname(__DIR__) . '/');
}

// Load Jankx core first to avoid issues with missing functions
function get_template_directory() {
    return dirname(__DIR__);
}

function get_stylesheet_directory() {
    return dirname(__DIR__);
}

if (!function_exists('is_singular')) {
    function is_singular($post_types = '') { return false; }
}
if (!function_exists('get_post')) {
    function get_post($post = null) { return null; }
}
if (!function_exists('get_the_ID')) {
    function get_the_ID() { return 0; }
}
if (!function_exists('get_the_title')) {
    function get_the_title($post = 0) { return ''; }
}
if (!function_exists('get_permalink')) {
    function get_permalink($post = 0) { return ''; }
}
if (!function_exists('get_post_type')) {
    function get_post_type($post = null) { return 'post'; }
}
if (!function_exists('wp_get_attachment_image_url')) {
    function wp_get_attachment_image_url($attachment_id, $size = 'thumbnail', $icon = false) { return ''; }
}
if (!function_exists('register_block_type_from_metadata')) {
    function register_block_type_from_metadata($file_or_folder, $args = array()) { return true; }
}
if (!function_exists('get_block_wrapper_attributes')) {
    function get_block_wrapper_attributes($extra_attributes = array()) { return ''; }
}
if (!function_exists('wp_kses_post')) {
    function wp_kses_post($data) { return $data; }
}
if (!function_exists('wp_json_encode')) {
    function wp_json_encode($data) { return json_encode($data); }
}
if (!function_exists('absint')) {
    function absint($maybeint) { return abs(intval($maybeint)); }
}
if (!function_exists('wp_parse_args')) {
    function wp_parse_args($args, $defaults = array()) {
        if (is_object($args)) { $args = (array)$args; }
        if (is_object($defaults)) { $defaults = (array)$defaults; }
        if (is_array($args)) { return array_merge($defaults, $args); }
        return $defaults;
    }
}
if (!function_exists('shortcode_exists')) {
    function shortcode_exists($tag) { return false; }
}
if (!function_exists('do_shortcode')) {
    function do_shortcode($content) { return $content; }
}
if (!function_exists('get_archives_link')) {
    function get_archives_link($url, $text, $format = 'html', $before = '', $after = '', $selected = false) { return $text; }
}
if (!function_exists('wp_strip_all_tags')) {
    function wp_strip_all_tags($string, $remove_breaks = false) {
        $string = preg_replace('@<(script|style)[^>]*?>.*?</\\1>@si', '', $string);
        $string = strip_tags($string);
        if ($remove_breaks) { $string = preg_replace('/[\r\n\t ]+/', ' ', $string); }
        return trim($string);
    }
}

if (!function_exists('get_the_author_meta')) {
    function get_the_author_meta($field = '', $user_id = false) { return 1; }
}
if (!function_exists('number_format_i18n')) {
    function number_format_i18n($number, $decimals = 0) { return number_format($number, $decimals); }
}
if (!function_exists('get_current_user_id')) {
    function get_current_user_id() { return 1; }
}
if (!function_exists('get_users')) {
    function get_users($args = array()) { return array(); }
}
if (!function_exists('get_userdata')) {
    function get_userdata($user_id) {
        $user = new \stdClass();
        $user->ID = $user_id;
        $user->display_name = 'Admin';
        $user->description = 'Author bio description';
        return $user;
    }
}
if (!function_exists('get_avatar')) {
    function get_avatar($id_or_email, $size = 96, $default = '', $alt = '', $args = null) {
        return '<img src="http://example.com/avatar.jpg" alt="' . $alt . '" />';
    }
}
if (!function_exists('get_author_posts_url')) {
    function get_author_posts_url($author_id) { return 'http://example.com/author/admin'; }
}
if (!function_exists('get_user_meta')) {
    function get_user_meta($user_id, $key = '', $single = false) { return ''; }
}
if (!function_exists('get_posts')) {
    function get_posts($args = array()) { return array(); }
}
if (!function_exists('sanitize_html_class')) {
    function sanitize_html_class($class, $fallback = '') { return preg_replace('/[^A-Za-z0-9_-]/', '', $class); }
}
if (!function_exists('esc_attr__')) {
    function esc_attr__($text, $domain = 'default') { return $text; }
}
if (!function_exists('esc_html__')) {
    function esc_html__($text, $domain = 'default') { return $text; }
}
if (!function_exists('get_queried_object')) {
    function get_queried_object() { return null; }
}

if (!function_exists('esc_url_raw')) {
    function esc_url_raw($url, $protocols = null) { return $url; }
}
if (!function_exists('sanitize_text_field')) {
    function sanitize_text_field($str) { return trim($str); }
}
if (!function_exists('trailingslashit')) {
    function trailingslashit($string) { return rtrim($string, '/\\') . '/'; }
}
if (!function_exists('get_query_var')) {
    function get_query_var($var, $default = '') { return $default; }
}
if (!function_exists('parse_blocks')) {
    function parse_blocks($content) { return array(); }
}
if (!function_exists('wp_create_nonce')) {
    function wp_create_nonce($action = -1) { return 'nonce'; }
}
if (!function_exists('is_admin')) {
    function is_admin() { return false; }
}
if (!function_exists('sanitize_key')) {
    function sanitize_key($key) { return preg_replace('/[^a-z0-9_-]/', '', strtolower($key)); }
}
if (!function_exists('get_post_meta')) {
    function get_post_meta($post_id, $key = '', $single = false) { return ''; }
}

if (!function_exists('get_template_directory_uri')) {
    function get_template_directory_uri() { return 'http://example.com/wp-content/themes/jankx'; }
}
if (!function_exists('get_stylesheet_directory_uri')) {
    function get_stylesheet_directory_uri() { return 'http://example.com/wp-content/themes/jankx'; }
}
if (!function_exists('wp_enqueue_script')) {
    function wp_enqueue_script($handle, $src = '', $deps = array(), $ver = false, $in_footer = false) { return true; }
}
if (!function_exists('wp_register_script')) {
    function wp_register_script($handle, $src, $deps = array(), $ver = false, $in_footer = false) { return true; }
}
if (!function_exists('wp_enqueue_style')) {
    function wp_enqueue_style($handle, $src = '', $deps = array(), $ver = false, $media = 'all') { return true; }
}
if (!function_exists('wp_register_style')) {
    function wp_register_style($handle, $src, $deps = array(), $ver = false, $media = 'all') { return true; }
}
if (!function_exists('wp_localize_script')) {
    function wp_localize_script($handle, $object_name, $l10n) { return true; }
}
if (!function_exists('wp_add_inline_script')) {
    function wp_add_inline_script($handle, $data, $position = 'after') { return true; }
}
if (!function_exists('wp_script_is')) {
    function wp_script_is($handle, $list = 'enqueued') { return true; }
}
if (!function_exists('wp_style_is')) {
    function wp_style_is($handle, $list = 'enqueued') { return true; }
}
if (!function_exists('has_block')) {
    function has_block($block_name, $post = null) { return false; }
}
if (!function_exists('__')) {
    function __($text, $domain = 'default') { return $text; }
}
if (!function_exists('_e')) {
    function _e($text, $domain = 'default') { echo $text; }
}
if (!function_exists('esc_url')) {
    function esc_url($url, $protocols = null, $_context = 'display') { return $url; }
}
if (!function_exists('esc_html')) {
    function esc_html($text) { return $text; }
}
if (!function_exists('esc_attr')) {
    function esc_attr($text) { return $text; }
}

// Load test bootstrap which mocks WP and loads autoloader
require_once ABSPATH . 'tests/bootstrap.php';

use Jankx\Foundation\Application;
use Tests\Gutenberg\Blocks\BlockOutputReferenceGenerator;

// Initialize the application
$app = Application::getInstance();

if (!function_exists('admin_url')) {
    function admin_url($path = '', $scheme = 'admin') { return 'http://example.com/wp-admin/' . $path; }
}
if (!function_exists('home_url')) {
    function home_url($path = '', $scheme = null) { return 'http://example.com/' . $path; }
}
if (!function_exists('site_url')) {
    function site_url($path = '', $scheme = null) { return 'http://example.com/' . $path; }
}
if (!function_exists('get_admin_url')) {
    function get_admin_url($blog_id = null, $path = '', $scheme = 'admin') { return 'http://example.com/wp-admin/' . $path; }
}
if (!function_exists('plugins_url')) {
    function plugins_url($path = '', $plugin = '') { return 'http://example.com/wp-content/plugins/' . $path; }
}
if (!function_exists('content_url')) {
    function content_url($path = '') { return 'http://example.com/wp-content/' . $path; }
}
if (!function_exists('includes_url')) {
    function includes_url($path = '') { return 'http://example.com/wp-includes/' . $path; }
}
if (!function_exists('wp_upload_dir')) {
    function wp_upload_dir($time = null, $create_dir = true, $refresh_cache = false) {
        return [
            'path' => '/tmp',
            'url' => 'http://example.com/wp-content/uploads',
            'subdir' => '',
            'basedir' => '/tmp',
            'baseurl' => 'http://example.com/wp-content/uploads',
            'error' => false,
        ];
    }
}
if (!function_exists('get_taxonomy')) {
    function get_taxonomy($taxonomy) { return false; }
}
if (!function_exists('taxonomy_exists')) {
    function taxonomy_exists($taxonomy) { return false; }
}
if (!function_exists('get_post_type_object')) {
    function get_post_type_object($post_type) { return null; }
}
if (!function_exists('post_type_exists')) {
    function post_type_exists($post_type) { return true; }
}
if (!function_exists('wp_get_nav_menus')) {
    function wp_get_nav_menus($args = array()) { return array(); }
}
if (!function_exists('get_term')) {
    function get_term($term, $taxonomy = '', $output = 'OBJECT', $filter = 'raw') { return null; }
}
if (!function_exists('get_terms')) {
    function get_terms($args = array(), $deprecated = '') { return array(); }
}
if (!function_exists('get_taxonomies')) {
    function get_taxonomies($args = array(), $output = 'names', $operator = 'and') { return array(); }
}
if (!function_exists('get_object_taxonomies')) {
    function get_object_taxonomies($object, $output = 'names') { return array(); }
}
if (!function_exists('get_the_terms')) {
    function get_the_terms($post, $taxonomy) { return false; }
}
if (!function_exists('is_wp_error')) {
    function is_wp_error($thing) { return false; }
}
if (!function_exists('remove_filter')) {
    function remove_filter($hook, $callback, $priority = 10) { return true; }
}
if (!function_exists('remove_action')) {
    function remove_action($hook, $callback, $priority = 10) { return true; }
}
if (!function_exists('has_filter')) {
    function has_filter($hook, $callback = false) { return false; }
}

if (!class_exists('WP_Query')) {
    class WP_Query {
        public $posts = array();
        public $post_count = 0;
        public $found_posts = 0;
        public $max_num_pages = 0;
        public $query_vars = array();
        public function __construct($args = array()) {
            $this->query_vars = $args;
        }
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

// Initialize global wp_query
$GLOBALS['wp_query'] = new WP_Query();

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

// Mock WP_Block if not already defined (usually Mockery handles it but just in case)
if (!class_exists('WP_Block')) {
    class WP_Block {
        public $attributes = array();
        public $parsed_block = array();
        public function __construct($parsed_block = array(), $context = array()) {
            $this->parsed_block = $parsed_block;
        }
    }
}

// Register necessary providers
$app->register(\Jankx\Support\Providers\GutenbergServiceProvider::class);

// Bind non-instantiable managers
$app->singleton(\Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutManager::class, function() {
    return \Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutManager::getInstance();
});
$app->singleton(\Jankx\Layouts\DynamicDataLayout\ViewLayouts\ViewLayoutManager::class, function() {
    return \Jankx\Layouts\DynamicDataLayout\ViewLayouts\ViewLayoutManager::getInstance();
});

// Boot the application
$app->bootProviders();

// Create the generator
$generator = new BlockOutputReferenceGenerator($app);

// Run the generation process
$generator->generate();
