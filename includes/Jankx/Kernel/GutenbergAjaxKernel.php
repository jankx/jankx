<?php

namespace Jankx\Kernel;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


use Jankx\Contracts\KernelInterface;
use Jankx\Bootstrappers\Global\ThemeBootstrapper;
use Jankx\Bootstrappers\Gutenberg\GutenbergAjaxBootstrapper;

/**
 * Gutenberg AJAX Kernel
 *
 * Handles Gutenberg AJAX requests for partial hydration and block data
 *
 * @package Jankx\Kernel
 * @since 2.0.0
 */
class GutenbergAjaxKernel extends Kernel implements KernelInterface
{
    /**
     * Get kernel type
     * @since 2.0.0
     */
    public function getKernelType(): string
    {
        return 'gutenberg-ajax';
    }

    /**
     * Register bootstrappers
     * @since 2.0.0
     */
    protected function registerBootstrappers(): void
    {
        parent::registerBootstrappers();

        // Theme bootstrapper (highest priority)
        $this->addBootstrapper(ThemeBootstrapper::class);

        // Gutenberg AJAX bootstrapper
        $this->addBootstrapper(GutenbergAjaxBootstrapper::class);

        // Allow child themes to add custom bootstrappers
        $customBootstrappers = apply_filters('jankx/gutenberg-ajax/bootstrappers', []);
        foreach ($customBootstrappers as $bootstrapper) {
            $this->addBootstrapper($bootstrapper);
        }
    }

    /**
     * Register services
     * @since 2.0.0
     */
    protected function registerServices(): void
    {
        parent::registerServices();

        // Gutenberg AJAX-specific services will be registered here
    }

    /**
     * Register hooks
     * @since 2.0.0
     */
    protected function registerHooks(): void
    {
        // Gutenberg AJAX-specific hooks will be registered here
    }

    /**
     * Register filters
     * @since 2.0.0
     */
    protected function registerFilters(): void
    {
        // Gutenberg AJAX-specific filters will be registered here
    }

    /**
     * Boot the kernel
     * @since 2.0.0
     */
    public function boot(): void
    {
        parent::boot();
        // Additional boot logic for Gutenberg AJAX if needed
    }

    /**
     * Check if kernel is booted
     * @since 2.0.0
     */
    public function isBooted(): bool
    {
        return parent::isBooted();
    }
}
