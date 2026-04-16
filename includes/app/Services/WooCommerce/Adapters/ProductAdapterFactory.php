<?php

namespace App\Services\WooCommerce\Adapters;

use App\Services\WooCommerce\Adapters\Contracts\ProductAdapterInterface;

/**
 * Factory for creating product adapters
 *
 * Factory Pattern: Create appropriate adapter based on product type
 */
class ProductAdapterFactory
{
    /**
     * @var array Registered adapter classes
     */
    private static $adapters = [
        WCProductAdapter::class,
        WPPostAdapter::class,
        ProductIdAdapter::class,
    ];

    /**
     * Create adapter for given product
     *
     * @param mixed $product
     * @return ProductAdapterInterface|null
     */
    public static function create($product): ?ProductAdapterInterface
    {
        foreach (self::$adapters as $adapterClass) {
            if ($adapterClass::supports($product)) {
                return new $adapterClass($product);
            }
        }

        return null;
    }

    /**
     * Register custom adapter
     *
     * @param string $adapterClass
     * @return void
     */
    public static function register(string $adapterClass): void
    {
        if (!in_array($adapterClass, self::$adapters, true)) {
            self::$adapters[] = $adapterClass;
        }
    }

    /**
     * Check if product can be adapted
     *
     * @param mixed $product
     * @return bool
     */
    public static function canAdapt($product): bool
    {
        return self::create($product) !== null;
    }
}
