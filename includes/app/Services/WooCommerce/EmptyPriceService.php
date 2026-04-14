<?php

namespace App\Services\WooCommerce;

use Jankx\Foundation\Application;
use Jankx\Facades\Config;

/**
 * WooCommerce Empty Price Service
 *
 * Handles display of empty price text for products without price
 *
 * @package App\Services\WooCommerce
 * @since 2.0.0
 */
class EmptyPriceService
{
    /**
     * The application instance.
     *
     * @var \Jankx\Foundation\Application
     */
    protected $app;

    /**
     * Create a new empty price service.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    /**
     * Handle empty price for regular products.
     *
     * @param  string  $price
     * @param  \WC_Product  $product
     * @return string
     */
    public function handleEmptyPrice($price, $product)
    {
        return $this->getEmptyPriceHtml($product);
    }

    /**
     * Hook into WooCommerce price display to trigger empty price hooks.
     *
     * @param  string  $price
     * @param  \WC_Product  $product
     * @return string
     */
    public function hookIntoPriceDisplay($price, $product)
    {
        // If price is not empty, return original price
        if (!empty($price)) {
            return $price;
        }

        // Check if product has no price and trigger appropriate hook
        if (!$this->hasPrice($product)) {
            $emptyPrice = apply_filters('woocommerce_empty_price_html', '', $product);
            return !empty($emptyPrice) ? $emptyPrice : $this->getEmptyPriceHtml($product);
        }

        return $price;
    }

    /**
     * Hook into WooCommerce variable price display to trigger empty price hooks.
     *
     * @param  string  $price
     * @param  \WC_Product_Variable  $product
     * @return string
     */
    public function hookIntoVariablePriceDisplay($price, $product)
    {
        // If price is not empty, return original price
        if (!empty($price)) {
            return $price;
        }

        // Check if variable product has no price and trigger appropriate hook
        if (!$this->hasVariablePrice($product)) {
            $emptyPrice = apply_filters('woocommerce_variable_empty_price_html', '', $product);
            return !empty($emptyPrice) ? $emptyPrice : $this->getEmptyPriceHtml($product);
        }

        return $price;
    }

    /**
     * Hook into WooCommerce grouped price display to trigger empty price hooks.
     *
     * @param  string  $price
     * @param  \WC_Product_Grouped  $product
     * @return string
     */
    public function hookIntoGroupedPriceDisplay($price, $product)
    {
        // If price is not empty, return original price
        if (!empty($price)) {
            return $price;
        }

        // Check if grouped product has no price and trigger appropriate hook
        if (!$this->hasGroupedPrice($product)) {
            $emptyPrice = apply_filters('woocommerce_grouped_empty_price_html', '', $product);
            return !empty($emptyPrice) ? $emptyPrice : $this->getEmptyPriceHtml($product);
        }

        return $price;
    }

    /**
     * Hook into WooCommerce external price display to trigger empty price hooks.
     *
     * @param  string  $price
     * @param  \WC_Product_External  $product
     * @return string
     */
    public function hookIntoExternalPriceDisplay($price, $product)
    {
        // If price is not empty, return original price
        if (!empty($price)) {
            return $price;
        }

        // Check if external product has no price and trigger appropriate hook
        if (!$this->hasPrice($product)) {
            $emptyPrice = apply_filters('woocommerce_external_empty_price_html', '', $product);
            return !empty($emptyPrice) ? $emptyPrice : $this->getEmptyPriceHtml($product);
        }

        return $price;
    }

    /**
     * Hook into WooCommerce blocks price display to trigger empty price hooks.
     *
     * @param  string  $price
     * @param  \WC_Product  $product
     * @return string
     */
    public function hookIntoBlocksPriceDisplay($price, $product)
    {
        // If price is not empty, return original price
        if (!empty($price)) {
            return $price;
        }

        // Check if product has no price and trigger appropriate hook
        if (!$this->hasPrice($product)) {
            $emptyPrice = apply_filters('woocommerce_empty_price_html', '', $product);
            return !empty($emptyPrice) ? $emptyPrice : $this->getEmptyPriceHtml($product);
        }

        return $price;
    }

    /**
     * Filter render content of woocommerce/product-price block.
     *
     * @param  string  $block_content
     * @param  array  $block
     * @return string
     */
    public function filterProductPriceBlock($block_content, $block)
    {
        // Check if block content is empty (no price)
        $clean_content = trim(strip_tags($block_content));
        if (empty($clean_content)) {
            // Get product ID from block context or global variables
            $product_id = $this->getProductIdFromBlock($block);

            if ($product_id) {
                $product = wc_get_product($product_id);

                if ($product && !$this->hasPrice($product)) {
                    // Get empty price HTML
                    $emptyPriceHtml = $this->getEmptyPriceHtml($product);
                    // Inject empty price HTML into the block content
                    $block_content = preg_replace(
                        '/<div class="wc-block-components-product-price[^>]*>[\s]*<\/div>/s',
                        '<div class="wc-block-components-product-price wc-block-grid__product-price has-text-align-center has-font-size has-small-font-size has-text-align-center" style="">' . $emptyPriceHtml . '</div>',
                        $block_content
                    );
                }
            }
        }

        return $block_content;
    }

    /**
     * Get product ID from block attributes or context.
     *
     * @param  array  $block
     * @return int|null
     */
    protected function getProductIdFromBlock($block)
    {
        // Try to get from block attributes
        if (isset($block['attrs']['productId'])) {
            return (int) $block['attrs']['productId'];
        }

        // Try to get from block context
        if (isset($block['attrs']['data-wp-context'])) {
            $context = json_decode($block['attrs']['data-wp-context'], true);
            if (isset($context['productId'])) {
                return (int) $context['productId'];
            }
        }

        // Try to get from WooCommerce query loop context (most reliable for product collections)
        if (function_exists('wc_get_loop_prop')) {
            $product_id = wc_get_loop_prop('product_id');
            if ($product_id) {
                return (int) $product_id;
            }
        }

        // Try to get from WooCommerce global product
        global $product;
        if ($product && is_a($product, 'WC_Product')) {
            return $product->get_id();
        }

        // Try to get from global post
        global $post;
        if ($post && $post->post_type === 'product') {
            return $post->ID;
        }

        // Try to get from WooCommerce query object
        if (function_exists('wc_get_loop_prop')) {
            $current_product = wc_get_loop_prop('current_product');
            if ($current_product && is_a($current_product, 'WC_Product')) {
                return $current_product->get_id();
            }
        }

        return null;
    }

    /**
     * Handle empty price for variable products.
     *
     * @param  string  $price
     * @param  \WC_Product_Variable  $product
     * @return string
     */
    public function handleVariableEmptyPrice($price, $product)
    {
        return $this->getEmptyPriceHtml($product);
    }

    /**
     * Handle empty price for grouped products.
     *
     * @param  string  $price
     * @param  \WC_Product_Grouped  $product
     * @return string
     */
    public function handleGroupedEmptyPrice($price, $product)
    {
        return $this->getEmptyPriceHtml($product);
    }

    /**
     * Handle empty price for external products.
     *
     * @param  string  $price
     * @param  \WC_Product_External  $product
     * @return string
     */
    public function handleExternalEmptyPrice($price, $product)
    {
        // If price is not empty, return original price
        if (!empty($price)) {
            return $price;
        }

        // Check if external product has no price
        if (!$this->hasPrice($product)) {
            return $this->getEmptyPriceHtml($product);
        }

        return $price;
    }

    /**
     * Check if product has price.
     *
     * @param  \WC_Product  $product
     * @return bool
     */
    protected function hasPrice($product)
    {
        $price = $product->get_price();
        return !empty($price) && $price > 0;
    }

    /**
     * Check if variable product has price range.
     *
     * @param  \WC_Product_Variable  $product
     * @return bool
     */
    protected function hasVariablePrice($product)
    {
        $min_price = $product->get_variation_price('min');
        $max_price = $product->get_variation_price('max');

        return !empty($min_price) && $min_price > 0;
    }

    /**
     * Check if grouped product has price.
     *
     * @param  \WC_Product_Grouped  $product
     * @return bool
     */
    protected function hasGroupedPrice($product)
    {
        $children = $product->get_children();

        if (empty($children)) {
            return false;
        }

        foreach ($children as $child_id) {
            $child = wc_get_product($child_id);
            if ($child && $this->hasPrice($child)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get empty price HTML.
     *
     * @param  \WC_Product  $product
     * @return string
     */
    protected function getEmptyPriceHtml($product)
    {
        // Get empty price text from theme options or config
        $emptyText = $this->getEmptyPriceText();

        // Create HTML structure
        $html = sprintf(
            '<span class="price empty-price" data-product-id="%d">%s</span>',
            $product->get_id(),
            esc_html($emptyText)
        );

        // Apply filters for customization
        return apply_filters('jankx_woocommerce_empty_price_html', $html, $product, $emptyText);
    }


    /**
     * Get empty price text.
     *
     * @return string
     */
    protected function getEmptyPriceText()
    {
        // Try to get from theme options first
        $themeOptionText = $this->getThemeOptionText();

        if (!empty($themeOptionText)) {
            return $themeOptionText;
        }

        // Fallback to config default
        $text = Config::get('woocommerce.product.price.empty_text', 'Contact');
        // Apply translation only if WordPress is ready (after init action)
        if (did_action('init')) {
            return __($text, 'jankx');
        }
        return $text;
    }

    /**
     * Get empty price text from theme options.
     *
     * @return string
     */
    protected function getThemeOptionText()
    {
        // Try to get from theme options
        if (function_exists('jankx_option')) {
            return jankx_option('woocommerce_empty_price_text', '');
        }

        // Try to get from customizer
        if (function_exists('get_theme_mod')) {
            return get_theme_mod('woocommerce_empty_price_text', '');
        }

        // Try to get from options
        return get_option('jankx_woocommerce_empty_price_text', '');
    }

    /**
     * Get empty price CSS classes.
     *
     * @param  \WC_Product  $product
     * @return array
     */
    protected function getEmptyPriceClasses($product)
    {
        $classes = [
            'price',
            'empty-price',
            'jankx-empty-price'
        ];

        // Add product type class
        $classes[] = 'empty-price-' . $product->get_type();

        // Add product status class
        if ($product->is_on_sale()) {
            $classes[] = 'empty-price-sale';
        }

        if ($product->is_featured()) {
            $classes[] = 'empty-price-featured';
        }

        return apply_filters('jankx_woocommerce_empty_price_classes', $classes, $product);
    }

    /**
     * Get empty price attributes.
     *
     * @param  \WC_Product  $product
     * @return array
     */
    protected function getEmptyPriceAttributes($product)
    {
        $attributes = [
            'data-product-id' => $product->get_id(),
            'data-product-type' => $product->get_type(),
            'data-product-status' => $product->get_status(),
        ];

        return apply_filters('jankx_woocommerce_empty_price_attributes', $attributes, $product);
    }
}
