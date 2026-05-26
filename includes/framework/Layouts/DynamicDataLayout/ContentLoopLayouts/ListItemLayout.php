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
            'showDate',
            'showAuthor',
            'showExcerpt',
            'excerptLength',
        ];
    }
}

