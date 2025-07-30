<?php

namespace Jankx\Bootstrappers\Gutenberg;

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
