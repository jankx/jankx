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
        parent::registerBootstrappers();

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
        parent::registerServices();
    }

    /**
     * Register hooks
     */
    protected function registerHooks(): void
    {
        $this->hooks = [
            'wp_loaded' => ['Jankx\Kernel\FrontendKernel', 'loadFrontendServices'],
            'wp_enqueue_scripts' => ['Jankx\Kernel\FrontendKernel', 'enqueueFrontendAssets'],
            'wp_head' => ['Jankx\Kernel\FrontendKernel', 'addHeadMeta'],
        ];
    }

    /**
     * Register filters
     */
    protected function registerFilters(): void
    {
        $this->filters = [
            'jankx_frontend_title' => ['Jankx\Kernel\FrontendKernel', 'filterPageTitle'],
            'jankx_frontend_description' => ['Jankx\Kernel\FrontendKernel', 'filterPageDescription'],
        ];
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
