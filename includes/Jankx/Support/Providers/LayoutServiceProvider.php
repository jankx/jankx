<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

/**
 * Layout Service Provider
 *
 * Registers and bootstraps layout managers for Jankx Framework
 *
 * @package Jankx\Support\Providers
 * @since 2.0.0
 */
class LayoutServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(Application $app)
    {
        // Register layout managers
        $app->singleton('layout.menu', \Jankx\Managers\MenuManager::class);
        $app->singleton('layout.sidebar', \Jankx\Managers\SidebarManager::class);
        $app->singleton('layout.footer', \Jankx\Managers\FooterManager::class);
        $app->singleton('layout.layout', \Jankx\Managers\LayoutManager::class);
    }

    /**
     * Bootstrap any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function boot(Application $app)
    {
        // Initialize managers - they will setup their own hooks
        $app->make('layout.menu');
        $app->make('layout.sidebar');
        $app->make('layout.footer');
        $app->make('layout.layout');
    }
}
