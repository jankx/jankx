<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class MasterDataTemplateBlock extends Block
{
    protected $blockId = 'jankx/master-data-template';
    
    // Logic render is handled by parent block (MasterDataLayoutBlock)
    // or via InnerBlocks.Content in save.
}
