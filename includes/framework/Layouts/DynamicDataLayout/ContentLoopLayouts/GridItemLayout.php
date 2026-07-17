<?php

namespace Jankx\Layouts\DynamicDataLayout\ContentLoopLayouts;

class GridItemLayout
{
    public function getTitle(): string
    {
        return 'Grid';
    }

    public function getSupportedOptions(): array
    {
        return [
            'thumbnailPosition',
            'itemSpacing',
            'showItemBorder',
            'itemBorderRadius',
        ];
    }
}

