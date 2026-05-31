<?php

namespace Jankx\Layouts\DynamicDataLayout\ContentLoopLayouts;

class HorizontalItemLayout extends AbstractContentLoopLayout
{
    public function getName(): string
    {
        return 'horizontal';
    }

    public function getTitle(): string
    {
        return 'Horizontal';
    }

    public function getDefaultTemplate(string $postType): array
    {
        return [
            ['core/columns', [], [
                ['core/column', ['width' => '33.33%'], [
                    ['core/post-featured-image', []]
                ]],
                ['core/column', ['width' => '66.66%'], [
                    ['core/post-title', ['isLink' => true]],
                    ['jankx/human-readable-post-date', []],
                    ['core/post-excerpt', []]
                ]]
            ]]
        ];
    }
}
