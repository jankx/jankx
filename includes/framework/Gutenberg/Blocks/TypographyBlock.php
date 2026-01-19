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

        $style_attr = !empty($styles) ? ' style="' . implode(';', $styles) . '"' : '';
        $class_attr = ' class="' . implode(' ', $classes) . '"';

        return sprintf(
            '<div%1$s%2$s>%3$s</div>',
            $class_attr,
            $style_attr,
            $content
        );
    }
}
