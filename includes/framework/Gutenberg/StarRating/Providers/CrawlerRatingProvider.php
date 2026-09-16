<?php

namespace Jankx\Gutenberg\StarRating\Providers;

use Jankx\Gutenberg\StarRating\AbstractStarRatingProvider;

/**
 * Crawler Rating Provider
 *
 * Reads rating data from a custom crawler/external source.
 * Extend or replace this provider if your crawler uses a specific table schema.
 */
class CrawlerRatingProvider extends AbstractStarRatingProvider
{
    public function getId(): string
    {
        return 'crawler';
    }

    public function getLabel(): string
    {
        return __('Crawler Data', 'jankx');
    }

    public function getRating(int $postId, array $attributes): float
    {
        /**
         * Filter the crawler rating value.
         * Extensions that implement a custom crawler can hook here to return
         * the correct value without needing to replace the entire provider.
         *
         * @param float  $rating      Current rating (default 0.0).
         * @param int    $postId      The post ID.
         * @param array  $attributes  Block attributes (includes 'crawlerTable').
         */
        return (float) apply_filters(
            'jankx/star_rating/crawler_rating',
            0.0,
            $postId,
            $attributes
        );
    }

    public function getCount(int $postId, array $attributes): int
    {
        /**
         * Filter the crawler review count.
         *
         * @param int    $count       Current count (default 0).
         * @param int    $postId      The post ID.
         * @param array  $attributes  Block attributes (includes 'crawlerTable').
         */
        return (int) apply_filters(
            'jankx/star_rating/crawler_count',
            0,
            $postId,
            $attributes
        );
    }
}
