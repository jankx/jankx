<?php
/**
 * Render the Post Views block
 */

// Get block attributes
$show_icon = isset($attributes['showIcon']) ? $attributes['showIcon'] : true;
$show_label = isset($attributes['showLabel']) ? $attributes['showLabel'] : true;
$label = isset($attributes['label']) ? $attributes['label'] : 'lượt xem';
$post_id = isset($attributes['postId']) ? $attributes['postId'] : 0;

// Get post view service
$post_view_service = isset($GLOBALS['jankx_post_view_service']) ? $GLOBALS['jankx_post_view_service'] : null;

// Get view count
$view_count = 0;
if ($post_view_service) {
    if ($post_id > 0) {
        $view_count = $post_view_service->getPostViews($post_id);
    } else {
        $view_count = $post_view_service->getPostViews();
    }
}

// Format view count
$formatted_views = $post_view_service ? $post_view_service->formatViews($view_count) : number_format($view_count);

// Get CSS classes
$classes = array('jankx-views-block');
if (isset($attributes['align'])) {
    $classes[] = 'align' . $attributes['align'];
}
$class_string = implode(' ', $classes);

// Get the actual post ID for tracking
$tracking_post_id = $post_id > 0 ? $post_id : get_the_ID();
?>

<div class="<?php echo esc_attr($class_string); ?>" data-post-id="<?php echo esc_attr($tracking_post_id); ?>">
    <div class="views-content">
        <?php if ($show_icon): ?>
            <span class="views-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                </svg>
            </span>
        <?php endif; ?>

        <span class="views-count"><?php echo esc_html($formatted_views); ?></span>

        <?php if ($show_label): ?>
            <span class="views-label"><?php echo esc_html($label); ?></span>
        <?php endif; ?>
    </div>
</div>

<?php
// Script is now enqueued by PostViewService on singular pages
// No need to enqueue here to avoid duplicates
?>
