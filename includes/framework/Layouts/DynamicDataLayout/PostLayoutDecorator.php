<?php

namespace Jankx\Layouts\DynamicDataLayout;

use Jankx\Facades\Log;
use Jankx\Layouts\DynamicDataLayout\Contracts\PostLayoutInterface;
use Jankx\Layouts\DynamicDataLayout\Support\LayoutOptionsResolver;
use Jankx\Layouts\DynamicDataLayout\Support\LayoutQueryBuilder;
use WP_Query;

class PostLayoutDecorator
{
    protected $layout;
    protected $excerptLengthFilter = null;

    public function __construct(PostLayoutInterface $layout)
    {
        $this->layout = $layout;
    }

    public function withAttributes(array $attributes): self
    {
        $this->applyGeneratorFromFilters($attributes);

        $resolver = new LayoutOptionsResolver($attributes, $this->layout);
        $options = $resolver->resolve();
        $this->layout->setOptions($options);

        $this->refreshExcerptFilter($attributes);

        return $this;
    }

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

        if ($generator && is_a($generator, 'Jankx\Layouts\DynamicDataLayout\Contracts\ContentGeneratorInterface')) {
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

    public function buildQuery(array $attributes): WP_Query
    {
        $builder = new LayoutQueryBuilder($attributes, $this->layout);
        return $builder->build();
    }

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

    public function getLayout(): PostLayoutInterface
    {
        return $this->layout;
    }
}

