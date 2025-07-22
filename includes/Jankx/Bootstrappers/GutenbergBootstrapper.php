<?php

namespace Jankx\Bootstrappers;

use Illuminate\Container\Container;
use Jankx\Gutenberg\BlockRegistry;
use Jankx\Facades\Logger;

/**
 * Gutenberg Bootstrapper
 *
 * Handles Gutenberg block registration and editor integration
 *
 * @package Jankx\Bootstrappers
 */
class GutenbergBootstrapper extends AbstractBootstrapper
{
    protected $priority = 10;

    public function getName(): string
    {
        return 'gutenberg';
    }

    public function shouldRun(): bool
    {
        return function_exists('register_block_type') && is_admin();
    }

    public function bootstrap(Container $container): void
    {
        // Initialize Gutenberg Block Registry
        BlockRegistry::boot();

        // Register block categories - Use only block_categories_all for WordPress 5.8+
        if (function_exists('block_categories_all')) {
            // WordPress 5.8+
            add_filter('block_categories_all', [$this, 'registerBlockCategories']);
        }
        // Note: Removed deprecated block_categories hook for older versions

        // Register block patterns
        add_action('init', [$this, 'registerBlockPatterns']);

        // Register block styles
        add_action('init', [$this, 'registerBlockStyles']);

        // Register block variations (WordPress 5.8+)
        if (function_exists('register_block_variation')) {
            add_action('init', [$this, 'registerBlockVariations']);
        }

        Logger::debug('Gutenberg Bootstrapper initialized', [
            'blocks_registered' => count(BlockRegistry::getBlocks()),
            'context' => 'admin'
        ]);

        // Debug logging
        Logger::debug('Jankx Gutenberg: GutenbergBootstrapper initialized');
        Logger::debug('Jankx Gutenberg: Blocks registered', [
            'count' => count(BlockRegistry::getBlocks()),
            'blocks' => array_keys(BlockRegistry::getBlocks())
        ]);
    }

    /**
     * Register block categories
     */
    public function registerBlockCategories($categories)
    {
        return array_merge($categories, [
            [
                'slug' => 'jankx-blocks',
                'title' => __('Jankx Blocks', 'jankx'),
                'icon' => 'admin-customizer'
            ],
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
        // Check if register_block_pattern function exists (WordPress 5.5+)
        if (!function_exists('register_block_pattern')) {
            return;
        }

        // Register testimonial pattern
        register_block_pattern(
            'jankx/testimonial-pattern',
            [
                'title' => __('Testimonial Pattern', 'jankx'),
                'description' => __('A testimonial section with quote and author', 'jankx'),
                'categories' => ['jankx-components'],
                'content' => '<!-- wp:jankx/testimonial {"content":"Amazing service and support!","author":"John Doe","position":"CEO","company":"Example Corp","rating":5,"style":"default","alignment":"center"} -->'
            ]
        );

        // Register hero section pattern
        register_block_pattern(
            'jankx/hero-section-pattern',
            [
                'title' => __('Hero Section Pattern', 'jankx'),
                'description' => __('A prominent hero section with title, description, and call-to-action', 'jankx'),
                'categories' => ['jankx-sections'],
                'content' => '<!-- wp:jankx/hero-section {"title":"Welcome to Our Site","description":"Discover amazing features and services","alignment":"center"} -->'
            ]
        );

        // Register feature grid pattern
        register_block_pattern(
            'jankx/feature-grid-pattern',
            [
                'title' => __('Feature Grid Pattern', 'jankx'),
                'description' => __('A grid of feature items with icons and descriptions', 'jankx'),
                'categories' => ['jankx-sections'],
                'content' => '<!-- wp:jankx/feature-grid {"title":"Our Features","description":"Discover what makes us special","columns":3} -->'
            ]
        );
    }

    /**
     * Register block styles
     */
    public function registerBlockStyles()
    {
        // Check if register_block_style function exists (WordPress 5.3+)
        if (!function_exists('register_block_style')) {
            return;
        }

        // Register testimonial styles
        register_block_style('jankx/testimonial', [
            'name' => 'card',
            'label' => __('Card', 'jankx')
        ]);

        register_block_style('jankx/testimonial', [
            'name' => 'minimal',
            'label' => __('Minimal', 'jankx')
        ]);

        register_block_style('jankx/testimonial', [
            'name' => 'modern',
            'label' => __('Modern', 'jankx')
        ]);

        // Register hero section styles
        register_block_style('jankx/hero-section', [
            'name' => 'centered',
            'label' => __('Centered', 'jankx')
        ]);

        register_block_style('jankx/hero-section', [
            'name' => 'left-aligned',
            'label' => __('Left Aligned', 'jankx')
        ]);
    }

    /**
     * Register block variations (WordPress 5.8+)
     */
    public function registerBlockVariations()
    {
        // Check if register_block_variation function exists
        if (!function_exists('register_block_variation')) {
            return;
        }

        // Register testimonial variations
        register_block_variation('jankx/testimonial', [
            'name' => 'testimonial-simple',
            'title' => __('Simple Testimonial', 'jankx'),
            'description' => __('A simple testimonial with quote and author', 'jankx'),
            'attributes' => [
                'content' => 'Amazing service and support!',
                'author' => 'John Doe',
                'position' => 'CEO',
                'company' => 'Example Corp',
                'rating' => 5,
                'style' => 'default',
                'alignment' => 'center'
            ]
        ]);

        register_block_variation('jankx/testimonial', [
            'name' => 'testimonial-with-avatar',
            'title' => __('Testimonial with Avatar', 'jankx'),
            'description' => __('A testimonial with author avatar', 'jankx'),
            'attributes' => [
                'content' => 'Amazing service and support!',
                'author' => 'John Doe',
                'position' => 'CEO',
                'company' => 'Example Corp',
                'rating' => 5,
                'style' => 'card',
                'alignment' => 'center',
                'showAvatar' => true
            ]
        ]);

        // Register hero section variations
        register_block_variation('jankx/hero-section', [
            'name' => 'hero-simple',
            'title' => __('Simple Hero', 'jankx'),
            'description' => __('A simple hero section with title and description', 'jankx'),
            'attributes' => [
                'title' => 'Welcome to Our Site',
                'description' => 'Discover amazing features',
                'alignment' => 'center'
            ]
        ]);

        register_block_variation('jankx/hero-section', [
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
}