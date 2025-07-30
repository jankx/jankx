<?php

namespace Jankx\Bootstrappers\Gutenberg;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


use Illuminate\Container\Container;
use Jankx\Gutenberg\BlockRegistry;
use Jankx\Facades\Logger;
use Jankx\Bootstrappers\AbstractBootstrapper;

/**
 * Gutenberg Bootstrapper
 *
 * Handles Gutenberg block registration and editor integration
 *
 * @package Jankx\Bootstrappers
 * @since 2.0.0
 */
class GutenbergBootstrapper extends AbstractBootstrapper
{
    protected $priority = 10;

    /**
     * Method getName
     *
     * @since 2.0.0
     */
    public function getName(): string
    {
        return 'gutenberg';
    }

    /**
     * Method shouldRun
     *
     * @since 2.0.0
     */
    public function shouldRun(): bool
    {
        return function_exists('register_block_type') && is_admin();
    }

    /**
     * Method bootstrap
     *
     * @since 2.0.0
     */
    public function bootstrap(Container $container): void
    {
        // Initialize Gutenberg Block Registry
        BlockRegistry::boot();

        // Register block categories
        if (function_exists('block_categories_all')) {
            add_filter('block_categories_all', [$this, 'registerBlockCategories']);
        }

        Logger::debug('Gutenberg Bootstrapper initialized', [
            'blocks_registered' => count(BlockRegistry::getBlocks()),
            'context' => 'admin'
        ]);
    }

    /**
     * Register block categories
     * @since 2.0.0
     */
    public function registerBlockCategories($categories)
    {
        return array_merge($categories, [
            [
                'slug' => 'jankx-blocks',
                'title' => __('Jankx Blocks', 'jankx'),
                'icon' => 'admin-customizer'
            ]
        ]);
    }
}
