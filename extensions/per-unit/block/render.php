<?php

$post_id = get_the_ID();
$attrs = isset($attributes) ? $attributes : [];
$metaKey = isset($attrs['metaKey']) ? $attrs['metaKey'] : '_unit';
$customMetaKey = isset($attrs['customMetaKey']) ? $attrs['customMetaKey'] : '';
$prefix = isset($attrs['prefix']) ? $attrs['prefix'] : '/';
$fallback = isset($attrs['fallbackText']) ? $attrs['fallbackText'] : 'kg';
$key = $metaKey === 'custom' ? $customMetaKey : $metaKey;
$value = '';
if (is_string($key) && strlen($key)) {
    $raw = get_post_meta($post_id, $key, true);
    if (is_scalar($raw)) {
        $value = trim((string) $raw);
    }
}
if ($value === '') {
    $value = $fallback;
}
$wrapper = get_block_wrapper_attributes(['class' => 'jankx-per-unit']);
echo '<span ' . $wrapper . '>';
echo '<span class="per-unit-prefix">' . esc_html($prefix) . '</span>';
echo '<span class="per-unit-value">' . esc_html($value) . '</span>';
echo '</span>';
