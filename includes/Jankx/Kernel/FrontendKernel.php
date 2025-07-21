<?php

namespace Jankx\Kernel;

use Jankx\Contracts\KernelInterface;
use Jankx\Bootstrappers\Frontend\FrontendBootstrapper;
use Jankx\Bootstrappers\Global\ThemeBootstrapper;

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

        // Frontend bootstrapper
        $this->addBootstrapper(FrontendBootstrapper::class);

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
        // Frontend-specific services will be registered here
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
