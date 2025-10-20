<?php

namespace Jankx\Support\Providers;

use Jankx\Facades\Log;
use Jankx\Foundation\Application;
use Jankx\Services\ThemeService;
use Jankx\Support\Providers\ServiceProvider;
use Jankx\Support\TemplateEngine\TemplateEngineManager;
use Jankx\Support\TemplateEngine\Engines\PlatesEngine;
use Jankx\PostLayout\Request\PostsFetcher;
use Jankx\PostLayout\PostLayoutManager;
use Jankx\PostLayout\LoopItemContent\DefaultContent;

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
        // Register TemplateEngineManager as singleton
        $app->singleton(TemplateEngineManager::class, function (Application $app) {
            return new TemplateEngineManager($app);
        });

        // Register PlatesEngine as singleton
        $app->singleton(PlatesEngine::class, function (Application $app) {
            return new PlatesEngine($app);
        });

        // Register aliases for easy access
        $app->alias(TemplateEngineManager::class, 'template.engine');
        $app->alias(PlatesEngine::class, 'template.engine.plates');
        $app->alias(TemplateEngineManager::class, 'template');
        $app->alias(PlatesEngine::class, 'template.engine.jankx');
    }

    /**
     * Initialize template engines
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    protected function initializeTemplateEngines(Application $app)
    {
        // Get TemplateEngineManager instance to trigger initialization
        $templateEngineManager = $app->make(TemplateEngineManager::class);

        // Override WordPress template hierarchy
        add_filter('template_include', function ($template) use ($app, $templateEngineManager) {
            return $template;
        }, 999);
    }

    /**
     * Register PostLayout services in the container
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    protected function registerPostLayoutServices(Application $app)
    {
        // Register PostsFetcher as singleton
        $app->singleton(PostsFetcher::class, function (Application $app) {
            return new PostsFetcher();
        });

        // Register PostLayoutManager as singleton
        $app->singleton('postlayout.manager', function (Application $app) {
            // Get template engine
            $templateEngine = $app->make('template.engine.jankx');

            // Create PostLayoutManager instance
            return PostLayoutManager::createInstance($templateEngine);
        });
    }

    /**
     * Initialize PostLayout services
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    protected function initializePostLayoutServices(Application $app)
    {
        // Register loop item layouts
        add_filter('jankx/posts/loop/layouts', function($layouts) {
            $layouts['default'] = DefaultContent::class;
            return $layouts;
        });

        // Initialize PostsFetcher to register AJAX actions
        $postsFetcher = $app->make(PostsFetcher::class);
        $postsFetcher->init();
    }
}
