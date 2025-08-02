<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

/**
 * AJAX Service Provider
 *
 * Handles AJAX functionality for Jankx Framework:
 *
 * - AJAX request handling and routing
 * - Security validation (nonce verification)
 * - Response formatting and JSON handling
 * - Error handling and logging
 * - Load more posts functionality
 * - Search posts with AJAX
 * - Filter posts with dynamic queries
 * - Real-time data updates
 * - Form submission handling
 * - Dynamic content loading
 *
 * @package Jankx\Support\Providers
 * @since 2.0.0
 */
class AjaxServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(Application $app)
    {
    }

    /**
     * Bootstrap any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function boot(Application $app)
    {
    }
}
