<?php

namespace Jankx\Gutenberg\StarRating\Providers;

use Jankx\Gutenberg\StarRating\AbstractStarRatingProvider;

/**
 * Manual Rating Provider
 *
 * Returns a hard-coded rating value set directly in the block attributes.
 */
class ManualRatingProvider extends AbstractStarRatingProvider
{
    public function getId(): string
    {
        return 'manual';
    }

    public function getLabel(): string
    {
        return __('Manual', 'jankx');
    }

    public function getRating(int $postId, array $attributes): float
    {
        return (float) ($attributes['manualRating'] ?? 5.0);
    }

    public function getEditorConfig(): array
    {
        return [
            [
                'type'      => 'range',
                'attribute' => 'manualRating',
                'label'     => __('Rating Value', 'jankx'),
                'min'       => 0,
                'max'       => 5,
                'step'      => 0.1,
            ],
        ];
    }
}
