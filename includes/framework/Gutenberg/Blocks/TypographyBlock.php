<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class TypographyBlock extends Block
{
    protected $blockId = 'jankx/typography';

    public function render($attributes, $content = '', $block = null)
    {
        $classes = ['has-jankx-typography'];
        if (isset($attributes['className'])) {
            $classes[] = $attributes['className'];
        }

        $styles = [];
        $responsive_props = [
            'fontSizeDesktop' => '--jankx-font-size-desktop',
            'fontSizeTablet' => '--jankx-font-size-tablet',
            'fontSizeMobile' => '--jankx-font-size-mobile',
            'lineClampDesktop' => '--jankx-line-clamp-desktop',
            'lineClampTablet' => '--jankx-line-clamp-tablet',
            'lineClampMobile' => '--jankx-line-clamp-mobile',
        ];

        foreach ($responsive_props as $attr => $var) {
            if (isset($attributes[$attr])) {
                $unit = strpos($attr, 'fontSize') !== false ? 'px' : '';
                $styles[] = "{$var}: {$attributes[$attr]}{$unit}";
            }
        }

        if (isset($attributes['textColor'])) {
            $styles[] = "color: {$attributes['textColor']}";
        }

        $class_string = implode(' ', $classes);
        $block_id = 'jankx-typo-' . substr(md5(serialize($attributes)), 0, 8);

        $inline_css = "<style>.{$block_id} > * {";
        if (!empty($styles)) {
            $inline_css .= implode(';', $styles) . ' !important;';
        }
        $inline_css .= "display: -webkit-box !important;-webkit-box-orient: vertical !important;overflow: hidden !important;text-overflow: ellipsis !important;";
        $inline_css .= "}</style>";

        return sprintf(
            '%s<div class="%s %s">%s</div>',
            $inline_css,
            $class_string,
            $block_id,
            $content
        );
    }
}
