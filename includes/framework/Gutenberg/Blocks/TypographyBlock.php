<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class TypographyBlock extends Block
{
    protected $blockId = 'jankx/typography';

    public function render($attributes, $content = '', $block = null)
    {
        if (empty($content)) {
            return $content;
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

        $style_attr = !empty($styles) ? implode('; ', $styles) . ';' : '';
        $trimmed_content = ltrim($content);

        // Try to inject into the first tag of the child block (e.g. h2, p)
        if (preg_match('/^<([a-z0-9]+)([^>]*)>/is', $trimmed_content, $matches)) {
            $tag_name = $matches[1];
            $tag_attrs = $matches[2];

            // 1. Add Class 'has-jankx-typography'
            if (preg_match('/class=["\']([^"\']*)["\']/i', $tag_attrs, $class_matches)) {
                $existing_classes = $class_matches[1];
                if (strpos($existing_classes, 'has-jankx-typography') === false) {
                    $new_classes = $existing_classes . ' has-jankx-typography';
                    $tag_attrs = str_replace($class_matches[0], 'class="' . esc_attr(trim($new_classes)) . '"', $tag_attrs);
                }
            } else {
                $tag_attrs .= ' class="has-jankx-typography"';
            }

            // 2. Add Styles (Variables)
            if (!empty($style_attr)) {
                if (preg_match('/style=["\']([^"\']*)["\']/i', $tag_attrs, $style_matches)) {
                    $existing_style = $style_matches[1];
                    $new_style = rtrim(trim($existing_style), ';') . '; ' . $style_attr;
                    $tag_attrs = str_replace($style_matches[0], 'style="' . esc_attr(trim($new_style)) . '"', $tag_attrs);
                } else {
                    $tag_attrs .= ' style="' . esc_attr(trim($style_attr)) . '"';
                }
            }

            $new_opening_tag = "<{$tag_name}{$tag_attrs}>";
            $pos = strpos($content, $matches[0]);
            if ($pos !== false) {
                return substr_replace($content, $new_opening_tag, $pos, strlen($matches[0]));
            }
        }

        // Fallback: wrap in a single div if injection into child tag fails
        return sprintf(
            '<div class="has-jankx-typography" style="%s">%s</div>',
            esc_attr($style_attr),
            $content
        );
    }
}
