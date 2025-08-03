<?php

namespace Jankx\Support\Providers\Layout;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;
use Jankx\Facades\Log;
use Jankx\Helper\Environment;

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
 * @package Jankx\Support\Providers\Layout
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
        // Note: SlideoutMenuService is now registered in HeavyServicesProvider as 'slideout.menu.service'
        // This provider only handles UI rendering and assets
    }

    /**
     * Bootstrap any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function boot(Application $app)
    {
        if (Environment::isDebugLog()) {
            // Debug log removed for release
        }
    }
}
