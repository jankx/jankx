<?php

namespace Jankx\Support\Providers;

use Jankx\Facades\Config;
use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

/**
 * Performance Service Provider
 *
 * Handles performance optimization features for Jankx Framework:
 *
 * - Asset optimization (CSS/JS minification, compression)
 * - Image optimization (WebP support, lazy loading)
 * - Database optimization (cleanup revisions, spam, expired transients)
 * - Cache management (browser caching headers, resource hints)
 * - Performance monitoring (memory usage, metrics logging)
 * - Resource optimization (DNS prefetch, preconnect, defer loading)
 * - HTML optimization (remove unnecessary tags, scripts)
 * - Database query optimization
 * - Memory management and cleanup
 *
 * @package Jankx\Support\Providers
 * @since 2.0.0
 */
class PerformanceServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(Application $app)
    {
        $this->app->singleton('performance', function ($app) {
            return new \Jankx\Services\PerformanceService($app);
        });
        
        $this->app->singleton(\Jankx\Services\PerformanceService::class, function ($app) {
            return $app->make('performance');
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
        // Get the performance service
        $performance = $app->make('performance');
        
        // We only apply heavy frontend optimizations if context is frontend
        // But some features like removing emojis from admin also apply globally
        $kernel = $app->make('kernel');
        
        // Always boot, the service methods will handle is_admin() checks
        $performance->boot();
    }
}
