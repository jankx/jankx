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

        // Theme color classes
        if (!empty($attributes['backgroundColor'])) {
            $classes[] = 'has-' . \esc_attr($attributes['backgroundColor']) . '-background-color';
        }
        if (!empty($attributes['textColor'])) {
            $classes[] = 'has-' . \esc_attr($attributes['textColor']) . '-color';
        }
        if (!empty($attributes['gradient'])) {
            $classes[] = 'has-' . \esc_attr($attributes['gradient']) . '-gradient-background';
        }

        // Font size class
        if (!empty($attributes['fontSize'])) {
            $classes[] = 'has-' . \esc_attr($attributes['fontSize']) . '-font-size';
        }

        // Custom className
        if (!empty($attributes['className'])) {
            $classes[] = $attributes['className'];
        }

        // Build inline styles
        $styles = [];

        // CSS custom properties for responsive padding/margin
        $responsive_vars = [
            'paddingDesktop' => '--jankx-padding-desktop',
            'paddingTablet' => '--jankx-padding-tablet',
            'paddingMobile' => '--jankx-padding-mobile',
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

        // Background color
        if (!empty($attributes['customBackgroundColor'])) {
            $styles[] = 'background-color: ' . \esc_attr($attributes['customBackgroundColor']);
        }

        // Text color
        if (!empty($attributes['customTextColor'])) {
            $styles[] = 'color: ' . \esc_attr($attributes['customTextColor']);
        }

        // Gradient
        if (!empty($attributes['customGradient'])) {
            $styles[] = 'background: ' . \esc_attr($attributes['customGradient']);
        }

        // Font size
        if (!empty($attributes['customFontSize'])) {
            $styles[] = 'font-size: ' . (int) $attributes['customFontSize'] . 'px';
        }

        // Font family
        if (!empty($attributes['customFontFamily'])) {
            $styles[] = 'font-family: ' . \esc_attr($attributes['customFontFamily']);
        }

        // Font weight
        if (!empty($attributes['fontWeight'])) {
            $styles[] = 'font-weight: ' . \esc_attr($attributes['fontWeight']);
        }

        // Line height
        if (!empty($attributes['lineHeight'])) {
            $styles[] = 'line-height: ' . \esc_attr($attributes['lineHeight']);
        }

        // Letter spacing
        if (!empty($attributes['letterSpacing'])) {
            $styles[] = 'letter-spacing: ' . \esc_attr($attributes['letterSpacing']);
        }

        // Text transform
        if (!empty($attributes['textTransform'])) {
            $styles[] = 'text-transform: ' . \esc_attr($attributes['textTransform']);
        }

        // Text decoration
        if (!empty($attributes['textDecoration'])) {
            $styles[] = 'text-decoration: ' . \esc_attr($attributes['textDecoration']);
        }

        // Border color
        if (!empty($attributes['customBorderColor'])) {
            $styles[] = 'border-color: ' . \esc_attr($attributes['customBorderColor']);
        }

        // Border width
        if (!empty($attributes['borderWidth'])) {
            $styles[] = 'border-width: ' . \esc_attr($attributes['borderWidth']);
        }

        // Border style
        if (!empty($attributes['borderStyle']) && $attributes['borderStyle'] !== 'none') {
            $styles[] = 'border-style: ' . \esc_attr($attributes['borderStyle']);
        }

        // Border radius
        if (!empty($attributes['borderRadius'])) {
            $styles[] = 'border-radius: ' . \esc_attr($attributes['borderRadius']);
        } else {
            $tl = $attributes['borderRadiusTopLeft'] ?? '0';
            $tr = $attributes['borderRadiusTopRight'] ?? '0';
            $bl = $attributes['borderRadiusBottomLeft'] ?? '0';
            $br = $attributes['borderRadiusBottomRight'] ?? '0';
            if (!empty($attributes['borderRadiusTopLeft']) || !empty($attributes['borderRadiusTopRight'])
                || !empty($attributes['borderRadiusBottomLeft']) || !empty($attributes['borderRadiusBottomRight'])) {
                $styles[] = sprintf('border-radius: %s %s %s %s', \esc_attr($tl), \esc_attr($tr), \esc_attr($br), \esc_attr($bl));
            }
        }

        // Min height
        if (!empty($attributes['minHeight'])) {
            $styles[] = 'min-height: ' . \esc_attr($attributes['minHeight']);
        }

        // Overflow
        if (!empty($attributes['overflow'])) {
            $styles[] = 'overflow: ' . \esc_attr($attributes['overflow']);
        }

        // Position
        if (!empty($attributes['position'])) {
            $styles[] = 'position: ' . \esc_attr($attributes['position']);
        }

        // Z-index
        if (isset($attributes['zIndex']) && $attributes['zIndex'] !== '') {
            $styles[] = 'z-index: ' . (int) $attributes['zIndex'];
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
