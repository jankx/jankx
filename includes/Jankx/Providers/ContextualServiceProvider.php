<?php

namespace Jankx\Providers;

use Illuminate\Container\Container;
use Jankx\Context\ContextualServiceRegistry;

/**
 * Contextual Service Provider
 *
 * Registers and boots services based on the current context
 * (admin, frontend, cli, api, etc.)
 *
 * @package Jankx\Providers
 */
class ContextualServiceProvider extends ServiceProvider
{
    public function __construct(Container $container)
    {
        parent::__construct($container);
    }

    public function register(): void
    {
        // Register core services
        $this->registerCoreServices();

        // Get current context
        $context = $this->getCurrentContext();

        // Register context-specific services
        $this->registerContextServices($context);

        // Register deferred services
        $this->registerDeferredServices($context);
    }

    public function boot(): void
    {
        // Get current context
        $context = $this->getCurrentContext();

        // Boot context-specific services
        $this->bootContextServices($context);
    }

    /**
     * Get current context
     */
    private function getCurrentContext(): string
    {
        if (is_admin()) {
            return ContextualServiceRegistry::ADMIN;
        } elseif (defined('WP_CLI') && WP_CLI) {
            return ContextualServiceRegistry::CLI;
        } elseif (wp_doing_ajax()) {
            return ContextualServiceRegistry::API;
        } else {
            return ContextualServiceRegistry::FRONTEND;
        }
    }

    /**
     * Register core services
     */
    private function registerCoreServices(): void
    {
        // Core services are now registered through specific Service Providers
        // This method is kept for backward compatibility
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
     * Boot context services
     */
    private function bootContextServices(string $context): void
    {
        switch ($context) {
            case 'admin':
                $this->bootAdminServices();
                break;
            case 'frontend':
                $this->bootFrontendServices();
                break;
            case 'api':
                $this->bootAPIServices();
                break;
            case 'cli':
                $this->bootCLIServices();
                break;
        }
    }

    /**
     * Register deferred services
     */
    private function registerDeferredServices(string $context): void
    {
        // Defer heavy services until actually needed
        \Jankx\Helpers\DeferredServiceHelper::registerDeferredServices($this->container, $context);
    }

    /**
     * Register admin services
     */
    private function registerAdminServices(): void
    {
        // Admin services are now registered through AdminServiceProvider
        $provider = new AdminServiceProvider($this->container);
        $provider->register();
    }

    /**
     * Register frontend services
     */
    private function registerFrontendServices(): void
    {
        // Frontend services are now registered through FrontendServiceProvider
        $provider = new FrontendServiceProvider($this->container);
        $provider->register();
    }

    /**
     * Register API services
     */
    private function registerAPIServices(): void
    {
        // API services are now registered through APIServiceProvider
        $provider = new APIServiceProvider($this->container);
        $provider->register();
    }

    /**
     * Register CLI services
     */
    private function registerCLIServices(): void
    {
        // CLI services are now registered through CLIServiceProvider
        $provider = new CLIServiceProvider($this->container);
        $provider->register();
    }

    /**
     * Boot admin services
     */
    private function bootAdminServices(): void
    {
        // Boot admin services through AdminServiceProvider
        $provider = new AdminServiceProvider($this->container);
        $provider->boot();
    }

    /**
     * Boot frontend services
     */
    private function bootFrontendServices(): void
    {
        // Boot frontend services through FrontendServiceProvider
        $provider = new FrontendServiceProvider($this->container);
        $provider->boot();
    }

    /**
     * Boot API services
     */
    private function bootAPIServices(): void
    {
        // Boot API services through APIServiceProvider
        $provider = new APIServiceProvider($this->container);
        $provider->boot();
    }

    /**
     * Boot CLI services
     */
    private function bootCLIServices(): void
    {
        // Boot CLI services through CLIServiceProvider
        $provider = new CLIServiceProvider($this->container);
        $provider->boot();
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