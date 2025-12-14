<?php

namespace Jankx\Layouts\DynamicDataLayout\ContentLoopLayouts;

class CardItemLayout
{
    public function getTitle(): string
    {
        return 'Card';
    }

    public function getSupportedOptions(): array
    {
        return [
            'thumbnailPosition',
            'imageRatio',
            'itemSpacing',
            'showItemBorder',
            'itemBorderRadius',
            'showExcerpt',
            'excerptLength',
        ];
    }
}

