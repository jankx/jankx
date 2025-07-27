<?php

namespace Jankx\Helpers;

use Illuminate\Container\Container;
use Jankx\Context\ContextualServiceRegistry;

/**
 * Deferred Service Helper
 * 
 * Manages deferred service registration in a DRY way
 * 
 * @package Jankx\Helpers
 * @since 2.0.1
 */
class DeferredServiceHelper
{
    /**
     * Register admin deferred services
     */
    public static function registerAdminDeferredServices(): void
    {
        ContextualServiceRegistry::defer(ContextualServiceRegistry::ADMIN, function(Container $container) {
            $container->singleton(\Jankx\Admin\AnalyticsManager::class);
            $container->singleton(\Jankx\Admin\ReportManager::class);
            $container->singleton(\Jankx\Admin\DashboardWidgetManager::class);
        });
    }

    /**
     * Register frontend deferred services
     */
    public static function registerFrontendDeferredServices(): void
    {
        ContextualServiceRegistry::defer(ContextualServiceRegistry::FRONTEND, function(Container $container) {
            $container->singleton(\Jankx\SEO\SEOManager::class);
            $container->singleton(\Jankx\Analytics\AnalyticsManager::class);
            $container->singleton(\Jankx\Template\TemplateRenderer::class);
            $container->singleton(\Jankx\Frontend\AssetOptimizer::class);
        });
    }

    /**
     * Register Gutenberg deferred services
     */
    public static function registerGutenbergDeferredServices(): void
    {
        ContextualServiceRegistry::defer(ContextualServiceRegistry::GUTENBERG, function(Container $container) {
            $container->singleton(\Jankx\Gutenberg\BlockRegistry::class);
            $container->singleton(\Jankx\Gutenberg\LayoutRegistry::class);
            $container->singleton(\Jankx\Gutenberg\AjaxHandler::class);
            $container->singleton(\Jankx\Gutenberg\BlockRenderer::class);
        });
    }

    /**
     * Register WooCommerce deferred services
     */
    public static function registerWooCommerceDeferredServices(): void
    {
        ContextualServiceRegistry::defer(ContextualServiceRegistry::WOOCOMMERCE, function(Container $container) {
            $container->singleton(\Jankx\WooCommerce\ProductManager::class);
            $container->singleton(\Jankx\WooCommerce\CartManager::class);
            $container->singleton(\Jankx\WooCommerce\CheckoutManager::class);
        });
    }

    /**
     * Register all deferred services for a context
     */
    public static function registerDeferredServicesForContext(string $context): void
    {
        switch ($context) {
            case ContextualServiceRegistry::ADMIN:
                self::registerAdminDeferredServices();
                break;
            case ContextualServiceRegistry::FRONTEND:
                self::registerFrontendDeferredServices();
                break;
            case ContextualServiceRegistry::GUTENBERG:
                self::registerGutenbergDeferredServices();
                break;
            case ContextualServiceRegistry::WOOCOMMERCE:
                self::registerWooCommerceDeferredServices();
                break;
        }
    }
} 