<?php

namespace Jankx\Support\Providers;

use Jankx\Contracts\ServiceProvider;
use Jankx\Foundation\Application;
use League\Plates\Engine;

/**
 * Plates Service Provider
 *
 * Registers PlatesPHP template engine as a singleton
 */
class PlatesServiceProvider implements ServiceProvider
{
    /**
     * Register the service provider
     */
    public function register(Application $app): void
    {
        // Register Plates Engine as singleton
        $app->singleton('plates.engine', function () {
            $engine = new Engine();

            // Add template directories with child theme override support
            $parentPatternsDir = get_template_directory() . '/resources/patterns';
            $childPatternsDir = get_stylesheet_directory() . '/resources/patterns';

            // Add parent theme patterns directory
            if (is_dir($parentPatternsDir)) {
                $engine->addFolder('patterns', $parentPatternsDir);
            }

            // Add child theme patterns directory (will override parent)
            if (is_dir($childPatternsDir)) {
                $engine->addFolder('patterns-child', $childPatternsDir);
            }

            // Add blocks directory
            $parentBlocksDir = get_template_directory() . '/resources/blocks';
            $childBlocksDir = get_stylesheet_directory() . '/resources/blocks';

            if (is_dir($parentBlocksDir)) {
                $engine->addFolder('blocks', $parentBlocksDir);
            }

            if (is_dir($childBlocksDir)) {
                $engine->addFolder('blocks', $childBlocksDir);
            }

            // Add template functions
            $engine->registerFunction('asset', function ($path) {
                return get_template_directory_uri() . '/assets/' . ltrim($path, '/');
            });

            $engine->registerFunction('image', function ($path, $alt = '') {
                return sprintf(
                    '<img src="%s" alt="%s" />',
                    get_template_directory_uri() . '/assets/images/' . ltrim($path, '/'),
                    esc_attr($alt)
                );
            });

            $engine->registerFunction('icon', function ($name, $class = '') {
                return sprintf('<i class="icon icon-%s %s"></i>', $name, $class);
            });

            return $engine;
        });
    }

    /**
     * Boot the service provider
     */
    public function boot(Application $app): void
    {
        // No boot logic needed
    }
}
