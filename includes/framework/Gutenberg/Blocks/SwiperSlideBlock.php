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

    public function __construct()
    {
        parent::__construct();
    }

    public function render($attributes, $content = '', $block = null)
    {
        $slide_id = $attributes['slideId'] ?? '';

        // Build wrapper attributes
        $wrapper_attributes = [
            'class' => 'swiper-slide'
        ];

        if ($slide_id) {
            $wrapper_attributes['data-slide-id'] = esc_attr($slide_id);
        }

        // Get WordPress block wrapper attributes (includes spacing, colors, background, etc.)
        $block_wrapper_attrs = get_block_wrapper_attributes($wrapper_attributes);

        return sprintf(
            '<div %s>%s</div>',
            $block_wrapper_attrs,
            $content
        );
    }
}
