<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\LegacyTemplateLoader;
use Jankx\Support\Providers\ServiceProvider;

class LegacyTemplateLoaderServiceProvider extends ServiceProvider
{
    /**
     * Register services into the container.
     *
     * @return void
     */
    public function register(Application $app)
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
    public function boot(Application $app)
    {
        // Initialize LegacyTemplateLoader
        $this->app->make('jankx.legacy.template.loader');
    }
}
