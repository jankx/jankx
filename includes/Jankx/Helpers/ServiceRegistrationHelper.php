<?php

namespace Jankx\Helpers;

use Illuminate\Container\Container;

/**
 * Service Registration Helper
 *
 * Manages service registration in a DRY way
 *
 * @package Jankx\Helpers
 * @since 2.0.0
 */
class ServiceRegistrationHelper
{
    /**
     * Register multiple services as singletons
     */
    public static function registerServices(Container $container, array $services): void
    {
        foreach ($services as $service) {
            $container->singleton($service);
        }
    }

    /**
     * Register services with deferred resolver
     */
    public static function registerDeferredServices(Container $container, array $services): void
    {
        // Register deferred resolver if not exists
        if (!$container->bound('deferred.resolver')) {
            $container->singleton('deferred.resolver', \Jankx\Services\DeferredServiceResolver::class);
        }

        // Register services for deferred loading
        foreach ($services as $service) {
            $container->singleton($service);
        }
    }

    /**
     * Register core services
     */
    public static function registerCoreServices(Container $container): void
    {
        $coreServices = [
            \Jankx\Config\ConfigManager::class,
            \Jankx\Logger\Logger::class,
            \Jankx\Security\SecurityManager::class,
            \Jankx\Performance\PerformanceMonitor::class,
        ];

        self::registerServices($container, $coreServices);
    }

    /**
     * Register admin services
     */
    public static function registerAdminServices(Container $container): void
    {
        $adminServices = [
            \Jankx\Admin\MenuManager::class,
            \Jankx\Admin\AssetManager::class,
            \Jankx\Admin\NoticeManager::class,
        ];

        self::registerServices($container, $adminServices);
    }

    /**
     * Register frontend services
     */
    public static function registerFrontendServices(Container $container): void
    {
        $frontendServices = [
            \Jankx\Frontend\AssetManager::class,
            \Jankx\Frontend\TemplateManager::class,
            \Jankx\Frontend\ContentManager::class,
        ];

        self::registerServices($container, $frontendServices);
    }

    /**
     * Register Gutenberg services
     */
    public static function registerGutenbergServices(Container $container): void
    {
        $gutenbergServices = [
            \Jankx\Gutenberg\BlockRegistry::class,
            \Jankx\Gutenberg\LayoutRegistry::class,
            \Jankx\Gutenberg\AjaxHandler::class,
            \Jankx\Gutenberg\BlockRenderer::class,
        ];

        self::registerServices($container, $gutenbergServices);
    }

    /**
     * Register API services
     */
    public static function registerAPIServices(Container $container): void
    {
        $apiServices = [
            \Jankx\API\APIManager::class,
            \Jankx\API\EndpointManager::class,
            \Jankx\API\AuthenticationManager::class,
            \Jankx\API\ResponseFormatter::class,
        ];

        self::registerServices($container, $apiServices);
    }

    /**
     * Register WooCommerce services
     */
    public static function registerWooCommerceServices(Container $container): void
    {
        $woocommerceServices = [
            \Jankx\WooCommerce\WooCommerceManager::class,
            \Jankx\WooCommerce\ProductManager::class,
            \Jankx\WooCommerce\CartManager::class,
        ];

        self::registerServices($container, $woocommerceServices);
    }

    /**
     * Register debug services
     */
    public static function registerDebugServices(Container $container): void
    {
        $debugServices = [
            \Jankx\Debug\Services\DebugInfoService::class,
            \Jankx\Debug\Services\QueryCountService::class,
            \Jankx\Debug\Services\CacheInfoService::class,
            \Jankx\Debug\Services\GutenbergBlocksService::class,
            \Jankx\Debug\Services\PluginDebugService::class,
            \Jankx\Debug\Renderers\DebugInfoRenderer::class,
        ];

        self::registerServices($container, $debugServices);

        // Register main debug info service
        $container->singleton(\Jankx\Debug\DebugInfo::class, function($container) {
            return new \Jankx\Debug\DebugInfo(
                $container->make(\Jankx\Debug\Services\DebugInfoService::class),
                $container->make(\Jankx\Debug\Services\QueryCountService::class),
                $container->make(\Jankx\Debug\Services\CacheInfoService::class),
                $container->make(\Jankx\Debug\Services\GutenbergBlocksService::class),
                $container->make(\Jankx\Debug\Services\PluginDebugService::class),
                $container->make(\Jankx\Debug\Renderers\DebugInfoRenderer::class)
            );
        });
    }
}