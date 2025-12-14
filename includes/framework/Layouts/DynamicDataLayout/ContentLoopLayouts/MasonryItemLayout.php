<?php

namespace Jankx\Layouts\DynamicDataLayout\ContentLoopLayouts;

class MasonryItemLayout
{
    public function getTitle(): string
    {
        return 'Masonry';
    }

    public function getSupportedOptions(): array
    {
        return [
            'thumbnailPosition',
            'imageRatio',
            'itemSpacing',
            'showItemBorder',
            'itemBorderRadius',
        ];
    }
}

