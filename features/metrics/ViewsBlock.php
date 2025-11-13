<?php

namespace Jankx\Features\Metrics;

use Jankx\Gutenberg\Block;

class ViewsBlock extends Block
{
    protected $blockId = 'jankx/views';

    public function init()
    {
        // Block is registered via block.json
        // No additional scripts needed for this block
    }
}
