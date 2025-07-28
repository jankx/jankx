<?php

namespace Jankx\Helpers;

use Illuminate\Container\Container;

/**
 * Bootstrapper Helper
 *
 * Manages bootstrapper patterns in a DRY way
 *
 * @package Jankx\Helpers
 * @since 2.0.0
 */
class BootstrapperHelper
{
    /**
     * Fire bootstrapper loaded action
     */
    public static function fireLoadedAction(string $bootstrapperName, Container $container): void
    {
        do_action("jankx/bootstrapper/{$bootstrapperName}/loaded", $container);
    }

    /**
     * Setup deferred resolver
     */
    public static function setupDeferredResolver(Container $container): void
    {
        if (!$container->bound('deferred.resolver')) {
            $container->singleton('deferred.resolver', \Jankx\Services\DeferredServiceResolver::class);
        }
    }

    /**
     * Register context provider
     */
    public static function registerContextProvider(Container $container): void
    {
        $contextProvider = new \Jankx\Providers\ContextualServiceProvider($container);
        $contextProvider->register();
    }

    /**
     * Get container from global instance
     */
    public static function getGlobalContainer()
    {
        return \Jankx\Jankx::getInstance();
    }

    /**
     * Check if container and resolver are available
     */
    public static function isContainerReady($container): bool
    {
        return $container && $container->bound('deferred.resolver');
    }

    /**
     * Get deferred resolver from container
     */
    public static function getDeferredResolver(Container $container)
    {
        if (!self::isContainerReady($container)) {
            return null;
        }

        return $container->make('deferred.resolver');
    }
}