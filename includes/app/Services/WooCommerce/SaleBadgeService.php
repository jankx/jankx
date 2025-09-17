<?php

namespace App\Services\WooCommerce;

use Jankx\Log\Log;

/**
 * Sale Badge Service
 *
 * Converts WooCommerce sale badge text to percentage format
 * Example: "Khuyến mại" => "-38%"
 */
class SaleBadgeService
{
    /**
     * Convert sale badge text to percentage
     *
     * @param string $badgeText Original badge text
     * @param int $productId Product ID
     * @return string Converted badge text with percentage
     */
    public function convertToPercentage($badgeText, $productId = null)
    {
        // If already contains percentage, return as is
        if (strpos($badgeText, '%') !== false) {
            return $badgeText;
        }

        // Get discount percentage for the product
        $percentage = $this->getDiscountPercentage($productId);

        if ($percentage > 0) {
            return "-{$percentage}%";
        }

        // Fallback to original text if no percentage found
        return $badgeText;
    }

    /**
     * Get discount percentage for a product
     *
     * @param int $productId Product ID
     * @return int Discount percentage (0-100)
     */
    protected function getDiscountPercentage($productId)
    {
        if (!$productId) {
            return 0;
        }

        $product = wc_get_product($productId);

        if (!$product || !$product->is_on_sale()) {
            return 0;
        }

        $regular_price = $product->get_regular_price();
        $sale_price = $product->get_sale_price();

        if (!$regular_price || !$sale_price || $regular_price <= 0) {
            return 0;
        }

        // Calculate percentage
        $discount = (($regular_price - $sale_price) / $regular_price) * 100;

        return round($discount);
    }

    /**
     * Hook into WooCommerce sale badge filter
     *
     * @param string $badgeText Original badge text
     * @param mixed $product Product object (WP_Post or WC_Product)
     * @return string Modified badge text
     */
    public function filterSaleBadgeText($badgeText, $product = null)
    {
        $productId = null;

        if ($product) {
            // Handle different product object types
            if (is_object($product)) {
                if (method_exists($product, 'get_id')) {
                    // WC_Product object
                    $productId = $product->get_id();
                } elseif (isset($product->ID)) {
                    // WP_Post object
                    $productId = $product->ID;
                }
            } elseif (is_numeric($product)) {
                // Product ID passed directly
                $productId = $product;
            }
        }

        return $this->convertToPercentage($badgeText, $productId);
    }

    /**
     * Filter WooCommerce Blocks product grid item HTML
     *
     * @param string $html Original HTML
     * @param mixed $product Product object or data
     * @param mixed $context Context or WC_Product object
     * @return string Modified HTML
     */
    public function filterProductGridItemHtml($html, $product, $context)
    {
        // The actual WC_Product object is in the $context parameter
        $wcProduct = $context;

        if (!$wcProduct || !is_object($wcProduct) || !method_exists($wcProduct, 'is_on_sale')) {
            return $html;
        }

        if (!$wcProduct->is_on_sale()) {
            return $html;
        }

        $productId = $wcProduct->get_id();
        $percentage = $this->getDiscountPercentage($productId);

        if ($percentage > 0) {
            // Replace "Khuyến mại" with percentage in the HTML
            $html = str_replace(
                'Khuyến mại',
                "-{$percentage}%",
                $html
            );
        }

        return $html;
    }

    /**
     * Filter WooCommerce Blocks sale badge HTML
     *
     * @param string $badgeHtml Original badge HTML
     * @param mixed $product Product object
     * @return string Modified badge HTML
     */
    public function filterWooCommerceBlocksSaleBadgeHtml($badgeHtml, $product = null)
    {
        if (!$badgeHtml || strpos($badgeHtml, 'Khuyến mại') === false) {
            return $badgeHtml;
        }

        $productId = null;

        if ($product) {
            if (is_object($product)) {
                if (method_exists($product, 'get_id')) {
                    $productId = $product->get_id();
                } elseif (isset($product->ID)) {
                    $productId = $product->ID;
                }
            } elseif (is_numeric($product)) {
                $productId = $product;
            }
        }

        $percentage = $this->getDiscountPercentage($productId);

        if ($percentage > 0) {
            // Replace "Khuyến mại" with percentage in the HTML
            $badgeHtml = str_replace(
                'Khuyến mại',
                "-{$percentage}%",
                $badgeHtml
            );
        }

        return $badgeHtml;
    }

    /**
     * Hook into WooCommerce sale badge HTML filter
     *
     * @param string $badgeHtml Original badge HTML
     * @param \WC_Product $product Product object
     * @return string Modified badge HTML
     */
    public function filterSaleBadgeHtml($badgeHtml, $product = null)
    {
        if (!$product) {
            return $badgeHtml;
        }

        $productId = $product->get_id();
        $percentage = $this->getDiscountPercentage($productId);

        if ($percentage > 0) {
            // Replace the badge text with percentage
            $badgeHtml = str_replace(
                'Khuyến mại',
                "-{$percentage}%",
                $badgeHtml
            );
        }

        return $badgeHtml;
    }

    /**
     * Get sale badge text for a specific product
     *
     * @param int $productId Product ID
     * @return string Sale badge text
     */
    public function getSaleBadgeText($productId)
    {
        $product = wc_get_product($productId);

        if (!$product || !$product->is_on_sale()) {
            return '';
        }

        $percentage = $this->getDiscountPercentage($productId);

        if ($percentage > 0) {
            return "-{$percentage}%";
        }

        return __('Khuyến mại', 'cheephub');
    }

    /**
     * Check if product is on sale and has valid discount
     *
     * @param int $productId Product ID
     * @return bool True if product has valid discount
     */
    public function hasValidDiscount($productId)
    {
        $product = wc_get_product($productId);

        if (!$product || !$product->is_on_sale()) {
            return false;
        }

        $percentage = $this->getDiscountPercentage($productId);

        return $percentage > 0;
    }
}
