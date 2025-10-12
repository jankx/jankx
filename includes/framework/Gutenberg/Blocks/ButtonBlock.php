<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Unified Button Block
 *
 * This block combines functionality from:
 * - IconButtonBlock (icon picker support)
 * - ImageButtonBlock (image from media support)
 * - SvgIconButtonBlock (SVG icon support)
 *
 * Plus all core/button features including:
 * - Link settings
 * - Typography controls
 * - Color and gradient support
 * - Border and spacing controls
 * - Multiple icon types (none, svg, image, upload, picker)
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class ButtonBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/button';

    /**
     * Render the block content
     *
     * This block uses JavaScript save function for most rendering,
     * but we need to handle special trigger types like detail-link
     * which requires PHP to get the current post permalink.
     *
     * @param array $attributes Block attributes
     * @param string $content Block content (HTML from save function)
     * @param \WP_Block $block Block instance
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '', $block = null)
    {
        $triggerType = $attributes['triggerType'] ?? 'link';

        // Fallback: Check HTML content for data-trigger-type if attribute parsing fails
        // This is important for query loops where attributes come from template, not individual posts
        if ($triggerType === 'link' && strpos($content, 'data-trigger-type="detail-link"') !== false) {
            $triggerType = 'detail-link';
        } elseif ($triggerType === 'link' && strpos($content, 'data-trigger-type="modal"') !== false) {
            $triggerType = 'modal';
        } elseif ($triggerType === 'link' && strpos($content, 'data-trigger-type="button"') !== false) {
            $triggerType = 'button';
        }

        // Handle detail-link: Replace placeholder href with actual permalink
        if ($triggerType === 'detail-link') {
            $permalink = get_permalink();

            if ($permalink) {
                // Use regex to replace href="#" with actual permalink
                // This handles cases where there might be spaces or other variations
                $content = preg_replace(
                    '/href\s*=\s*["\']#["\']/',
                    'href="' . esc_url($permalink) . '"',
                    $content
                );
            }
        }

        // Handle modal trigger: add dynamic data attributes
        if ($triggerType === 'modal') {
            $modalId = $attributes['modalId'] ?? '';

            // Build data attributes to inject
            $dataAttrs = [];

            // Replace placeholder data attributes with actual post data
            // Check if we're in a post context (single post, page, custom post type)
            if (is_singular() && have_posts()) {
                the_post();
                $post_id = get_the_ID();
                $post_title = get_the_title();
                $post_url = get_permalink();
                wp_reset_postdata();
            } else {
                // Fallback for archive pages or other contexts
                global $post;
                $post_id = $post ? $post->ID : '';
                $post_title = $post ? $post->post_title : '';
                $post_url = $post ? get_permalink($post) : '';
            }

            if ($post_id && $post_title && $post_url) {
                // Escape data for HTML attributes
                $post_id_escaped = esc_attr($post_id);
                $post_title_escaped = esc_attr($post_title);
                $post_url_escaped = esc_attr($post_url);

                // Replace placeholders
                $content = str_replace('{{CURRENT_POST_ID}}', $post_id_escaped, $content);
                $content = str_replace('{{CURRENT_POST_TITLE}}', $post_title_escaped, $content);
                $content = str_replace('{{CURRENT_POST_URL}}', $post_url_escaped, $content);
            }

            // Inject data attributes into button
            if (!empty($dataAttrs)) {
                // Build attributes string
                $attrsString = '';
                foreach ($dataAttrs as $attrName => $attrValue) {
                    $attrsString .= ' ' . $attrName . '="' . $attrValue . '"';
                }

                // Inject after data-modal-id
                $content = preg_replace(
                    '/(data-modal-id="[^"]*")/',
                    '$1' . $attrsString,
                    $content
                );
            }
        }

        return $content;
    }

    /**
     * Get block attributes with defaults
     *
     * @param array $attributes Raw attributes from block
     * @return array Processed attributes with defaults
     */
    protected function getAttributesWithDefaults($attributes)
    {
        $defaults = [
            'tagName' => 'a',
            'type' => 'button',
            'textAlign' => '',
            'url' => '',
            'title' => '',
            'text' => '',
            'linkTarget' => '',
            'rel' => '',
            'placeholder' => '',
            'backgroundColor' => '',
            'textColor' => '',
            'gradient' => '',
            'customGradient' => '',
            'width' => 0,
            'borderRadius' => 0,
            'style' => [],
            'className' => '',
            'fontSize' => '',
            'fontFamily' => '',
            'fontWeight' => '',
            'textTransform' => '',
            'letterSpacing' => '',
            'lineHeight' => '',
            'justification' => '',
            'opensInNewTab' => false,
            'iconType' => 'none',
            'icon' => '',
            'iconName' => '',
            'iconSet' => 'material',
            'iconPosition' => 'before',
            'iconSize' => '16px',
            'iconColor' => '',
            'iconStyle' => 'filled',
            'imageId' => 0,
            'imageUrl' => '',
            'imageAlt' => '',
            'imageWidth' => 0,
            'imageHeight' => 20,
            'imageSizeSlug' => '',
            'imageMarginRight' => '5px',
            'iconBackgroundColor' => '',
            'customIconBackgroundColor' => '',
            'iconBackgroundColorValue' => '',
            'customIconColor' => '',
            'iconColorValue' => '',
            'hasNoIconFill' => false,
            'rotate' => 0,
            'flipHorizontal' => false,
            'flipVertical' => false,
            'hoverEffect' => 'none',
            'iconSpacing' => '8px',
            'showIcon' => true,
            'showText' => true,
        ];

        return wp_parse_args($attributes, $defaults);
    }

    /**
     * Sanitize block attributes
     *
     * @param array $attributes Raw attributes
     * @return array Sanitized attributes
     */
    protected function sanitizeAttributes($attributes)
    {
        $sanitized = [];

        // Basic text fields
        $textFields = ['url', 'title', 'text', 'linkTarget', 'rel', 'placeholder', 'className'];
        foreach ($textFields as $field) {
            if (isset($attributes[$field])) {
                $sanitized[$field] = sanitize_text_field($attributes[$field]);
            }
        }

        // Color fields
        $colorFields = ['backgroundColor', 'textColor', 'gradient', 'customGradient', 'iconColor', 'iconBackgroundColor'];
        foreach ($colorFields as $field) {
            if (isset($attributes[$field])) {
                $sanitized[$field] = sanitize_hex_color($attributes[$field]);
            }
        }

        // Numeric fields
        $numericFields = ['width', 'borderRadius', 'imageId', 'imageWidth', 'imageHeight', 'rotate'];
        foreach ($numericFields as $field) {
            if (isset($attributes[$field])) {
                $sanitized[$field] = intval($attributes[$field]);
            }
        }

        // Boolean fields
        $booleanFields = ['opensInNewTab', 'hasNoIconFill', 'flipHorizontal', 'flipVertical', 'showIcon', 'showText'];
        foreach ($booleanFields as $field) {
            if (isset($attributes[$field])) {
                $sanitized[$field] = (bool) $attributes[$field];
            }
        }

        // Select fields with validation
        if (isset($attributes['tagName'])) {
            $sanitized['tagName'] = in_array($attributes['tagName'], ['a', 'button']) ? $attributes['tagName'] : 'a';
        }

        if (isset($attributes['iconType'])) {
            $validIconTypes = ['none', 'svg', 'image', 'upload', 'picker'];
            $sanitized['iconType'] = in_array($attributes['iconType'], $validIconTypes) ? $attributes['iconType'] : 'none';
        }

        if (isset($attributes['iconPosition'])) {
            $sanitized['iconPosition'] = in_array($attributes['iconPosition'], ['before', 'after']) ? $attributes['iconPosition'] : 'before';
        }

        if (isset($attributes['iconStyle'])) {
            $validStyles = ['filled', 'outlined', 'rounded', 'sharp', 'two-tone'];
            $sanitized['iconStyle'] = in_array($attributes['iconStyle'], $validStyles) ? $attributes['iconStyle'] : 'filled';
        }

        // Size fields
        $sizeFields = ['iconSize', 'imageMarginRight', 'iconSpacing'];
        foreach ($sizeFields as $field) {
            if (isset($attributes[$field])) {
                $sanitized[$field] = sanitize_text_field($attributes[$field]);
            }
        }

        // Complex fields
        if (isset($attributes['style']) && is_array($attributes['style'])) {
            $sanitized['style'] = $attributes['style']; // WordPress will handle this
        }

        // SVG content (needs special handling)
        if (isset($attributes['icon'])) {
            // Allow SVG content but sanitize it
            $sanitized['icon'] = wp_kses($attributes['icon'], [
                'svg' => [
                    'xmlns' => true,
                    'viewbox' => true,
                    'role' => true,
                    'aria-hidden' => true,
                    'width' => true,
                    'height' => true,
                    'fill' => true,
                    'stroke' => true,
                    'class' => true,
                    'style' => true
                ],
                'path' => [
                    'd' => true,
                    'fill' => true,
                    'stroke' => true,
                    'class' => true,
                    'style' => true
                ],
                'circle' => [
                    'cx' => true,
                    'cy' => true,
                    'r' => true,
                    'fill' => true,
                    'stroke' => true,
                    'class' => true,
                    'style' => true
                ],
                'rect' => [
                    'x' => true,
                    'y' => true,
                    'width' => true,
                    'height' => true,
                    'fill' => true,
                    'stroke' => true,
                    'class' => true,
                    'style' => true
                ]
            ]);
        }

        return $sanitized;
    }

    /**
     * Get CSS classes for the button
     *
     * @param array $attributes Block attributes
     * @return string CSS classes
     */
    protected function getButtonClasses($attributes)
    {
        $classes = ['wp-block-jankx-button__link'];

        // Style classes
        if (!empty($attributes['className'])) {
            $classes[] = $attributes['className'];
        }

        // Icon type classes
        if ($attributes['iconType'] !== 'none') {
            $classes[] = 'has-icon';
            $classes[] = 'has-icon-' . $attributes['iconType'];
        }

        // Position classes
        if ($attributes['iconType'] !== 'none') {
            $classes[] = 'icon-position-' . $attributes['iconPosition'];
        }

        // Display classes
        if (!$attributes['showText']) {
            $classes[] = 'is-icon-only';
        }

        if (!$attributes['showIcon']) {
            $classes[] = 'is-text-only';
        }

        // Size classes based on width
        if ($attributes['width'] > 0) {
            if ($attributes['width'] >= 100) {
                $classes[] = 'is-width-full';
            } elseif ($attributes['width'] >= 50) {
                $classes[] = 'is-width-large';
            }
        }

        return implode(' ', $classes);
    }

    /**
     * Get inline styles for the button
     *
     * @param array $attributes Block attributes
     * @return string Inline styles
     */
    protected function getButtonStyles($attributes)
    {
        $styles = [];

        // Width
        if ($attributes['width'] > 0) {
            $styles[] = sprintf('width: %dpx;', $attributes['width']);
        }

        // Border radius
        if ($attributes['borderRadius'] > 0) {
            $styles[] = sprintf('border-radius: %dpx;', $attributes['borderRadius']);
        }

        // Background color
        if (!empty($attributes['backgroundColor'])) {
            $styles[] = sprintf('background-color: %s;', $attributes['backgroundColor']);
        }

        // Text color
        if (!empty($attributes['textColor'])) {
            $styles[] = sprintf('color: %s;', $attributes['textColor']);
        }

        // Gradient
        if (!empty($attributes['gradient'])) {
            $styles[] = sprintf('background: %s;', $attributes['gradient']);
        }

        // Font size
        if (!empty($attributes['fontSize'])) {
            $styles[] = sprintf('font-size: %s;', $attributes['fontSize']);
        }

        // Font family
        if (!empty($attributes['fontFamily'])) {
            $styles[] = sprintf('font-family: %s;', $attributes['fontFamily']);
        }

        // Font weight
        if (!empty($attributes['fontWeight'])) {
            $styles[] = sprintf('font-weight: %s;', $attributes['fontWeight']);
        }

        // Text transform
        if (!empty($attributes['textTransform'])) {
            $styles[] = sprintf('text-transform: %s;', $attributes['textTransform']);
        }

        // Letter spacing
        if (!empty($attributes['letterSpacing'])) {
            $styles[] = sprintf('letter-spacing: %s;', $attributes['letterSpacing']);
        }

        // Line height
        if (!empty($attributes['lineHeight'])) {
            $styles[] = sprintf('line-height: %s;', $attributes['lineHeight']);
        }

        return implode(' ', $styles);
    }

    /**
     * Get inline styles for the icon
     *
     * @param array $attributes Block attributes
     * @return string Inline styles
     */
    protected function getIconStyles($attributes)
    {
        $styles = [];

        // Icon size
        if (!empty($attributes['iconSize'])) {
            $styles[] = sprintf('width: %s;', $attributes['iconSize']);
            $styles[] = sprintf('height: %s;', $attributes['iconSize']);
        }

        // Icon color
        if (!empty($attributes['iconColor'])) {
            $styles[] = sprintf('color: %s;', $attributes['iconColor']);
        }

        // Icon spacing
        if (!empty($attributes['iconSpacing'])) {
            if ($attributes['iconPosition'] === 'before') {
                $styles[] = sprintf('margin-right: %s;', $attributes['iconSpacing']);
            } else {
                $styles[] = sprintf('margin-left: %s;', $attributes['iconSpacing']);
            }
        }

        // Transform for SVG icons
        if ($attributes['iconType'] === 'svg') {
            $transform = [];

            if ($attributes['rotate'] > 0) {
                $transform[] = sprintf('rotate(%ddeg)', $attributes['rotate']);
            }

            if ($attributes['flipHorizontal']) {
                $transform[] = 'scaleX(-1)';
            }

            if ($attributes['flipVertical']) {
                $transform[] = 'scaleY(-1)';
            }

            if (!empty($transform)) {
                $styles[] = sprintf('transform: %s;', implode(' ', $transform));
            }
        }

        return implode(' ', $styles);
    }
}
