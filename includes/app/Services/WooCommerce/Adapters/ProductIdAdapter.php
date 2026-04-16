<?php

namespace App\Services\WooCommerce\Adapters;

use App\Services\WooCommerce\Adapters\Contracts\ProductAdapterInterface;
use WC_Product;

/**
 * Adapter for raw product IDs
 */
class ProductIdAdapter implements ProductAdapterInterface
{
    /**
     * @var int
     */
    private $productId;

    /**
     * @var WC_Product|null
     */
    private $wcProduct;

    /**
     * Constructor
     *
     * @param int $productId
     */
    public function __construct(int $productId)
    {
        $this->productId = $productId;
        $this->wcProduct = null;
    }

    /**
     * Get product ID
     *
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->productId;
    }

    /**
     * Get WC_Product instance
     *
     * @return WC_Product|null
     */
    private function getWCProduct(): ?WC_Product
    {
        if ($this->wcProduct === null) {
            $this->wcProduct = wc_get_product($this->productId);
        }
        return $this->wcProduct;
    }

    /**
     * Check if product is on sale
     *
     * @return bool
     */
    public function isOnSale(): bool
    {
        $product = $this->getWCProduct();
        return $product ? $product->is_on_sale() : false;
    }

    /**
     * Get regular price
     *
     * @return float
     */
    public function getRegularPrice(): float
    {
        $product = $this->getWCProduct();
        if (!$product) {
            return 0.0;
        }
        $price = $product->get_regular_price();
        return is_numeric($price) ? (float) $price : 0.0;
    }

    /**
     * Get sale price
     *
     * @return float
     */
    public function getSalePrice(): float
    {
        $product = $this->getWCProduct();
        if (!$product) {
            return 0.0;
        }
        $price = $product->get_sale_price();
        return is_numeric($price) ? (float) $price : 0.0;
    }

    /**
     * Check if this adapter supports the given product
     *
     * @param mixed $product
     * @return bool
     */
    public static function supports($product): bool
    {
        return is_numeric($product) && (int) $product > 0;
    }
}
