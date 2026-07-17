<?php

namespace Jankx\Support\Providers;

use Jankx\Facades\Log;
use Jankx\Foundation\Application;
use Jankx\Services\ThemeService;
use Jankx\Services\DefaultThumbnailService;
use Jankx\Support\Providers\ServiceProvider;
use Jankx\Support\TemplateEngine\TemplateEngineManager;
use Jankx\Layouts\DynamicDataLayout\DynamicDataLayoutManager;
use Jankx\Layouts\DynamicDataLayout\Supports\DefaultContent;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\ViewLayoutManager;

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
 * - TemplateEngineManager and LatteEngine setup
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

        // Register DefaultThumbnail service
        $this->registerDefaultThumbnailService($app);

        // Register ViewLayoutManager binding for container resolution
        $app->singleton(ViewLayoutManager::class, function () {
            return ViewLayoutManager::getInstance();
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
        // dùng để bật các theme feature của WordPress
        $theme = $app->make('theme');
        add_action('init', [$theme, 'initFeatures']);

        // Initialize template engines
        $this->initializeTemplateEngines($app);

        // Initialize PostLayout services
        $this->initializePostLayoutServices($app);

        // Initialize DefaultThumbnail service
        $this->initializeDefaultThumbnailService($app);
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

        // Register aliases for easy access
        $app->alias(TemplateEngineManager::class, 'template.engine');
        $app->alias(TemplateEngineManager::class, 'template');
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
        // Register PostLayoutManager as singleton
        // Use both names for backward compatibility
        $app->singleton('postlayout.manager', function (Application $app) {
            return DynamicDataLayoutManager::getInstance();
        });
        
        // Also register with dot notation for facade compatibility
        $app->singleton('post.layout.manager', function (Application $app) {
            return DynamicDataLayoutManager::getInstance();
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
        // PostLayoutManager is already initialized as singleton
        // No additional initialization needed
    }

    /**
     * Register DefaultThumbnail service in the container
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    protected function registerDefaultThumbnailService(Application $app)
    {
        // Register DefaultThumbnailService as singleton
        $app->singleton(DefaultThumbnailService::class, function (Application $app) {
            return new DefaultThumbnailService();
        });

        // Register alias for easy access
        $app->alias(DefaultThumbnailService::class, 'thumbnail.default');
    }

    /**
     * Initialize DefaultThumbnail service
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    protected function initializeDefaultThumbnailService(Application $app)
    {
        // Boot the service on 'wp' hook to ensure WordPress is fully loaded
        add_action('wp', function () use ($app) {
            $service = $app->make(DefaultThumbnailService::class);
            if ($service->isEnabled()) {
                $service->boot();
            }
        });
    }
}
