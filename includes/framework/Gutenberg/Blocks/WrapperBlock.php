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

        $style_attr = !empty($styles) ? ' style="' . implode(';', $styles) . '"' : '';
        $class_attr = ' class="' . implode(' ', $classes) . '"';

        return sprintf(
            '<%1$s%2$s%3$s>%4$s</%1$s>',
            $tag,
            $class_attr,
            $style_attr,
            $content
        );
    }
}
