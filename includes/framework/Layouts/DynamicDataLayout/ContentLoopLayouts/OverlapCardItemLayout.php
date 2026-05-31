<?php

namespace Jankx\Layouts\DynamicDataLayout\ContentLoopLayouts;

class OverlapCardItemLayout extends AbstractContentLoopLayout
{
    public function getName(): string
    {
        return 'overlap-card';
    }

    public function getTitle(): string
    {
        return 'Overlap Card';
    }

    public function getDefaultTemplate(string $postType): array
    {
        return [
            ['core/post-featured-image', []],
            ['core/group', [
                'className' => 'overlap-card-content',
                'style' => [
                    'spacing' => [
                        'margin' => ['top' => '-60px'],
                        'padding' => ['top' => '20px', 'right' => '20px', 'bottom' => '20px', 'left' => '20px']
                    ],
                    'border' => ['radius' => '8px'],
                    'color' => ['background' => '#ffffff']
                ]
            ], [
                ['core/post-title', ['isLink' => true]],
                ['jankx/human-readable-post-date', []]
            ]]
        ];
    }
}
