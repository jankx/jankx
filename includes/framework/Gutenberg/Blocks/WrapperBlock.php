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

        // Responsive visibility
        if (!empty($attributes['hideOnDesktop'])) {
            $classes[] = 'hide-on-desktop';
        }
        if (!empty($attributes['hideOnTablet'])) {
            $classes[] = 'hide-on-tablet';
        }
        if (!empty($attributes['hideOnMobile'])) {
            $classes[] = 'hide-on-mobile';
        }

        // Custom className
        if (!empty($attributes['className'])) {
            $classes[] = $attributes['className'];
        }

        // Add alignment classes
        if (!empty($attributes['align'])) {
            $classes[] = 'align' . $attributes['align'];
        }

        // Build inline styles
        $styles = [];

        // CSS custom properties for responsive padding/margin
        $responsive_vars = [
            'paddingUltrawide' => '--jankx-padding-ultrawide',
            'paddingDesktop' => '--jankx-padding-desktop',
            'paddingTablet' => '--jankx-padding-tablet',
            'paddingMobile' => '--jankx-padding-mobile',
            'marginUltrawide' => '--jankx-margin-ultrawide',
            'marginDesktop' => '--jankx-margin-desktop',
            'marginTablet' => '--jankx-margin-tablet',
            'marginMobile' => '--jankx-margin-mobile',
        ];

        foreach ($responsive_vars as $attr => $var) {
            if (!empty($attributes[$attr])) {
                $styles[] = "{$var}: {$attributes[$attr]}px";
            }
        }

        if (!empty($attributes['maxWidth'])) {
            $styles[] = '--jankx-max-width: ' . \esc_attr($attributes['maxWidth']);
            $styles[] = 'max-width: ' . \esc_attr($attributes['maxWidth']);
        }

        // Apply WordPress style supports
        $style_attr = $this->apply_wordpress_styles($attributes);
        if (!empty($style_attr)) {
            $styles[] = $style_attr;
        }

        $class_string = \esc_attr(implode(' ', $classes));
        $block_id = 'jankx-wrapper-' . substr(md5(serialize($attributes)), 0, 8);

        // Build inline style string
        $inline_style = '';
        if (!empty($styles)) {
            $inline_style = sprintf(' style="%s"', \esc_attr(\safecss_filter_attr(implode('; ', $styles))));
        }

        // Generate responsive CSS for child elements
        $responsive_css = $this->build_responsive_css($block_id, $attributes);

        $style_tag = '';
        if (!empty($responsive_css)) {
            $style_tag = '<style>' . $responsive_css . '</style>';
        }

        return sprintf(
            '%s<%s class="%s %s"%s>%s</%2$s>',
            $style_tag,
            $tag,
            $class_string,
            $block_id,
            $inline_style,
            $content
        );
    }

    /**
     * Apply WordPress native style supports to inline styles.
     */
    private function apply_wordpress_styles(array $attributes): string
    {
        $style = $attributes['style'] ?? [];
        $css_parts = [];

        // Color styles
        if (!empty($style['color']['background'])) {
            $css_parts[] = 'background-color: ' . \esc_attr($style['color']['background']);
        }
        if (!empty($style['color']['text'])) {
            $css_parts[] = 'color: ' . \esc_attr($style['color']['text']);
        }
        if (!empty($style['color']['gradient'])) {
            $css_parts[] = 'background: ' . \esc_attr($style['color']['gradient']);
        }

        // Typography styles
        if (!empty($style['typography']['fontSize'])) {
            $css_parts[] = 'font-size: ' . \esc_attr($style['typography']['fontSize']);
        }
        if (!empty($style['typography']['fontFamily'])) {
            $css_parts[] = 'font-family: ' . \esc_attr($style['typography']['fontFamily']);
        }
        if (!empty($style['typography']['fontWeight'])) {
            $css_parts[] = 'font-weight: ' . \esc_attr($style['typography']['fontWeight']);
        }
        if (!empty($style['typography']['fontStyle'])) {
            $css_parts[] = 'font-style: ' . \esc_attr($style['typography']['fontStyle']);
        }
        if (!empty($style['typography']['lineHeight'])) {
            $css_parts[] = 'line-height: ' . \esc_attr($style['typography']['lineHeight']);
        }
        if (!empty($style['typography']['letterSpacing'])) {
            $css_parts[] = 'letter-spacing: ' . \esc_attr($style['typography']['letterSpacing']);
        }
        if (!empty($style['typography']['textTransform'])) {
            $css_parts[] = 'text-transform: ' . \esc_attr($style['typography']['textTransform']);
        }
        if (!empty($style['typography']['textDecoration'])) {
            $css_parts[] = 'text-decoration: ' . \esc_attr($style['typography']['textDecoration']);
        }

        // Border styles
        if (!empty($style['border']['color'])) {
            $css_parts[] = 'border-color: ' . \esc_attr($style['border']['color']);
        }
        if (!empty($style['border']['width'])) {
            $css_parts[] = 'border-width: ' . \esc_attr($style['border']['width']);
        }
        if (!empty($style['border']['style'])) {
            $css_parts[] = 'border-style: ' . \esc_attr($style['border']['style']);
        }
        if (!empty($style['border']['radius'])) {
            if (is_string($style['border']['radius'])) {
                $css_parts[] = 'border-radius: ' . \esc_attr($style['border']['radius']);
            } elseif (is_array($style['border']['radius'])) {
                if (!empty($style['border']['radius']['topLeft'])) {
                    $css_parts[] = 'border-top-left-radius: ' . \esc_attr($style['border']['radius']['topLeft']);
                }
                if (!empty($style['border']['radius']['topRight'])) {
                    $css_parts[] = 'border-top-right-radius: ' . \esc_attr($style['border']['radius']['topRight']);
                }
                if (!empty($style['border']['radius']['bottomLeft'])) {
                    $css_parts[] = 'border-bottom-left-radius: ' . \esc_attr($style['border']['radius']['bottomLeft']);
                }
                if (!empty($style['border']['radius']['bottomRight'])) {
                    $css_parts[] = 'border-bottom-right-radius: ' . \esc_attr($style['border']['radius']['bottomRight']);
                }
            }
        }

        // Dimensions
        if (!empty($style['dimensions']['minHeight'])) {
            $css_parts[] = 'min-height: ' . \esc_attr($style['dimensions']['minHeight']);
        }
        if (!empty($style['dimensions']['minWidth'])) {
            $css_parts[] = 'min-width: ' . \esc_attr($style['dimensions']['minWidth']);
        }

        // Spacing
        if (!empty($style['spacing']['padding'])) {
            $padding = $style['spacing']['padding'];
            if (is_string($padding)) {
                $css_parts[] = 'padding: ' . \esc_attr($padding);
            } elseif (is_array($padding)) {
                if (!empty($padding['top'])) {
                    $css_parts[] = 'padding-top: ' . \esc_attr($padding['top']);
                }
                if (!empty($padding['right'])) {
                    $css_parts[] = 'padding-right: ' . \esc_attr($padding['right']);
                }
                if (!empty($padding['bottom'])) {
                    $css_parts[] = 'padding-bottom: ' . \esc_attr($padding['bottom']);
                }
                if (!empty($padding['left'])) {
                    $css_parts[] = 'padding-left: ' . \esc_attr($padding['left']);
                }
            }
        }
        if (!empty($style['spacing']['margin'])) {
            $margin = $style['spacing']['margin'];
            if (is_string($margin)) {
                $css_parts[] = 'margin: ' . \esc_attr($margin);
            } elseif (is_array($margin)) {
                if (!empty($margin['top'])) {
                    $css_parts[] = 'margin-top: ' . \esc_attr($margin['top']);
                }
                if (!empty($margin['right'])) {
                    $css_parts[] = 'margin-right: ' . \esc_attr($margin['right']);
                }
                if (!empty($margin['bottom'])) {
                    $css_parts[] = 'margin-bottom: ' . \esc_attr($margin['bottom']);
                }
                if (!empty($margin['left'])) {
                    $css_parts[] = 'margin-left: ' . \esc_attr($margin['left']);
                }
            }
        }

        // Shadow
        if (!empty($style['shadow'])) {
            $css_parts[] = 'box-shadow: ' . \esc_attr($style['shadow']);
        }

        // Background image
        if (!empty($style['background']['backgroundImage']['url'])) {
            $css_parts[] = 'background-image: url(' . \esc_url($style['background']['backgroundImage']['url']) . ')';
        }
        if (!empty($style['background']['backgroundSize'])) {
            $css_parts[] = 'background-size: ' . \esc_attr($style['background']['backgroundSize']);
        }

        return implode('; ', $css_parts);
    }

    /**
     * Build responsive CSS rules for child elements.
     */
    private function build_responsive_css(string $block_id, array $a): string
    {
        $css = [];

        // Desktop padding/margin on children
        $desktop_props = [];
        if (!empty($a['paddingDesktop'])) {
            $desktop_props[] = '--jankx-padding-desktop: ' . $a['paddingDesktop'] . 'px';
        }
        if (!empty($a['marginDesktop'])) {
            $desktop_props[] = '--jankx-margin-desktop: ' . $a['marginDesktop'] . 'px';
        }

        if (!empty($desktop_props)) {
            $css[] = ".{$block_id} > * {" . implode(';', $desktop_props) . " !important;}";
        }

        // Ultrawide
        $ultra_props = [];
        if (!empty($a['paddingUltrawide'])) {
            $ultra_props[] = '--jankx-padding-ultrawide: ' . $a['paddingUltrawide'] . 'px';
        }
        if (!empty($a['marginUltrawide'])) {
            $ultra_props[] = '--jankx-margin-ultrawide: ' . $a['marginUltrawide'] . 'px';
        }
        if (!empty($ultra_props)) {
            $css[] = '@media (min-width: 1600px) {.' . $block_id . ' > * {' . implode(';', $ultra_props) . ' !important;}}';
        }

        // Tablet
        $tablet_props = [];
        if (!empty($a['paddingTablet'])) {
            $tablet_props[] = '--jankx-padding-tablet: ' . $a['paddingTablet'] . 'px';
        }
        if (!empty($a['marginTablet'])) {
            $tablet_props[] = '--jankx-margin-tablet: ' . $a['marginTablet'] . 'px';
        }
        if (!empty($tablet_props)) {
            $css[] = '@media (max-width: 1024px) {.' . $block_id . ' > * {' . implode(';', $tablet_props) . ' !important;}}';
        }

        // Mobile
        $mobile_props = [];
        if (!empty($a['paddingMobile'])) {
            $mobile_props[] = '--jankx-padding-mobile: ' . $a['paddingMobile'] . 'px';
        }
        if (!empty($a['marginMobile'])) {
            $mobile_props[] = '--jankx-margin-mobile: ' . $a['marginMobile'] . 'px';
        }
        if (!empty($mobile_props)) {
            $css[] = '@media (max-width: 768px) {.' . $block_id . ' > * {' . implode(';', $mobile_props) . ' !important;}}';
        }

        return implode("\n", $css);
    }
}
