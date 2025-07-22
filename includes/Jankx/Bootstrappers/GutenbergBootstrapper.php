<?php

namespace Jankx\Bootstrappers;

use Illuminate\Container\Container;
use Jankx\Gutenberg\LayoutManager;
use Jankx\Gutenberg\LayoutOptions;
use Jankx\Gutenberg\AjaxHandler;
use Jankx\Facades\Logger;

/**
 * Gutenberg Bootstrapper
 *
 * Initializes Gutenberg layout system for Jankx theme.
 * Handles layout registration and management.
 */
class GutenbergBootstrapper extends AbstractBootstrapper
{
    protected $priority = 30;

    public function getName(): string
    {
        return 'gutenberg';
    }

    public function shouldRun(): bool
    {
        // Only run if Gutenberg is available
        return function_exists('register_block_type') &&
               function_exists('wp_enqueue_script') &&
               function_exists('wp_enqueue_style');
    }

    public function bootstrap(Container $container): void
    {
        // Initialize Layout Manager
        $layoutManager = new LayoutManager($container);
        $container->instance('gutenberg.layout_manager', $layoutManager);

        // Initialize Layout Options
        LayoutOptions::init($container);
        $container->instance('gutenberg.layout_options', LayoutOptions::class);

        // Initialize AJAX Handler
        AjaxHandler::init();

        // Initialize the layout system
        $layoutManager->init();

        // Register Gutenberg hooks
        $this->registerGutenbergHooks();

        Logger::debug('Gutenberg Bootstrapper initialized', [
            'layouts_registered' => count($layoutManager->getRegisteredLayouts()),
            'options_registered' => count(LayoutOptions::getOptions()),
            'context' => $this->getCurrentContext()
        ]);
    }

    /**
     * Register Gutenberg hooks
     */
    protected function registerGutenbergHooks()
    {
        // Register block categories
        add_filter('block_categories_all', [$this, 'registerBlockCategories']);

        // Register block patterns
        add_action('init', [$this, 'registerBlockPatterns']);

        // Register block styles
        add_action('init', [$this, 'registerBlockStyles']);

        // Register block variations
        add_action('init', [$this, 'registerBlockVariations']);

        // Add layout options to editor
        add_action('enqueue_block_editor_assets', [$this, 'addLayoutOptions']);

        // Add partial hydration assets
        add_action('wp_enqueue_scripts', [$this, 'addPartialHydrationAssets']);

        // Handle layout AJAX requests
        add_action('wp_ajax_jankx_load_layout', [$this, 'handleLayoutAjaxRequest']);
        add_action('wp_ajax_nopriv_jankx_load_layout', [$this, 'handleLayoutAjaxRequest']);
    }

    /**
     * Register block categories
     */
    public function registerBlockCategories($categories)
    {
        return array_merge($categories, [
            [
                'slug' => 'jankx-layouts',
                'title' => __('Jankx Layouts', 'jankx'),
                'icon' => 'layout'
            ],
            [
                'slug' => 'jankx-sections',
                'title' => __('Jankx Sections', 'jankx'),
                'icon' => 'section'
            ],
            [
                'slug' => 'jankx-components',
                'title' => __('Jankx Components', 'jankx'),
                'icon' => 'component'
            ]
        ]);
    }

    /**
     * Register block patterns
     */
    public function registerBlockPatterns()
    {
        // Register hero section pattern
        register_block_pattern(
            'jankx/hero-section',
            [
                'title' => __('Hero Section', 'jankx'),
                'description' => __('A prominent hero section with title, description, and call-to-action', 'jankx'),
                'categories' => ['jankx-sections'],
                'content' => '<!-- wp:jankx/layout-hero-section {"title":"Welcome to Our Site","description":"Discover amazing features and services","buttonText":"Get Started","buttonUrl":"#","alignment":"center","spacing":"loose"} -->'
            ]
        );

        // Register testimonial pattern
        register_block_pattern(
            'jankx/testimonial',
            [
                'title' => __('Testimonial', 'jankx'),
                'description' => __('A testimonial section with quote and author', 'jankx'),
                'categories' => ['jankx-components'],
                'content' => '<!-- wp:jankx/layout-testimonial {"quote":"Amazing service and support!","author":"John Doe","position":"CEO","company":"Example Corp"} -->'
            ]
        );

        // Register feature grid pattern
        register_block_pattern(
            'jankx/feature-grid',
            [
                'title' => __('Feature Grid', 'jankx'),
                'description' => __('A grid of feature items with icons and descriptions', 'jankx'),
                'categories' => ['jankx-sections'],
                'content' => '<!-- wp:jankx/layout-feature-grid {"title":"Our Features","description":"Discover what makes us special","columns":3} -->'
            ]
        );
    }

    /**
     * Register block styles
     */
    public function registerBlockStyles()
    {
        // Register hero section styles
        register_block_style('jankx/layout-hero-section', [
            'name' => 'centered',
            'label' => __('Centered', 'jankx')
        ]);

        register_block_style('jankx/layout-hero-section', [
            'name' => 'left-aligned',
            'label' => __('Left Aligned', 'jankx')
        ]);

        // Register testimonial styles
        register_block_style('jankx/layout-testimonial', [
            'name' => 'card',
            'label' => __('Card', 'jankx')
        ]);

        register_block_style('jankx/layout-testimonial', [
            'name' => 'quote',
            'label' => __('Quote', 'jankx')
        ]);
    }

    /**
     * Register block variations
     */
    public function registerBlockVariations()
    {
        // Register hero section variations
        register_block_variation('jankx/layout-hero-section', [
            'name' => 'hero-simple',
            'title' => __('Simple Hero', 'jankx'),
            'description' => __('A simple hero section with title and description', 'jankx'),
            'attributes' => [
                'title' => 'Welcome to Our Site',
                'description' => 'Discover amazing features',
                'alignment' => 'center'
            ]
        ]);

        register_block_variation('jankx/layout-hero-section', [
            'name' => 'hero-with-button',
            'title' => __('Hero with Button', 'jankx'),
            'description' => __('A hero section with call-to-action button', 'jankx'),
            'attributes' => [
                'title' => 'Welcome to Our Site',
                'description' => 'Discover amazing features',
                'buttonText' => 'Get Started',
                'buttonUrl' => '#',
                'alignment' => 'center'
            ]
        ]);
    }

    /**
     * Add layout options to editor
     */
    public function addLayoutOptions()
    {
        // Enqueue layout options script
        wp_enqueue_script(
            'jankx-layout-options',
            get_template_directory_uri() . '/assets/js/layout-options.js',
            ['wp-blocks', 'wp-dom-ready', 'wp-edit-post', 'wp-components', 'wp-media-utils'],
            JANKX_VERSION,
            true
        );

        // Get all layouts and their options
        $layouts = \Jankx\Gutenberg\LayoutRegistry::getLayouts();
        $layoutOptions = [];

        foreach ($layouts as $layoutName => $layout) {
            $layoutOptions[$layoutName] = \Jankx\Gutenberg\LayoutOptions::getOptionsForLayout($layoutName);
        }

        // Localize script with layout options data
        wp_localize_script('jankx-layout-options', 'jankxLayoutOptions', [
            'layouts' => $layoutOptions,
            'groups' => \Jankx\Gutenberg\LayoutOptions::getGroups(),
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('jankx_layout_options'),
            'strings' => [
                'layoutOptions' => __('Layout Options', 'jankx'),
                'performance' => __('Performance', 'jankx'),
                'partialHydration' => __('Partial Hydration', 'jankx'),
                'partialHydrationDesc' => __('Load this layout via AJAX when visible', 'jankx'),
                'firstLayoutNote' => __('First layout is always server-rendered', 'jankx')
            ]
        ]);
    }

    /**
     * Add partial hydration assets
     */
    public function addPartialHydrationAssets()
    {
        // Enqueue partial hydration script
        wp_enqueue_script(
            'jankx-partial-hydration',
            get_template_directory_uri() . '/assets/js/partial-hydration.js',
            ['jquery'],
            JANKX_VERSION,
            true
        );

        // Enqueue partial hydration styles
        wp_enqueue_style(
            'jankx-partial-hydration',
            get_template_directory_uri() . '/assets/css/partial-hydration.css',
            [],
            JANKX_VERSION
        );

        // Localize script with partial hydration data
        wp_localize_script('jankx-partial-hydration', 'jankxPartialHydration', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('jankx_partial_hydration'),
            'debug' => defined('WP_DEBUG') && WP_DEBUG,
            'strings' => [
                'loading' => __('Loading...', 'jankx'),
                'error' => __('Error loading layout', 'jankx'),
                'retry' => __('Try Again', 'jankx'),
                'timeout' => __('Request timeout', 'jankx')
            ]
        ]);
    }

    /**
     * Handle layout AJAX request
     */
    public function handleLayoutAjaxRequest()
    {
        // This is handled by AjaxHandler class
        // This method is kept for backward compatibility
        AjaxHandler::loadLayout();
    }

    /**
     * Get current context
     */
    protected function getCurrentContext()
    {
        if (is_admin()) {
            return 'dashboard';
        }

        if (wp_doing_ajax()) {
            return 'ajax';
        }

        if (wp_doing_cron()) {
            return 'cron';
        }

        return 'frontend';
    }
}