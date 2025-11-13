<?php

namespace App\Providers\WooCommerce;

use App\Services\WooCommerce\EmptyPriceService;
use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

class EmptyPriceServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(Application $app)
    {
        // Register Empty Price service
        $app->singleton('woocommerce.empty_price.service', function ($app) {
            return new EmptyPriceService($app);
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function boot(Application $app)
    {

        // Only run if WooCommerce is active
        if (!class_exists('WooCommerce')) {
            return;
        }


        $emptyPriceService = $app->make('woocommerce.empty_price.service');

        // Hook into WooCommerce price display to trigger empty price hooks
        add_filter('woocommerce_get_price_html', [$emptyPriceService, 'hookIntoPriceDisplay'], 10, 2);
        add_filter('woocommerce_variable_price_html', [$emptyPriceService, 'hookIntoVariablePriceDisplay'], 10, 2);
        add_filter('woocommerce_grouped_price_html', [$emptyPriceService, 'hookIntoGroupedPriceDisplay'], 10, 2);
        add_filter('woocommerce_external_price_html', [$emptyPriceService, 'hookIntoExternalPriceDisplay'], 10, 2);

        // Hook into custom empty price display hooks
        add_filter('woocommerce_empty_price_html', [$emptyPriceService, 'handleEmptyPrice'], 10, 2);
        add_filter('woocommerce_variable_empty_price_html', [$emptyPriceService, 'handleVariableEmptyPrice'], 10, 2);
        add_filter('woocommerce_grouped_empty_price_html', [$emptyPriceService, 'handleGroupedEmptyPrice'], 10, 2);
        add_filter('woocommerce_external_empty_price_html', [$emptyPriceService, 'handleExternalEmptyPrice'], 10, 2);

        // Hook into WooCommerce blocks
        add_filter('woocommerce_blocks_product_price_html', [$emptyPriceService, 'hookIntoBlocksPriceDisplay'], 10, 2);

        // Alternative hooks for WooCommerce blocks
        add_filter('woocommerce_product_get_price_html', [$emptyPriceService, 'hookIntoPriceDisplay'], 10, 2);
        add_filter('woocommerce_product_variation_get_price_html', [$emptyPriceService, 'hookIntoPriceDisplay'], 10, 2);

        // Filter render content of woocommerce/product-price block specifically
        add_filter('render_block_woocommerce/product-price', [$emptyPriceService, 'filterProductPriceBlock'], 10, 2);
    }
}
