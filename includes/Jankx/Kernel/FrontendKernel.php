<?php

namespace Jankx\Kernel;

use Jankx\Contracts\KernelInterface;
use Jankx\Bootstrappers\Frontend\FrontendBootstrapper;
use Jankx\Bootstrappers\Frontend\WooCommerceBootstrapper;
use Jankx\Bootstrappers\Global\ThemeBootstrapper;
use Jankx\Bootstrappers\Gutenberg\GutenbergFrontendBootstrapper;

/**
 * Frontend Kernel
 *
 * Handles frontend-specific features
 *
 * @package Jankx\Kernel
 */
class FrontendKernel extends Kernel implements KernelInterface
{
    /**
     * Get kernel type
     */
    public function getKernelType(): string
    {
        return 'frontend';
    }

    /**
     * Register bootstrappers
     */
    protected function registerBootstrappers(): void
    {
        // Theme bootstrapper (highest priority)
        $this->addBootstrapper(ThemeBootstrapper::class);

        // Debug bootstrapper (when JANKX_DEBUG is enabled)
        if (defined('JANKX_DEBUG') && JANKX_DEBUG) {
            $this->addBootstrapper(\Jankx\Bootstrappers\Global\DebugBootstrapper::class);
        }

        // Gutenberg Frontend bootstrapper (for used blocks only)
        $this->addBootstrapper(GutenbergFrontendBootstrapper::class);

        // Frontend bootstrapper
        $this->addBootstrapper(FrontendBootstrapper::class);

        // WooCommerce bootstrapper (if WooCommerce is active)
        if (class_exists('WooCommerce')) {
            $this->addBootstrapper(WooCommerceBootstrapper::class);
        }

        // Allow child themes to add custom bootstrappers
        $customBootstrappers = apply_filters('jankx/frontend/bootstrappers', []);
        foreach ($customBootstrappers as $bootstrapper) {
            $this->addBootstrapper($bootstrapper);
        }
    }

    /**
     * Register services
     */
    protected function registerServices(): void
    {
        // Register FrontendServiceProvider
        $this->addServiceProvider(\Jankx\Providers\FrontendServiceProvider::class);

        // Register DebugServiceProvider (only in frontend context)
        if (defined('JANKX_DEBUG') && JANKX_DEBUG) {
            $this->addServiceProvider(\Jankx\Providers\DebugServiceProvider::class);
        }

        // Frontend services are now registered through FrontendServiceProvider
        // This method is kept for backward compatibility
        // All services should be registered through Service Providers
    }

    /**
     * Register hooks
     */
    protected function registerHooks(): void
    {
        // Frontend-specific hooks will be registered here
    }

    /**
     * Register filters
     */
    protected function registerFilters(): void
    {
        // Frontend-specific filters will be registered here
    }

    /**
     * Boot the kernel
     */
    public function boot(): void
    {
        parent::boot();
        // Additional boot logic for frontend if needed
    }

    /**
     * Check if kernel is booted
     */
    public function isBooted(): bool
    {
        return parent::isBooted();
    }
}
