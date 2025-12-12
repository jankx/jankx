<?php

namespace Jankx\Layouts\AdvancedImageBox\Presets;

use Jankx\Layouts\AdvancedImageBox\PresetInterface;

class BorderedFramePreset implements PresetInterface
{
    public function getId(): string { return 'bordered-frame'; }
    public function getName(): string { return 'bordered_frame'; }
    public function getLabel(): string { return __('Bordered Frame', 'jankx'); }
    public function getDescription(): string { return __('Image with inner border frame and title box', 'jankx'); }
    public function getMaskType(): string { return 'css'; }
    public function getOptions(): array
    {
        return [
            ['name' => 'borderWidth','label' => __('Border Width', 'jankx'),'type' => 'range','default' => 4,'min' => 1,'max' => 20,'step' => 1,'help' => __('Width of the inner border frame in pixels', 'jankx')],
            ['name' => 'borderColor','label' => __('Border Color', 'jankx'),'type' => 'color','default' => '#ffffff','help' => __('Color of the inner border frame', 'jankx')],
            ['name' => 'borderOffset','label' => __('Border Offset', 'jankx'),'type' => 'range','default' => 20,'min' => 0,'max' => 100,'step' => 5,'help' => __('Distance from image edges to border in pixels', 'jankx')],
            ['name' => 'titleFullWidth','label' => __('Title Full Width', 'jankx'),'type' => 'toggle','default' => false,'help' => __('Make title box full width of the frame', 'jankx')],
            ['name' => 'titlePosition','label' => __('Title Position', 'jankx'),'type' => 'select','default' => 'bottom-center','options' => [
                ['label' => __('Top Left', 'jankx'), 'value' => 'top-left'],
                ['label' => __('Top Center', 'jankx'), 'value' => 'top-center'],
                ['label' => __('Top Right', 'jankx'), 'value' => 'top-right'],
                ['label' => __('Bottom Left', 'jankx'), 'value' => 'bottom-left'],
                ['label' => __('Bottom Center', 'jankx'), 'value' => 'bottom-center'],
                ['label' => __('Bottom Right', 'jankx'), 'value' => 'bottom-right'],
                ['label' => __('Left Top', 'jankx'), 'value' => 'left-top'],
                ['label' => __('Left Center', 'jankx'), 'value' => 'left-center'],
                ['label' => __('Left Bottom', 'jankx'), 'value' => 'left-bottom'],
                ['label' => __('Right Top', 'jankx'), 'value' => 'right-top'],
                ['label' => __('Right Center', 'jankx'), 'value' => 'right-center'],
                ['label' => __('Right Bottom', 'jankx'), 'value' => 'right-bottom'],
                ['label' => __('Center', 'jankx'), 'value' => 'center'],
            ],'help' => __('Position of the title box (only applies when Full Width is disabled)', 'jankx')],
            ['name' => 'titleBackground','label' => __('Title Background', 'jankx'),'type' => 'color','default' => 'rgba(0, 0, 0, 0.8)','help' => __('Background color of the title box', 'jankx')],
            ['name' => 'titleColor','label' => __('Title Color', 'jankx'),'type' => 'color','default' => '#ffffff','help' => __('Text color of the title', 'jankx')],
            ['name' => 'titleMarginTop','label' => __('Title Margin Top', 'jankx'),'type' => 'range','default' => 0,'min' => 0,'max' => 50,'step' => 1,'help' => __('Top margin of the title box in pixels', 'jankx')],
            ['name' => 'titleMarginRight','label' => __('Title Margin Right', 'jankx'),'type' => 'range','default' => 0,'min' => 0,'max' => 50,'step' => 1,'help' => __('Right margin of the title box in pixels', 'jankx')],
            ['name' => 'titleMarginBottom','label' => __('Title Margin Bottom', 'jankx'),'type' => 'range','default' => 0,'min' => 0,'max' => 50,'step' => 1,'help' => __('Bottom margin of the title box in pixels', 'jankx')],
            ['name' => 'titleMarginLeft','label' => __('Title Margin Left', 'jankx'),'type' => 'range','default' => 0,'min' => 0,'max' => 50,'step' => 1,'help' => __('Left margin of the title box in pixels', 'jankx')],
            ['name' => 'titleWidth','label' => __('Title Width', 'jankx'),'type' => 'range','default' => 0,'min' => 0,'max' => 500,'step' => 10,'help' => __('Width of the title box (0 = auto)', 'jankx')],
            ['name' => 'titleWidthUnit','label' => __('Title Width Unit', 'jankx'),'type' => 'select','default' => 'px','options' => [
                ['label' => __('Pixels (px)', 'jankx'), 'value' => 'px'],
                ['label' => __('Percent (%)', 'jankx'), 'value' => '%'],
                ['label' => __('Rem', 'jankx'), 'value' => 'rem'],
            ],'help' => __('Unit for the title box width', 'jankx')],
            ['name' => 'titleMinWidth','label' => __('Title Min Width', 'jankx'),'type' => 'range','default' => 0,'min' => 0,'max' => 500,'step' => 10,'help' => __('Minimum width of the title box in pixels', 'jankx')],
            ['name' => 'titlePaddingTop','label' => __('Title Padding Top', 'jankx'),'type' => 'range','default' => 12,'min' => 0,'max' => 100,'step' => 1,'help' => __('Top padding of the title box in pixels', 'jankx')],
            ['name' => 'titlePaddingRight','label' => __('Title Padding Right', 'jankx'),'type' => 'range','default' => 20,'min' => 0,'max' => 100,'step' => 1,'help' => __('Right padding of the title box in pixels', 'jankx')],
            ['name' => 'titlePaddingBottom','label' => __('Title Padding Bottom', 'jankx'),'type' => 'range','default' => 12,'min' => 0,'max' => 100,'step' => 1,'help' => __('Bottom padding of the title box in pixels', 'jankx')],
            ['name' => 'titlePaddingLeft','label' => __('Title Padding Left', 'jankx'),'type' => 'range','default' => 20,'min' => 0,'max' => 100,'step' => 1,'help' => __('Left padding of the title box in pixels', 'jankx')],
        ];
    }
    public function requiresInnerBlocks(): bool { return true; }
    public function getInnerBlocksTemplate(): ?array
    {
        return [['name' => 'core/heading','attributes' => ['level' => 3,'placeholder' => __('Enter image title', 'jankx'),'textAlign' => 'center']]];
    }
    public function getClasses(): array { return ['preset-bordered-frame']; }
    public function renderCSS(array $attributes, array $options = []): string
    {
        $borderWidth = $options['borderWidth'] ?? 4;
        $borderColor = $options['borderColor'] ?? '#ffffff';
        $borderOffset = $options['borderOffset'] ?? 20;
        $titleFullWidth = $options['titleFullWidth'] ?? false;
        $titlePosition = $options['titlePosition'] ?? 'bottom-center';
        $titleBackground = $options['titleBackground'] ?? 'rgba(0, 0, 0, 0.8)';
        $titleColor = $options['titleColor'] ?? '#ffffff';
        $styleMargin = $attributes['style']['spacing']['margin'] ?? null;
        $marginTop = is_array($styleMargin ?? null) && array_key_exists('top', $styleMargin) ? (string)$styleMargin['top'] : ((int)($options['titleMarginTop'] ?? 0)) . 'px';
        $marginRight = is_array($styleMargin ?? null) && array_key_exists('right', $styleMargin) ? (string)$styleMargin['right'] : ((int)($options['titleMarginRight'] ?? 0)) . 'px';
        $marginBottom = is_array($styleMargin ?? null) && array_key_exists('bottom', $styleMargin) ? (string)$styleMargin['bottom'] : ((int)($options['titleMarginBottom'] ?? 0)) . 'px';
        $marginLeft = is_array($styleMargin ?? null) && array_key_exists('left', $styleMargin) ? (string)$styleMargin['left'] : ((int)($options['titleMarginLeft'] ?? 0)) . 'px';
        $titleWidth = $options['titleWidth'] ?? 0;
        $titleWidthUnit = $options['titleWidthUnit'] ?? 'px';
        $titleMinWidth = $options['titleMinWidth'] ?? 0;
        $titlePaddingTop = $options['titlePaddingTop'] ?? 12;
        $titlePaddingRight = $options['titlePaddingRight'] ?? 20;
        $titlePaddingBottom = $options['titlePaddingBottom'] ?? 12;
        $titlePaddingLeft = $options['titlePaddingLeft'] ?? 20;
        $css = "
.wp-block-jankx-advanced-image-box.preset-bordered-frame { position: relative; display: block; }
.wp-block-jankx-advanced-image-box.preset-bordered-frame img { display: block; width: 100%; height: auto; transition: all 0.3s ease; }
.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__frame-wrapper { position: absolute; top: {$borderOffset}px; left: {$borderOffset}px; right: {$borderOffset}px; bottom: {$borderOffset}px; pointer-events: none; z-index: 1; }
.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__frame { position: absolute; top: 0; left: 0; right: 0; bottom: 0; border: {$borderWidth}px solid {$borderColor}; pointer-events: none; }
.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { position: absolute; background: {$titleBackground}; color: {$titleColor}; padding-top: {$titlePaddingTop}px; padding-right: {$titlePaddingRight}px; padding-bottom: {$titlePaddingBottom}px; padding-left: {$titlePaddingLeft}px; z-index: 2; pointer-events: none; margin-top: {$marginTop}; margin-right: {$marginRight}; margin-bottom: {$marginBottom}; margin-left: {$marginLeft}; box-sizing: border-box; max-width: 100%;
";
        if ($titleWidth > 0) { $css .= "    width: {$titleWidth}{$titleWidthUnit};\n"; }
        if ($titleMinWidth > 0) { $css .= "    min-width: {$titleMinWidth}px;\n"; }
        $css .= "}\n";
        if ($titleFullWidth) {
            if (strpos($titlePosition, 'top') === 0) { $css .= ".wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { top:0; left:0; right:0; width:100%; }\n"; }
            elseif (strpos($titlePosition, 'bottom') === 0) { $css .= ".wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { bottom:0; left:0; right:0; width:100%; }\n"; }
            elseif (strpos($titlePosition, 'left') === 0) { $css .= ".wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { top:0; left:0; bottom:0; height:100%; }\n"; }
            elseif (strpos($titlePosition, 'right') === 0) { $css .= ".wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { top:0; right:0; bottom:0; height:100%; }\n"; }
        } else {
            $map = [
                'top-left' => 'top:0; left:0;',
                'top-center' => 'top:0; left:50%; transform:translateX(-50%);',
                'top-right' => 'top:0; right:0;',
                'bottom-left' => 'bottom:0; left:0;',
                'bottom-center' => 'bottom:0; left:50%; transform:translateX(-50%);',
                'bottom-right' => 'bottom:0; right:0;',
                'left-top' => 'top:0; left:0;',
                'left-center' => 'top:50%; left:0; transform:translateY(-50%);',
                'left-bottom' => 'bottom:0; left:0;',
                'right-top' => 'top:0; right:0;',
                'right-center' => 'top:50%; right:0; transform:translateY(-50%);',
                'right-bottom' => 'bottom:0; right:0;',
                'center' => 'top:50%; left:50%; transform:translate(-50%, -50%);',
            ];
            $css .= ".wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box { " . ($map[$titlePosition] ?? '') . " }\n";
        }
        $css .= "
.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box h3,
.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__title-box .wp-block-heading { margin:0; color: {$titleColor}; font-size:1.2em; font-weight:600; }
.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__no-image { background-color: {$titleBackground}; background-size: cover; background-position: center; min-height: 240px; }
.wp-block-jankx-advanced-image-box.preset-bordered-frame .wp-block-jankx-advanced-image-box__no-image__alt { color: {$titleColor}; }
.wp-block-jankx-advanced-image-box.preset-bordered-frame:hover .wp-block-jankx-advanced-image-box__image.has-hover-zoom { transform: scale(1.05); }
.wp-block-jankx-advanced-image-box.preset-bordered-frame:hover .wp-block-jankx-advanced-image-box__image.has-hover-fade { opacity: 0.8; }
.wp-block-jankx-advanced-image-box.preset-bordered-frame:hover .wp-block-jankx-advanced-image-box__image.has-hover-blur { filter: blur(2px); }
.wp-block-jankx-advanced-image-box.preset-bordered-frame:hover .wp-block-jankx-advanced-image-box__image.has-hover-grayscale { filter: grayscale(100%); }
.wp-block-jankx-advanced-image-box.preset-bordered-frame:hover .wp-block-jankx-advanced-image-box__image.has-hover-sepia { filter: sepia(100%); }
.wp-block-jankx-advanced-image-box.preset-bordered-frame:hover .wp-block-jankx-advanced-image-box__image.has-hover-brightness { filter: brightness(1.2); }
";
        return $css;
    }
    public function renderSVGMask(array $attributes, array $options = []): string { return ''; }
    public function renderMarkup(array $attributes, array $options = [], string $content = ''): string
    {
        $styleMargin = $attributes['style']['spacing']['margin'] ?? null;
        $marginTop = is_array($styleMargin ?? null) && array_key_exists('top', $styleMargin) ? (string)$styleMargin['top'] : ((int)($options['titleMarginTop'] ?? 0)) . 'px';
        $marginRight = is_array($styleMargin ?? null) && array_key_exists('right', $styleMargin) ? (string)$styleMargin['right'] : ((int)($options['titleMarginRight'] ?? 0)) . 'px';
        $marginBottom = is_array($styleMargin ?? null) && array_key_exists('bottom', $styleMargin) ? (string)$styleMargin['bottom'] : ((int)($options['titleMarginBottom'] ?? 0)) . 'px';
        $marginLeft = is_array($styleMargin ?? null) && array_key_exists('left', $styleMargin) ? (string)$styleMargin['left'] : ((int)($options['titleMarginLeft'] ?? 0)) . 'px';
        $paddingTop = (int)($options['titlePaddingTop'] ?? 12) . 'px';
        $paddingRight = (int)($options['titlePaddingRight'] ?? 20) . 'px';
        $paddingBottom = (int)($options['titlePaddingBottom'] ?? 12) . 'px';
        $paddingLeft = (int)($options['titlePaddingLeft'] ?? 20) . 'px';
        $titlePosition = $options['titlePosition'] ?? 'bottom-center';
        $titleFullWidth = $options['titleFullWidth'] ?? false;
        $offsets = '';
        if ($titleFullWidth) {
            if (strpos($titlePosition, 'top') === 0) { $offsets .= 'top:' . esc_attr($marginTop) . '; left:0; right:0;'; }
            elseif (strpos($titlePosition, 'bottom') === 0) { $offsets .= 'bottom:' . esc_attr($marginBottom) . '; left:0; right:0;'; }
            elseif (strpos($titlePosition, 'left') === 0) { $offsets .= 'left:' . esc_attr($marginLeft) . '; top:0; bottom:0;'; }
            elseif (strpos($titlePosition, 'right') === 0) { $offsets .= 'right:' . esc_attr($marginRight) . '; top:0; bottom:0;'; }
        } else {
            $map = [
                'top-left' => 'top:' . esc_attr($marginTop) . '; left:' . esc_attr($marginLeft) . ';',
                'top-center' => 'top:' . esc_attr($marginTop) . '; left:50%; transform:translateX(-50%);',
                'top-right' => 'top:' . esc_attr($marginTop) . '; right:' . esc_attr($marginRight) . ';',
                'bottom-left' => 'bottom:' . esc_attr($marginBottom) . '; left:' . esc_attr($marginLeft) . ';',
                'bottom-center' => 'bottom:' . esc_attr($marginBottom) . '; left:50%; transform:translateX(-50%);',
                'bottom-right' => 'bottom:' . esc_attr($marginBottom) . '; right:' . esc_attr($marginRight) . ';',
                'left-top' => 'top:' . esc_attr($marginTop) . '; left:' . esc_attr($marginLeft) . ';',
                'left-center' => 'top:50%; left:' . esc_attr($marginLeft) . '; transform:translateY(-50%);',
                'left-bottom' => 'bottom:' . esc_attr($marginBottom) . '; left:' . esc_attr($marginLeft) . ';',
                'right-top' => 'top:' . esc_attr($marginTop) . '; right:' . esc_attr($marginRight) . ';',
                'right-center' => 'top:50%; right:' . esc_attr($marginRight) . '; transform:translateY(-50%);',
                'right-bottom' => 'bottom:' . esc_attr($marginBottom) . '; right:' . esc_attr($marginRight) . ';',
                'center' => 'top:50%; left:50%; transform:translate(-50%, -50%);',
            ];
            $offsets .= $map[$titlePosition] ?? '';
        }
        $inlineStyle = sprintf('padding-top:%s;padding-right:%s;padding-bottom:%s;padding-left:%s;%s', esc_attr($paddingTop), esc_attr($paddingRight), esc_attr($paddingBottom), esc_attr($paddingLeft), $offsets);
        $markup = '<div class="wp-block-jankx-advanced-image-box__frame-wrapper">';
        $markup .= '<div class="wp-block-jankx-advanced-image-box__frame"></div>';
        $markup .= sprintf('<div class="wp-block-jankx-advanced-image-box__title-box" style="%s">%s</div>', $inlineStyle, $content);
        $markup .= '</div>';
        return $markup;
    }
    public function getJavaScript(): string { return ''; }
}

