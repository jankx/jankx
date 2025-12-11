<?php

namespace Jankx\Support\Providers;


use Jankx\Foundation\Application;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(Application $app)
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
