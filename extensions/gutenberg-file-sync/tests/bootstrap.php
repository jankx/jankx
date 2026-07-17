<?php
/**
 * PHPUnit Bootstrap for Gutenberg File Sync Extension Tests
 */

// Load Composer autoloader if exists
if (file_exists(__DIR__ . '/../vendor/autoload.php')) {
    require_once __DIR__ . '/../vendor/autoload.php';
}

// Initialize Brain Monkey
\Brain\Monkey\setUp();

// Mock WordPress functions
\Brain\Monkey\Functions\stubs([
    'wp_mkdir_p',
    'get_stylesheet_directory',
    'wp_delete_post',
    'add_action'
]);

// Helper for WP_Post mock if needed
if (!class_exists('WP_Post')) {
    class WP_Post {
        public $ID;
        public $post_type;
        public $post_name;
        public $post_content;
        
        public function __construct($data = []) {
            foreach ($data as $key => $value) {
                $this->$key = $value;
            }
        }
    }
}
