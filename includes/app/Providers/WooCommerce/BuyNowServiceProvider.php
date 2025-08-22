<?php

namespace App\Providers\WooCommerce;

use Jankx\Support\Providers\ServiceProvider;
use Jankx\Foundation\Application;
use App\Services\WooCommerce\BuyNowService;

class BuyNowServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(Application $app)
    {
        // Register the BuyNowService as a singleton
        $app->singleton(BuyNowService::class, function ($app) {
            return new BuyNowService();
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(Application $app)
    {
        // Only load WooCommerce functionality if the plugin is active
        if (!$this->isWooCommerceActive()) {
            return;
        }

        // Get the BuyNowService instance
        $buyNowService = $app->make(BuyNowService::class);

        // Initialize the service (this will register AJAX actions)
        $buyNowService->init();
    }

    /**
     * Check if WooCommerce plugin is active
     */
    protected function isWooCommerceActive(): bool
    {
        return class_exists('WooCommerce') &&
               function_exists('WC') &&
               function_exists('wc_get_page_permalink');
    }
}
