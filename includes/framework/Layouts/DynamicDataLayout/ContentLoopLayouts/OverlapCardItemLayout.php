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

    /**
     * Special rendering for Overlap Card
     * Separates featured image from other blocks and wraps content in a group
     */
    public function renderOverlapCard(string $imageHtml, string $contentHtml, array $attrs): string
    {
        $marginTop       = $attrs['overlapMarginTop']       ?? '-60px';
        $padding         = $attrs['overlapPadding']         ?? '20px';
        $borderRadius    = $attrs['overlapBorderRadius']    ?? '8px';
        $backgroundColor = $attrs['overlapBackgroundColor'] ?? '#ffffff';

        $groupStyle  = '--jankx-overlap-margin-top:' . $marginTop . ';';
        $groupStyle .= '--jankx-overlap-padding:' . $padding . ';';
        $groupStyle .= '--jankx-overlap-radius:' . $borderRadius . ';';
        $groupStyle .= '--jankx-overlap-bg:' . $backgroundColor . ';';

        return sprintf(
            '%s<div class="overlap-card-content" style="%s">%s</div>',
            $imageHtml,
            esc_attr($groupStyle),
            $contentHtml
        );
    }

    public function getSupportedOptions(): array
    {
        return [
            'overlapMarginTop',
            'overlapPadding',
            'overlapBorderRadius',
            'overlapBackgroundColor',
        ];
    }
}
