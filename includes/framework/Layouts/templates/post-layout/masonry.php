<?php
/**
 * @var WP_Query $query
 * @var Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutInterface $layout
 * @var int $columns
 */
?>
<div id="<?php echo esc_attr($id); ?>" class="wp-block-jankx-dynamic-data-layout post-type-layout-masonry columns-<?php echo esc_attr(max(1, $columns)); ?>">
    <?php
    while ($query->have_posts()) {
        $query->the_post();
        echo $layout->renderPostItem();
    }
    wp_reset_postdata();
    ?>
</div>
