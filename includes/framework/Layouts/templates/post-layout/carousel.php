<?php
/**
 * @var WP_Query $query
 * @var Jankx\Layouts\DynamicDataLayout\BlockTemplateLayoutInterface $layout
 * @var array $carousel_classes
 * @var array $data_attributes
 * @var bool $show_arrows
 * @var string $prev_style
 * @var string $next_style
 * @var string $item_classes
 * @var bool $show_dots
 * @var string $dots_style
 */
?>
<div id="<?php echo esc_attr($id); ?>" class="<?php echo esc_attr(implode(' ', (array)$carousel_classes)); ?>" style="position: relative;"
    <?php foreach ($data_attributes as $key => $value) : ?>
        data-<?php echo esc_attr($key); ?>="<?php echo esc_attr($value); ?>"
    <?php endforeach; ?>>

    <?php if ($show_arrows): ?>
        <button class="carousel-nav carousel-arrow carousel-arrow-prev" aria-label="<?php esc_attr_e('Previous slide', 'jankx'); ?>">
            <span class="carousel-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </span>
        </button>
        <button class="carousel-nav carousel-arrow carousel-arrow-next" aria-label="<?php esc_attr_e('Next slide', 'jankx'); ?>">
            <span class="carousel-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
            </span>
        </button>
    <?php endif; ?>

    <div class="carousel-viewport embla__viewport">
        <div class="carousel-container embla__container">
            <?php
            while ($query->have_posts()) :
                $query->the_post();
                echo '<div class="carousel-slide ' . esc_attr($item_classes) . ' embla__slide">';
                echo $layout->renderPostItem();
                echo '</div>';
            endwhile;
            wp_reset_postdata();
            ?>
        </div>
    </div>

    <?php if ($show_dots): ?>
        <div class="carousel-dots"></div>
    <?php endif; ?>
</div>
