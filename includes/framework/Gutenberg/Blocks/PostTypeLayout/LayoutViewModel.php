<?php

namespace Jankx\Gutenberg\Blocks\PostTypeLayout;

class LayoutViewModel
{
    public static function fromAttributes(array $attributes, string $html): array
    {
        $normalized = self::normalizeAttributes($attributes);

        return [
            'block_id' => $normalized['queryId'],
            'html' => $html,
            'wrapper_attributes' => self::buildWrapperAttributes($normalized),
            'block_settings' => self::buildBlockSettings($normalized),
            'js_init' => $normalized['js_init'] ?? null,
            'extra_wrapper_classes' => $normalized['extraWrapperClasses'] ?? [],
        ];
    }

    public static function render(array $viewModel): string
    {
        $attributes = $viewModel['wrapper_attributes'];
        $settings = $viewModel['block_settings'];
        $attributes['data-block-settings'] = esc_attr(wp_json_encode($settings));

        if (!empty($viewModel['extra_wrapper_classes']) && is_array($viewModel['extra_wrapper_classes'])) {
            $existingClass = $attributes['class'] ?? '';
            $classes = array_filter(array_map('trim', explode(' ', $existingClass)));
            $classes = array_merge($classes, array_map('sanitize_html_class', $viewModel['extra_wrapper_classes']));
            $attributes['class'] = implode(' ', array_values(array_unique(array_filter($classes))));
        }

        if (!empty($viewModel['js_init'])) {
            $attributes['data-layout-js'] = esc_attr(wp_json_encode($viewModel['js_init']));
        }

        $attributeString = get_block_wrapper_attributes($attributes);

        return sprintf('<div %s>%s</div>', $attributeString, $viewModel['html']);
    }

    protected static function normalizeAttributes(array $attributes): array
    {
        if (empty($attributes['queryId'])) {
            $attributes['queryId'] = 'query_' . uniqid();
        }

        $attributes['queryId'] = (string) $attributes['queryId'];

        return $attributes;
    }

    protected static function buildWrapperAttributes(array $attributes): array
    {
        $layoutName = $attributes['layout'] ?? 'grid';
        $thumbnailPosition = $attributes['thumbnailPosition'] ?? 'top';
        if (!in_array($thumbnailPosition, ['top', 'bottom', 'left', 'right'], true)) {
            $thumbnailPosition = 'top';
        }

        $classes = [
            'wp-block-jankx-post-type-layout',
            'layout-' . $layoutName,
            'thumbnail-position-' . $thumbnailPosition,
        ];

        if (!empty($attributes['extraWrapperClasses']) && is_array($attributes['extraWrapperClasses'])) {
            $classes = array_merge($classes, array_map('sanitize_html_class', $attributes['extraWrapperClasses']));
        }

        $styles = [];
        if (!empty($attributes['columns'])) {
            $styles[] = '--columns-desktop: ' . (int) $attributes['columns'];
        }
        if (!empty($attributes['columnsTablet'])) {
            $styles[] = '--columns-tablet: ' . (int) $attributes['columnsTablet'];
        }
        if (!empty($attributes['columnsMobile'])) {
            $styles[] = '--columns-mobile: ' . (int) $attributes['columnsMobile'];
        }

        return array_filter([
            'class' => implode(' ', array_values(array_unique(array_filter($classes)))),
            'style' => !empty($styles) ? implode('; ', $styles) : '',
            'data-block-id' => $attributes['queryId'],
            'data-query-id' => $attributes['queryId'],
            'data-post-type' => isset($attributes['postType']) ? esc_attr($attributes['postType']) : '',
            'data-layout' => esc_attr($layoutName),
            'data-posts-per-page' => isset($attributes['postsPerPage']) ? (int) $attributes['postsPerPage'] : '',
            'data-columns' => isset($attributes['columns']) ? (int) $attributes['columns'] : '',
            'data-columns-tablet' => isset($attributes['columnsTablet']) ? (int) $attributes['columnsTablet'] : '',
            'data-columns-mobile' => isset($attributes['columnsMobile']) ? (int) $attributes['columnsMobile'] : '',
            'data-order-by' => isset($attributes['orderBy']) ? esc_attr($attributes['orderBy']) : '',
            'data-order' => isset($attributes['order']) ? esc_attr($attributes['order']) : '',
            'data-query-preset' => isset($attributes['queryPreset']) ? esc_attr($attributes['queryPreset']) : '',
            'data-image-ratio' => !empty($attributes['imageRatio']) ? esc_attr($attributes['imageRatio']) : '',
            'data-thumbnail-position' => esc_attr($thumbnailPosition),
        ]);
    }

    protected static function buildBlockSettings(array $attributes): array
    {
        return [
            'queryId' => $attributes['queryId'],
            'postType' => $attributes['postType'] ?? 'post',
            'postsPerPage' => $attributes['postsPerPage'] ?? 10,
            'layout' => $attributes['layout'] ?? 'grid',
            'columns' => $attributes['columns'] ?? 3,
            'columnsTablet' => $attributes['columnsTablet'] ?? 2,
            'columnsMobile' => $attributes['columnsMobile'] ?? 1,
            'orderBy' => $attributes['orderBy'] ?? 'date',
            'order' => $attributes['order'] ?? 'DESC',
            'queryPreset' => $attributes['queryPreset'] ?? 'custom',
            'thumbnailPosition' => $attributes['thumbnailPosition'] ?? 'top',
            'includeStickyPosts' => !empty($attributes['includeStickyPosts']),
        ];
    }
}
