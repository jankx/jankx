<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Master Table Block
 *
 * A customizable table block with advanced styling options
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class MasterTableBlock extends Block
{
    protected $blockId = 'jankx/master-table';

    public function __construct()
    {
        parent::__construct();
    }

    // Không cần render callback - sử dụng static HTML từ save.tsx
}

