<?php

namespace Jankx\Support\Providers;

use Jankx\Services\GutenbergService;
use Jankx\Foundation\Application;
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
        // Register Gutenberg service
        $app->singleton('gutenberg.service', function ($app) {
            return new GutenbergService($app);
        });

        // Register Gutenberg repository
        $app->singleton('gutenberg.repository', function ($app) {
            return new \Jankx\Gutenberg\GutenbergRepository();
        });

        // Register Block Extra Manager
        $app->singleton('gutenberg.extra_manager', function ($app) {
            return new \Jankx\Gutenberg\Extra\BlockExtraManager($app);
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

        // Register blocks path
        $app->bind('blocks.path', function ($app) {
            return get_template_directory() . '/resources/blocks';
        });

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
        $app = Application::getInstance();
        if ($app && $app->bound('gutenberg.service')) {
            $app->make('gutenberg.service')->clearCache();
        }
    }

    /**
     * Register Gutenberg-specific hooks
     */
    protected function registerGutenbergHooks()
    {
        // Initialize Gutenberg service (includes both blocks and patterns)
        add_action(
            'init',
            [$this->app->make('gutenberg.service'), 'registerBlocks'],
            5
        );


        // init blocks
        add_action(
            'init',
            [$this->app->make('gutenberg.service'), 'init']
        );
    }
}
