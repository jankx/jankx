<?php

define('ABSPATH', dirname(__FILE__) . '/../');

require_once dirname(__FILE__) . '/../vendor/autoload.php';

// Mock some essential WP functions that might be called during construction/initialization
// if they are not mocked by Brain Monkey yet.
if (!function_exists('add_action')) {
    function add_action($tag, $callback, $priority = 10, $accepted_args = 1) { return true; }
}
if (!function_exists('add_filter')) {
    function add_filter($tag, $callback, $priority = 10, $accepted_args = 1) { return true; }
}
if (!function_exists('apply_filters')) {
    function apply_filters($tag, $value, ...$args) { return $value; }
}
