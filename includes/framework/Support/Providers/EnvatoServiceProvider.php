<?php
/**
 * Envato Service Provider for Jankx Theme Framework
 * 
 * Handles theme activation and purchase code verification.
 * 
 * @package Jankx\Support\Providers
 * @since 1.0.0
 */

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Extensions\EnvatoManager;
use Jankx\Support\Providers\ServiceProvider;

class EnvatoServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param \Jankx\Foundation\Application $app
     * @return void
     */
    public function register(Application $app)
    {
        $app->singleton('envato.manager', function ($app) {
            return new EnvatoManager($app);
        });

        // Register alias for easy access
        $app->alias('envato.manager', 'license');
    }

    /**
     * Bootstrap any application services.
     *
     * @param \Jankx\Foundation\Application $app
     * @return void
     */
    public function boot(Application $app)
    {
        // Boot service if needed
    }
}
