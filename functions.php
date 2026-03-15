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

/**
 * Enqueue fonts and styles for frontend
 */
add_action('wp_enqueue_scripts', function() {
    // Enqueue Inter and Montserrat from Google Fonts
    wp_enqueue_style('jankx-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@700;800&display=swap', [], null);
});

/**
 * Enqueue fonts and styles for block editor
 */
add_action('enqueue_block_editor_assets', function() {
    wp_enqueue_style('jankx-editor-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Montserrat:wght@700;800&display=swap', [], null);
});
