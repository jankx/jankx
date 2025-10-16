<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Table Cell Block
 *
 * A table cell that can contain any block content
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class TableCellBlock extends Block
{
    protected $blockId = 'jankx/table-cell';

    public function __construct()
    {
        parent::__construct();
    }

    // Không cần render callback - sử dụng static HTML từ save.tsx
}

