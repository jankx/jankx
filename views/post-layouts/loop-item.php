<?php
/**
 * Post Layout Loop Item Template
 *
 * This template is used to render individual post items in post layouts.
 */

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

// Set default values for template variables
$post_classes = isset($post_classes) ? $post_classes : ['post-item'];
$attributes = isset($attributes) ? $attributes : '';
$show_thumbnail = isset($show_thumbnail) ? $show_thumbnail : true;
$show_title = isset($show_title) ? $show_title : true;
$show_excerpt = isset($show_excerpt) ? $show_excerpt : true;
$thumbnail_size = isset($thumbnail_size) ? $thumbnail_size : 'medium';
$post_title_tag = isset($post_title_tag) ? $post_title_tag : 'h3';
$data_index = isset($data_index) ? $data_index : 0;
?>
<div <?php post_class($post_classes); ?> <?php echo $attributes; ?>>
    <?php if ($show_thumbnail && has_post_thumbnail($post->ID)) : ?>
        <div class="post-thumbnail">
            <a href="<?php echo get_permalink($post->ID); ?>">
                <?php echo get_the_post_thumbnail($post->ID, $thumbnail_size); ?>
            </a>
        </div>
    <?php endif; ?>

    <div class="post-content">
        <?php if ($show_title) : ?>
        <<?php echo $post_title_tag; ?> class="post-title">
            <a href="<?php echo get_permalink($post->ID); ?>">
                <?php echo get_the_title($post->ID); ?>
            </a>
        </<?php echo $post_title_tag; ?>>
        <?php endif; ?>

        <?php if ($show_excerpt) : ?>
        <div class="post-excerpt">
            <?php echo wp_trim_words(get_the_excerpt($post->ID), 20); ?>
        </div>
        <?php endif; ?>

        <div class="post-meta">
            <span class="post-date"><?php echo get_the_date('', $post->ID); ?></span>
            <?php if ($post->post_type !== 'page') : ?>
                <span class="post-type"><?php echo ucfirst($post->post_type); ?></span>
            <?php endif; ?>
        </div>
    </div>
</div>