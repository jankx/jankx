<?php

namespace Jankx\Gutenberg\StarRating\Providers;

use Jankx\Gutenberg\StarRating\AbstractStarRatingProvider;

/**
 * WooCommerce Rating Provider
 *
 * Reads the average rating and review count from a WooCommerce product.
 * Only available for the 'product' post type.
 */
class WooCommerceRatingProvider extends AbstractStarRatingProvider
{
    public function getId(): string
    {
        return 'woocommerce';
    }

    public function getLabel(): string
    {
        return __('WooCommerce Product', 'jankx');
    }

    public function getSupportedPostTypes(): array
    {
        return ['product'];
    }

    public function getRating(int $postId, array $attributes): float
    {
        if (!function_exists('wc_get_product')) {
            return 0.0;
        }

        global $product;
        if (!($product instanceof \WC_Product) || $product->get_id() !== $postId) {
            $product = wc_get_product($postId);
        }

        return $product ? (float) $product->get_average_rating() : 0.0;
    }

    public function getCount(int $postId, array $attributes): int
    {
        if (!function_exists('wc_get_product')) {
            return 0;
        }

        global $product;
        if (!($product instanceof \WC_Product) || $product->get_id() !== $postId) {
            $product = wc_get_product($postId);
        }

        return $product ? (int) $product->get_rating_count() : 0;
    }
}
