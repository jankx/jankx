<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Tab Block
 *
 * This block represents a single tab within a tabs container.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class TabBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/tab';

    /**
     * Block attributes
     *
     * @var array
     */
    protected $attributes = [];
}
