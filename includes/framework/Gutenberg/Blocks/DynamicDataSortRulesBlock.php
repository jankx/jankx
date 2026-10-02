<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Sort Rules block.
 *
 * Settings-only block used inside the dynamic-data-layout block. It does not
 * render any markup on the frontend; the parent block reads its attributes
 * server-side and turns them into an ordered list of WP_Query sort criteria.
 *
 * Each rule mirrors the "Order By" / "Order" settings of the Query Settings
 * panel, so the editor offers exactly the same option list.
 */
class DynamicDataSortRulesBlock extends Block
{
    /**
     * Block ID.
     *
     * @var string
     */
    protected $blockId = 'jankx/dynamic-data-sort-rules';

    /**
     * Render nothing on the frontend.
     *
     * The parent dynamic-data-layout block extracts the attributes of this block
     * from its inner blocks and merges them into the query attributes.
     *
     * @param array $attributes Block attributes.
     * @param string $content Inner block content.
     * @param \WP_Block|null $block Block instance.
     * @return string
     */
    public function render($attributes, $content = '', $block = null)
    {
        return '';
    }
}