<?php
// Load Composer autoloader first for Brain Monkey/Patchwork
$autoloader = dirname(__FILE__) . '/../vendor/autoload.php';
if (file_exists($autoloader)) {
    require_once $autoloader;
}

/**
 * PHPUnit Bootstrap File
 *
 * This file is loaded before running tests to set up the testing environment.
 */

if (!class_exists('WP_CLI_Command')) {
    class WP_CLI_Command {}
}

if (!class_exists('WP_CLI')) {
    class WP_CLI {
        public static function log($message) {}
        public static function error($message, $die = true) { if ($die) throw new \Exception($message); }
        public static function success($message) {}
        public static function add_command($name, $class) {}
        public static function line($message) {}
        public static function warning($message) {}
        public static function debug($message, $group = false) {}
    }
}

if (!class_exists('WP_Block')) {
    class WP_Block {
        public $attributes;
        public $context;
        public $inner_blocks;
        public $inner_html;
        public $inner_content;
        public function __construct($block) {
            $this->attributes = $block['attrs'] ?? [];
            $this->context = $block['context'] ?? [];
        }
    }
}

// Define WordPress constants for testing
if (!defined('ABSPATH')) {
    define('ABSPATH', dirname(__FILE__) . '/../');
}

if (!defined('WP_CONTENT_DIR')) {
    define('WP_CONTENT_DIR', dirname(__FILE__) . '/../');
}

if (!defined('WP_PLUGIN_DIR')) {
    define('WP_PLUGIN_DIR', dirname(__FILE__) . '/../plugins/');
}

if (!defined('WP_THEME_DIR')) {
    define('WP_THEME_DIR', dirname(__FILE__) . '/../themes/');
}

if (!defined('WP_LANG_DIR')) {
    define('WP_LANG_DIR', dirname(__FILE__) . '/../languages/');
}

// Mock WordPress functions if they don't exist
if (!function_exists('get_stylesheet_directory')) {
    function get_stylesheet_directory()
    {
        if (isset($GLOBALS['test_child_theme_path'])) {
            return $GLOBALS['test_child_theme_path'];
        }
        return dirname(__FILE__) . '/..';
    }
}

if (!function_exists('get_template_directory')) {
    function get_template_directory()
    {
        if (isset($GLOBALS['test_parent_theme_path'])) {
            return $GLOBALS['test_parent_theme_path'];
        }
        return dirname(__FILE__) . '/..';
    }
}

if (!function_exists('get_template_directory_uri')) {
    function get_template_directory_uri()
    {
        return 'http://example.com/wp-content/themes/jankx';
    }
}

if (!function_exists('get_stylesheet_directory_uri')) {
    function get_stylesheet_directory_uri()
    {
        return 'http://example.com/wp-content/themes/jankx-child';
    }
}

/*
if (!function_exists('add_action')) {
    function add_action($hook, $callback, $priority = 10, $accepted_args = 1)
    {
        return true;
    }
}

if (!function_exists('add_filter')) {
    function add_filter($hook, $callback, $priority = 10, $accepted_args = 1)
    {
        return true;
    }
}

if (!function_exists('do_action')) {
    function do_action($hook, ...$args)
    {
        return true;
    }
}

if (!function_exists('apply_filters')) {
    function apply_filters($hook, $value, ...$args)
    {
        return $value;
    }
}

if (!function_exists('remove_action')) {
    function remove_action($tag, $callback, $priority = 10)
    {
        return true;
    }
}

if (!function_exists('remove_all_actions')) {
    function remove_all_actions($tag, $priority = false)
    {
        return true;
    }
}

if (!function_exists('remove_filter')) {
    function remove_filter($tag, $callback, $priority = 10)
    {
        return true;
    }
}

if (!function_exists('remove_all_filters')) {
    function remove_all_filters($tag, $priority = false)
    {
        return true;
    }
}
*/

if (!function_exists('add_menu_page')) {
    function add_menu_page($page_title, $menu_title, $capability, $menu_slug, $function = '', $icon_url = '', $position = null)
    {
        return true;
    }
}

if (!function_exists('add_submenu_page')) {
    function add_submenu_page($parent_slug, $page_title, $menu_title, $capability, $menu_slug, $function = '', $position = null)
    {
        return true;
    }
}

if (!function_exists('get_option')) {
    function get_option($option, $default = false)
    {
        if (isset($GLOBALS['options'][$option])) {
            return $GLOBALS['options'][$option];
        }
        return $default;
    }
}

if (!function_exists('add_shortcode')) {
    function add_shortcode($tag, $callback)
    {
        return true;
    }
}

if (!function_exists('do_shortcode')) {
    function do_shortcode($content, $ignore_html = false)
    {
        return $content;
    }
}

if (!function_exists('shortcode_exists')) {
    function shortcode_exists($tag)
    {
        return false;
    }
}

if (!function_exists('update_option')) {
    function update_option($option, $value, $autoload = null)
    {
        return true;
    }
}

if (!function_exists('delete_option')) {
    function delete_option($option)
    {
        return true;
    }
}

if (!function_exists('wp_die')) {
    function wp_die($message = '', $title = '', $args = array())
    {
        throw new Exception($message);
    }
}

if (!function_exists('wp_redirect')) {
    function wp_redirect($location, $status = 302, $x_redirect_by = 'WordPress')
    {
        return true;
    }
}

if (!function_exists('wp_safe_redirect')) {
    function wp_safe_redirect($location, $status = 302, $x_redirect_by = 'WordPress')
    {
        return true;
    }
}

if (!function_exists('is_admin')) {
    function is_admin()
    {
        if (isset($GLOBALS['mock_is_admin'])) {
            return (bool) $GLOBALS['mock_is_admin'];
        }
        return true;
    }
}

if (!function_exists('is_ajax')) {
    function is_ajax()
    {
        return false;
    }
}

if (!function_exists('wp_doing_ajax')) {
    function wp_doing_ajax()
    {
        return false;
    }
}

if (!function_exists('wp_doing_cron')) {
    function wp_doing_cron()
    {
        return false;
    }
}

if (!function_exists('wp_cache_get')) {
    function wp_cache_get($key, $group = '', $force = false, &$found = null)
    {
        $found = false;
        return false;
    }
}

if (!function_exists('wp_cache_set')) {
    function wp_cache_set($key, $data, $group = '', $expire = 0)
    {
        return true;
    }
}

if (!function_exists('wp_cache_delete')) {
    function wp_cache_delete($key, $group = '')
    {
        return true;
    }
}

if (!function_exists('wp_cache_flush_group')) {
    function wp_cache_flush_group($group)
    {
        return true;
    }
}

if (!function_exists('wp_cache_add')) {
    function wp_cache_add($key, $data, $group = '', $expire = 0)
    {
        return true;
    }
}

if (!function_exists('did_action')) {
    function did_action($tag)
    {
        return 0;
    }
}

if (!function_exists('wp_get_theme')) {
    function wp_get_theme($stylesheet = null)
    {
        return new class($stylesheet) {
            private $stylesheet;
            public function __construct($stylesheet = null) {
                $this->stylesheet = $stylesheet ?? get_stylesheet();
            }
            public function get($key) { return ''; }
            public function exists() { return true; }
            public function get_stylesheet() { return $this->stylesheet; }
            public function get_template() { return get_template(); }
        };
    }
}

if (!function_exists('get_template')) {
    function get_template()
    {
        if (isset($GLOBALS['test_parent_theme_path'])) {
            return basename($GLOBALS['test_parent_theme_path']);
        }
        return 'bookix';
    }
}

if (!function_exists('get_stylesheet')) {
    function get_stylesheet()
    {
        if (isset($GLOBALS['test_child_theme_path'])) {
            return basename($GLOBALS['test_child_theme_path']);
        }
        return 'bookix-child';
    }
}

if (!function_exists('is_child_theme')) {
    function is_child_theme()
    {
        if (isset($GLOBALS['mock_is_child_theme'])) {
            return (bool) $GLOBALS['mock_is_child_theme'];
        }
        return get_template_directory() !== get_stylesheet_directory();
    }
}

if (!function_exists('wp_verify_nonce')) {
    function wp_verify_nonce($nonce, $action = -1)
    {
        return true;
    }
}

if (!function_exists('wp_create_nonce')) {
    function wp_create_nonce($action = -1)
    {
        return 'test_nonce';
    }
}

if (!function_exists('wp_nonce_field')) {
    function wp_nonce_field($action = -1, $name = '_wpnonce', $referer = true, $echo = true)
    {
        $nonce_field = '<input type="hidden" id="' . $name . '" name="' . $name . '" value="' . wp_create_nonce($action) . '" />';
        if ($referer) {
            $nonce_field .= wp_referer_field(false);
        }
        if ($echo) {
            echo $nonce_field;
        }
        return $nonce_field;
    }
}

if (!function_exists('wp_referer_field')) {
    function wp_referer_field($echo = true)
    {
        $ref = '<input type="hidden" name="_wp_http_referer" value="' . esc_attr(wp_unslash($_SERVER['REQUEST_URI'])) . '" />';
        if ($echo) {
            echo $ref;
        }
        return $ref;
    }
}

if (!function_exists('esc_attr')) {
    function esc_attr($text)
    {
        return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('esc_html')) {
    function esc_html($text)
    {
        return htmlspecialchars($text, ENT_QUOTES, 'UTF-8');
    }
}

if (!function_exists('esc_url')) {
    function esc_url($url, $protocols = null, $_context = 'display')
    {
        return $url;
    }
}

if (!function_exists('wp_kses_post')) {
    function wp_kses_post($data)
    {
        return $data;
    }
}

if (!function_exists('wp_trim_words')) {
    function wp_trim_words($text, $num_words = 55, $more = null)
    {
        return $text;
    }
}

if (!function_exists('wp_style_is')) {
    function wp_style_is($handle, $status = 'registered')
    {
        return false;
    }
}

if (!function_exists('wp_add_inline_style')) {
    function wp_add_inline_style($handle, $css)
    {
        return true;
    }
}

if (!function_exists('wp_unslash')) {
    function wp_unslash($value)
    {
        return stripslashes($value);
    }
}

if (!function_exists('sanitize_file_name')) {
    function sanitize_file_name($filename)
    {
        return strtolower(preg_replace('/[^a-zA-Z0-9_\-]/', '-', $filename));
    }
}

if (!function_exists('__')) {
    function __($text, $domain = 'default')
    {
        return $text;
    }
}

if (!function_exists('_e')) {
    function _e($text, $domain = 'default')
    {
        echo $text;
    }
}

if (!function_exists('esc_html_e')) {
    function esc_html_e($text, $domain = 'default')
    {
        echo esc_html($text);
    }
}

if (!function_exists('esc_attr_e')) {
    function esc_attr_e($text, $domain = 'default')
    {
        echo esc_attr($text);
    }
}

if (!function_exists('_x')) {
    function _x($text, $context, $domain = 'default')
    {
        return $text;
    }
}

if (!function_exists('_ex')) {
    function _ex($text, $context, $domain = 'default')
    {
        echo $text;
    }
}

if (!function_exists('_n')) {
    function _n($single, $plural, $number, $domain = 'default')
    {
        return $number == 1 ? $single : $plural;
    }
}

if (!function_exists('_nx')) {
    function _nx($single, $plural, $number, $context, $domain = 'default')
    {
        return $number == 1 ? $single : $plural;
    }
}

if (!function_exists('_n_noop')) {
    function _n_noop($singular, $plural, $domain = null)
    {
        return array($singular, $plural, $domain);
    }
}

if (!function_exists('_nx_noop')) {
    function _nx_noop($singular, $plural, $context, $domain = null)
    {
        return array($singular, $plural, $context, $domain);
    }
}

if (!function_exists('translate_nooped_plural')) {
    function translate_nooped_plural($nooped_plural, $count, $domain = 'default')
    {
        if ($nooped_plural['domain']) {
            $domain = $nooped_plural['domain'];
        }
        if ($nooped_plural['context']) {
            return _nx($nooped_plural['singular'], $nooped_plural['plural'], $count, $nooped_plural['context'], $domain);
        } else {
            return _n($nooped_plural['singular'], $nooped_plural['plural'], $count, $domain);
        }
    }
}

// Stub for render_block to avoid requiring WordPress core in unit tests
if (!function_exists('render_block')) {
    function render_block($block)
    {
        if (isset($block['blockName'])) {
            return sprintf('<!-- %s -->', $block['blockName']);
        }
        return '';
    }
}

if (!function_exists('load_theme_textdomain')) {
    function load_theme_textdomain($domain, $path = false)
    {
        return true;
    }
}

if (!function_exists('is_textdomain_loaded')) {
    function is_textdomain_loaded($domain)
    {
        return false;
    }
}

if (!function_exists('load_textdomain')) {
    function load_textdomain($domain, $mofile)
    {
        return true;
    }
}

if (!function_exists('unload_textdomain')) {
    function unload_textdomain($domain)
    {
        return true;
    }
}

if (!function_exists('get_locale')) {
    function get_locale()
    {
        return 'en_US';
    }
}

if (!function_exists('is_rtl')) {
    function is_rtl()
    {
        return false;
    }
}

if (!function_exists('wp_parse_url')) {
    function wp_parse_url($url, $component = -1)
    {
        return parse_url($url, $component);
    }
}

if (!function_exists('wp_upload_dir')) {
    function wp_upload_dir($time = null)
    {
        return array(
            'path' => dirname(__FILE__) . '/../uploads',
            'url' => 'http://example.com/uploads',
            'subdir' => '',
            'basedir' => dirname(__FILE__) . '/../uploads',
            'baseurl' => 'http://example.com/uploads',
            'error' => false,
        );
    }
}

if (!function_exists('wp_mkdir_p')) {
    function wp_mkdir_p($target)
    {
        if (is_dir($target)) {
            return true;
        }
        return @mkdir($target, 0755, true);
    }
}

if (!function_exists('wp_is_post_autosave')) {
    function wp_is_post_autosave($post_id) { return false; }
}

if (!function_exists('wp_is_post_revision')) {
    function wp_is_post_revision($post_id) { return false; }
}

if (!function_exists('clean_post_cache')) {
    function clean_post_cache($post_id) { return true; }
}

if (!function_exists('get_post_status')) {
    function get_post_status($post_id) { return 'publish'; }
}

if (!function_exists('wp_is_writable')) {
    function wp_is_writable($path)
    {
        return is_writable($path);
    }
}

if (!function_exists('wp_check_filetype')) {
    function wp_check_filetype($filename, $mimes = null)
    {
        return array(
            'type' => 'image/jpeg',
            'ext' => 'jpg',
        );
    }
}

if (!function_exists('wp_handle_upload')) {
    function wp_handle_upload($file, $overrides = false, $time = null)
    {
        return array(
            'file' => $file['tmp_name'],
            'url' => 'http://example.com/uploads/' . basename($file['name']),
            'type' => $file['type'],
            'error' => false,
        );
    }
}

if (!function_exists('wp_handle_sideload')) {
    function wp_handle_sideload($file, $overrides = false, $time = null)
    {
        return array(
            'file' => $file['tmp_name'],
            'url' => 'http://example.com/uploads/' . basename($file['name']),
            'type' => $file['type'],
            'error' => false,
        );
    }
}

if (!function_exists('pll_current_language')) {
    function pll_current_language() {
        if (isset($GLOBALS['mock_pll_current_language'])) {
            return $GLOBALS['mock_pll_current_language'];
        }
        return 'vi';
    }
}

if (!function_exists('pll_the_languages')) {
    function pll_the_languages($args) {
        if (isset($GLOBALS['mock_pll_languages'])) {
            return $GLOBALS['mock_pll_languages'];
        }
        return [];
    }
}

if (!function_exists('wp_handle_upload_error')) {
    function wp_handle_upload_error($file, $message)
    {
        return array(
            'error' => $message,
        );
    }
}

if (!function_exists('wp_handle_sideload_error')) {
    function wp_handle_sideload_error($file, $message)
    {
        return array(
            'error' => $message,
        );
    }
}

if (!function_exists('wp_upload_bits')) {
    function wp_upload_bits($name, $deprecated, $bits, $time = null)
    {
        return array(
            'file' => dirname(__FILE__) . '/../uploads/' . $name,
            'url' => 'http://example.com/uploads/' . $name,
            'error' => false,
        );
    }
}

if (!function_exists('wp_upload_dir')) {
    function wp_upload_dir($time = null)
    {
        return array(
            'path' => dirname(__FILE__) . '/../uploads',
            'url' => 'http://example.com/uploads',
            'subdir' => '',
            'basedir' => dirname(__FILE__) . '/../uploads',
            'baseurl' => 'http://example.com/uploads',
            'error' => false,
        );
    }
}
if (!defined('HOUR_IN_SECONDS')) {
    define('HOUR_IN_SECONDS', 3600);
}

if (!function_exists('get_transient')) {
    function get_transient($transient) {
        if (isset($GLOBALS['transients'][$transient])) {
            return $GLOBALS['transients'][$transient];
        }
        return false;
    }
}

if (!function_exists('set_transient')) {
    function set_transient($transient, $value, $expiration = 0) {
        $GLOBALS['transients'][$transient] = $value;
        return true;
    }
}

if (!function_exists('delete_transient')) {
    function delete_transient($transient) {
        unset($GLOBALS['transients'][$transient]);
        return true;
    }
}

if (!function_exists('is_singular')) {
    function is_singular($post_types = '') {
        return false;
    }
}

if (!function_exists('get_permalink')) {
    function get_permalink($post = 0, $leavename = false) {
        return 'http://example.com/permalink';
    }
}

if (!function_exists('get_the_ID')) {
    function get_the_ID() {
        return 1;
    }
}

if (!function_exists('get_block_wrapper_attributes')) {
    function get_block_wrapper_attributes($extra_attributes = []) {
        $attributes = '';
        foreach ($extra_attributes as $name => $value) {
            $attributes .= sprintf(' %s="%s"', esc_attr($name), esc_attr($value));
        }
        return $attributes;
    }
}

// Load Composer autoloader
$autoloader = dirname(__FILE__) . '/../vendor/autoload.php';
if (file_exists($autoloader)) {
    require_once $autoloader;
}

// Set error reporting for testing
error_reporting(E_ALL);

// Register extension autoloader for tests
spl_autoload_register(function ($class) {
    if (strpos($class, 'Jankx\\Extensions\\') === 0) {
        $name = str_replace('Jankx\\Extensions\\', '', $class);
        $dirName = strtolower(preg_replace('/(?<!^)[A-Z]/', '-$0', str_replace('Extension', '', $name)));
        
        $file = dirname(__FILE__) . '/../extensions/' . $dirName . '/' . $name . '.php';
        if (file_exists($file)) {
            require_once $file;
        }
    } elseif (strpos($class, 'Jankx\\Features\\Metrics\\') === 0) {
        $relativeClass = str_replace('Jankx\\Features\\Metrics\\', '', $class);
        $file = dirname(__FILE__) . '/../extensions/metrics/' . str_replace('\\', '/', $relativeClass) . '.php';
        if (file_exists($file)) {
            require_once $file;
        }
    }
});
ini_set('display_errors', 1);

// Set timezone for testing
date_default_timezone_set('UTC');

// Load test helpers
require_once dirname(__FILE__) . '/Helpers/TestCase.php';
