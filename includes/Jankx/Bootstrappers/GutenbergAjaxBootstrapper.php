<?php

namespace Jankx\Bootstrappers;

use Illuminate\Container\Container;
use Jankx\Gutenberg\AjaxHandler;
use Jankx\Facades\Logger;

/**
 * Gutenberg AJAX Bootstrapper
 *
 * Handles AJAX requests for Gutenberg blocks and partial hydration
 *
 * @package Jankx\Bootstrappers
 */
class GutenbergAjaxBootstrapper extends AbstractBootstrapper
{
    protected $priority = 5;

    public function getName(): string
    {
        return 'gutenberg-ajax';
    }

    public function shouldRun(): bool
    {
        return wp_doing_ajax() &&
               (isset($_POST['action']) || isset($_GET['action'])) &&
               (strpos($_POST['action'] ?? $_GET['action'] ?? '', 'jankx_gutenberg') === 0);
    }

    public function bootstrap(Container $container): void
    {
        // Initialize AJAX Handler
        AjaxHandler::init();

        // Register AJAX hooks for Gutenberg
        $this->registerAjaxHooks();

        Logger::debug('Gutenberg AJAX Bootstrapper initialized', [
            'context' => 'ajax',
            'action' => $_POST['action'] ?? $_GET['action'] ?? 'unknown'
        ]);
    }

    /**
     * Register AJAX hooks for Gutenberg
     */
    protected function registerAjaxHooks(): void
    {
        // Block rendering AJAX
        add_action('wp_ajax_jankx_gutenberg_render_block', [$this, 'handleBlockRender']);
        add_action('wp_ajax_nopriv_jankx_gutenberg_render_block', [$this, 'handleBlockRender']);

        // Layout loading AJAX
        add_action('wp_ajax_jankx_gutenberg_load_layout', [$this, 'handleLayoutLoad']);
        add_action('wp_ajax_nopriv_jankx_gutenberg_load_layout', [$this, 'handleLayoutLoad']);

        // Block data AJAX
        add_action('wp_ajax_jankx_gutenberg_get_block_data', [$this, 'handleGetBlockData']);
        add_action('wp_ajax_nopriv_jankx_gutenberg_get_block_data', [$this, 'handleGetBlockData']);

        // Block options AJAX
        add_action('wp_ajax_jankx_gutenberg_get_block_options', [$this, 'handleGetBlockOptions']);
        add_action('wp_ajax_nopriv_jankx_gutenberg_get_block_options', [$this, 'handleGetBlockOptions']);

        // Performance monitoring AJAX
        add_action('wp_ajax_jankx_gutenberg_performance_stats', [$this, 'handlePerformanceStats']);
        add_action('wp_ajax_nopriv_jankx_gutenberg_performance_stats', [$this, 'handlePerformanceStats']);
    }

    /**
     * Handle block rendering AJAX request
     */
    public function handleBlockRender(): void
    {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'] ?? '', 'jankx_gutenberg_nonce')) {
            wp_die('Security check failed', 'Security Error', ['response' => 403]);
        }

        $block_name = sanitize_text_field($_POST['block_name'] ?? '');
        $attributes = json_decode(stripslashes($_POST['attributes'] ?? '{}'), true);
        $content = wp_kses_post($_POST['content'] ?? '');

        if (empty($block_name)) {
            wp_send_json_error(['message' => 'Block name is required']);
            return;
        }

        try {
            // Get block class from registry
            $block_class = \Jankx\Gutenberg\BlockRegistry::getBlock($block_name);

            if (!$block_class) {
                wp_send_json_error(['message' => 'Block not found']);
                return;
            }

            // Render the block
            $rendered_content = $block_class::render($attributes, $content);

            wp_send_json_success([
                'html' => $rendered_content,
                'block_name' => $block_name,
                'attributes' => $attributes
            ]);

        } catch (\Exception $e) {
            Logger::error('Block rendering failed', [
                'block_name' => $block_name,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            wp_send_json_error([
                'message' => 'Block rendering failed',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Handle layout loading AJAX request
     */
    public function handleLayoutLoad(): void
    {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'] ?? '', 'jankx_gutenberg_nonce')) {
            wp_die('Security check failed', 'Security Error', ['response' => 403]);
        }

        $layout_name = sanitize_text_field($_POST['layout_name'] ?? '');
        $layout_data = json_decode(stripslashes($_POST['layout_data'] ?? '{}'), true);

        if (empty($layout_name)) {
            wp_send_json_error(['message' => 'Layout name is required']);
            return;
        }

        try {
            // Load layout via AjaxHandler
            $result = AjaxHandler::loadLayout($layout_name, $layout_data);

            wp_send_json_success($result);

        } catch (\Exception $e) {
            Logger::error('Layout loading failed', [
                'layout_name' => $layout_name,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            wp_send_json_error([
                'message' => 'Layout loading failed',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Handle get block data AJAX request
     */
    public function handleGetBlockData(): void
    {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'] ?? '', 'jankx_gutenberg_nonce')) {
            wp_die('Security check failed', 'Security Error', ['response' => 403]);
        }

        $block_name = sanitize_text_field($_POST['block_name'] ?? '');

        if (empty($block_name)) {
            wp_send_json_error(['message' => 'Block name is required']);
            return;
        }

        try {
            // Get block data from registry
            $block_data = \Jankx\Gutenberg\BlockRegistry::getBlockData();

            if (!isset($block_data[$block_name])) {
                wp_send_json_error(['message' => 'Block data not found']);
                return;
            }

            wp_send_json_success([
                'block_data' => $block_data[$block_name]
            ]);

        } catch (\Exception $e) {
            Logger::error('Get block data failed', [
                'block_name' => $block_name,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            wp_send_json_error([
                'message' => 'Get block data failed',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Handle get block options AJAX request
     */
    public function handleGetBlockOptions(): void
    {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'] ?? '', 'jankx_gutenberg_nonce')) {
            wp_die('Security check failed', 'Security Error', ['response' => 403]);
        }

        $block_name = sanitize_text_field($_POST['block_name'] ?? '');

        if (empty($block_name)) {
            wp_send_json_error(['message' => 'Block name is required']);
            return;
        }

        try {
            // Get block options from LayoutOptions
            $options = \Jankx\Gutenberg\LayoutOptions::getOptionsForLayout($block_name);

            wp_send_json_success([
                'options' => $options
            ]);

        } catch (\Exception $e) {
            Logger::error('Get block options failed', [
                'block_name' => $block_name,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            wp_send_json_error([
                'message' => 'Get block options failed',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Handle performance stats AJAX request
     */
    public function handlePerformanceStats(): void
    {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'] ?? '', 'jankx_gutenberg_nonce')) {
            wp_die('Security check failed', 'Security Error', ['response' => 403]);
        }

        try {
            $stats = [
                'memory_usage' => memory_get_usage(true),
                'peak_memory' => memory_get_peak_usage(true),
                'load_time' => microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'],
                'blocks_loaded' => count(\Jankx\Gutenberg\BlockRegistry::getBlocks()),
                'layouts_loaded' => count(\Jankx\Gutenberg\LayoutRegistry::getLayouts()),
                'timestamp' => time()
            ];

            wp_send_json_success([
                'stats' => $stats
            ]);

        } catch (\Exception $e) {
            Logger::error('Get performance stats failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            wp_send_json_error([
                'message' => 'Get performance stats failed',
                'error' => $e->getMessage()
            ]);
        }
    }
}