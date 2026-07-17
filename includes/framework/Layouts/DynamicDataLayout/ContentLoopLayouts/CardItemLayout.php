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
            'itemSpacing',
            'showItemBorder',
            'itemBorderRadius',
            'showExcerpt',
            'excerptLength',
        ];
    }
}

