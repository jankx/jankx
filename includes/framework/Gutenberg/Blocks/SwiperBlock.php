<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Swiper Block
 *
 * Modern touch slider container với InnerBlocks support
 * Supports variations: default, banner, carousel, testimonial
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class SwiperBlock extends Block
{
    protected $blockId = 'jankx/swiper';

    /**
     * Render the Swiper block
     *
     * @param array $attributes Block attributes
     * @param string $content Inner blocks content
     * @param object|null $block Block object
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '', $block = null)
    {
        // Get all attributes with defaults
        $slides_per_view = $attributes['slidesPerView'] ?? 1;
        $slides_per_view_tablet = $attributes['slidesPerViewTablet'] ?? $slides_per_view;
        $slides_per_view_mobile = $attributes['slidesPerViewMobile'] ?? $slides_per_view;
        $space_between = $attributes['spaceBetween'] ?? 30;
        $loop = $attributes['loop'] ?? true;
        $autoplay = $attributes['autoplay'] ?? false;
        $autoplay_delay = $attributes['autoplayDelay'] ?? 3000;
        $speed = $attributes['speed'] ?? 300;
        $navigation = $attributes['navigation'] ?? true;
        $pagination = $attributes['pagination'] ?? true;
        $height = $attributes['height'] ?? 50;
        $min_height = $attributes['minHeight'] ?? 50;
        $class_name = $attributes['className'] ?? '';
        $anchor = $attributes['anchor'] ?? '';

        // Banner style attributes (for banner variation)
        $banner_style = $attributes['bannerStyle'] ?? 'default';
        $banner_text_color = $attributes['bannerTextColor'] ?? '#ffffff';
        $banner_background_color = $attributes['bannerBackgroundColor'] ?? 'rgba(0,0,0,0.5)';
        $banner_padding = $attributes['bannerPadding'] ?? 20;
        $banner_border_radius = $attributes['bannerBorderRadius'] ?? 0;

        // Gradient overlay attributes
        $gradient_overlay = $attributes['gradientOverlay'] ?? false;
        $gradient_color = $attributes['gradientColor'] ?? '#000000';
        $gradient_opacity = $attributes['gradientOpacity'] ?? 0.7;
        $gradient_height = $attributes['gradientHeight'] ?? 60;

        // Extract style variation from className
        $style_variation = 'default';
        if (preg_match('/is-style-(\w+)/', $class_name, $matches)) {
            $style_variation = $matches[1];
        }

        // Build wrapper attributes
        // Build custom classes - WordPress will automatically merge className from attributes
        $custom_classes = 'swiper-block';
        
        // Merge with className from attributes (includes variation styles like is-style-banner, etc.)
        if (!empty($class_name)) {
            $custom_classes = trim($custom_classes . ' ' . esc_attr($class_name));
        }

        // Build style string
        $style_string = sprintf(
            '--swiper-height: %dpx; --swiper-min-height: %dpx; --slides-per-view-desktop: %d; --slides-per-view-tablet: %d; --slides-per-view-mobile: %d; --space-between: %dpx;',
            $height,
            $min_height,
            $slides_per_view,
            $slides_per_view_tablet,
            $slides_per_view_mobile,
            $space_between
        );

        $wrapper_attributes = [
            'style' => $style_string
        ];

        if ($anchor) {
            $wrapper_attributes['id'] = esc_attr($anchor);
        }

        // Get WordPress block wrapper attributes
        // This will automatically add wp-block-jankx-swiper class and merge className from $attributes
        $block_wrapper_attrs = get_block_wrapper_attributes($wrapper_attributes);
        
        // Add our custom classes to the existing class attribute
        if (preg_match('/class=["\']([^"\']*)["\']/', $block_wrapper_attrs, $matches)) {
            $existing_classes = trim($matches[1]);
            $all_classes = trim($existing_classes . ' ' . $custom_classes);
            $block_wrapper_attrs = preg_replace(
                '/class=["\'][^"\']*["\']/',
                'class="' . esc_attr($all_classes) . '"',
                $block_wrapper_attrs
            );
        } else {
            // If no class attribute exists, add it
            $block_wrapper_attrs .= ' class="' . esc_attr($custom_classes) . '"';
        }

        // Build container data attributes for Embla initialization
        $container_attrs = sprintf(
            'data-slides-per-view="%s" data-slides-per-view-tablet="%s" data-slides-per-view-mobile="%s" data-space-between="%s" data-loop="%s" data-autoplay="%s" data-autoplay-delay="%s" data-speed="%s" data-navigation="%s" data-pagination="%s" data-banner-style="%s" data-banner-text-color="%s" data-banner-background-color="%s" data-banner-padding="%s" data-banner-border-radius="%s" data-swiper-height="%s" data-gradient-overlay="%s" data-gradient-color="%s" data-gradient-opacity="%s" data-gradient-height="%s"',
            esc_attr($slides_per_view),
            esc_attr($slides_per_view_tablet),
            esc_attr($slides_per_view_mobile),
            esc_attr($space_between),
            $loop ? 'true' : 'false',
            $autoplay ? 'true' : 'false',
            esc_attr($autoplay_delay),
            esc_attr($speed),
            $navigation ? 'true' : 'false',
            $pagination ? 'true' : 'false',
            esc_attr($banner_style),
            esc_attr($banner_text_color),
            esc_attr($banner_background_color),
            esc_attr($banner_padding),
            esc_attr($banner_border_radius),
            intval($height),
            $gradient_overlay ? 'true' : 'false',
            esc_attr($gradient_color),
            esc_attr($gradient_opacity),
            esc_attr($gradient_height)
        );

        // Separate slides and overlay
        $slides_content = '';
        $overlay_content = '';

        if ($block && !empty($block->inner_blocks)) {
            foreach ($block->inner_blocks as $inner_block) {
                // Ensure $inner_block is an array if it's not an object (compatibility with different WP versions/contexts)
                if (is_object($inner_block)) {
                    $block_name = $inner_block->name;
                    $parsed_block = (array) $inner_block; // Cast to array if render_block expects array
                    // However, render_block expects an array representing the parsed block. 
                    // WP_Block->inner_blocks contains WP_Block objects in recent versions.
                    // We need to render the WP_Block object correctly.
                    
                    // Actually, render_block() expects an array. 
                    // If we have WP_Block objects, we should use their ->parsed_block property or construct the array.
                    // But wait, render_block($inner_block->parsed_block) is likely what we need if $inner_block is a WP_Block.
                    $parsed_block_data = $inner_block->parsed_block;
                } else {
                    $block_name = $inner_block['blockName'];
                    $parsed_block_data = $inner_block;
                }

                $block_html = render_block($parsed_block_data);
                
                if ($block_name === 'jankx/swiper-inner-blocks-overlay') {
                    $overlay_content .= $block_html;
                } else {
                    $slides_content .= $block_html;
                }
            }
        } else {
            $slides_content = $content;
        }

        ob_start();
        ?>
        <div <?php echo $block_wrapper_attrs; ?>>
            <div class="embla" <?php echo $container_attrs; ?> style="position:relative;">
                <div class="embla__container">
                    <?php echo $slides_content; ?>
                </div>

                <?php echo $overlay_content; ?>

                <?php if ($navigation) : ?>
                    <div class="embla__button embla__button--prev" style="position:absolute;top:50%;left:10px;transform:translateY(-50%);width:44px;height:44px;background:rgba(0,0,0,0.7);border-radius:50%;z-index:2;"></div>
                    <div class="embla__button embla__button--next" style="position:absolute;top:50%;right:10px;transform:translateY(-50%);width:44px;height:44px;background:rgba(0,0,0,0.7);border-radius:50%;z-index:2;"></div>
                <?php endif; ?>

                <?php if ($pagination) : ?>
                    <div class="embla__dots" style="position:absolute;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:8px;z-index:2;"></div>
                <?php endif; ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}
