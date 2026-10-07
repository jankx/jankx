<?php
/**
 * Jankx Framework 2.0
 *
 * A powerful WordPress theme framework with high performance,
 * compatibility, and easy development experience.
 *
 * @package Jankx
 * @version 2.0.0
 * @author Puleeno Nguyen <puleeno@gmail.com>
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Load Jankx Framework
require_once get_template_directory() . '/includes/framework.php';

// Load Gutenberg Controls Integration for blocks
$blocks_integration = get_template_directory() . '/resources/blocks/integration/loader.php';
if (file_exists($blocks_integration)) {
    require_once $blocks_integration;
}

/**
 * Enqueue fonts and styles for block editor
 */
add_action('enqueue_block_editor_assets', function() {
    wp_enqueue_style('jankx-editor-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@700;800&display=swap', [], null);
});

/**
 * Self-hosted animate.css (blocks previously @imported it from cdnjs inside
 * their CSS, creating a render-blocking @import chain).
 */
add_action('wp_enqueue_scripts', function() {
    wp_enqueue_style(
        'jankx-animate',
        get_template_directory_uri() . '/resources/assets/css/animate.min.css',
        [],
        '4.1.1'
    );
});
