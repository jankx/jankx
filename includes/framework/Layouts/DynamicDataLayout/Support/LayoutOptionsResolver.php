<?php

namespace Jankx\Layouts\DynamicDataLayout\Support;

use Jankx\Layouts\DynamicDataLayout\Contracts\PostLayoutInterface;

class LayoutOptionsResolver
{
    protected array $attributes;
    protected PostLayoutInterface $layout;

    public function __construct(array $attributes, PostLayoutInterface $layout)
    {
        $this->attributes = $attributes;
        $this->layout = $layout;
    }

    public function resolve(): array
    {
        $templateBlock = $this->resolveTemplateBlock();
        $postType = $this->getPostType();

        $options = [
            'columns' => $this->attributes['columns'] ?? 3,
            'columnsTablet' => $this->attributes['columnsTablet'] ?? ($this->attributes['columns'] ?? 2),
            'columnsMobile' => $this->attributes['columnsMobile'] ?? 1,
            'responsiveColumns' => $this->attributes['responsiveColumns'] ?? null,
            'showFeaturedImage' => $this->attributes['showFeaturedImage'] ?? true,
            'thumbnailPosition' => $this->resolveThumbnailPosition(),
            'imageRatio' => $this->attributes['imageRatio'] ?? '',
            'showTitle' => $this->attributes['showTitle'] ?? true,
            'showExcerpt' => $this->attributes['showExcerpt'] ?? true,
            'showDate' => $this->attributes['showDate'] ?? true,
            'showAuthor' => $this->attributes['showAuthor'] ?? false,
            'layout' => $this->attributes['layout'] ?? 'grid',
            'postsPerPage' => $this->attributes['postsPerPage'] ?? 10,
            'excerptLength' => $this->attributes['excerptLength'] ?? 55,
            'includeStickyPosts' => !empty($this->attributes['includeStickyPosts']),
            'slidesToScroll' => $this->attributes['slidesToScroll'] ?? 1,
            'loop' => $this->attributes['loop'] ?? false,
            'autoplay' => $this->attributes['autoplay'] ?? false,
            'autoplayDelay' => $this->attributes['autoplayDelay'] ?? 3000,
            'showArrows' => $this->attributes['showArrows'] ?? true,
            'showDots' => $this->attributes['showDots'] ?? true,
            'itemsWrapperClass' => $this->sanitizeClass($this->attributes['itemsWrapperClass'] ?? ''),
            'itemClass' => $this->sanitizeClass($this->attributes['itemClass'] ?? ''),
            'postTemplate' => $templateBlock,
        ];

        $options = $this->maybeAugmentForWooCommerce($options, $postType);
        $options = $this->ensureTemplateDefaults($options, $templateBlock);

        return apply_filters('jankx/post-layout/options', $options, $postType, $this->attributes);
    }

    protected function resolveTemplateBlock(): ?array
    {
        $template = $this->attributes['postTemplate'] ?? null;
        if (!is_array($template) || empty($template)) {
            return null;
        }
        return $template;
    }

    protected function resolveThumbnailPosition(): string
    {
        $position = $this->attributes['thumbnailPosition'] ?? 'top';
        $allowed = ['top', 'bottom', 'left', 'right'];
        return in_array($position, $allowed, true) ? $position : 'top';
    }

    protected function sanitizeClass(string $className): string
    {
        if ($className === '') {
            return '';
        }
        return sanitize_html_class($className);
    }

    protected function maybeAugmentForWooCommerce(array $options, string $postType): array
    {
        $layoutName = $this->attributes['layout'] ?? 'grid';
        if ($layoutName !== 'carousel' || $postType !== 'product' || !class_exists('WooCommerce')) {
            return $options;
        }
        if (empty($options['itemsWrapperClass'])) {
            $options['itemsWrapperClass'] = 'wc-block-product-template';
        }
        if (empty($options['itemClass'])) {
            $options['itemClass'] = 'wc-block-product';
        }
        return $options;
    }

    protected function ensureTemplateDefaults(array $options, ?array $templateBlock): array
    {
        if ($templateBlock === null) {
            return $options;
        }
        if (empty($options['itemsWrapperClass'])) {
            $options['itemsWrapperClass'] = 'wp-block-jankx-post-layout-template';
        }
        if (empty($options['itemClass'])) {
            $options['itemClass'] = 'wp-block-post';
        }
        return $options;
    }

    protected function getPostType(): string
    {
        return $this->attributes['postType'] ?? 'post';
    }
}

