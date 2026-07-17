<?php

namespace Tests\Gutenberg\Blocks;

use Jankx\Gutenberg\Blocks\AdvancedImageBoxBlock;
use Jankx\Layouts\AdvancedImageBox\PresetRegistry;
use Jankx\Layouts\AdvancedImageBox\Presets\BorderedFramePreset;

class AdvancedImageBoxPresetRenderTest extends BlockTestCase
{
    protected AdvancedImageBoxBlock $block;

    protected function setUp(): void
    {
        parent::setUp();
        $blockPath = dirname(__DIR__, 3) . '/resources/blocks/advanced-image-box';
        $this->block = new AdvancedImageBoxBlock($blockPath);
        PresetRegistry::register(BorderedFramePreset::class);
    }

    protected function getBlockId(): string
    {
        return 'jankx/advanced-image-box';
    }

    protected function createBlockInstance()
    {
        $blockPath = dirname(__DIR__, 3) . '/resources/blocks/advanced-image-box';
        return new AdvancedImageBoxBlock($blockPath);
    }

    protected function getDefaultAttributes(): array
    {
        return [
            'preset' => 'bordered-frame',
            'presetOptions' => [],
            'style' => [
                'spacing' => [
                    'margin' => [
                        'top' => '10px',
                        'right' => '12px',
                        'bottom' => '14px',
                        'left' => '16px',
                    ],
                ],
            ],
        ];
    }

    public function test_preset_inserts_title_box_and_renders_inner_blocks_from_serialized(): void
    {
        $attributes = $this->getDefaultAttributes();
        $block = $this->createMockBlock($attributes);

        $content = '<figure class="wp-block-jankx-advanced-image-box">'
            . '<div class="wp-block-jankx-advanced-image-box__serialized-content" style="display:none">'
            . '<h3 class="wp-block-heading">Serialized Title</h3>'
            . '</div>'
            . '</figure>';

        $html = $this->block->render($attributes, $content, $block);

        $this->assertHtmlContains($html, [
            'wp-block-jankx-advanced-image-box__frame-wrapper',
            'wp-block-jankx-advanced-image-box__title-box',
            'Serialized Title',
        ], 'Preset should insert frame and title-box with serialized content');

        // Inline style should reflect spacing and padding
        $this->assertStringContainsString('style="', $html);
        $this->assertStringContainsString('bottom:14px;', $html);
        $this->assertStringContainsString('padding-top:12px;', $html);
        $this->assertStringContainsString('padding-right:20px;', $html);

        $this->assertHtmlNotContains($html, [
            'wp-block-jankx-advanced-image-box__overlay__content',
            'wp-block-jankx-advanced-image-box__serialized-content',
        ], 'Overlay and serialized wrapper should be removed');

        $this->assertStringContainsString('preset-bordered-frame', $html, 'Preset CSS class should be added');
    }

    public function test_preset_fallbacks_to_overlay_content_when_serialized_missing(): void
    {
        $attributes = $this->getDefaultAttributes();
        $block = $this->createMockBlock($attributes);

        $content = '<figure class="wp-block-jankx-advanced-image-box">'
            . '<div class="wp-block-jankx-advanced-image-box__overlay">'
            . '<div class="wp-block-jankx-advanced-image-box__overlay__content">'
            . '<h3 class="wp-block-heading">Overlay Title</h3>'
            . '</div>'
            . '</div>'
            . '</figure>';

        $html = $this->block->render($attributes, $content, $block);

        $this->assertHtmlContains($html, [
            'wp-block-jankx-advanced-image-box__frame-wrapper',
            'wp-block-jankx-advanced-image-box__title-box',
            'Overlay Title',
        ]);

        $this->assertHtmlNotContains($html, [
            'wp-block-jankx-advanced-image-box__overlay__content',
            'wp-block-jankx-advanced-image-box__overlay',
        ]);

        $this->assertStringContainsString('style="', $html);
    }

    public function test_css_margin_uses_wp_spacing_structure(): void
    {
        $attributes = $this->getDefaultAttributes();
        // Ensure preset is registered for CSS rendering
        PresetRegistry::register(BorderedFramePreset::class);
        $css = PresetRegistry::renderPresetCSS('bordered-frame', $attributes, $attributes['presetOptions']);

        $this->assertStringContainsString('margin-top: 10px;', $css);
        $this->assertStringContainsString('margin-right: 12px;', $css);
        $this->assertStringContainsString('margin-bottom: 14px;', $css);
        $this->assertStringContainsString('margin-left: 16px;', $css);
    }

    public function test_css_margin_fallbacks_to_preset_options_when_spacing_missing(): void
    {
        $attributes = $this->getDefaultAttributes();
        // Remove style.spacing.margin to force fallback
        unset($attributes['style']['spacing']['margin']);
        $presetOptions = [
            'titleMarginTop' => 5,
            'titleMarginRight' => 7,
            'titleMarginBottom' => 9,
            'titleMarginLeft' => 11,
        ];
        PresetRegistry::register(BorderedFramePreset::class);
        $css = PresetRegistry::renderPresetCSS('bordered-frame', $attributes, $presetOptions);

        $this->assertStringContainsString('margin-top: 5px;', $css);
        $this->assertStringContainsString('margin-right: 7px;', $css);
        $this->assertStringContainsString('margin-bottom: 9px;', $css);
        $this->assertStringContainsString('margin-left: 11px;', $css);
    }

    public function test_css_padding_uses_preset_options(): void
    {
        $attributes = $this->getDefaultAttributes();
        $presetOptions = [
            'titlePaddingTop' => 8,
            'titlePaddingRight' => 12,
            'titlePaddingBottom' => 10,
            'titlePaddingLeft' => 14,
        ];
        PresetRegistry::register(BorderedFramePreset::class);
        $css = PresetRegistry::renderPresetCSS('bordered-frame', $attributes, $presetOptions);

        $this->assertStringContainsString('padding-top: 8px;', $css);
        $this->assertStringContainsString('padding-right: 12px;', $css);
        $this->assertStringContainsString('padding-bottom: 10px;', $css);
        $this->assertStringContainsString('padding-left: 14px;', $css);
    }
}

