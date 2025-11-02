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
        $height = $attributes['height'] ?? 50;
        $min_height = $attributes['minHeight'] ?? 50;
        $class_name = $attributes['className'] ?? '';
        $anchor = $attributes['anchor'] ?? '';
        
        // Banner style attributes
        $banner_style = $attributes['bannerStyle'] ?? 'default';
        $banner_text_color = $attributes['bannerTextColor'] ?? '#ffffff';
        $banner_background_color = $attributes['bannerBackgroundColor'] ?? 'rgba(0,0,0,0.5)';
        $banner_padding = $attributes['bannerPadding'] ?? 20;
        $banner_border_radius = $attributes['bannerBorderRadius'] ?? 0;

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
            'data-slides-per-view="%s" data-space-between="%s" data-loop="%s" data-autoplay="%s" data-autoplay-delay="%s" data-speed="%s" data-navigation="%s" data-pagination="%s" data-effect="%s" data-banner-style="%s" data-banner-text-color="%s" data-banner-background-color="%s" data-banner-padding="%s" data-banner-border-radius="%s" data-swiper-height="%s"',
            esc_attr($slides_per_view),
            esc_attr($space_between),
            $loop ? 'true' : 'false',
            $autoplay ? 'true' : 'false',
            esc_attr($autoplay_delay),
            esc_attr($speed),
            $navigation ? 'true' : 'false',
            $pagination ? 'true' : 'false',
            esc_attr($effect),
            esc_attr($banner_style),
            esc_attr($banner_text_color),
            esc_attr($banner_background_color),
            esc_attr($banner_padding),
            esc_attr($banner_border_radius),
            intval($height)
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
