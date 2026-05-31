<?php

namespace Jankx\Layouts\DynamicDataLayout\ContentLoopLayouts;

class BoxedItemLayout extends AbstractContentLoopLayout
{
    public function getName(): string
    {
        return 'boxed';
    }

    public function getTitle(): string
    {
        return 'Boxed';
    }

    public function getDefaultTemplate(string $postType): array
    {
        return [
            ['core/post-featured-image', []],
            ['core/group', ['style' => ['spacing' => ['padding' => ['top' => '15px', 'right' => '15px', 'bottom' => '15px', 'left' => '15px']]]], [
                ['core/post-title', ['isLink' => true]],
                ['jankx/human-readable-post-date', []],
                ['core/post-excerpt', []]
            ]]
        ];
    }
}
