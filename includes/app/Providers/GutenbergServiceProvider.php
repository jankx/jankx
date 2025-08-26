<?php

namespace App\Providers;

use App\Services\GutenbergService;
use Jankx\Foundation\Application;
use Jankx\Support\Providers\GutenbergServiceProvider as FrameworkGutenbergServiceProvider;

class GutenbergServiceProvider extends FrameworkGutenbergServiceProvider
{
    /**
     * Register any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(Application $app)
    {
        // Register Gutenberg service
        $app->singleton('gutenberg.service', function ($app) {

            return new GutenbergService($app);
        });
// Register Gutenberg repository
        $app->singleton('gutenberg.repository', function ($app) {

            return new \Jankx\Gutenberg\GutenbergRepository();
        });
    }
}
