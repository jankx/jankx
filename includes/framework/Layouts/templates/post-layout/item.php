<?php
/**
 * @var int $post_id
 * @var array $options
 * @var string $loop_layout
 * @var string $post_type
 */
?>
<div class="post-content-wrapper<?php echo $loop_layout === 'boxed' ? ' card-body' : ''; ?>">
    <?php if (!empty($options['showFeaturedImage']) && has_post_thumbnail($post_id)) : ?>
        <figure class="wp-block-post-featured-image">
            <?php echo get_the_post_thumbnail($post_id, $options['imageSize'] ?? 'post-thumbnail'); ?>
        </figure>
    <?php endif; ?>

    <?php if (!empty($options['showTitle'])) : ?>
        <h2 class="wp-block-post-title">
            <a href="<?php echo esc_url(get_permalink($post_id)); ?>">
                <?php echo esc_html(get_the_title($post_id)); ?>
            </a>
        </h2>
    <?php endif; ?>

    <?php if (!empty($options['showDate'])) : ?>
        <div class="wp-block-post-date">
            <?php echo esc_html(get_the_date('', $post_id)); ?>
        </div>
    <?php endif; ?>

    <?php if (!empty($options['showExcerpt'])) : ?>
        <div class="wp-block-post-excerpt">
            <p><?php echo wp_trim_words(get_the_excerpt($post_id), (int)($options['excerptLength'] ?? 55)); ?></p>
        </div>
    <?php endif; ?>
</div>
