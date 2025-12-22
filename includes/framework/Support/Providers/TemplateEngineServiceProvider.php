<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

/**
 * Template Engine Service Provider
 *
 * Registers the template engine bindings and aliases for Jankx Framework.
 * Provides proper container bindings for template engine resolution.
 *
 * @package Jankx\Support\Providers
 * @since 2.0.0
 */
class TemplateEngineServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(Application $app)
    {
        // Register template engine.latte alias pointing to latte.engine
        $app->singleton('template.engine.latte', function (Application $app) {
            return $app->make('latte.engine');
        });

        // Register plates alias for backward compatibility
        $app->singleton('template.engine.plates', function (Application $app) {
            return $app->make('latte.engine');
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
        // Template engine is already registered and ready to use
        // No additional boot logic needed
    }
}
