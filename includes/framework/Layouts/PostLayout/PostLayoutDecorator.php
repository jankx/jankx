<?php

namespace Jankx\Layouts\PostLayout;

use Jankx\Facades\Log;
use Jankx\Layouts\PostLayout\Contracts\PostLayoutInterface;
use Jankx\Layouts\PostLayout\Support\LayoutOptionsResolver;
use Jankx\Layouts\PostLayout\Support\LayoutQueryBuilder;
use WP_Query;

/**
 * Post Layout Decorator
 *
 * Decorator pattern để set options từ block attributes vào layout
 *
 * @package Jankx\Layouts\PostLayout
 */
class PostLayoutDecorator
{
    /**
     * Layout instance
     *
     * @var PostLayoutInterface
     */
    protected $layout;

    /**
     * Callback filter cho excerpt_length
     *
     * @var callable|null
     */
    protected $excerptLengthFilter = null;

    /**
     * Constructor
     *
     * @param PostLayoutInterface $layout
     */
    public function __construct(PostLayoutInterface $layout)
    {
        $this->layout = $layout;
    }

    /**
     * Set options từ block attributes
     *
     * @param array $attributes Block attributes từ Gutenberg
     * @return self
     */
    public function withAttributes(array $attributes): self
    {
        $this->applyGeneratorFromFilters($attributes);

        $resolver = new LayoutOptionsResolver($attributes, $this->layout);
        $options = $resolver->resolve();
        $this->layout->setOptions($options);

        $this->refreshExcerptFilter($attributes);

        return $this;
    }

    /**
     * Set query
     *
     * @param WP_Query $query
     * @return self
     */
    public function withQuery(WP_Query $query): self
    {
        $this->layout->setQuery($query);
        return $this;
    }

    protected function applyGeneratorFromFilters(array $attributes): void
    {
        $postType = $attributes['postType'] ?? 'post';
        $generator = apply_filters('jankx/post-layout/generator', null, $postType, $attributes);

        if ($generator !== null) {
            Log::error('PostLayoutDecorator: post_type=' . $postType . ', generator=' . get_class($generator));
        }

        if ($generator && is_a($generator, 'Jankx\Layouts\PostLayout\Contracts\ContentGeneratorInterface')) {
            $this->layout->setContentGenerator($generator);
        }
    }

    protected function refreshExcerptFilter(array $attributes): void
    {
        if ($this->excerptLengthFilter) {
            remove_filter('excerpt_length', $this->excerptLengthFilter, 999);
            $this->excerptLengthFilter = null;
        }

        if (!isset($attributes['excerptLength']) || empty($attributes['showExcerpt'])) {
            return;
        }

        $length = (int) $attributes['excerptLength'];
        $this->excerptLengthFilter = static function () use ($length) {
            return $length;
        };

        add_filter('excerpt_length', $this->excerptLengthFilter, 999);
    }

    /**
     * Build query từ block attributes
     *
     * @param array $attributes
     * @return WP_Query
     */
    public function buildQuery(array $attributes): WP_Query
    {
        $builder = new LayoutQueryBuilder($attributes, $this->layout);

        return $builder->build();
    }

    /**
     * Render layout
     *
     * @return string
     */
    public function render(): string
    {
        try {
            return $this->layout->render();
        } finally {
            if ($this->excerptLengthFilter) {
                remove_filter('excerpt_length', $this->excerptLengthFilter, 999);
                $this->excerptLengthFilter = null;
            }
        }
    }

    /**
     * Render preview
     *
     * @return array
     */
    public function renderPreview(): array
    {
        try {
            return $this->layout->renderPreview();
        } finally {
            if ($this->excerptLengthFilter) {
                remove_filter('excerpt_length', $this->excerptLengthFilter, 999);
                $this->excerptLengthFilter = null;
            }
        }
    }

    /**
     * Get layout instance
     *
     * @return PostLayoutInterface
     */
    public function getLayout(): PostLayoutInterface
    {
        return $this->layout;
    }
}
