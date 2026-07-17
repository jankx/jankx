<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class StickyBoxBlock extends Block
{
    protected $blockId = 'jankx/sticky-box';

    public function render($attributes, $content = '', $block = null)
    {
        $stickyEnabled = !empty($attributes['stickyEnabled']);
        $offsetTop = isset($attributes['offsetTop']) ? (int) $attributes['offsetTop'] : 16;

        $classes = ['jankx-sticky-box'];
        if ($stickyEnabled) {
            $classes[] = 'sticky-enabled';
        }

        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => implode(' ', $classes),
            'style' => '--sticky-top: ' . $offsetTop . 'px;',
        ]);

        return sprintf('<div %s>%s</div>', $wrapper_attributes, $content);
    }
}
