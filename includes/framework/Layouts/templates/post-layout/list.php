<?php
/**
 * @var WP_Query $query
 * @var Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutInterface $layout
 */
?>
<div class="wp-block-jankx-dynamic-data-layout post-type-layout-list">
    <?php
    while ($query->have_posts()) {
        $query->the_post();
        echo $layout->renderPostItem();
    }
    wp_reset_postdata();
    ?>
</div>
