<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Services\UserService;
use Jankx\Services\CacheService;
use Jankx\Facades\User;
use Jankx\Facades\Cache;

/**
 * System Service Provider
 *
 * Handles core system services for Jankx Framework:
 *
 * - User Service registration and management
 * - Cache Service registration and management
 * - System facades registration
 * - Global service availability
 * - Core framework services
 *
 * @package Jankx\Support\Providers
 * @since 2.0.0
 */
class SystemServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param \Jankx\Foundation\Application $app
     * @return void
     */
    public function register(Application $app)
    {
        if (\Jankx\Helper\Environment::isDebugLog()) {
            error_log('[JANKX DEBUG] SystemServiceProvider: Registering core services');
        }

        // Register Cache Service
        $app->singleton('cache', function (Application $app) {
            if (\Jankx\Helper\Environment::isDebugLog()) {
                error_log('[JANKX DEBUG] SystemServiceProvider: Creating CacheService instance');
            }
            return new CacheService($app);
        });

        // Register User Service
        $app->singleton('user', function (Application $app) {
            if (\Jankx\Helper\Environment::isDebugLog()) {
                error_log('[JANKX DEBUG] SystemServiceProvider: Creating UserService instance');
            }
            return new UserService($app);
        });

        // Register facades
        Cache::setFacadeApplication($app);
        User::setFacadeApplication($app);

        if (\Jankx\Helper\Environment::isDebugLog()) {
            error_log('[JANKX DEBUG] SystemServiceProvider: Registered Cache and User facades');
        }
    }

    /**
     * Bootstrap any application services.
     *
     * @param \Jankx\Foundation\Application $app
     * @return void
     */
    public function boot(Application $app)
    {
        if (\Jankx\Helper\Environment::isDebugLog()) {
            error_log('[JANKX DEBUG] SystemServiceProvider: Booted successfully');
        }
    }
}
