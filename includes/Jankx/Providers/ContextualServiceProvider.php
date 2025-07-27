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
        ServiceRegistrationHelper::registerCoreServices($this->container);
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