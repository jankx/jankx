<?php

namespace App\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;
use App\Services\HamburgerExampleService;

/**
 * Hamburger Example Service Provider
 *
 * Demonstrates how to use HamburgerMenuService with multiple instances:
 *
 * - Multiple hamburger menu configurations
 * - Different responsive behaviors
 * - Custom menu locations
 * - Service integration examples
 *
 * @package App\Providers
 * @since 2.0.0
 */
class HamburgerExampleServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(Application $app)
    {
        // Register the hamburger example service
        $app->singleton(HamburgerExampleService::class, function ($app) {
            return new HamburgerExampleService($app);
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
        // Initialize the hamburger example service
        $hamburgerExampleService = $app->make(HamburgerExampleService::class);
        $hamburgerExampleService->initialize();

        // Register additional menu locations for examples
        add_action('after_setup_theme', [$this, 'registerExampleMenuLocations']);
    }

    /**
     * Register example menu locations
     *
     * @return void
     */
    public function registerExampleMenuLocations()
    {
        // Register secondary menu location
        if (!has_nav_menu('secondary')) {
            register_nav_menus([
                'secondary' => __('Secondary Menu', 'jankx'),
            ]);
        }

        // Register floating menu location
        if (!has_nav_menu('floating')) {
            register_nav_menus([
                'floating' => __('Floating Menu', 'jankx'),
            ]);
        }
    }
}
