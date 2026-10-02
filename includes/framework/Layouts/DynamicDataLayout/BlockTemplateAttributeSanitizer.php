<?php

namespace Jankx\Layouts\DynamicDataLayout;

use Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutManager;
use Jankx\Layouts\DynamicDataLayout\Support\SortRulesResolver;

class BlockTemplateAttributeSanitizer
{
    protected $layoutManager;
    protected $allowedLayouts = [];

    public function __construct(BlockTemplateLayoutManager $layoutManager)
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
        $sanitized['renderOffset'] = $this->sanitizeNumericValue($attributes, 'renderOffset', 0, 1000, 0);
        $sanitized['renderLimit'] = $this->sanitizeNumericValue($attributes, 'renderLimit', 0, 1000, 0);
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
        $sanitized['queryPreset'] = sanitize_text_field($attributes['queryPreset'] ?? 'custom');
        $sanitized['paginationStyle'] = sanitize_text_field($attributes['paginationStyle'] ?? 'numbers');
        $sanitized['paginationAlignment'] = sanitize_text_field($attributes['paginationAlignment'] ?? 'center');
        $sanitized['paginationPrevText'] = sanitize_text_field($attributes['paginationPrevText'] ?? '');
        $sanitized['paginationNextText'] = sanitize_text_field($attributes['paginationNextText'] ?? '');
        $sanitized['orderBy'] = sanitize_text_field($attributes['orderBy'] ?? 'date');
        $sanitized['order'] = sanitize_text_field($attributes['order'] ?? 'DESC');
        $sanitized['keyword'] = sanitize_text_field($attributes['keyword'] ?? '');
        $sanitized['queryId'] = sanitize_text_field($attributes['queryId'] ?? '');

        // Sanitize arrays/complex values
        $sanitized['taxQuery'] = is_array($attributes['taxQuery'] ?? null) ? $attributes['taxQuery'] : [];
        $sanitized['metaQuery'] = is_array($attributes['metaQuery'] ?? null) ? $attributes['metaQuery'] : [];
        $sanitized['authorIn'] = is_array($attributes['authorIn'] ?? null) ? $attributes['authorIn'] : [];
        $sanitized['authorNotIn'] = is_array($attributes['authorNotIn'] ?? null) ? $attributes['authorNotIn'] : [];
        $sanitized['postIn'] = is_array($attributes['postIn'] ?? null) ? $attributes['postIn'] : [];
        $sanitized['postNotIn'] = is_array($attributes['postNotIn'] ?? null) ? $attributes['postNotIn'] : [];
        $sanitized['postStatus'] = is_array($attributes['postStatus'] ?? null) ? $attributes['postStatus'] : ['publish'];
        $sanitized['postTemplate'] = $attributes['postTemplate'] ?? null;

        // Sort rules from the jankx/dynamic-data-sort-rules child block. Stored as
        // a normalized payload because the query builder needs a single ordered
        // list, while the child block keeps "enabled" separate.
        if (isset($attributes['sortRules']) && is_array($attributes['sortRules'])) {
            [$sortRulesEnabled, $sortRules] = SortRulesResolver::normalize($attributes['sortRules']);
            $sanitized['sortRules'] = [
                'enabled' => $sortRulesEnabled,
                'rules' => $sortRules,
            ];
        }

        // Multi post type support. Without these two the first server render
        // silently fell back to $attributes['postType'] and the selection only
        // reappeared after an AJAX re-render.
        $sanitized['useMultiPostType'] = $this->sanitizeBooleanValue($attributes, 'useMultiPostType', false);
        $sanitized['postTypes'] = $this->sanitizePostTypes($attributes['postTypes'] ?? null, $postType);

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
            $sanitized['carouselPeek'] = $this->sanitizeNumericValue($attributes, 'carouselPeek', 0, 50, 0);
            $sanitized['carouselDuration'] = $this->sanitizeNumericValue($attributes, 'carouselDuration', 10, 100, 25);
            $sanitized['slidesToScroll'] = $this->sanitizeNumericValue($attributes, 'slidesToScroll', 1, 6, 1);
            $sanitized['carouselStartIndex'] = $this->sanitizeNumericValue($attributes, 'carouselStartIndex', 0, 50, 0);
            $sanitized['carouselDragFree'] = $this->sanitizeBooleanValue($attributes, 'carouselDragFree', false);
            $sanitized['carouselDragThreshold'] = $this->sanitizeNumericValue($attributes, 'carouselDragThreshold', 1, 100, 10);
            $sanitized['carouselSkipSnaps'] = $this->sanitizeBooleanValue($attributes, 'carouselSkipSnaps', false);
            $sanitized['carouselContainScroll'] = $this->sanitizeCarouselContainScroll($attributes['carouselContainScroll'] ?? 'trimSnaps');
            $sanitized['carouselInViewThreshold'] = $this->sanitizeRatioValue($attributes, 'carouselInViewThreshold', 0.0, 1.0, 0.0);
        }

        // Apply filter for custom sanitization
        return apply_filters('jankx_block_template_sanitize_attributes', $sanitized, $attributes);
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

    /**
     * block.json stores carouselContainScroll as an enum of strings, so the
     * disabled case arrives as the literal "false" rather than a boolean.
     */
    protected function sanitizeCarouselContainScroll($value): string
    {
        $allowed = ['false', 'trimSnaps', 'keepSnaps'];
        $value = is_scalar($value) ? (string) $value : '';

        return in_array($value, $allowed, true) ? $value : 'trimSnaps';
    }

    protected function sanitizeRatioValue(array $attributes, string $key, float $min, float $max, float $default): float
    {
        $value = $attributes[$key] ?? $default;
        $value = is_numeric($value) ? (float) $value : $default;

        return max($min, min($max, $value));
    }

    /**
     * Keep only post types that actually exist, falling back to the single
     * post type so a stale selection cannot produce an empty query.
     */
    protected function sanitizePostTypes($postTypes, string $fallback): array
    {
        if (!is_array($postTypes)) {
            return post_type_exists($fallback) ? [$fallback] : ['post'];
        }

        $valid = array_values(array_filter(
            array_map('strval', $postTypes),
            static function (string $type): bool {
                return $type !== '' && post_type_exists($type);
            }
        ));

        if (empty($valid)) {
            return post_type_exists($fallback) ? [$fallback] : ['post'];
        }

        return $valid;
    }
}
