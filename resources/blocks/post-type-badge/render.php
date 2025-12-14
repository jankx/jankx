<?php
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render callback for jankx/post-type-badge
 * Attributes available in $attributes
 */

global $post;

if (empty($post) || !($post instanceof WP_Post)) {
    return '';
}

$attrs = isset($attributes) ? (array) $attributes : [];

$position = isset($attrs['position']) ? $attrs['position'] : 'top-right';
$offsetX = isset($attrs['offsetX']) ? $attrs['offsetX'] : '12px';
$offsetY = isset($attrs['offsetY']) ? $attrs['offsetY'] : '12px';
$bg = isset($attrs['backgroundColor']) ? $attrs['backgroundColor'] : '#2e7d32';
$color = isset($attrs['textColor']) ? $attrs['textColor'] : '#fff';
$radius = isset($attrs['borderRadius']) ? intval($attrs['borderRadius']) : 8;
$showLabel = isset($attrs['showLabel']) ? boolval($attrs['showLabel']) : true;

$ptype = get_post_type($post);
$ptype_obj = get_post_type_object($ptype);
$label = $ptype_obj ? ($ptype_obj->labels->singular_name ?? $ptype_obj->label) : $ptype;

$classes = implode(' ', array_filter([
    'wp-block-jankx-post-type-badge',
    'position-' . esc_attr($position),
]));

$style_parts = [];
// compute style for offsets
if (strpos($position, 'top') !== false) {
    $style_parts[] = 'top: ' . esc_attr($offsetY) . ';';
} else {
    $style_parts[] = 'bottom: ' . esc_attr($offsetY) . ';';
}

if (strpos($position, 'right') !== false) {
    $style_parts[] = 'right: ' . esc_attr($offsetX) . ';';
} else {
    $style_parts[] = 'left: ' . esc_attr($offsetX) . ';';
}

$style_parts[] = 'background: ' . esc_attr($bg) . ';';
$style_parts[] = 'color: ' . esc_attr($color) . ';';
$style_parts[] = 'border-radius: ' . intval($radius) . 'px;';
$style = implode(' ', $style_parts);

if (!$showLabel) {
    return '';
}

return sprintf('<div class="%s" style="%s">%s</div>', esc_attr($classes), esc_attr($style), esc_html($label));
