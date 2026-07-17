<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Services\UserService;
use Jankx\Services\GutenbergService;
use Jankx\Services\SlideoutMenuService;

class HeavyServicesProvider extends ServiceProvider
{
    protected static $provides = [
        'user.service',
        'gutenberg.service',
        'slideout.menu.service'
    ];

    public function register(Application $app)
    {
        $app->singleton('user.service', function ($app) {
            return new UserService($app);
        });

        $app->singleton('gutenberg.service', function ($app) {
            return new GutenbergService($app);
        });

        $app->singleton('slideout.menu.service', function ($app) {
            return new SlideoutMenuService($app);
        });
    }

    public static function provides($service = null)
    {
        if (func_num_args() === 0) {
            return static::$provides;
        }
        return in_array($service, static::$provides);
    }
}
