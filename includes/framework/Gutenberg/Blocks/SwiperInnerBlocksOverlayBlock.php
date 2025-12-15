<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class SwiperInnerBlocksOverlayBlock extends Block
{
    protected $blockId = 'jankx/swiper-inner-blocks-overlay';

    public function render($attributes, $content = '', $block = null)
    {
        $class_name = $attributes['className'] ?? '';

        $wrapper_classes = ['swiper-inner-blocks-overlay'];
        if (!empty($class_name)) {
            $wrapper_classes[] = esc_attr($class_name);
        }

        $wrapper_attributes = [
            'class' => implode(' ', $wrapper_classes),
        ];

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
