<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class WrapperBlock extends Block
{
    protected $blockId = 'jankx/wrapper';

    public function render($attributes, $content = '', $block = null)
    {
        $renderMode = isset($attributes['renderMode']) ? $attributes['renderMode'] : 'dynamic';

        // If static mode and we already have content from JS save(), just return it
        if ($renderMode === 'static' && !empty($content)) {
            return $content;
        }

        $tag = isset($attributes['tagName']) ? $attributes['tagName'] : 'div';
        $classes = ['has-jankx-responsive-wrapper'];
        if (isset($attributes['hideOnDesktop']) && $attributes['hideOnDesktop']) {
            $classes[] = 'hide-on-desktop';
        }
        if (isset($attributes['hideOnTablet']) && $attributes['hideOnTablet']) {
            $classes[] = 'hide-on-tablet';
        }
        if (isset($attributes['hideOnMobile']) && $attributes['hideOnMobile']) {
            $classes[] = 'hide-on-mobile';
        }
        if (isset($attributes['className'])) {
            $classes[] = $attributes['className'];
        }

        $styles = [];
        $responsive_props = [
            'paddingDesktop' => '--jankx-padding-desktop',
            'paddingTablet' => '--jankx-padding-tablet',
            'paddingMobile' => '--jankx-padding-mobile',
            'marginDesktop' => '--jankx-margin-desktop',
            'marginTablet' => '--jankx-margin-tablet',
            'marginMobile' => '--jankx-margin-mobile',
        ];

        foreach ($responsive_props as $attr => $var) {
            if (isset($attributes[$attr])) {
                $styles[] = "{$var}: {$attributes[$attr]}px";
            }
        }

        $class_string = implode(' ', $classes);
        $block_id = 'jankx-wrapper-' . substr(md5(serialize($attributes)), 0, 8);

        $style_rules = [];
        if (!empty($styles)) {
            $style_rules[] = implode(';', $styles);
        }

        $inline_css = sprintf(
            '<style>.%s > * {%s}</style>',
            $block_id,
            !empty($style_rules) ? implode(';', $style_rules) . ' !important;' : ''
        );

        return sprintf(
            '%s<%s class="%s %s">%s</%2$s>',
            $inline_css,
            $tag,
            $class_string,
            $block_id,
            $content
        );
    }
}
