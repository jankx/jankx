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
        $image_size = $attributes['imageSize'] ?? 'cover';
        $class_name = $attributes['className'] ?? '';
        $overlay_color = $attributes['overlayColor'] ?? '';
        $overlay_opacity = $attributes['overlayOpacity'] ?? 40;

        // ── If $content already contains the slide structure (from save()) ──
        // Pass through with dynamic updates applied.
        if (!empty($content) && strpos($content, 'carousel-slide__content') !== false) {
            // Update overlay if color changed
            if (!empty($overlay_color)) {
                $opacity = (float) $overlay_opacity / 100;
                $overlay_style = sprintf(
                    'background-color:%s;opacity:%s;position:absolute;inset:0;pointer-events:none;z-index:1;',
                    esc_attr($overlay_color),
                    $opacity
                );
                // Replace existing overlay or add new one
                if (strpos($content, 'carousel-slide__overlay') !== false) {
                    $content = preg_replace(
                        '/<div class="carousel-slide__overlay" style="[^"]*"><\/div>/',
                        '<div class="carousel-slide__overlay" style="' . esc_attr($overlay_style) . '"></div>',
                        $content
                    );
                } else {
                    $content = preg_replace(
                        '/(<div class="carousel-slide__content"[^>]*>)/',
                        '$1<div class="carousel-slide__overlay" style="' . esc_attr($overlay_style) . '"></div>',
                        $content
                    );
                }
            }
            return $content;
        }

        // ── Fallback: build full HTML from scratch (no saved content) ──────
        $slide_id = $attributes['slideId'] ?? '';

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

        $block_wrapper_attrs = get_block_wrapper_attributes($wrapper_attributes);

        // Overlay style
        $overlay_style = '';
        if (!empty($overlay_color)) {
            $opacity = (float) $overlay_opacity / 100;
            $overlay_style = sprintf(
                'background-color: %s; opacity: %s; position: absolute; inset: 0; pointer-events: none; z-index: 1;',
                esc_attr($overlay_color),
                $opacity
            );
        }

        ob_start();
        ?>
        <div <?php echo $block_wrapper_attrs; ?>>
            <?php if (!empty($overlay_color)) : ?>
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
