<?php

/**
 * PHPUnit Bootstrap File
 *
 * This file is loaded before running tests to set up the testing environment.
 */

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
        return dirname(__FILE__) . '/../themes/bookix-child';
    }
}

if (!function_exists('get_template_directory')) {
    function get_template_directory()
    {
        return dirname(__FILE__) . '/../themes/bookix';
    }
}

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
        return $default;
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
        return true;
    }
}

if (!function_exists('is_ajax')) {
    function is_ajax()
    {
        return false;
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
        return mkdir($target, 0755, true);
    }
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

// Load Composer autoloader
$autoloader = dirname(__FILE__) . '/../vendor/autoload.php';
if (file_exists($autoloader)) {
    require_once $autoloader;
}

// Set error reporting for testing
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Set timezone for testing
date_default_timezone_set('UTC');

// Load test helpers
require_once dirname(__FILE__) . '/helpers/TestCase.php';
