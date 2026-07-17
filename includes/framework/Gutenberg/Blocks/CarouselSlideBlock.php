<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Carousel Slide Block
 *
 * Individual slide for Carousel slider
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class CarouselSlideBlock extends Block
{
    protected $blockId = 'jankx/carousel-slide';

    /**
     * Render the Carousel Slide block
     *
     * @param array $attributes Block attributes
     * @param string $content Inner blocks content
     * @param object|null $block Block object
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '', $block = null)
    {
        // Get attributes with defaults
        $slide_id = $attributes['slideId'] ?? '';
        $image_size = $attributes['imageSize'] ?? 'cover';
        $class_name = $attributes['className'] ?? '';
        $overlay_color = $attributes['overlayColor'] ?? '';
        $overlay_opacity = $attributes['overlayOpacity'] ?? 40;

        // Build wrapper classes
        $wrapper_classes = ['embla__slide'];
        if (!empty($image_size)) {
            $wrapper_classes[] = 'image-size-' . esc_attr($image_size);
        }
        if (!empty($class_name)) {
            $wrapper_classes[] = esc_attr($class_name);
        }

        // Build wrapper attributes
        $wrapper_attributes = [
            'class' => implode(' ', $wrapper_classes),
        ];

        if (!empty($slide_id)) {
            $wrapper_attributes['data-slide-id'] = esc_attr($slide_id);
        }
        
        if (!empty($image_size)) {
            $wrapper_attributes['data-image-size'] = esc_attr($image_size);
        }

        // Get WordPress block wrapper attributes
        $block_wrapper_attrs = get_block_wrapper_attributes($wrapper_attributes);

        // Overlay style
        $overlay_style = '';
        if (!empty($overlay_color)) {
            $opacity = $overlay_opacity / 100;
            $overlay_style = sprintf(
                'background-color: %s; opacity: %s; position: absolute; inset: 0; pointer-events: none; z-index: 1;',
                esc_attr($overlay_color),
                $opacity
            );
        }

        // Cleanup legacy nesting from previous versions where JS save() included the block wrapper
        // This prevents the "duplicate nested code" issue.
        if (strpos($content, 'wp-block-jankx-carousel-slide') !== false) {
            // Case 1: Full structure with content wrapper
            if (preg_match('/<div[^>]*class="[^"]*carousel-slide__content[^"]*"[^>]*>(.*)<\/div>\s*<\/div>\s*$/is', $content, $matches)) {
                $content = $matches[1];
            } 
            // Case 2: Simple wrapper
            elseif (preg_match('/^<div[^>]*class="[^"]*wp-block-jankx-carousel-slide[^"]*"[^>]*>(.*)<\/div>\s*$/is', trim($content), $matches)) {
                $content = $matches[1];
            }
        }

        $has_saved_overlay = strpos($content, 'carousel-slide__overlay') !== false;
        ob_start();
        ?>
        <div <?php echo $block_wrapper_attrs; ?>>
            <?php if (!empty($overlay_color) && !$has_saved_overlay) : ?>
                <div class="carousel-slide__overlay" style="<?php echo $overlay_style; ?>"></div>
            <?php endif; ?>
            <div class="carousel-slide__content" style="position: relative; z-index: 2; width: 100%; height: 100%;">
                <?php echo $content; ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}
