<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Services\ThemeService;
use Jankx\Support\Providers\ServiceProvider;
use Jankx\Support\TemplateEngine\TemplateEngineManager;
use Jankx\Support\TemplateEngine\Engines\PlatesEngine;
use Jankx\PostLayout\Request\PostsFetcher;

/**
 * Theme Service Provider
 *
 * Handles core theme functionality for Jankx Framework:
 *
 * - Theme support features setup
 * - Menu registration and management
 * - Widget areas and sidebars
 * - Asset enqueuing (CSS/JS)
 * - Theme customizer integration
 * - Image sizes and thumbnails
 * - Theme hooks and filters
 * - Admin assets and scripts
 * - Meta tags and head content
 * - Footer scripts and analytics
 * - Template engine registration and initialization
 * - TemplateEngineManager and PlatesEngine setup
 * - PostLayout PostsFetcher initialization and AJAX actions
 *
 * @package Jankx\Support\Providers
 * @since 2.0.0
 */
class ThemeServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(Application $app)
    {
        $app->singleton('theme', function () {
            return new ThemeService();
        });

        // Register template engines
        $this->registerTemplateEngines($app);

        // Register PostLayout services
        $this->registerPostLayoutServices($app);
    }

    /**
     * Bootstrap any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function boot(Application $app)
    {
        // dùng để bật các theme feature của WordPress
        $theme = $app->make('theme');
        add_action('init', [$theme, 'initFeatures']);

        // Initialize template engines
        $this->initializeTemplateEngines($app);

        // Initialize PostLayout services
        $this->initializePostLayoutServices($app);
    }

    /**
     * Register template engines in the container
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    protected function registerTemplateEngines(Application $app)
    {
        error_log("[ThemeServiceProvider Debug] Registering template engines");

        // Register TemplateEngineManager as singleton
        $app->singleton(TemplateEngineManager::class, function (Application $app) {
            error_log("[ThemeServiceProvider Debug] Creating TemplateEngineManager instance");
            return new TemplateEngineManager($app);
        });

        // Register PlatesEngine as singleton
        $app->singleton(PlatesEngine::class, function (Application $app) {
            error_log("[ThemeServiceProvider Debug] Creating PlatesEngine instance");
            return new PlatesEngine($app);
        });

        // Register aliases for easy access
        $app->alias(TemplateEngineManager::class, 'template.engine');
        $app->alias(PlatesEngine::class, 'template.engine.plates');
        $app->alias(TemplateEngineManager::class, 'template');

        error_log("[ThemeServiceProvider Debug] Template engines registered successfully");
    }

    /**
     * Initialize template engines
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    protected function initializeTemplateEngines(Application $app)
    {
        error_log("[ThemeServiceProvider Debug] Initializing template engines");

        // Get TemplateEngineManager instance to trigger initialization
        $templateEngineManager = $app->make(TemplateEngineManager::class);
        error_log("[ThemeServiceProvider Debug] TemplateEngineManager initialized: " . get_class($templateEngineManager));

        // Override WordPress template hierarchy
        add_filter('template_include', function ($template) use ($app, $templateEngineManager) {
            error_log("[ThemeServiceProvider Debug] WordPress template_include filter triggered");
            return $template;
        }, 999);

        error_log("[ThemeServiceProvider Debug] Template engines initialization completed");
    }

    /**
     * Register PostLayout services in the container
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    protected function registerPostLayoutServices(Application $app)
    {
        error_log("[ThemeServiceProvider Debug] Registering PostLayout services");

        // Register PostsFetcher as singleton
        $app->singleton(PostsFetcher::class, function (Application $app) {
            error_log("[ThemeServiceProvider Debug] Creating PostsFetcher instance");
            return new PostsFetcher();
        });

        error_log("[ThemeServiceProvider Debug] PostLayout services registered successfully");
    }

    /**
     * Initialize PostLayout services
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    protected function initializePostLayoutServices(Application $app)
    {
        error_log("[ThemeServiceProvider Debug] Initializing PostLayout services");

        // Register loop item layouts
        add_filter('jankx/posts/loop/layouts', function($layouts) {
            error_log("[ThemeServiceProvider Debug] Registering loop item layouts");
            $layouts['default'] = \Jankx\PostLayout\LoopItemContent\DefaultContent::class;
            error_log("[ThemeServiceProvider Debug] Registered default layout: " . $layouts['default']);
            return $layouts;
        });

        // Initialize PostsFetcher to register AJAX actions
        $postsFetcher = $app->make(PostsFetcher::class);
        $postsFetcher->init();

        error_log("[ThemeServiceProvider Debug] PostLayout services initialized successfully");
    }
}
