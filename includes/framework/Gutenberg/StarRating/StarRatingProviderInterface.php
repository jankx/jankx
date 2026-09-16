<?php

namespace Jankx\Gutenberg\StarRating;

/**
 * Interface StarRatingProviderInterface
 *
 * Contract that all star rating providers must implement.
 * Extensions can register their own providers via StarRatingRegistry.
 *
 * @package Jankx\Gutenberg\StarRating
 * @since 1.0.0
 */
interface StarRatingProviderInterface
{
    /**
     * Get the unique identifier for this provider.
     * Used as the value of ratingSource attribute in the block.
     *
     * @return string  e.g. 'woocommerce', 'tour_review', 'meta'
     */
    public function getId(): string;

    /**
     * Get a human-readable label shown in the Gutenberg editor dropdown.
     *
     * @return string  e.g. 'WooCommerce Product Rating'
     */
    public function getLabel(): string;

    /**
     * Return the post types this provider applies to.
     * Return an empty array to support ALL post types.
     *
     * @return string[]  e.g. ['product'], ['tour'], []
     */
    public function getSupportedPostTypes(): array;

    /**
     * Retrieve the rating value for a given post.
     *
     * @param int   $postId     The current post ID.
     * @param array $attributes The full block attributes.
     * @return float  A value between 0.0 and 5.0.
     */
    public function getRating(int $postId, array $attributes): float;

    /**
     * Retrieve the review/rating count for a given post.
     *
     * @param int   $postId     The current post ID.
     * @param array $attributes The full block attributes.
     * @return int
     */
    public function getCount(int $postId, array $attributes): int;
}
