<?php

namespace Jankx\Providers;

use Illuminate\Container\Container;
use Jankx\Context\ContextualServiceRegistry;

/**
 * Contextual Service Provider
 *
 * Registers services based on current application context
 *
 * @package Jankx\Providers
 */
class ContextualServiceProvider
{
    private $container;

    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    /**
     * Register services based on current context
     */
    public function register(): void
    {
        $context = $this->getCurrentContext();

        // Register core services (always loaded)
        $this->registerCoreServices();

        // Register context-specific services
        $this->registerContextServices($context);

        // Register deferred services
        $this->registerDeferredServices($context);
    }

    /**
     * Get current application context
     */
    private function getCurrentContext(): string
    {
        return ContextualServiceRegistry::getCurrentContext();
    }

    /**
     * Register core services (always loaded)
     */
    private function registerCoreServices(): void
    {
        // Essential services that are always needed
        $this->container->singleton(\Jankx\Config\ConfigManager::class);
        $this->container->singleton(\Jankx\Logger\Logger::class);
        $this->container->singleton(\Jankx\Security\SecurityManager::class);
        $this->container->singleton(\Jankx\Performance\PerformanceMonitor::class);
    }

    /**
     * Register context-specific services
     */
    private function registerContextServices(string $context): void
    {
        switch ($context) {
            case ContextualServiceRegistry::ADMIN:
                $this->registerAdminServices();
                break;
            case ContextualServiceRegistry::FRONTEND:
                $this->registerFrontendServices();
                break;
            case ContextualServiceRegistry::API:
                $this->registerAPIServices();
                break;
            case ContextualServiceRegistry::CLI:
                $this->registerCLIServices();
                break;
            case ContextualServiceRegistry::GUTENBERG:
                $this->registerGutenbergServices();
                break;
            case ContextualServiceRegistry::WOOCOMMERCE:
                $this->registerWooCommerceServices();
                break;
        }
    }

    /**
     * Register deferred services
     */
    private function registerDeferredServices(string $context): void
    {
        // Defer heavy services until actually needed
        ContextualServiceRegistry::defer($context, function(Container $container) use ($context) {
            // Admin-specific deferred services
            if ($context === ContextualServiceRegistry::ADMIN) {
                $container->singleton(\Jankx\Admin\DashboardManager::class);
                $container->singleton(\Jankx\Admin\SettingsManager::class);
                $container->singleton(\Jankx\Admin\NoticeManager::class);
                $container->singleton(\Jankx\Admin\AnalyticsManager::class);
                $container->singleton(\Jankx\Admin\ReportManager::class);
            }

            // Frontend-specific deferred services
            if ($context === ContextualServiceRegistry::FRONTEND) {
                $container->singleton(\Jankx\SEO\SEOManager::class);
                $container->singleton(\Jankx\Analytics\AnalyticsManager::class);
                $container->singleton(\Jankx\Template\TemplateRenderer::class);
                $container->singleton(\Jankx\Frontend\AssetOptimizer::class);
            }

            // Gutenberg-specific deferred services
            if ($context === ContextualServiceRegistry::GUTENBERG) {
                $container->singleton(\Jankx\Gutenberg\BlockRegistry::class);
                $container->singleton(\Jankx\Gutenberg\LayoutRegistry::class);
                $container->singleton(\Jankx\Gutenberg\AjaxHandler::class);
                $container->singleton(\Jankx\Gutenberg\BlockRenderer::class);
            }

            // WooCommerce-specific deferred services
            if ($context === ContextualServiceRegistry::WOOCOMMERCE) {
                $container->singleton(\Jankx\WooCommerce\ProductManager::class);
                $container->singleton(\Jankx\WooCommerce\CartManager::class);
                $container->singleton(\Jankx\WooCommerce\CheckoutManager::class);
            }
        });
    }

    /**
     * Register admin services
     */
    private function registerAdminServices(): void
    {
        $this->container->singleton(\Jankx\Admin\AdminManager::class);
        $this->container->singleton(\Jankx\Admin\MenuManager::class);
        $this->container->singleton(\Jankx\Admin\AssetManager::class);
        $this->container->singleton(\Jankx\Admin\NoticeManager::class);
    }

    /**
     * Register frontend services
     */
    private function registerFrontendServices(): void
    {
        $this->container->singleton(\Jankx\Frontend\AssetManager::class);
        $this->container->singleton(\Jankx\Frontend\TemplateManager::class);
        $this->container->singleton(\Jankx\Frontend\ContentManager::class);
        $this->container->singleton(\Jankx\Frontend\SEO\SEOManager::class);
    }

    /**
     * Register API services
     */
    private function registerAPIServices(): void
    {
        $this->container->singleton(\Jankx\API\APIManager::class);
        $this->container->singleton(\Jankx\API\EndpointManager::class);
        $this->container->singleton(\Jankx\API\AuthenticationManager::class);
        $this->container->singleton(\Jankx\API\ResponseFormatter::class);
    }

    /**
     * Register CLI services
     */
    private function registerCLIServices(): void
    {
        // CLI services are minimal for now
        // Will be implemented when needed
        // $this->container->singleton(\Jankx\CLI\CommandManager::class);
        // $this->container->singleton(\Jankx\CLI\OutputManager::class);
        // $this->container->singleton(\Jankx\CLI\ProgressBar::class);
    }

    /**
     * Register Gutenberg services
     */
    private function registerGutenbergServices(): void
    {
        $this->container->singleton(\Jankx\Gutenberg\EditorManager::class);
        $this->container->singleton(\Jankx\Gutenberg\BlockRenderer::class);
        $this->container->singleton(\Jankx\Gutenberg\LayoutManager::class);
    }

    /**
     * Register WooCommerce services
     */
    private function registerWooCommerceServices(): void
    {
        $this->container->singleton(\Jankx\WooCommerce\WooCommerceManager::class);
        $this->container->singleton(\Jankx\WooCommerce\ProductManager::class);
        $this->container->singleton(\Jankx\WooCommerce\CartManager::class);
    }

    /**
     * Register services for a specific context
     */
    public function registerForContext(string $context): void
    {
        // Load services for the specified context
        ContextualServiceRegistry::loadForContext($this->container, $context);

        // Register context-specific services
        $this->registerContextServices($context);
    }

    /**
     * Get registered services for current context
     */
    public function getRegisteredServices(): array
    {
        $context = $this->getCurrentContext();
        return ContextualServiceRegistry::getServicesForContext($context);
    }

    /**
     * Check if a service is registered for current context
     */
    public function isServiceRegistered(string $serviceClass): bool
    {
        $context = $this->getCurrentContext();
        $services = ContextualServiceRegistry::getServicesForContext($context);

        return in_array($serviceClass, $services);
    }
}