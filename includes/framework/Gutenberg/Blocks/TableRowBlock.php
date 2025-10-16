<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Table Row Block
 *
 * A table row with customizable cells
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class TableRowBlock extends Block
{
    protected $blockId = 'jankx/table-row';

    public function __construct()
    {
        parent::__construct();
    }

    // Không cần render callback - sử dụng static HTML từ save.tsx
}

