<?php
/**
 * Mock WordPress functions for CLI scripts
 */

if (!function_exists('get_template_directory')) { function get_template_directory() { return ABSPATH; } }
if (!function_exists('register_block_type_from_metadata')) { function register_block_type_from_metadata($path, $args) { return true; } }
if (!function_exists('add_action')) { function add_action($hook, $callback) {} }
if (!function_exists('add_filter')) { function add_filter($hook, $callback) {} }
if (!function_exists('apply_filters')) { function apply_filters($hook, $value) { return $value; } }
if (!function_exists('__')) { function __($text, $domain) { return $text; } }
if (!function_exists('esc_html')) { function esc_html($text) { return htmlspecialchars($text); } }
if (!function_exists('esc_attr')) { function esc_attr($text) { return htmlspecialchars($text, ENT_QUOTES); } }
if (!function_exists('esc_url')) { function esc_url($text) { return $text; } }
if (!function_exists('do_action')) { function do_action($hook, ...$args) {} }
if (!function_exists('did_action')) { function did_action($hook) { return 0; } }
if (!function_exists('get_option')) { function get_option($option, $default = false) { return $default; } }
if (!function_exists('update_option')) { function update_option($option, $value, $autoload = null) { return true; } }
if (!function_exists('wp_parse_args')) { function wp_parse_args($args, $defaults = '') { return array_merge((array)$defaults, (array)$args); } }
if (!function_exists('get_block_wrapper_attributes')) { 
    function get_block_wrapper_attributes($extra = []) { 
        $attr = '';
        foreach($extra as $k => $v) $attr .= sprintf(' %s="%s"', $k, htmlspecialchars($v, ENT_QUOTES));
        return $attr; 
    } 
}
if (!function_exists('is_singular')) { function is_singular() { return false; } }
if (!function_exists('is_admin')) { function is_admin() { return false; } }
if (!function_exists('get_the_ID')) { function get_the_ID() { return 1; } }
if (!function_exists('wp_json_encode')) { function wp_json_encode($data) { return json_encode($data); } }
if (!function_exists('esc_html__')) { function esc_html__($text, $domain) { return $text; } }
if (!function_exists('post_type_exists')) { function post_type_exists($post_type) { return true; } }

if (!class_exists('WP_Block')) {
    class WP_Block {
        public $attributes;
        public $inner_blocks = [];
        public function __construct($attributes = [], $inner_blocks = []) {
            $this->attributes = $attributes;
            $this->inner_blocks = $inner_blocks;
        }
        public function render() { return ''; }
    }
}
