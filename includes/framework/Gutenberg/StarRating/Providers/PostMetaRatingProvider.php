<?php

namespace Jankx\Gutenberg\StarRating\Providers;

use Jankx\Gutenberg\StarRating\AbstractStarRatingProvider;

/**
 * Post Meta Rating Provider
 *
 * Reads rating and optional count from WordPress custom fields (post meta).
 */
class PostMetaRatingProvider extends AbstractStarRatingProvider
{
    public function getId(): string
    {
        return 'meta';
    }

    public function getLabel(): string
    {
        return __('Post Meta', 'jankx');
    }

    public function getRating(int $postId, array $attributes): float
    {
        $metaKey = $attributes['metaKey'] ?? 'rating_score';
        return (float) get_post_meta($postId, $metaKey, true);
    }

    public function getCount(int $postId, array $attributes): int
    {
        if (empty($attributes['showCount'])) {
            return 0;
        }
        $countMetaKey = $attributes['countMetaKey'] ?? 'rating_count';
        return (int) get_post_meta($postId, $countMetaKey, true);
    }
}
