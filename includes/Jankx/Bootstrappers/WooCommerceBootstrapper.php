<?php

namespace Jankx\Bootstrappers;

use Illuminate\Container\Container;
use Jankx\Contracts\BootstrapperInterface;

/**
 * WooCommerce Bootstrapper
 *
 * Bootstrap WooCommerce-specific features
 *
 * @package Jankx\Bootstrappers
 */
class WooCommerceBootstrapper implements BootstrapperInterface
{
    /**
     * @var int
     */
    protected $priority = 40;

    /**
     * @var array
     */
    protected $dependencies = [];

    /**
     * Get bootstrapper name
     */
    public function getName(): string
    {
        return 'woocommerce';
    }

    /**
     * Get bootstrapper priority
     */
    public function getPriority(): int
    {
        return $this->priority;
    }

    /**
     * Check if bootstrapper should run
     */
    public function shouldRun(): bool
    {
        return class_exists('WooCommerce');
    }

    /**
     * Get bootstrapper dependencies
     */
    public function getDependencies(): array
    {
        return $this->dependencies;
    }

    /**
     * Bootstrap the application
     */
    public function bootstrap(Container $container): void
    {
        // Register WooCommerce-specific services or hooks here
        add_action('after_setup_theme', [$this, 'setupWooCommerceSupport']);
        add_action('init', [$this, 'initializeWooCommerceFeatures']);

        do_action('jankx/bootstrapper/woocommerce/loaded', $container);
    }

    /**
     * Setup WooCommerce support
     */
    public function setupWooCommerceSupport(): void
    {
        // Add theme support for WooCommerce
        add_theme_support('woocommerce');
        add_theme_support('wc-product-gallery-zoom');
        add_theme_support('wc-product-gallery-lightbox');
        add_theme_support('wc-product-gallery-slider');
    }

    /**
     * Initialize WooCommerce features
     */
    public function initializeWooCommerceFeatures(): void
    {
        // Add WooCommerce-specific initialization logic here
    }
}
