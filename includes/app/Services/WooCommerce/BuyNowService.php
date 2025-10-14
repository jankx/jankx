<?php

namespace App\Services\WooCommerce;

use Exception;
use Jankx\Facades\Log;

class BuyNowService
{
    /**
     * Initialize the service
     */
    public function init()
    {
        // Hook into WooCommerce after add to cart button
        add_action('woocommerce_after_add_to_cart_button', [$this, 'renderBuyNowButton']);

        // Register AJAX actions directly with WordPress
        add_action('wp_ajax_buy_now', [$this, 'handleBuyNowAjax']);
        add_action('wp_ajax_nopriv_buy_now', [$this, 'handleBuyNowAjax']);

        // Enqueue scripts and styles
        add_action('wp_enqueue_scripts', [$this, 'enqueueAssets']);
    }

    /**
     * Render the Buy Now button
     */
    public function renderBuyNowButton()
    {
        global $product;

        if (!$product) {
            return;
        }

        // Check if product can be purchased
        if (!$product->is_purchasable() || !$product->is_in_stock()) {
            return;
        }

        $button_text = __('MUA NGAY', 'jankx');
        $button_class = 'single_buy_now_button button alt';

        echo sprintf(
            '<button type="button" class="%s" data-product-id="%d" data-action="buy-now">%s%s</button>',
            esc_attr($button_class),
            esc_attr($product->get_id()),
            apply_filters('jankx/product/buynow/text/prefix', ''),
            apply_filters('jankx/product/buynow/text', esc_html($button_text))
        );
    }

    /**
     * Enqueue necessary assets
     */
    public function enqueueAssets()
    {
        if (!is_product()) {
            return;
        }

        wp_enqueue_script(
            'jankx-buy-now',
            get_template_directory_uri() . '/resources/assets/js/buy-now.js',
            ['jquery'],
            '1.0.0',
            true
        );

        wp_localize_script('jankx-buy-now', 'jankxBuyNow', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('jankx_buy_now_nonce'),
            'redirectUrl' => wc_get_checkout_url(),
        ]);

        if (apply_filters('jankx/product/buynow/css/enabled', false)) {
            wp_enqueue_style(
                'jankx-buy-now',
                get_template_directory_uri() . '/resources/assets/css/buy-now.css',
                [],
                '1.0.0'
            );
        }
    }

    /**
     * Handle AJAX buy now request
     */
    public function handleBuyNowAjax()
    {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'jankx_buy_now_nonce')) {
            wp_send_json_error([
                'message' => 'Security check failed',
                'debug' => 'nonce_failed'
            ]);
            return;
        }

        $product_id = intval($_POST['product_id']);
        $quantity = intval($_POST['quantity']);

        if ($quantity <= 0) {
            $quantity = 1;
        }

        // Check if WooCommerce is loaded
        if (!function_exists('WC') || !WC()->cart) {
            wp_send_json_error([
                'message' => 'WooCommerce not available',
                'debug' => 'wc_not_loaded'
            ]);
            return;
        }

        try {
            // Clear cart first
            WC()->cart->empty_cart();
            // Add product to cart
            $cart_item_key = WC()->cart->add_to_cart($product_id, $quantity);

            if ($cart_item_key) {
                $checkout_url = wc_get_checkout_url();
                wp_send_json_success([
                    'redirect_url' => $checkout_url,
                    'debug' => 'success',
                    'cart_item_key' => $cart_item_key
                ]);
            } else {
                wp_send_json_error([
                    'message' => 'Failed to add product to cart',
                    'debug' => 'add_to_cart_failed'
                ]);
            }
        } catch (Exception $e) {
            Log::error($e->getMessage());
            wp_send_json_error([
                'message' => 'An error occurred: ' . $e->getMessage(),
                'debug' => 'exception',
                'exception' => $e->getMessage()
            ]);
        }
    }
}
