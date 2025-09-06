<?php

namespace Jankx\Framework\Providers;

use Jankx\Framework\Support\LegacyTemplateLoader;
use Jankx\Framework\ServiceProvider;

class LegacyTemplateLoaderServiceProvider extends ServiceProvider
{
    /**
     * Register services into the container.
     *
     * @return void
     */
    public function register()
    {
        // Register LegacyTemplateLoader as singleton
        $this->app->singleton('jankx.legacy.template.loader', function ($app) {
            return LegacyTemplateLoader::getInstance();
        });

        // Register alias for easier access
        $this->app->alias('jankx.legacy.template.loader', LegacyTemplateLoader::class);
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        // Initialize LegacyTemplateLoader
        $this->app->make('jankx.legacy.template.loader');
    }
}
