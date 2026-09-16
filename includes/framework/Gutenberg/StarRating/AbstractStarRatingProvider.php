<?php

namespace Jankx\Gutenberg\StarRating;

/**
 * Class AbstractStarRatingProvider
 *
 * Optional base class for star rating providers.
 * Provides sensible defaults so extensions only override what they need.
 *
 * @package Jankx\Gutenberg\StarRating
 * @since 1.0.0
 */
abstract class AbstractStarRatingProvider implements StarRatingProviderInterface
{
    /**
     * By default a provider supports all post types.
     * Override to restrict to specific post types.
     *
     * @return string[]
     */
    public function getSupportedPostTypes(): array
    {
        return [];
    }

    /**
     * By default, providers do not track a review count.
     *
     * @param int   $postId
     * @param array $attributes
     * @return int
     */
    public function getCount(int $postId, array $attributes): int
    {
        return 0;
    }
}
