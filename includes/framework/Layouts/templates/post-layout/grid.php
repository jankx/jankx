<ul id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr(implode(' ', $ul_classes)); ?>"
    style="<?php echo esc_attr(sprintf('--columns-desktop: %d; --columns-tablet: %d; --columns-mobile: %d;', $columns, $columns_tablet, $columns_mobile)); ?>">
    <?php
    while ($query->have_posts()) {
        $query->the_post();
        echo '<li class="' . esc_attr($item_classes) . '">';
        echo $layout->renderPostItem();
        echo '</li>';
    }
    wp_reset_postdata();
    ?>
</ul>
