<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Swiper\SwiperService;
use Jankx\Support\Providers\ServiceProvider;

class SwiperServiceProvider extends ServiceProvider
{
    /**
     * Register services into the container.
     *
     * @return void
     */
    public function register(Application $app)
    {
        // Register SwiperService as singleton
        $this->app->singleton('jankx.swiper.service', function ($app) {
            return SwiperService::getInstance();
        });

        // Register alias for easier access
        $this->app->alias('jankx.swiper.service', SwiperService::class);
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot(Application $app)
    {
        // Initialize SwiperService
        error_log("SwiperServiceProvider: boot() method called");
        $swiperService = $this->app->make('jankx.swiper.service');
        error_log("SwiperServiceProvider: SwiperService instance created");
        $swiperService->init();
        error_log("SwiperServiceProvider: SwiperService init() called");
    }
}
