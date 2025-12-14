<?php

namespace Jankx\Layouts\DynamicDataLayout\ContentLoopLayouts;

class ListItemLayout
{
    public function getTitle(): string
    {
        return 'List';
    }

    public function getSupportedOptions(): array
    {
        return [
            'thumbnailPosition',
            'imageRatio',
            'showDate',
            'showAuthor',
            'showExcerpt',
            'excerptLength',
        ];
    }
}

