<?php

namespace App\Providers;

use App\Services\SidebarTransitionsService;
use Jankx\Support\Providers\ServiceProvider;

/**
 * Sidebar Transitions Service Provider
 *
 * Registers and bootstraps the Sidebar Transitions Service
 * which provides all transition effects from tympanus.net
 *
 * @package App\Providers
 * @since 2.0.0
 */
class SidebarTransitionsServiceProvider extends ServiceProvider
{
    /**
     * Register services
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(\Jankx\Foundation\Application $app)
    {
        $this->app->singleton(SidebarTransitionsService::class, function ($app) {
            return new SidebarTransitionsService();
        });
    }

    /**
     * Bootstrap services
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function boot(\Jankx\Foundation\Application $app)
    {
        $sidebarService = $this->app->make(SidebarTransitionsService::class);
        $sidebarService->init($this->app);
    }

    /**
     * Get the services provided by the provider
     *
     * @return array
     */
    public function provides()
    {
        return [
            SidebarTransitionsService::class,
        ];
    }
}
