<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Style-only block: carries the radio box styling attributes of an
 * `jankx/advanced-filter` filter. It saves no markup; `AdvancedFilterBlock`
 * reads its attributes and turns them into CSS custom properties on the
 * filter wrapper.
 */
class FilterRadioBlock extends Block
{
    protected $blockId = 'jankx/filter-radio';
}
