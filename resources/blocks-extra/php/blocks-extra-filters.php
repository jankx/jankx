<?php
/**
 * Blocks Extra Filters
 * 
 * Enhanced block filters to improve Gutenberg blocks with better responsive support
 * and additional features like SSR/CSR render mode selection.
 * 
 * @package Jankx
 * @subpackage BlocksExtra
 */

if (!defined('ABSPATH')) {
    exit;
}

class Jankx_Blocks_Extra_Filters {
    
    /**
     * Singleton instance
     */
    private static $instance = null;
    
    /**
     * Get singleton instance
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor
     */
    private function __construct() {
        add_action('init', [$this, 'init']);
    }
    
    /**
     * Initialize the blocks extra system
     */
    public function init() {
        // Register block attributes for all blocks
        add_filter('block_type_metadata', [$this, 'add_render_mode_attribute'], 10, 1);
        
        // Filter block render to handle SSR/CSR mode
        add_filter('render_block', [$this, 'handle_render_mode'], 10, 2);
        
        // Enqueue assets
        add_action('enqueue_block_editor_assets', [$this, 'enqueue_editor_assets']);
        add_action('enqueue_block_assets', [$this, 'enqueue_frontend_assets']);
    }
    
    /**
     * Add render mode attribute to all blocks
     */
    public function add_render_mode_attribute($metadata) {
        if (!isset($metadata['attributes'])) {
            $metadata['attributes'] = [];
        }
        
        $metadata['attributes']['jankxRenderMode'] = [
            'type' => 'string',
            'default' => 'ssr', // Default to SSR
            'enum' => ['ssr', 'csr']
        ];
        
        return $metadata;
    }
    
    /**
     * Handle block rendering based on render mode
     */
    public function handle_render_mode($block_content, $block) {
        if (!isset($block['attrs']['jankxRenderMode'])) {
            return $block_content;
        }
        
        $render_mode = $block['attrs']['jankxRenderMode'];
        
        if ($render_mode === 'csr') {
            // For CSR mode, add data attribute and let JavaScript handle rendering
            $block_content = $this->prepare_csr_render($block_content, $block);
        }
        
        return $block_content;
    }
    
    /**
     * Prepare block for CSR rendering
     */
    private function prepare_csr_render($block_content, $block) {
        // Add data attributes for JavaScript processing
        $block_name = str_replace('/', '-', $block['blockName']);
        $wrapper_class = "jankx-csr-block jankx-csr-{$block_name}";
        
        return sprintf(
            '<div class="%s" data-block-name="%s" data-block-attrs="%s">%s</div>',
            esc_attr($wrapper_class),
            esc_attr($block['blockName']),
            esc_attr(wp_json_encode($block['attrs'])),
            $block_content
        );
    }
    
    /**
     * Enqueue editor assets
     */
    public function enqueue_editor_assets() {
        wp_enqueue_script(
            'jankx-blocks-extra-editor',
            get_template_directory_uri() . '/resources/blocks-extra/js/editor.js',
            ['wp-blocks', 'wp-element', 'wp-components', 'wp-data'],
            '1.0.0',
            true
        );
        
        wp_enqueue_style(
            'jankx-blocks-extra-editor',
            get_template_directory_uri() . '/resources/blocks-extra/scss/editor.scss',
            ['wp-edit-blocks'],
            '1.0.0'
        );
    }
    
    /**
     * Enqueue frontend assets
     */
    public function enqueue_frontend_assets() {
        wp_enqueue_script(
            'jankx-blocks-extra-frontend',
            get_template_directory_uri() . '/resources/blocks-extra/js/frontend.js',
            ['wp-element'],
            '1.0.0',
            true
        );
        
        wp_enqueue_style(
            'jankx-blocks-extra-frontend',
            get_template_directory_uri() . '/resources/blocks-extra/scss/frontend.scss',
            [],
            '1.0.0'
        );
    }
}

// Initialize the blocks extra system
Jankx_Blocks_Extra_Filters::get_instance();
