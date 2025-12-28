<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Swiper Slide Block
 *
 * Individual slide for Swiper slider
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class SwiperSlideBlock extends Block
{
    protected $blockId = 'jankx/swiper-slide';

    /**
     * Render the Swiper Slide block
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

        ob_start();
        ?>
        <div <?php echo $block_wrapper_attrs; ?>>
            <?php echo $content; ?>
        </div>
        <?php
        return ob_get_clean();
    }
}
