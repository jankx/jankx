<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class TypographyBlock extends Block
{
    protected $blockId = 'jankx/typography';

    /**
     * CSS rules extracted from style.scss — output as inline <style> tag.
     */
    private const INTERNAL_CSS = '.jankx-typography-block{font-size:var(--jankx-font-size-desktop,initial);display:-webkit-box;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis;-webkit-line-clamp:var(--jankx-line-clamp-desktop,initial);line-clamp:var(--jankx-line-clamp-desktop,initial)}@media(max-width:1024px){.jankx-typography-block{font-size:var(--jankx-font-size-tablet,var(--jankx-font-size-desktop,initial));-webkit-line-clamp:var(--jankx-line-clamp-tablet,var(--jankx-line-clamp-desktop,initial));line-clamp:var(--jankx-line-clamp-tablet,var(--jankx-line-clamp-desktop,initial))}}@media(max-width:768px){.jankx-typography-block{font-size:var(--jankx-font-size-mobile,var(--jankx-font-size-tablet,var(--jankx-font-size-desktop,initial)));-webkit-line-clamp:var(--jankx-line-clamp-mobile,var(--jankx-line-clamp-tablet,var(--jankx-line-clamp-desktop,initial)));line-clamp:var(--jankx-line-clamp-mobile,var(--jankx-line-clamp-tablet,var(--jankx-line-clamp-desktop,initial)))}}';

    public function render($attributes, $content = '', $block = null)
    {
        if (empty($content)) {
            return $content;
        }

        // Build inline CSS custom properties from block attributes
        $css_vars = [];
        $responsive_props = [
            'fontSizeDesktop' => ['--jankx-font-size-desktop', 'px'],
            'fontSizeTablet'  => ['--jankx-font-size-tablet', 'px'],
            'fontSizeMobile'  => ['--jankx-font-size-mobile', 'px'],
            'lineClampDesktop' => ['--jankx-line-clamp-desktop', ''],
            'lineClampTablet'  => ['--jankx-line-clamp-tablet', ''],
            'lineClampMobile'  => ['--jankx-line-clamp-mobile', ''],
        ];

        foreach ($responsive_props as $attr => [$var, $unit]) {
            if (isset($attributes[$attr]) && $attributes[$attr] !== '') {
                $css_vars[] = "{$var}: {$attributes[$attr]}{$unit}";
            }
        }

        if (!empty($attributes['textColor'])) {
            $css_vars[] = "color: {$attributes['textColor']}";
        }

        $style_value = !empty($css_vars) ? implode('; ', $css_vars) : '';
        $tag_class = 'jankx-typography-block';

        $trimmed_content = ltrim($content);

        // Inject class + style into the first child block's opening tag
        if (preg_match('/^<([a-z0-9]+)([^>]*)>/is', $trimmed_content, $matches)) {
            $tag_name = $matches[1];
            $tag_attrs = $matches[2];

            // Append .jankx-typography-block class
            if (preg_match('/class=["\']([^"\']*)["\']/i', $tag_attrs, $class_matches)) {
                $existing_classes = $class_matches[1];
                if (strpos($existing_classes, $tag_class) === false) {
                    $new_classes = trim($existing_classes . ' ' . $tag_class);
                    $tag_attrs = str_replace(
                        $class_matches[0],
                        'class="' . esc_attr($new_classes) . '"',
                        $tag_attrs
                    );
                }
            } else {
                $tag_attrs .= ' class="' . esc_attr($tag_class) . '"';
            }

            // Append CSS custom properties to style attribute
            if (!empty($style_value)) {
                if (preg_match('/style="/i', $tag_attrs, $style_pos_match, PREG_OFFSET_CAPTURE)) {
                    $style_start = $style_pos_match[0][1];
                    $value_start = $style_start + strlen('style="');

                    $search_from = $value_start;
                    $closing_quote_pos = false;
                    $attr_len = strlen($tag_attrs);

                    while ($search_from < $attr_len) {
                        $q_pos = strpos($tag_attrs, '"', $search_from);
                        if ($q_pos === false) {
                            break;
                        }
                        $next_char = isset($tag_attrs[$q_pos + 1]) ? $tag_attrs[$q_pos + 1] : '';
                        if ($next_char === '' || $next_char === ' ' || $next_char === '/') {
                            $closing_quote_pos = $q_pos;
                            break;
                        }
                        $search_from = $q_pos + 1;
                    }

                    if ($closing_quote_pos !== false) {
                        $existing_style = substr($tag_attrs, $value_start, $closing_quote_pos - $value_start);
                        $new_style = rtrim($existing_style, '; ') . '; ' . $style_value;
                        $tag_attrs = substr($tag_attrs, 0, $value_start) . $new_style . substr($tag_attrs, $closing_quote_pos);
                    } else {
                        $tag_attrs .= ' style="' . esc_attr($style_value) . '"';
                    }
                } else {
                    $tag_attrs .= ' style="' . esc_attr($style_value) . '"';
                }
            }

            $new_opening_tag = "<{$tag_name}{$tag_attrs}>";
            $pos = strpos($content, $matches[0]);
            if ($pos !== false) {
                $injected_content = substr_replace($content, $new_opening_tag, $pos, strlen($matches[0]));
                return '<style>' . self::INTERNAL_CSS . '</style>' . $injected_content;
            }
        }

        // Fallback: wrap in a div
        return '<style>' . self::INTERNAL_CSS . '</style>' . sprintf(
            '<div class="%s" style="%s">%s</div>',
            esc_attr($tag_class),
            esc_attr($style_value),
            $content
        );
    }
}
