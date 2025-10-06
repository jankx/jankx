<?php
/**
 * Advanced Filter Block Initialization
 *
 * File khởi tạo cho advanced filter block
 */

if (!defined('ABSPATH')) {
    exit;
}

// Include integration class
require_once __DIR__ . '/../../includes/framework/Gutenberg/Blocks/AdvancedFilters/AdvancedFilterIntegration.php';

// Initialize the block
add_action('init', function() {
    \Jankx\Gutenberg\Blocks\AdvancedFilters\AdvancedFilterIntegration::getInstance();
}, 20);

// Add block category if not exists
add_filter('block_categories_all', function($categories, $block_editor_context) {
    $category_exists = false;
    foreach ($categories as $category) {
        if ($category['slug'] === 'jankx') {
            $category_exists = true;
            break;
        }
    }

    if (!$category_exists) {
        $categories[] = [
            'slug' => 'jankx',
            'title' => __('Jankx', 'jankx'),
            'icon' => 'grid-view'
        ];
    }

    return $categories;
}, 10, 2);

// Add nonce for AJAX
add_action('wp_enqueue_scripts', function() {
    if (!is_admin()) {
        wp_localize_script('jquery', 'jankx_advanced_filter_nonce', wp_create_nonce('jankx_advanced_filter_nonce'));
    }
});

// Add admin nonce
add_action('admin_enqueue_scripts', function() {
    wp_localize_script('jquery', 'jankx_advanced_filter_nonce', wp_create_nonce('jankx_advanced_filter_nonce'));
});
