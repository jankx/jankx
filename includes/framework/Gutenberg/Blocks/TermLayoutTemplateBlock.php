<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class TermLayoutTemplateBlock extends Block
{
    protected $blockId = 'jankx/term-layout-template';

    public function init()
    {
        // No special AJAX needed separate from TermLayoutBlock for now
    }

    public function render($attributes, $content = '', $block = null)
    {
        // On the frontend, this block itself doesn't render unless inside a TermLayoutBlock context
        // But we provide a wrapper for inner blocks
        return sprintf('<div class="term-layout-template">%s</div>', $content);
    }
}
