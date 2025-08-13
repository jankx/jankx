<?php

namespace Jankx\Support;

use Jankx\Foundation\Application;
use Jankx\Helper\Environment;

/**
 * Lazy Loader Helper
 *
 * Provides easy access to lazy-loaded services
 */
class LazyLoader
{
    /**
     * Application instance
     */
    private static $app = null;

    /**
     * Lazy services cache
     */
    private static $cache = [];

    /**
     * Set application instance
     *
     * @param Application $app
     * @return void
     */
    public static function setApp(Application $app)
    {
        self::$app = $app;
    }

    /**
     * Get a lazy service
     *
     * @param string $service
     * @return mixed
     */
    public static function service($service)
    {
        // Check cache first
        if (isset(self::$cache[$service])) {
            return self::$cache[$service];
        }

        // Load service if not cached
        if (self::$app && self::$app->isLazyService($service)) {
            $instance = self::$app->loadLazyService($service);
            self::$cache[$service] = $instance;
            return $instance;
        }

        // Fallback to regular service
        if (self::$app) {
            $instance = self::$app->make($service);
            self::$cache[$service] = $instance;
            return $instance;
        }

        throw new \Exception("Application not set or service '{$service}' not found");
    }

    /**
     * Check if a service is lazy loaded
     *
     * @param string $service
     * @return bool
     */
    public static function isLazy($service)
    {
        return self::$app && self::$app->isLazyService($service);
    }

    /**
     * Clear service cache
     *
     * @return void
     */
    public static function clearCache()
    {
        self::$cache = [];
    }

    /**
     * Get cached services
     *
     * @return array
     */
    public static function getCachedServices()
    {
        return array_keys(self::$cache);
    }

    /**
     * Performance monitoring
     *
     * @param string $service
     * @return void
     */
    public static function monitor($service)
    {
        if (Environment::isDebugLog()) {
            $start = microtime(true);
            $instance = self::service($service);
            $end = microtime(true);
            $time = ($end - $start) * 1000; // Convert to milliseconds

                            '[JANKX LAZY LOAD] Service "%s" loaded in %.2f ms',
                $service,
                $time
            ));
        }
    }
}
