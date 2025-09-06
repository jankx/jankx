<?php

namespace Jankx\Framework\Providers;

use Jankx\Foundation\PageRenderer;
use Jankx\Framework\ServiceProvider;

class PageRendererServiceProvider extends ServiceProvider
{
    /**
     * Register services into the container.
     *
     * @return void
     */
    public function register()
    {
        // Register PageRenderer as singleton
        $this->app->singleton('jankx.page.renderer', function ($app) {
            return PageRenderer::getInstance();
        });

        // Register alias for easier access
        $this->app->alias('jankx.page.renderer', PageRenderer::class);
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        // Initialize PageRenderer
        $this->app->make('jankx.page.renderer');
    }
}
