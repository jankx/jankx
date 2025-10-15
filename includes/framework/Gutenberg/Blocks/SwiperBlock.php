<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Swiper Block
 *
 * Modern touch slider container với InnerBlocks support
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class SwiperBlock extends Block
{
    protected $blockId = 'jankx/swiper';

    public function __construct()
    {
        parent::__construct();
    }

    public function render($attributes, $content = '', $block = null)
    {
        $slides_per_view = $attributes['slidesPerView'] ?? 1;
        $space_between = $attributes['spaceBetween'] ?? 30;
        $loop = $attributes['loop'] ?? true;
        $autoplay = $attributes['autoplay'] ?? false;
        $autoplay_delay = $attributes['autoplayDelay'] ?? 3000;
        $speed = $attributes['speed'] ?? 300;
        $navigation = $attributes['navigation'] ?? true;
        $pagination = $attributes['pagination'] ?? true;
        $effect = $attributes['effect'] ?? 'slide';
        $height = $attributes['height'] ?? 500;
        $min_height = $attributes['minHeight'] ?? 300;
        $class_name = $attributes['className'] ?? '';
        $anchor = $attributes['anchor'] ?? '';

        // Build wrapper attributes using WordPress block wrapper
        $wrapper_attributes = [
            'class' => 'swiper-effect-' . esc_attr($effect),
            'style' => sprintf(
                '--swiper-height: %dpx; --swiper-min-height: %dpx;',
                $height,
                $min_height
            )
        ];

        if ($anchor) {
            $wrapper_attributes['id'] = esc_attr($anchor);
        }

        // Get WordPress block wrapper attributes (includes spacing, colors, etc.)
        $block_wrapper_attrs = get_block_wrapper_attributes($wrapper_attributes);

        $container_attrs = sprintf(
            'data-slides-per-view="%s" data-space-between="%s" data-loop="%s" data-autoplay="%s" data-autoplay-delay="%s" data-speed="%s" data-navigation="%s" data-pagination="%s" data-effect="%s"',
            esc_attr($slides_per_view),
            esc_attr($space_between),
            $loop ? 'true' : 'false',
            $autoplay ? 'true' : 'false',
            esc_attr($autoplay_delay),
            esc_attr($speed),
            $navigation ? 'true' : 'false',
            $pagination ? 'true' : 'false',
            esc_attr($effect)
        );

        ob_start();
        ?>
        <div <?php echo $block_wrapper_attrs; ?>>
            <div class="swiper" <?php echo $container_attrs; ?>>
                <div class="swiper-wrapper">
                    <?php echo $content; ?>
                </div>

                <?php if ($navigation) : ?>
                    <div class="swiper-button-prev"></div>
                    <div class="swiper-button-next"></div>
                <?php endif; ?>

                <?php if ($pagination) : ?>
                    <div class="swiper-pagination"></div>
                <?php endif; ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}
