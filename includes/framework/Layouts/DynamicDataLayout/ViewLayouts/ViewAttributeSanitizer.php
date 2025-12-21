<?php

namespace Jankx\Layouts\DynamicDataLayout\ViewLayouts;

use Jankx\Layouts\DynamicDataLayout\ViewLayouts\ViewLayoutManager;

class ViewAttributeSanitizer
{
    protected $layoutManager;
    protected $allowedLayouts = [];

    public function __construct(ViewLayoutManager $layoutManager)
    {
        $this->layoutManager = $layoutManager;
        $this->allowedLayouts = $this->layoutManager->getLayoutNames();
    }

    public function sanitize(array $attributes, string $layoutName = '', bool $isAjax = false): array
    {
        $sanitized = [];

        // Sanitize layout
        $layout = $layoutName ?: ($attributes['layout'] ?? 'grid');
        if (in_array($layout, $this->allowedLayouts, true)) {
            $sanitized['layout'] = $layout;
        } else {
            $sanitized['layout'] = 'grid';
        }

        // Sanitize post type
        $postType = $attributes['postType'] ?? 'post';
        if (post_type_exists($postType)) {
            $sanitized['postType'] = $postType;
        } else {
            $sanitized['postType'] = 'post';
        }

        // Sanitize numeric values
        $sanitized['postsPerPage'] = $this->sanitizeNumericValue($attributes, 'postsPerPage', 1, 50, 10);
        $sanitized['paged'] = $this->sanitizeNumericValue($attributes, 'paged', 1, 1000, 1);
        $sanitized['columns'] = $this->sanitizeNumericValue($attributes, 'columns', 1, 6, 3);
        $sanitized['columnsTablet'] = $this->sanitizeNumericValue($attributes, 'columnsTablet', 1, 4, 2);
        $sanitized['columnsMobile'] = $this->sanitizeNumericValue($attributes, 'columnsMobile', 1, 2, 1);
        $sanitized['excerptLength'] = $this->sanitizeNumericValue($attributes, 'excerptLength', 10, 200, 55);

        // Sanitize boolean values
        $sanitized['showFeaturedImage'] = $this->sanitizeBooleanValue($attributes, 'showFeaturedImage', true);
        $sanitized['showTitle'] = $this->sanitizeBooleanValue($attributes, 'showTitle', true);
        $sanitized['showExcerpt'] = $this->sanitizeBooleanValue($attributes, 'showExcerpt', true);
        $sanitized['showDate'] = $this->sanitizeBooleanValue($attributes, 'showDate', true);
        $sanitized['showAuthor'] = $this->sanitizeBooleanValue($attributes, 'showAuthor', false);
        $sanitized['showEmptyMessage'] = $this->sanitizeBooleanValue($attributes, 'showEmptyMessage', true);
        $sanitized['includeStickyPosts'] = $this->sanitizeBooleanValue($attributes, 'includeStickyPosts', false);

        // Sanitize string values
        $sanitized['imageSize'] = $this->sanitizeImageSize($attributes['imageSize'] ?? 'large');
        $sanitized['thumbnailPosition'] = $this->sanitizeThumbnailPosition($attributes['thumbnailPosition'] ?? 'top');
        $sanitized['emptyMessage'] = $this->sanitizeText($attributes['emptyMessage'] ?? __('No posts found.', 'jankx'));
        $sanitized['className'] = $this->sanitizeClassName($attributes['className'] ?? '');

        // Carousel specific options
        if ($sanitized['layout'] === 'carousel') {
            $sanitized['slidesPerView'] = $this->sanitizeNumericValue($attributes, 'slidesPerView', 1, 6, 1);
            $sanitized['spaceBetween'] = $this->sanitizeNumericValue($attributes, 'spaceBetween', 0, 100, 16);
            $sanitized['autoplayDelay'] = $this->sanitizeNumericValue($attributes, 'autoplayDelay', 1000, 10000, 3000);
            $sanitized['loop'] = $this->sanitizeBooleanValue($attributes, 'loop', false);
            $sanitized['autoplay'] = $this->sanitizeBooleanValue($attributes, 'autoplay', false);
            $sanitized['showArrows'] = $this->sanitizeBooleanValue($attributes, 'showArrows', true);
            $sanitized['showDots'] = $this->sanitizeBooleanValue($attributes, 'showDots', true);
            $sanitized['carouselAlign'] = $this->sanitizeCarouselAlign($attributes['carouselAlign'] ?? 'start');
            $sanitized['carouselAxis'] = $this->sanitizeCarouselAxis($attributes['carouselAxis'] ?? 'x');
            $sanitized['carouselDirection'] = $this->sanitizeCarouselDirection($attributes['carouselDirection'] ?? 'ltr');
            $sanitized['carouselDuration'] = $this->sanitizeNumericValue($attributes, 'carouselDuration', 10, 100, 25);
        }

        // Apply filter for custom sanitization
        return apply_filters('jankx_view_layout_sanitize_attributes', $sanitized, $attributes);
    }

    protected function sanitizeNumericValue(array $attributes, string $key, int $min, int $max, int $default): int
    {
        $value = $attributes[$key] ?? $default;
        $value = is_numeric($value) ? (int) $value : $default;
        return max($min, min($max, $value));
    }

    protected function sanitizeBooleanValue(array $attributes, string $key, bool $default): bool
    {
        $value = $attributes[$key] ?? $default;
        return filter_var($value, FILTER_VALIDATE_BOOLEAN);
    }

    protected function sanitizeImageSize(string $size): string
    {
        $allowedSizes = ['thumbnail', 'medium', 'large', 'full'];
        return in_array($size, $allowedSizes, true) ? $size : 'large';
    }

    protected function sanitizeThumbnailPosition(string $position): string
    {
        $allowedPositions = ['top', 'bottom', 'left', 'right'];
        return in_array($position, $allowedPositions, true) ? $position : 'top';
    }

    protected function sanitizeText(string $text): string
    {
        return wp_kses_post($text);
    }

    protected function sanitizeClassName(string $className): string
    {
        return sanitize_html_class($className);
    }

    protected function sanitizeCarouselAlign(string $align): string
    {
        $allowedAligns = ['start', 'center', 'end'];
        return in_array($align, $allowedAligns, true) ? $align : 'start';
    }

    protected function sanitizeCarouselAxis(string $axis): string
    {
        $allowedAxes = ['x', 'y'];
        return in_array($axis, $allowedAxes, true) ? $axis : 'x';
    }

    protected function sanitizeCarouselDirection(string $direction): string
    {
        $allowedDirections = ['ltr', 'rtl'];
        return in_array($direction, $allowedDirections, true) ? $direction : 'ltr';
    }
}
