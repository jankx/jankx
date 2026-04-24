<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class CarouselInnerBlocksOverlayBlock extends Block
{
    protected $blockId = 'jankx/carousel-inner-blocks-overlay';

    public function render($attributes, $content = '', $block = null)
    {
        $class_name = $attributes['className'] ?? '';

        $wrapper_classes = ['carousel-inner-blocks-overlay'];
        if (!empty($class_name)) {
            $wrapper_classes[] = esc_attr($class_name);
        }

        $wrapper_attributes = [
            'class' => implode(' ', $wrapper_classes),
            'style' => 'z-index:1;-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none; user-select: none',
            'data-overlay' => 'true',
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
