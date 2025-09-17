<?php

namespace App\Providers\WooCommerce;

use App\Services\WooCommerce\SaleBadgeService;
use Jankx\Support\Providers\ServiceProvider;

/**
 * Sale Badge Service Provider
 *
 * Registers sale badge service and hooks into WooCommerce filters
 */
class SaleBadgeServiceProvider extends ServiceProvider
{
    /**
     * Register services
     *
     * @param \Jankx\Foundation\Application $app
     * @return void
     */
    public function register($app)
    {
        // Register sale badge service
        $app->singleton('sale.badge.service', function ($app) {
            return new SaleBadgeService();
        });

        // Alias for easier access
        $app->alias('sale.badge.service', SaleBadgeService::class);
    }

    /**
     * Boot services
     *
     * @param \Jankx\Foundation\Application $app
     * @return void
     */
    public function boot($app)
    {
        // Only hook into WooCommerce if it's active
        if (!class_exists('WooCommerce')) {
            return;
        }

        $this->registerWooCommerceHooks();
    }

    /**
     * Register WooCommerce hooks
     *
     * @return void
     */
    protected function registerWooCommerceHooks()
    {
        $service = $this->app->make('sale.badge.service');

        // Hook into WooCommerce sale badge text filter
        add_filter('woocommerce_sale_flash', [$service, 'filterSaleBadgeText'], 10, 2);

        // Hook into WooCommerce Blocks product grid item HTML
        add_filter('woocommerce_blocks_product_grid_item_html', [$service, 'filterProductGridItemHtml'], 10, 3);

        // Hook into WooCommerce Blocks sale badge text
        add_filter('woocommerce_blocks_product_grid_item_sale_badge', [$service, 'filterSaleBadgeText'], 10, 2);

        // Hook into custom sale badge HTML filter
        add_filter('cheephub_sale_badge_html', [$service, 'filterSaleBadgeHtml'], 10, 2);

        // Hook into custom sale badge text filter
        add_filter('cheephub_sale_badge_text', [$service, 'filterSaleBadgeText'], 10, 2);

        // Hook into WooCommerce Blocks sale badge HTML
        add_filter('woocommerce_blocks_product_grid_item_sale_badge_html', [$service, 'filterWooCommerceBlocksSaleBadgeHtml'], 10, 2);

        // Hook into WooCommerce Blocks sale badge text for product loops
        add_filter('woocommerce_blocks_product_grid_item_sale_badge_text', [$service, 'filterSaleBadgeText'], 10, 2);

        // Hook into WooCommerce Blocks sale badge for all contexts
        add_filter('woocommerce_blocks_product_sale_badge', [$service, 'filterSaleBadgeText'], 10, 2);
    }
}
