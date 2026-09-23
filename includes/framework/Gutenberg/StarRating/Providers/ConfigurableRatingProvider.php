<?php

namespace Jankx\Gutenberg\StarRating\Providers;

use Jankx\Gutenberg\StarRating\AbstractStarRatingProvider;

/**
 * Configurable Rating Provider
 *
 * A reusable provider that reads rating data from post meta.
 * Designed for extensions to register their own data sources
 * by simply instantiating this class with configuration.
 *
 * Usage:
 *
 *   StarRatingRegistry::register(new ConfigurableRatingProvider([
 *       'id'             => 'tour_rating',
 *       'label'          => __('Tour Rating', 'jankx'),
 *       'postTypes'      => ['tour'],
 *       'ratingMetaKey'  => 'jankx_rating_average',
 *       'countMetaKey'   => 'jankx_rating_count',
 *       'editorControls' => [...],
 *   ]));
 *
 * @package Jankx\Gutenberg\StarRating\Providers
 */
class ConfigurableRatingProvider extends AbstractStarRatingProvider
{
    protected string $id;
    protected string $label;
    protected array $postTypes;
    protected string $ratingMetaKey;
    protected string $countMetaKey;
    protected array $editorControls;

    public function __construct(array $config)
    {
        $this->id             = $config['id'] ?? '';
        $this->label          = $config['label'] ?? '';
        $this->postTypes      = $config['postTypes'] ?? [];
        $this->ratingMetaKey  = $config['ratingMetaKey'] ?? 'jankx_rating_average';
        $this->countMetaKey   = $config['countMetaKey'] ?? 'jankx_rating_count';
        $this->editorControls = $config['editorControls'] ?? [];
    }

    public function getId(): string
    {
        return $this->id;
    }

    public function getLabel(): string
    {
        return $this->label;
    }

    public function getSupportedPostTypes(): array
    {
        return $this->postTypes;
    }

    public function getRating(int $postId, array $attributes): float
    {
        $rating = (float) get_post_meta($postId, $this->ratingMetaKey, true);

        // Fallback: if canonical meta is empty, try legacy meta
        if ($rating <= 0.0) {
            $postType = get_post_type($postId);
            $legacyMap = [
                'tour'       => '_tour_rating',
                'experience' => '_experience_rating',
                'place'      => '_place_rating',
                'product'    => '_product_rating',
                'service'    => '_service_rating',
            ];
            $legacyKey = $legacyMap[$postType] ?? '';
            if ($legacyKey) {
                $rating = (float) get_post_meta($postId, $legacyKey, true);
            }
        }

        return max(0.0, min(5.0, $rating));
    }

    public function getCount(int $postId, array $attributes): int
    {
        return (int) get_post_meta($postId, $this->countMetaKey, true);
    }

    public function getEditorConfig(): array
    {
        return $this->editorControls;
    }
}
