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
        // Debug services are now registered through DebugServiceProvider
        // This method is kept for backward compatibility

        if (defined('JANKX_DEBUG') && JANKX_DEBUG) {
            $debugProvider = new \Jankx\Providers\DebugServiceProvider($container);
            $debugProvider->register();
            $debugProvider->boot();
        }
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
        switch ($context) {
            case 'frontend':
                $provider = new \Jankx\Providers\FrontendServiceProvider($container);
                break;
            case 'admin':
                $provider = new \Jankx\Providers\AdminServiceProvider($container);
                break;
            case 'cli':
                $provider = new \Jankx\Providers\CLIServiceProvider($container);
                break;
            case 'api':
                $provider = new \Jankx\Providers\APIServiceProvider($container);
                break;
            default:
                return;
        }

        $provider->register();
        $provider->boot();
    }
}