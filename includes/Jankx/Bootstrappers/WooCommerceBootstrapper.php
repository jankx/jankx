<?php

namespace Jankx\Bootstrappers;

use Illuminate\Container\Container;

class WooCommerceBootstrapper extends AbstractBootstrapper
{
    protected $priority = 40;

    public function getName(): string
    {
        return 'woocommerce';
    }

    public function shouldRun(): bool
    {
        return class_exists('WooCommerce');
    }

    public function bootstrap(Container $container): void
    {
        add_action('after_setup_theme', [$this, 'setupWooCommerceSupport']);
        add_action('init', [$this, 'initializeWooCommerceFeatures']);
        do_action('jankx/bootstrapper/woocommerce/loaded', $container);
    }

    public function setupWooCommerceSupport(): void
    {
        add_theme_support('woocommerce');
        add_theme_support('wc-product-gallery-zoom');
        add_theme_support('wc-product-gallery-lightbox');
        add_theme_support('wc-product-gallery-slider');
    }

    public function initializeWooCommerceFeatures(): void
    {
        // Add WooCommerce-specific initialization logic here
    }
}
