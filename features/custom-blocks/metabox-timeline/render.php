<?php

$post_id = get_the_ID();
$raw = get_post_meta($post_id, 'jankx_timeline_items', true);
$items = [];
if (is_string($raw) && strlen($raw)) {
    $decoded = json_decode($raw, true);
    if (is_array($decoded)) {
        $items = $decoded;
    }
} elseif (is_array($raw)) {
    $items = $raw;
}

if (empty($items)) {
    $wrapper = get_block_wrapper_attributes(['class' => 'jankx-timeline']);
    echo '<div ' . $wrapper . '>';
    echo '<div class="jankx-timeline-empty">' . esc_html__('No timeline items', 'jankx') . '</div>';
    echo '</div>';
    return;
}

$wrapper_attrs = get_block_wrapper_attributes(['class' => 'jankx-timeline']);
echo '<div ' . $wrapper_attrs . '>';
echo '<div class="jankx-timeline-line"></div>';
foreach ($items as $i => $item) {
    $time = isset($item['time']) ? $item['time'] : '';
    $title = isset($item['title']) ? $item['title'] : '';
    $description = isset($item['description']) ? $item['description'] : '';
    $imageId = isset($item['image']) ? (int) $item['image'] : 0;
    $imgUrl = $imageId ? wp_get_attachment_image_url($imageId, 'medium') : '';
    echo '<div class="jankx-timeline-item">';
    echo '<div class="jankx-timeline-marker"></div>';
    echo '<div class="jankx-timeline-card">';
    if ($time) {
        echo '<div class="jankx-timeline-time">' . esc_html($time) . '</div>';
    }
    if ($title) {
        echo '<div class="jankx-timeline-title">' . esc_html($title) . '</div>';
    }
    if ($description) {
        echo '<div class="jankx-timeline-desc">' . esc_html($description) . '</div>';
    }
    if ($imgUrl) {
        echo '<div class="jankx-timeline-image"><img src="' . esc_url($imgUrl) . '" alt=""></div>';
    }
    echo '</div>';
    echo '</div>';
}
echo '</div>';
