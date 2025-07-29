<?php

namespace Jankx\Helpers;

use Illuminate\Container\Container;

/**
 * Service Registration Helper
 *
 * Helper class for registering services through Service Providers
 * instead of registering directly to container
 *
 * @package Jankx\Helpers
 */
class ServiceRegistrationHelper
{
    /**
     * Register core services through Service Providers
     *
     * @param Container $container
     * @return void
     */
    public static function registerCoreServices(Container $container): void
    {
        // Register services through appropriate Service Providers
        // instead of registering directly to container

        // Core services should be registered through:
        // - FrontendServiceProvider for frontend services
        // - AdminServiceProvider for admin services
        // - CLIServiceProvider for CLI services
        // - APIServiceProvider for API services
        // - DebugServiceProvider for debug services

        // This method is kept for backward compatibility
        // All new services should be registered through Service Providers
    }

    /**
     * Register deferred services through Service Providers
     *
     * @param Container $container
     * @return void
     */
    public static function registerDeferredServices(Container $container): void
    {
        // Register deferred service resolver
        $container->singleton('deferred.resolver', function($container) {
            return new \Jankx\Services\DeferredServiceResolver($container);
        });

        // Deferred services should be registered through appropriate Service Providers
        // based on their context (admin, frontend, cli, etc.)
    }

    /**
     * Register debug services through DebugServiceProvider
     *
     * @param Container $container
     * @return void
     */
    public static function registerDebugServices(Container $container): void
    {
        // Debug services are now registered through FrontendServiceProvider
        // This method is kept for backward compatibility
    }

    /**
     * Register context-specific services through appropriate Service Providers
     *
     * @param Container $container
     * @param string $context
     * @return void
     */
    public static function registerContextServices(Container $container, string $context): void
    {
        // All services are now registered through their respective Kernels
        // No need to create new ServiceProvider instances here
        return;
    }
}