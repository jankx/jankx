<?php

namespace App\Services\WooCommerce\Adapters;

use App\Services\WooCommerce\Adapters\Contracts\ProductAdapterInterface;
use WC_Product;

/**
 * Adapter for WP_Post objects
 */
class WPPostAdapter implements ProductAdapterInterface
{
    /**
     * @var \WP_Post
     */
    private $post;

    /**
     * @var WC_Product|null
     */
    private $wcProduct;

    /**
     * Constructor
     *
     * @param \WP_Post $post
     */
    public function __construct(\WP_Post $post)
    {
        $this->post = $post;
        $this->wcProduct = null;
    }

    /**
     * Get product ID
     *
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->post->ID;
    }

    /**
     * Get WC_Product instance
     *
     * @return WC_Product|null
     */
    private function getWCProduct(): ?WC_Product
    {
        if ($this->wcProduct === null) {
            $this->wcProduct = wc_get_product($this->post->ID);
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
        return is_object($product) && $product instanceof \WP_Post;
    }
}
