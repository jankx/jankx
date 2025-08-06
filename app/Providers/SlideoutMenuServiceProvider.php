<?php

namespace App\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;
use App\Services\Layouts\SlideoutMenuLayoutService;

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
    }
}
