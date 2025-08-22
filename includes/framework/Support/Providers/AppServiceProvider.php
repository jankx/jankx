<?php

namespace Jankx\Support\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register()
    {
        // Register core services
        $this->app->singleton('url.manager', function ($app) {
            return new \Jankx\Managers\UrlManager();
        });

        $this->app->singleton(\Jankx\Managers\UrlManager::class, function ($app) {
            return $app->make('url.manager');
        });
    }
}
