<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use Jankx\Layouts\DynamicDataLayout\CarouselArrowsRenderer;

/**
 * Carousel Block
 *
 * Modern touch slider container với InnerBlocks support
 * Supports variations: default, banner, carousel, testimonial
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class CarouselBlock extends Block
{
    protected $blockId = 'jankx/carousel';

    /**
     * Render the Carousel block
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
        $height = $attributes['height'] ?? 400;
        $min_height = $attributes['minHeight'] ?? 50;
        $class_name = $attributes['className'] ?? '';
        $anchor = $attributes['anchor'] ?? '';
        $full_height = $attributes['fullHeight'] ?? false;
        $fit_vh_minus_header = $attributes['fitViewportMinusHeader'] ?? false;

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

        // Navigation icon attributes
        $nav_icon_type = $attributes['navIconType'] ?? 'arrow';
        $nav_icon_size = $attributes['navIconSize'] ?? 24;
        $nav_icon_color = $attributes['navIconColor'] ?? '';
        $prev_icon_image_url = $attributes['prevIconImageUrl'] ?? '';
        $next_icon_image_url = $attributes['nextIconImageUrl'] ?? '';
        $prev_icon_svg = $attributes['prevIconSvg'] ?? '';
        $next_icon_svg = $attributes['nextIconSvg'] ?? '';
        $prev_icon_class = $attributes['prevIconClass'] ?? '';
        $next_icon_class = $attributes['nextIconClass'] ?? '';

        // Navigation button attributes
        $nav_btn_width = $attributes['navBtnWidth'] ?? 44;
        $nav_btn_height = $attributes['navBtnHeight'] ?? 44;
        $nav_btn_border_radius = $attributes['navBtnBorderRadius'] ?? 50;
        $nav_btn_bg_color = $attributes['navBtnBgColor'] ?? 'rgba(0,0,0,0.7)';

        // Arrow position / visibility (mirrors the carousel-arrows block so
        // both blocks share one renderer and one set of semantics).
        $arrows_position = (string) ($attributes['arrowsPosition'] ?? 'inside');
        $always_show_arrows = (bool) ($attributes['alwaysShowArrows'] ?? false);

        // Extract style variation from className
        $style_variation = 'default';
        if (preg_match('/is-style-(\w+)/', $class_name, $matches)) {
            $style_variation = $matches[1];
        }

        // Build custom classes list
        $custom_classes = '';

        if ($full_height) {
            $custom_classes .= ' is-full-height';
        }
        if ($fit_vh_minus_header) {
            $custom_classes .= ' fit-vh-minus-header';
        }
        if ($navigation && $arrows_position !== 'inside') {
            $position_class = CarouselArrowsRenderer::positionClass([
                'arrowsPosition' => $arrows_position,
            ]);
            if ($position_class !== '') {
                $custom_classes .= ' ' . $position_class;
            }
        }

        // Build style string
        $carousel_height_val = $full_height ? '100vh' : sprintf('%dpx', $height);
        $style_string = sprintf(
            '--carousel-height: %s; --carousel-min-height: %dpx; --slides-per-view-desktop: %d; --slides-per-view-tablet: %d; --slides-per-view-mobile: %d; --space-between: %dpx;',
            $carousel_height_val,
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
        // This will automatically add wp-block-jankx-carousel class and merge className from $attributes
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
            'data-slides-per-view="%s" data-slides-per-view-tablet="%s" data-slides-per-view-mobile="%s" data-space-between="%s" data-loop="%s" data-autoplay="%s" data-autoplay-delay="%s" data-speed="%s" data-navigation="%s" data-pagination="%s" data-banner-style="%s" data-banner-text-color="%s" data-banner-background-color="%s" data-banner-padding="%s" data-banner-border-radius="%s" data-carousel-height="%s" data-gradient-overlay="%s" data-gradient-color="%s" data-gradient-opacity="%s" data-gradient-height="%s" data-nav-icon-type="%s" data-nav-icon-size="%s" data-nav-icon-color="%s" data-prev-icon-image-url="%s" data-next-icon-image-url="%s" data-prev-icon-svg="%s" data-next-icon-svg="%s" data-prev-icon-class="%s" data-next-icon-class="%s" data-always-show-arrows="%s"',
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
            esc_attr($gradient_height),
            esc_attr($nav_icon_type),
            esc_attr($nav_icon_size),
            esc_attr($nav_icon_color),
            esc_attr($prev_icon_image_url),
            esc_attr($next_icon_image_url),
            esc_attr($prev_icon_svg),
            esc_attr($next_icon_svg),
            esc_attr($prev_icon_class),
            esc_attr($next_icon_class),
            $always_show_arrows ? 'true' : 'false'
        );

        // Separate slides and overlay
        $slides_content = '';
        $overlay_content = '';
        $slide_count = 0;

        if ($block && !empty($block->inner_blocks)) {
            foreach ($block->inner_blocks as $inner_block) {
                if (is_object($inner_block)) {
                    $block_name = $inner_block->name;
                    // Use WP_Block::render() to properly resolve inner blocks
                    $block_html = $inner_block->render();
                } else {
                    $block_name = $inner_block['blockName'];
                    $block_html = render_block($inner_block);
                }

                if ($block_name === 'jankx/carousel-inner-blocks-overlay') {
                    $overlay_content .= $block_html;
                } else {
                    $slide_count++;
                    $slides_content .= $block_html;
                }
            }
        } else {
            $slides_content = $content;
            // Dọn placeholder tĩnh hoặc phỏng đoán số lượng slide
            // (Thực tế nếu block có nội dung thì nó vẫn sẽ sinh HTML có cấu trúc)
            $slide_count = substr_count($slides_content, 'class="embla__slide"') ?: substr_count($slides_content, 'class="wp-block-jankx-carousel-slide"');
        }

        $nav_enabled = $navigation && $slide_count > 1;

        // Same renderer the carousel-arrows block uses, so icon handling,
        // sanitisation and edge-hiding semantics stay identical across both
        // blocks (and the dynamic-data/term layouts).
        $buttons_html = '';
        if ($nav_enabled) {
            $buttons_html = CarouselArrowsRenderer::render([
                'showArrows' => $navigation,
                'alwaysShowArrows' => $always_show_arrows,
                'arrowsPosition' => $arrows_position,
                'navIconType' => $nav_icon_type,
                'navIconSize' => $nav_icon_size,
                'navIconColor' => $nav_icon_color,
                'prevIconImageId' => $attributes['prevIconImageId'] ?? 0,
                'prevIconImageUrl' => $prev_icon_image_url,
                'nextIconImageId' => $attributes['nextIconImageId'] ?? 0,
                'nextIconImageUrl' => $next_icon_image_url,
                'prevIconSvg' => $prev_icon_svg,
                'nextIconSvg' => $next_icon_svg,
                'prevIconClass' => $prev_icon_class,
                'nextIconClass' => $next_icon_class,
                'navBtnWidth' => $nav_btn_width,
                'navBtnHeight' => $nav_btn_height,
                'navBtnBorderRadius' => $nav_btn_border_radius,
                'navBtnBgColor' => $nav_btn_bg_color,
            ], $navigation);
        }

        ob_start();
        ?>
        <div <?php echo $block_wrapper_attrs; ?>>
            <div class="embla" <?php echo $container_attrs; ?> style="position:relative;">
                <div class="embla__container">
                    <?php echo $slides_content; ?>
                </div>

                <?php echo $overlay_content; ?>

                <?php if ($nav_enabled && $arrows_position === 'inside') : ?>
                    <?php echo $buttons_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
                <?php endif; ?>

                <?php if ($pagination && $slide_count > 1) : ?>
                    <div class="embla__dots" style="position:absolute;bottom:12px;left:50%;transform:translateX(-50%);display:flex;gap:8px;z-index:2;"></div>
                <?php endif; ?>
            </div>

            <?php if ($nav_enabled && $arrows_position === 'bottom') : ?>
                <div class="carousel-arrows-bottom-row"><?php echo $buttons_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?></div>
            <?php elseif ($nav_enabled && $arrows_position === 'outside') : ?>
                <?php echo $buttons_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
            <?php endif; ?>
        </div>
        <?php
        return ob_get_clean();
    }
}
