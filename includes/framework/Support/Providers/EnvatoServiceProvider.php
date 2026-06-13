<?php
/**
 * License Service Provider for Jankx Theme Framework
 * 
 * Handles theme activation with self-hosted license verification.
 * 
 * @package Jankx\Support\Providers
 * @since 1.0.0
 */

namespace Jankx\Support\Providers;

use App\Services\ProLicenseService;
use Jankx\Foundation\Application;
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
        $app->singleton('license.manager', function ($app) {
            return new ProLicenseService();
        });

        // Register alias for easy access
        $app->alias('license.manager', 'license');
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
