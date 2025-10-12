<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Smart Tab Block
 *
 * Represents a single tab panel within a Smart Tabs container.
 * Supports icons and accepts any inner blocks for content.
 *
 * Note: This is NOT a dynamic block. Content is saved via InnerBlocks.Content
 * and rendered by the parent SmartTabsBlock.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class SmartTabBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/smart-tab';

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();
    }

    // No render callback needed - content is saved statically via InnerBlocks.Content
    // Parent SmartTabsBlock handles the dynamic rendering
}

