<?php

namespace App\Services\WooCommerce;

use Jankx\Log\Log;
use App\Services\WooCommerce\Adapters\ProductAdapterFactory;
use App\Services\WooCommerce\Adapters\Contracts\ProductAdapterInterface;

/**
 * Sale Badge Service
 *
 * Converts WooCommerce sale badge text to percentage format
 * Example: "Khuyến mại" => "-38%"
 *
 * Refactored to use Adapter Pattern for product type handling
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
     * @param int|object $product Product ID or object
     * @return int Discount percentage (0-100)
     */
    protected function getDiscountPercentage($product)
    {
        $adapter = ProductAdapterFactory::create($product);

        if (!$adapter) {
            return 0;
        }

        return $this->calculateDiscountPercentage($adapter);
    }

    /**
     * Calculate discount percentage from adapter
     *
     * @param ProductAdapterInterface $adapter
     * @return int
     */
    protected function calculateDiscountPercentage(ProductAdapterInterface $adapter): int
    {
        if (!$adapter->isOnSale()) {
            return 0;
        }

        $regularPrice = $adapter->getRegularPrice();
        $salePrice = $adapter->getSalePrice();

        if ($regularPrice <= 0 || $salePrice <= 0) {
            return 0;
        }

        $discount = (($regularPrice - $salePrice) / $regularPrice) * 100;

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
        $adapter = ProductAdapterFactory::create($product);

        if (!$adapter) {
            return $badgeText;
        }

        $percentage = $this->calculateDiscountPercentage($adapter);

        if ($percentage > 0) {
            return "-{$percentage}%";
        }

        return $badgeText;
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
        $adapter = ProductAdapterFactory::create($context);

        if (!$adapter || !$adapter->isOnSale()) {
            return $html;
        }

        $percentage = $this->calculateDiscountPercentage($adapter);

        if ($percentage > 0) {
            // Replace "Sale!" with percentage in the HTML
            $html = str_replace(
                __('Sale!', 'jankx'),
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
        if (!$badgeHtml) {
            return $badgeHtml;
        }

        $adapter = ProductAdapterFactory::create($product);

        if (!$adapter) {
            return $badgeHtml;
        }

        $percentage = $this->calculateDiscountPercentage($adapter);

        if ($percentage > 0) {
            // Replace the sale text with percentage in the HTML
            $badgeHtml = preg_replace(
                '/(>)([^<]*Sale![^<]*)(<)/i',
                "$1-{$percentage}%$3",
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
        $adapter = ProductAdapterFactory::create($product);

        if (!$adapter) {
            return $badgeHtml;
        }

        $percentage = $this->calculateDiscountPercentage($adapter);

        if ($percentage > 0) {
            // Replace the badge text with percentage
            $badgeHtml = preg_replace(
                '/(>)([^<]*Sale![^<]*)(<)/i',
                "$1-{$percentage}%$3",
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
        $adapter = ProductAdapterFactory::create($productId);

        if (!$adapter || !$adapter->isOnSale()) {
            return '';
        }

        $percentage = $this->calculateDiscountPercentage($adapter);

        if ($percentage > 0) {
            return "-{$percentage}%";
        }

        return __('Sale!', 'jankx');
    }

    /**
     * Check if product is on sale and has valid discount
     *
     * @param int $productId Product ID
     * @return bool True if product has valid discount
     */
    public function hasValidDiscount($productId)
    {
        $adapter = ProductAdapterFactory::create($productId);

        if (!$adapter || !$adapter->isOnSale()) {
            return false;
        }

        $percentage = $this->calculateDiscountPercentage($adapter);

        return $percentage > 0;
    }
}
