<?php

namespace Jankx\Support\Providers;

use Jankx\Services\GutenbergService;
use Jankx\Services\AdvancedGutenbergService;
use Jankx\Foundation\Application;
use Jankx\Facades\Log;
use Jankx\Helper\Environment;

/**
 * Gutenberg Service Provider
 *
 * This service provider handles Gutenberg block registration and management
 * in the Jankx Framework. It initializes the Gutenberg Service and
 * manages block lifecycle.
 *
 * @package Jankx\Support\Providers
 * @since 2.0.0
 */
class GutenbergServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(Application $app)
    {
        // Register blocks path
        $app->bind('blocks.path', function ($app) {
            return get_template_directory() . '/resources/blocks';
        });

        // Register Gutenberg service
        $app->singleton('gutenberg.service', function ($app) {
            return new GutenbergService($app);
        });

        // Register Gutenberg repository
        $app->singleton('gutenberg.repository', function ($app) {
            return new \Jankx\Gutenberg\GutenbergRepository();
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function boot(Application $app)
    {
        // Initialize Gutenberg blocks
        $this->registerGutenbergHooks();
    }



    /**
     * Clear block discovery cache
     *
     * @return void
     */
    public static function clearBlockCache()
    {
        // Clear WordPress cache
        wp_cache_flush_group('jankx_blocks');

        // Clear Gutenberg service cache if available
        if (function_exists('jankx')) {
            $app = jankx();
            if ($app && $app->bound('gutenberg.service')) {
                $app->make('gutenberg.service')->clearCache();
            }
        }
    }

    /**
     * Register Gutenberg-specific hooks
     */
    protected function registerGutenbergHooks()
    {
        // Initialize Gutenberg service (includes both blocks and patterns)
        add_action('init', [$this->app->make('gutenberg.service'), 'init']);
    }
}
