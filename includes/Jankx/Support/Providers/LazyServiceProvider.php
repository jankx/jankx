<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\LazyLoader;
use Jankx\Support\Providers\ServiceProvider;

/**
 * Lazy Service Provider Example
 *
 * This provider demonstrates how to create lazy-loaded services
 * that are only instantiated when actually needed.
 */
class LazyServiceProvider extends ServiceProvider
{
    /**
     * The services that this provider provides
     *
     * @var array
     */
    protected $provides = [
    ];

    /**
     * Register any application services.
     *
     * @param \Jankx\Foundation\Application $app
     * @return void
     */
    public function register(Application $app)
    {
        LazyLoader::setApp($app);
    }

    /**
     * Bootstrap any application services.
     *
     * @param \Jankx\Foundation\Application $app
     * @return void
     */
    public function boot(Application $app)
    {
        // Boot logic here if needed
    }

    /**
     * Check if this provider provides a specific service
     *
     * @param string $service
     * @return bool
     */
    public static function provides($service)
    {
        return in_array($service, [
        ]);
    }
}
