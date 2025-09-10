<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Foundation\PageRenderer;
use Jankx\Support\Providers\ServiceProvider;

class PageRendererServiceProvider extends ServiceProvider
{
    /**
     * Register services into the container.
     *
     * @return void
     */
    public function register(Application $app)
    {
        // Register PageRenderer as singleton
        $app->singleton('jankx.page.renderer', function ($app) {
            return PageRenderer::getInstance();
        });

        // Register alias for easier access
        $app->alias('jankx.page.renderer', PageRenderer::class);
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot(Application $app)
    {
        // Initialize PageRenderer
        $this->app->make('jankx.page.renderer');
    }
}
