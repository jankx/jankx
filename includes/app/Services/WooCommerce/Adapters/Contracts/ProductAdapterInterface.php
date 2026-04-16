<?php

namespace App\Services\WooCommerce\Adapters\Contracts;

/**
 * Interface for product adapters
 *
 * Adapter Pattern: Normalize different product object types to common interface
 */
interface ProductAdapterInterface
{
    /**
     * Get product ID
     *
     * @return int|null
     */
    public function getId(): ?int;

    /**
     * Check if product is on sale
     *
     * @return bool
     */
    public function isOnSale(): bool;

    /**
     * Get regular price
     *
     * @return float
     */
    public function getRegularPrice(): float;

    /**
     * Get sale price
     *
     * @return float
     */
    public function getSalePrice(): float;

    /**
     * Check if this adapter supports the given product
     *
     * @param mixed $product
     * @return bool
     */
    public static function supports($product): bool;
}
