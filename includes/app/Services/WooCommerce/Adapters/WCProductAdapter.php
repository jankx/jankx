<?php

namespace App\Services\WooCommerce\Adapters;

use App\Services\WooCommerce\Adapters\Contracts\ProductAdapterInterface;
use WC_Product;

/**
 * Adapter for WC_Product objects
 */
class WCProductAdapter implements ProductAdapterInterface
{
    /**
     * @var WC_Product
     */
    private $product;

    /**
     * Constructor
     *
     * @param WC_Product $product
     */
    public function __construct(WC_Product $product)
    {
        $this->product = $product;
    }

    /**
     * Get product ID
     *
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->product->get_id();
    }

    /**
     * Check if product is on sale
     *
     * @return bool
     */
    public function isOnSale(): bool
    {
        return $this->product->is_on_sale();
    }

    /**
     * Get regular price
     *
     * @return float
     */
    public function getRegularPrice(): float
    {
        $price = $this->product->get_regular_price();
        return $this->parsePrice($price);
    }

    /**
     * Get sale price
     *
     * @return float
     */
    public function getSalePrice(): float
    {
        $price = $this->product->get_sale_price();
        return $this->parsePrice($price);
    }

    /**
     * Check if this adapter supports the given product
     *
     * @param mixed $product
     * @return bool
     */
    public static function supports($product): bool
    {
        return is_object($product) && $product instanceof WC_Product;
    }

    /**
     * Parse price to float
     *
     * @param mixed $price
     * @return float
     */
    private function parsePrice($price): float
    {
        if (is_numeric($price)) {
            return (float) $price;
        }
        return 0.0;
    }
}
