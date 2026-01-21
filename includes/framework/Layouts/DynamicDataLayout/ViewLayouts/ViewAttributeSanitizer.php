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
        $sanitized['enablePagination'] = $this->sanitizeBooleanValue($attributes, 'enablePagination', false);
        $sanitized['showPaginationNumbers'] = $this->sanitizeBooleanValue($attributes, 'showPaginationNumbers', true);

        // Sanitize string values
        $sanitized['imageSize'] = $this->sanitizeImageSize($attributes['imageSize'] ?? 'large');
        $sanitized['thumbnailPosition'] = $this->sanitizeThumbnailPosition($attributes['thumbnailPosition'] ?? 'top');
        $sanitized['emptyMessage'] = $this->sanitizeText($attributes['emptyMessage'] ?? __('No posts found.', 'jankx'));
        $sanitized['className'] = $this->sanitizeClassName($attributes['className'] ?? '');
        // Image ratio (e.g., "16/9") used by some layouts
        $sanitized['imageRatio'] = $this->sanitizeImageRatio($attributes['imageRatio'] ?? '');

        // Pagination strings
        $sanitized['paginationStyle'] = $this->sanitizeText($attributes['paginationStyle'] ?? 'numbers');
        $sanitized['paginationAlignment'] = $this->sanitizeText($attributes['paginationAlignment'] ?? 'center');
        $sanitized['paginationPrevText'] = $this->sanitizeText($attributes['paginationPrevText'] ?? '');
        $sanitized['paginationNextText'] = $this->sanitizeText($attributes['paginationNextText'] ?? '');

        // Query attributes
        $sanitized['queryPreset'] = $this->sanitizeText($attributes['queryPreset'] ?? 'custom');
        $sanitized['orderBy'] = $this->sanitizeText($attributes['orderBy'] ?? 'date');
        $sanitized['order'] = $this->sanitizeText($attributes['order'] ?? 'DESC');
        $sanitized['keyword'] = $this->sanitizeText($attributes['keyword'] ?? '');
        $sanitized['queryId'] = $this->sanitizeText($attributes['queryId'] ?? '');
        $sanitized['metaKey'] = $this->sanitizeText($attributes['metaKey'] ?? '');
        $sanitized['metaType'] = $this->sanitizeText($attributes['metaType'] ?? '');
        $sanitized['customQueryId'] = $this->sanitizeText($attributes['customQueryId'] ?? '');

        // Array attributes
        $sanitized['taxQuery'] = is_array($attributes['taxQuery'] ?? null) ? $attributes['taxQuery'] : [];
        $sanitized['metaQuery'] = is_array($attributes['metaQuery'] ?? null) ? $attributes['metaQuery'] : [];
        $sanitized['authorIn'] = is_array($attributes['authorIn'] ?? null) ? $attributes['authorIn'] : [];
        $sanitized['authorNotIn'] = is_array($attributes['authorNotIn'] ?? null) ? $attributes['authorNotIn'] : [];
        $sanitized['postIn'] = is_array($attributes['postIn'] ?? null) ? $attributes['postIn'] : [];
        $sanitized['postNotIn'] = is_array($attributes['postNotIn'] ?? null) ? $attributes['postNotIn'] : [];
        $sanitized['postStatus'] = is_array($attributes['postStatus'] ?? null) ? $attributes['postStatus'] : ['publish'];
        $sanitized['postTypes'] = is_array($attributes['postTypes'] ?? null) ? $attributes['postTypes'] : [];

        // Overlay icon options
        $sanitized['overlayIcon'] = $this->sanitizeText($attributes['overlayIcon'] ?? '');
        $sanitized['overlayIconType'] = $this->sanitizeOverlayType($attributes['overlayIconType'] ?? 'class');
        $sanitized['overlayIconImageUrl'] = $this->sanitizeUrl($attributes['overlayIconImageUrl'] ?? '');
        $sanitized['overlayIconText'] = $this->sanitizeText($attributes['overlayIconText'] ?? '');
        $sanitized['overlayIconRotate'] = $this->sanitizeNumericValue($attributes, 'overlayIconRotate', 0, 360, 0);
        $sanitized['overlayIconColor'] = $this->sanitizeText($attributes['overlayIconColor'] ?? '#ffffff');
        $sanitized['overlayIconBackground'] = $this->sanitizeText($attributes['overlayIconBackground'] ?? 'rgba(0, 0, 0, 0.5)');
        $sanitized['overlayIconSize'] = $this->sanitizeNumericValue($attributes, 'overlayIconSize', 8, 256, 24);
        $sanitized['overlayIconPosition'] = $this->sanitizeOverlayPosition($attributes['overlayIconPosition'] ?? 'center');
        $sanitized['overlayIconShowMode'] = $this->sanitizeOverlayMode($attributes['overlayIconShowMode'] ?? 'always-show');
        $sanitized['overlayIconTarget'] = $this->sanitizeOverlayTarget($attributes['overlayIconTarget'] ?? 'featured-image');

        // Carousel specific options
        if ($sanitized['layout'] === 'carousel') {
            $sanitized['slidesPerView'] = $this->sanitizeNumericValue(
                $attributes,
                'slidesPerView',
                1,
                6,
                $sanitized['columns'] ?? 1
            );
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

    protected function sanitizeImageRatio(string $ratio): string
    {
        $ratio = trim((string) $ratio);
        if ($ratio === '') {
            return '';
        }
        if (preg_match('/^\d+(\.\d+)?\s*\/\s*\d+(\.\d+)?$/', $ratio)) {
            return $ratio;
        }
        return '';
    }

    protected function sanitizeOverlayType(string $type): string
    {
        $allowed = ['class', 'image', 'text'];
        return in_array($type, $allowed, true) ? $type : 'class';
    }

    protected function sanitizeUrl(string $url): string
    {
        $url = esc_url_raw($url);
        return is_string($url) ? $url : '';
    }

    protected function sanitizeOverlayPosition(string $pos): string
    {
        $allowed = ['center', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
        return in_array($pos, $allowed, true) ? $pos : 'center';
    }

    protected function sanitizeOverlayMode(string $mode): string
    {
        $allowed = ['always-show', 'hover-hide', 'hover-show'];
        return in_array($mode, $allowed, true) ? $mode : 'always-show';
    }

    protected function sanitizeOverlayTarget(string $target): string
    {
        $allowed = ['featured-image', 'entry-image', 'entire-item'];
        return in_array($target, $allowed, true) ? $target : 'featured-image';
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
