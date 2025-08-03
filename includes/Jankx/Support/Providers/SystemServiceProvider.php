<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Services\UserService;
use Jankx\Services\CacheService;
use Jankx\Facades\User;
use Jankx\Facades\Cache;
use Jankx\Facades\Log;
use Jankx\Helper\Environment;

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
        if (Environment::isDebugLog()) {
            Log::debug('SystemServiceProvider: Registering core services');
        }

        // Register Cache Service
        $app->singleton('cache', function (Application $app) {
            if (Environment::isDebugLog()) {
                Log::debug('SystemServiceProvider: Creating CacheService instance');
            }
            return new CacheService($app);
        });

        // Register User Service
        $app->singleton('user', function (Application $app) {
            if (Environment::isDebugLog()) {
                Log::debug('SystemServiceProvider: Creating UserService instance');
            }
            return new UserService($app);
        });

        // Register facades
        Cache::setFacadeApplication($app);
        User::setFacadeApplication($app);

        // Register layout facades
        \Jankx\Facades\Menu::setFacadeApplication($app);
        \Jankx\Facades\Sidebar::setFacadeApplication($app);
        \Jankx\Facades\Footer::setFacadeApplication($app);

        if (Environment::isDebugLog()) {
            Log::debug('SystemServiceProvider: Registered Cache, User, and Layout facades');
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
        if (Environment::isDebugLog()) {
            Log::debug('SystemServiceProvider: Booted successfully');
        }

        // Create PHP class aliases from config
        $this->createClassAliases($app);
    }

    /**
     * Create PHP class aliases from app.aliases config
     *
     * @param \Jankx\Foundation\Application $app
     * @return void
     */
    protected function createClassAliases(Application $app)
    {
        $aliases = $app->make('config')->get('app.aliases', []);

        if (empty($aliases)) {
            if (Environment::isDebugLog()) {
                Log::debug('SystemServiceProvider: No aliases found in app.aliases config');
            }
            return;
        }

        foreach ($aliases as $alias => $classes) {
            if (empty($classes) || !is_array($classes)) {
                continue;
            }

            // Get the first class from the list
            $targetClass = reset($classes);
            $className = ucfirst($alias);

            if (Environment::isDebugLog()) {
                Log::debug("SystemServiceProvider: Creating alias '{$className}' => '{$targetClass}'");
            }

            // Create class alias if it doesn't exist
            if (!class_exists($className)) {
                class_alias($targetClass, $className);
            }
        }

        if (Environment::isDebugLog()) {
            Log::debug('SystemServiceProvider: Class aliases created successfully');
        }
    }
}
