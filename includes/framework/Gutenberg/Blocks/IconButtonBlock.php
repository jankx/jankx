<?php

namespace Jankx\Framework\Gutenberg\Blocks;

class IconButtonBlock extends Block
{
    protected $blockName = 'jankx/icon-button';

    public function register()
    {
        $blockPath = $this->getBlockPath();
        $metadata = $this->getBlockMetadata($blockPath);

        $this->registerBlock($blockPath, $metadata);
    }
}
