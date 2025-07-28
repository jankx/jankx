<?php

namespace Jankx\Helpers;

use Illuminate\Container\Container;

/**
 * Deferred Service Helper
 *
 * Helper class for registering deferred services through Service Providers
 * instead of registering directly to container
 *
 * @package Jankx\Helpers
 */
class DeferredServiceHelper
{
    /**
     * Register deferred services through appropriate Service Providers
     *
     * @param Container $container
     * @param string $context
     * @return void
     */
    public static function registerDeferredServices(Container $container, string $context = 'frontend'): void
    {
        // Register deferred service resolver
        $container->singleton('deferred.resolver', function($container) {
            return new \Jankx\Services\DeferredServiceResolver($container);
        });

        // Register context-specific deferred services through Service Providers
        switch ($context) {
            case 'admin':
                $provider = new \Jankx\Providers\AdminServiceProvider($container);
                break;
            case 'frontend':
                $provider = new \Jankx\Providers\FrontendServiceProvider($container);
                break;
            case 'cli':
                $provider = new \Jankx\Providers\CLIServiceProvider($container);
                break;
            case 'api':
                $provider = new \Jankx\Providers\APIServiceProvider($container);
                break;
            default:
                $provider = new \Jankx\Providers\FrontendServiceProvider($container);
        }

        $provider->register();
        $provider->boot();
    }

    /**
     * Register admin deferred services through AdminServiceProvider
     *
     * @param Container $container
     * @return void
     */
    public static function registerAdminDeferredServices(Container $container): void
    {
        // Admin services are now registered through AdminServiceProvider
        $provider = new \Jankx\Providers\AdminServiceProvider($container);
        $provider->register();
        $provider->boot();
    }

    /**
     * Register frontend deferred services through FrontendServiceProvider
     *
     * @param Container $container
     * @return void
     */
    public static function registerFrontendDeferredServices(Container $container): void
    {
        // Frontend services are now registered through FrontendServiceProvider
        $provider = new \Jankx\Providers\FrontendServiceProvider($container);
        $provider->register();
        $provider->boot();
    }

    /**
     * Register Gutenberg deferred services through appropriate Service Provider
     *
     * @param Container $container
     * @return void
     */
    public static function registerGutenbergDeferredServices(Container $container): void
    {
        // Gutenberg services should be registered through appropriate Service Provider
        // based on context (admin for editor, frontend for rendering)
        $context = is_admin() ? 'admin' : 'frontend';
        self::registerDeferredServices($container, $context);
    }

    /**
     * Register WooCommerce deferred services through appropriate Service Provider
     *
     * @param Container $container
     * @return void
     */
    public static function registerWooCommerceDeferredServices(Container $container): void
    {
        // WooCommerce services should be registered through appropriate Service Provider
        // based on context (admin for management, frontend for display)
        $context = is_admin() ? 'admin' : 'frontend';
        self::registerDeferredServices($container, $context);
    }
}