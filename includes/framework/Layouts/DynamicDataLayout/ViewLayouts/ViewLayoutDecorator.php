<?php

namespace Jankx\Layouts\DynamicDataLayout\ViewLayouts;

use Jankx\Layouts\DynamicDataLayout\ViewLayouts\ViewLayoutManager;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\ViewAttributeSanitizer;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\ViewLayoutQueryBuilder;
use Jankx\Layouts\DynamicDataLayout\ViewLayouts\Contracts\ViewLayoutInterface;
use WP_Query;

class ViewLayoutDecorator
{
    protected $layout;
    protected $excerptLengthFilter = null;

    public function __construct(ViewLayoutInterface $layout)
    {
        $this->layout = $layout;
    }

    public function withAttributes(array $attributes): self
    {
        $this->applyGeneratorFromFilters($attributes);

        $layoutManager = ViewLayoutManager::getInstance();
        $resolver = new ViewAttributeSanitizer($layoutManager);
        $options = $resolver->sanitize($attributes);
        $this->layout->setOptions($options);

        return $this;
    }

    protected function applyGeneratorFromFilters(array $attributes): void
    {
        $postType = $attributes['postType'] ?? 'post';
        $generator = apply_filters("jankx_view_layout_{$postType}_generator", null, $attributes, $this->layout);
        
        if ($generator) {
            $generatorClass = get_class($generator);
            $this->layout->setContentGenerator($generator);
        }
    }

    public function render(): string
    {
        $query = $this->createQuery();
        $this->layout->setQuery($query);

        $options = $this->layout->getOptions();
        if (($options['excerptLength'] ?? 0) > 0) {
            $excerptLength = $options['excerptLength'];
            $this->excerptLengthFilter = function ($length) use ($excerptLength) {
                return $excerptLength;
            };
            add_filter('excerpt_length', $this->excerptLengthFilter, 999);
        }

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

    public function getLayout(): ViewLayoutInterface
    {
        return $this->layout;
    }

    protected function createQuery(): WP_Query
    {
        $queryBuilder = new ViewLayoutQueryBuilder($this->layout);
        return $queryBuilder->build();
    }
}
