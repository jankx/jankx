<ul class="<?php echo esc_attr(implode(' ', $ul_classes)); ?>"
    style="<?php echo esc_attr(sprintf('--columns-desktop: %d; --columns-tablet: %d; --columns-mobile: %d; %s', $columns, $columns_tablet, $columns_mobile, $ratio_style)); ?>">
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
