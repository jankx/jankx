<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;
use WP_Query;

class DynamicDataSSRBlock extends Block
{
    protected $blockId = 'jankx/dynamic-data-ssr';

    public function render($attributes, $content = '', $block = null)
    {
        if ($block instanceof \WP_Block) {
            $context = $block->context['jankxPostTypeLayout'] ?? null;
            if (is_array($context)) {
                $query = $context['query'] ?? null;
                if ($query instanceof WP_Query) {
                    return '';
                }
            }
        }
        return $content;
    }
}
