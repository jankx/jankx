<?php

namespace App\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;
use App\Services\Layouts\SlideoutMenuLayoutService;
use App\Services\Layouts\HamburgerMenuService;

/**
 * Slideout Menu Service Provider
 *
 * Handles slideout menu functionality for mobile devices:
 *
 * - Mobile menu rendering
 * - Responsive breakpoints
 * - Animation controls
 * - Touch gestures
 * - Accessibility features
 * - Customizable triggers
 * - Device-specific behavior
 * - Hamburger menu item integration
 *
 * @package App\Providers
 * @since 2.0.0
 */
class SlideoutMenuServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(Application $app)
    {
        // Register the slideout menu layout service
        $app->singleton(SlideoutMenuLayoutService::class, function ($app) {
            return new SlideoutMenuLayoutService();
        });

        // Register the hamburger menu service
        $app->singleton(HamburgerMenuService::class, function ($app) {
            return new HamburgerMenuService($app, [
                'menu_locations' => ['primary', 'mobile'],
                'item_title' => '☰',
                'responsive' => [
                    'mobile' => true,
                    'tablet' => true,
                    'desktop' => false,
                ],
                'position' => 'last',
            ]);
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
        // Initialize the slideout menu service
        $slideoutMenuService = $app->make(SlideoutMenuLayoutService::class);
        $slideoutMenuService->init($app);

        // Initialize the hamburger menu service - service sẽ tự động setup hooks
        $app->make(HamburgerMenuService::class);

        // Add custom menu locations if they don't exist
        add_action('after_setup_theme', [$this, 'registerMenuLocations']);
    }

    /**
     * Register custom menu locations for slideout menu
     *
     * @return void
     */
    public function registerMenuLocations()
    {
        // Register mobile menu location if not already registered
        if (!has_nav_menu('mobile')) {
            register_nav_menus([
                'mobile' => __('Mobile Menu', 'jankx'),
            ]);
        }
    }
}
