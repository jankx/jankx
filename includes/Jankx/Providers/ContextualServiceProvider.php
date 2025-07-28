<?php

namespace Jankx\Providers;

use Illuminate\Container\Container;
use Jankx\Context\ContextualServiceRegistry;
use Jankx\Helpers\ServiceRegistrationHelper;
use Jankx\Helpers\DeferredServiceHelper;

/**
 * Contextual Service Provider
 *
 * Registers services based on current application context
 *
 * @package Jankx\Providers
 */
class ContextualServiceProvider extends ServiceProvider
{
    public function __construct(Container $container)
    {
        parent::__construct($container);
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
     * Boot the service provider
     */
    public function boot(): void
    {
        // Boot any services that need to be booted after registration
        $context = $this->getCurrentContext();
        $this->bootContextServices($context);
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
        ServiceRegistrationHelper::registerCoreServices($this->container);

        // Register additional core services
        $this->container->singleton(\Jankx\Services\GutenbergBlocksService::class);
        $this->container->singleton(\Jankx\Services\DeferredServiceMonitor::class);
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
     * Boot context-specific services
     */
    private function bootContextServices(string $context): void
    {
        // Boot any services that need to be booted for this context
        switch ($context) {
            case ContextualServiceRegistry::ADMIN:
                $this->bootAdminServices();
                break;
            case ContextualServiceRegistry::FRONTEND:
                $this->bootFrontendServices();
                break;
            case ContextualServiceRegistry::API:
                $this->bootAPIServices();
                break;
            case ContextualServiceRegistry::CLI:
                $this->bootCLIServices();
                break;
            case ContextualServiceRegistry::GUTENBERG:
                $this->bootGutenbergServices();
                break;
            case ContextualServiceRegistry::WOOCOMMERCE:
                $this->bootWooCommerceServices();
                break;
        }
    }

    /**
     * Register deferred services
     */
    private function registerDeferredServices(string $context): void
    {
        // Defer heavy services until actually needed
        DeferredServiceHelper::registerDeferredServicesForContext($context);
    }

    /**
     * Register admin services
     */
    private function registerAdminServices(): void
    {
        ServiceRegistrationHelper::registerAdminServices($this->container);
    }

    /**
     * Register frontend services
     */
    private function registerFrontendServices(): void
    {
        ServiceRegistrationHelper::registerFrontendServices($this->container);
    }

    /**
     * Register API services
     */
    private function registerAPIServices(): void
    {
        ServiceRegistrationHelper::registerAPIServices($this->container);
    }

    /**
     * Register CLI services
     */
    private function registerCLIServices(): void
    {
        // CLI services are minimal for now
        // Will be implemented when needed
        // ServiceRegistrationHelper::registerCLIServices($this->container);
    }

    /**
     * Register Gutenberg services
     */
    private function registerGutenbergServices(): void
    {
        ServiceRegistrationHelper::registerGutenbergServices($this->container);
    }

    /**
     * Register WooCommerce services
     */
    private function registerWooCommerceServices(): void
    {
        ServiceRegistrationHelper::registerWooCommerceServices($this->container);
    }

    /**
     * Boot admin services
     */
    private function bootAdminServices(): void
    {
        // Boot admin-specific services
    }

    /**
     * Boot frontend services
     */
    private function bootFrontendServices(): void
    {
        // Boot frontend-specific services
    }

    /**
     * Boot API services
     */
    private function bootAPIServices(): void
    {
        // Boot API-specific services
    }

    /**
     * Boot CLI services
     */
    private function bootCLIServices(): void
    {
        // Boot CLI-specific services
    }

    /**
     * Boot Gutenberg services
     */
    private function bootGutenbergServices(): void
    {
        // Boot Gutenberg-specific services
    }

    /**
     * Boot WooCommerce services
     */
    private function bootWooCommerceServices(): void
    {
        // Boot WooCommerce-specific services
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