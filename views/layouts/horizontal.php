<?php
/**
 * Horizontal Layout Template
 * Used by ViewHorizontalLayout for rendering individual items
 */

$view_id = get_the_ID();
$show_thumbnail = (bool) ($options['showFeaturedImage'] ?? true);
$show_title = (bool) ($options['showTitle'] ?? true);
$show_excerpt = (bool) ($options['showExcerpt'] ?? true);
$show_date = (bool) ($options['showDate'] ?? true);
$excerpt_length = (int) ($options['excerptLength'] ?? 55);
$image_size = $options['imageSize'] ?? 'post-thumbnail';
$thumbnail_position = $options['thumbnailPosition'] ?? 'left';

$content_classes = ['wp-block-view-content', 'horizontal-item-content'];
if ($thumbnail_position) {
    $content_classes[] = 'thumbnail-' . $thumbnail_position;
}
?>

<div class="<?php echo esc_attr(implode(' ', $content_classes)); ?>">
    <?php if ($show_thumbnail && has_post_thumbnail($view_id)): ?>
        <figure class="wp-block-view-featured-image">
            <?php the_post_thumbnail($image_size, ['style' => 'object-fit:cover;']); ?>
        </figure>
    <?php endif; ?>

    <div class="wp-block-view-content-inner">
        <?php if ($show_title): ?>
            <h2 class="wp-block-view-title">
                <a href="<?php echo esc_url(get_permalink($view_id)); ?>">
                    <?php echo esc_html(get_the_title($view_id)); ?>
                </a>
            </h2>
        <?php endif; ?>

        <?php if ($show_date): ?>
            <div class="wp-block-view-date">
                <time datetime="<?php echo esc_attr(get_post_time('c', true, $view_id)); ?>">
                    <?php echo esc_html(get_the_date('', $view_id)); ?>
                </time>
            </div>
        <?php endif; ?>

        <?php if ($show_excerpt): ?>
            <div class="wp-block-view-excerpt">
                <p class="wp-block-view-excerpt__excerpt">
                    <?php
                    $raw_excerpt = has_excerpt($view_id) ? get_the_excerpt($view_id) : get_post_field('post_content', $view_id);
                    echo esc_html(wp_trim_words($raw_excerpt, max(1, $excerpt_length)));
                    ?>
                </p>
            </div>
        <?php endif; ?>
    </div>
</div>
