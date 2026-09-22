<?php

namespace Jankx\Gutenberg\StarRating;

/**
 * Interface StarRatingProviderInterface
 *
 * Contract that all star rating providers must implement.
 * Extensions register their own providers via StarRatingRegistry.
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

    /**
     * Declare the editor controls for this provider.
     *
     * Return an array of control definitions that the Gutenberg editor
     * will render dynamically when this source is selected.
     *
     * Each control is an associative array with:
     *   - type:      string  One of 'range', 'text', 'select', 'toggle'
     *   - attribute: string  The block attribute name to bind
     *   - label:     string  Human-readable label
     *   - help:      string  (optional) Help text
     *   - default:   mixed   (optional) Default value
     *
     * Type-specific keys:
     *   range:   min, max, step
     *   select:  options (array of {value, label})
     *
     * @return array<array{
     *   type: string,
     *   attribute: string,
     *   label: string,
     *   help?: string,
     *   default?: mixed,
     *   min?: int|float,
     *   max?: int|float,
     *   step?: int|float,
     *   options?: array<array{value: string, label: string}>
     * }>
     */
    public function getEditorConfig(): array;
}
