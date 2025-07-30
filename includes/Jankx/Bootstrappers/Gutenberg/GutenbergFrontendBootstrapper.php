<?php

namespace Jankx\Bootstrappers\Gutenberg;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;
use Jankx\Gutenberg\BlockRegistry;
use Jankx\Facades\Logger;
use Jankx\Services\BlockParserService;

/**
 * Gutenberg Frontend Bootstrapper
 *
 * Handles Gutenberg block loading for frontend with post content parsing
 *
 * @package Jankx\Bootstrappers
 */
class GutenbergFrontendBootstrapper extends AbstractBootstrapper
{
    protected $priority = 15; // Higher priority than FrontendBootstrapper
    protected $container;

    public function getName(): string
    {
        return 'gutenberg-frontend';
    }

    public function shouldRun(): bool
    {
        return !is_admin() && !wp_doing_ajax() && !wp_doing_cron();
    }

    public function bootstrap(Container $container): void
    {
        $this->container = $container;

        Logger::info('GutenbergFrontendBootstrapper is booting');
        // Only parse and register blocks after the_post of the main query
        add_action('the_post', function ($post) use ($container) {
            static $parsed = false;
            if ($parsed) {
                return;
            }
            global $wp_query;
            if (isset($wp_query) && method_exists($wp_query, 'is_main_query') && $wp_query->is_main_query()) {
                $used_blocks = $this->parseUsedBlocks();
                $used_blocks = array_unique($used_blocks);
                $this->registerUsedBlocks($used_blocks);
                $parsed = true;
            }
        });
        // Initialize partial hydration
        $this->initializePartialHydration();
        // Enqueue frontend assets via proper WordPress hooks
        add_action('wp_enqueue_scripts', [$this, 'enqueueFrontendAssets']);
        Logger::debug('Gutenberg Frontend Bootstrapper initialized', [
            'context' => 'frontend'
        ]);
    }

    /**
     * Parse used blocks from content
     */
    protected function parseUsedBlocks(): array
    {
        $content = get_the_content();
        $content .= $this->getWidgetContent();

        // Get BlockParserService from container (using Application facade)
        $blockParserService = \Jankx\Facades\Application::make(\Jankx\Services\BlockParserService::class);
        $blocks = $blockParserService->parseBlocks($content);

        Logger::debug('Parsed blocks array', ['blocks' => $blocks]);
        $used_blocks = $this->extractJankxBlocks($blocks);
        Logger::debug('Extracted Jankx block names', ['used_blocks' => $used_blocks]);
        return array_unique(apply_filters('jankx/frontend/used_blocks', $used_blocks, $content));
    }

    /**
     * Extract Jankx blocks from parsed blocks
     */
    protected function extractJankxBlocks(array $blocks): array
    {
        $jankx_blocks = [];

        foreach ($blocks as $block) {
            if (isset($block['blockName']) && strpos($block['blockName'], 'jankx/') === 0) {
                $jankx_blocks[] = $block['blockName'];
            }

            // Recursively check inner blocks
            if (isset($block['innerBlocks']) && is_array($block['innerBlocks'])) {
                $inner_blocks = $this->extractJankxBlocks($block['innerBlocks']);
                $jankx_blocks = array_merge($jankx_blocks, $inner_blocks);
            }
        }

        return $jankx_blocks;
    }

    /**
     * Get widget content for block parsing
     */
    protected function getWidgetContent(): string
    {
        $widget_content = '';

        // Check active widgets
        $active_widgets = get_option('sidebars_widgets', []);

        foreach ($active_widgets as $sidebar => $widgets) {
            if (is_array($widgets)) {
                foreach ($widgets as $widget) {
                    $widget_data = get_option('widget_' . $widget);
                    if (is_array($widget_data)) {
                        foreach ($widget_data as $instance) {
                            if (isset($instance['content'])) {
                                $widget_content .= $instance['content'];
                            }
                        }
                    }
                }
            }
        }

        return $widget_content;
    }

    /**
     * Register only used blocks
     */
    protected function registerUsedBlocks(array $used_blocks): void
    {
        if (empty($used_blocks)) {
            Logger::debug('No Jankx blocks found in content');
            return;
        }

        // Initialize BlockRegistry
        BlockRegistry::init();

        // Register only used blocks
        foreach ($used_blocks as $block_name) {
            $block_class = BlockRegistry::getBlock($block_name);
            if ($block_class) {
                // Check if register_block_type function exists
                if (!function_exists('register_block_type')) {
                    Logger::error('register_block_type function not available');
                    continue;
                }

                // Register block for frontend rendering
                register_block_type($block_name, [
                    'render_callback' => [$block_class, 'render'],
                    'attributes' => $block_class::getAttributes(),
                ]);

                Logger::debug('Registered frontend block', [
                    'block_name' => $block_name,
                    'class' => $block_class
                ]);
            }
        }

        // Store used blocks for JavaScript
        wp_localize_script('jankx-frontend', 'jankxFrontend', [
            'usedBlocks' => $used_blocks,
            'partialHydration' => $this->getPartialHydrationSettings(),
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('jankx/gutenberg/nonce'),
        ]);
    }

    /**
     * Initialize partial hydration settings
     */
    protected function initializePartialHydration(): void
    {
        // Get partial hydration settings
        $settings = $this->getPartialHydrationSettings();

        // Add partial hydration data to page
        add_action('wp_head', function () use ($settings) {
            echo '<script type="application/json" id="jankx-partial-hydration-settings">';
            echo json_encode($settings);
            echo '</script>';
        });

        // Register AJAX handlers for partial hydration
        if ($settings['enabled']) {
            add_action('wp_ajax_jankx_gutenberg_render_block', [$this, 'handleBlockRender']);
            add_action('wp_ajax_nopriv_jankx_gutenberg_render_block', [$this, 'handleBlockRender']);
        }
    }

    /**
     * Get partial hydration settings
     */
    protected function getPartialHydrationSettings(): array
    {
        $default_settings = [
            'enabled' => true,
            'firstBlockServerRendered' => true,
            'lazyLoadThreshold' => 0.1,
            'retryAttempts' => 3,
            'timeout' => 30000,
        ];

        return apply_filters('jankx/frontend/partial_hydration_settings', $default_settings);
    }

    /**
     * Enqueue frontend assets
     */
    public function enqueueFrontendAssets(): void
    {
        // Only enqueue if blocks are used
        $used_blocks = $this->getUsedBlocks();
        if (empty($used_blocks)) {
            return;
        }

        // Enqueue main frontend script
        wp_enqueue_script(
            'jankx-frontend',
            get_template_directory_uri() . '/assets/js/partial-hydration.js',
            ['jquery'],
            \Jankx\Jankx::getFrameworkVersion(),
            true
        );

        // Enqueue block-specific frontend styles
        wp_enqueue_style(
            'jankx-gutenberg-frontend-style',
            get_template_directory_uri() . '/assets/gutenberg/css/frontend.css',
            [],
            \Jankx\Jankx::getFrameworkVersion()
        );

        // Enqueue partial hydration styles
        wp_enqueue_style(
            'jankx-partial-hydration',
            get_template_directory_uri() . '/assets/css/partial-hydration.css',
            [],
            \Jankx\Jankx::getFrameworkVersion()
        );

        // Enqueue layout themes
        wp_enqueue_style(
            'jankx-layout-themes',
            get_template_directory_uri() . '/assets/css/layout-themes.css',
            [],
            \Jankx\Jankx::getFrameworkVersion()
        );
    }

    /**
     * Handle block rendering for partial hydration
     */
    public function handleBlockRender(): void
    {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'] ?? '', 'jankx/gutenberg/nonce')) {
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
            $block_class = BlockRegistry::getBlock($block_name);

            if (!$block_class) {
                wp_send_json_error(['message' => 'Block not found']);
                return;
            }

            // Render the block
            $rendered_content = $block_class::render($attributes, $content);

            wp_send_json_success([
                'html' => $rendered_content,
                'block_name' => $block_name,
                'attributes' => $attributes,
                'performance' => [
                    'render_time' => microtime(true) - $_SERVER['REQUEST_TIME_FLOAT'],
                    'memory_usage' => memory_get_usage(true)
                ]
            ]);
        } catch (\Exception $e) {
            Logger::error('Frontend block rendering failed', [
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
     * Get block statistics using BlockParserService
     */
    public function getBlockStats(): array
    {
        // Get BlockParserService from container (using Application facade)
        $blockParserService = \Jankx\Facades\Application::make(\Jankx\Services\BlockParserService::class);
        $stats = $blockParserService->getBlockStats();

        return array_merge($stats, [
            'partial_hydration_enabled' => $this->getPartialHydrationSettings()['enabled'],
            'performance' => [
                'memory_usage' => memory_get_usage(true)
            ]
        ]);
    }

    /**
     * Check if block is used in current page
     */
    public function isBlockUsed(string $block_name): bool
    {
        $used_blocks = $this->parseUsedBlocks();
        return in_array($block_name, $used_blocks);
    }

    /**
     * Get all used blocks for current page
     */
    public function getUsedBlocks(): array
    {
        return $this->parseUsedBlocks();
    }
}
