<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Services\AssetService;
use Jankx\Facades\Asset;

/**
 * Asset Service Provider
 *
 * Handles asset management for Jankx Framework:
 *
 * - CSS/JS file registration and enqueuing
 * - Theme style.css loading (parent and child themes)
 * - Asset optimization and minification
 * - Conditional asset loading
 * - Asset versioning and cache busting
 * - Editor assets for Gutenberg
 * - Admin assets for dashboard
 * - Frontend assets for public pages
 * - Asset dependencies management
 * - Asset localization and translations
 *
 * @package Jankx\Support\Providers
 * @since 2.0.0
 */
class AssetServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param \Jankx\Foundation\Application $app
     * @return void
     */
    public function register(Application $app)
    {
        $app->singleton('asset', function (Application $app) {
            return new AssetService($app);
        });

        // Register Asset facade
        Asset::setFacadeApplication($app);
    }

    /**
     * Bootstrap any application services.
     *
     * @param \Jankx\Foundation\Application $app
     * @return void
     */
    public function boot(Application $app)
    {
        // Check current kernel context
        $kernel = $app->make('kernel');

        // Only load theme stylesheets for frontend requests
        if ($kernel instanceof \Jankx\Foundation\Http\Kernels\FrontendKernel) {
            add_action('wp_enqueue_scripts', [$this, 'enqueueThemeStylesheets']);
        }
    }

    /**
     * Enqueue theme stylesheets
     *
     * @return void
     */
    public function enqueueThemeStylesheets()
    {
        $asset = $this->app->make('asset');
        $asset->enqueueThemeStylesheets();
    }
}