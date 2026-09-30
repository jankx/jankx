<?php

namespace App\Providers;

use App\Services\ScrollService;
use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

/**
 * Scroll Engine Service Provider
 *
 * Wires the shared page-scroll engine (Lenis + `window.jankxScroll`) into the
 * theme and exposes it through the container so extensions can do:
 *
 *   jankx()->make('scroll')->isEnabled();
 *
 * @package App\Providers
 */
class ScrollServiceProvider extends ServiceProvider
{
    /**
     * Register the scroll service.
     *
     * @param Application $app
     * @return void
     */
    public function register(Application $app): void
    {
        $app->singleton('scroll', function ($app) {
            return new ScrollService(
                $app->bound('theme-options') ? $app->make('theme-options') : null
            );
        });

        $app->alias('scroll', ScrollService::class);
    }

    /**
     * Boot the service on the frontend.
     *
     * @param Application $app
     * @return void
     */
    public function boot(Application $app): void
    {
        // The editor iframe has its own scroll context; skip it there.
        if (!$this->shouldLoadFrontend()) {
            return;
        }

        add_action('after_setup_theme', function () use ($app) {
            if ($app->bound('scroll')) {
                $app->make('scroll')->init();
            }
        }, 20);
    }

    /**
     * Scroll engine is frontend-only.
     *
     * @return bool
     */
    public function shouldLoadAdmin(): bool
    {
        return false;
    }

    /**
     * @return bool
     */
    public function shouldLoadCli(): bool
    {
        return false;
    }

    /**
     * @return bool
     */
    public function shouldLoadCron(): bool
    {
        return false;
    }

    /**
     * @return bool
     */
    public function shouldLoadRest(): bool
    {
        return false;
    }
}
