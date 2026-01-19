<?php
/**
 * Line Clamp Block Extra
 *
 * PHP version 7.4
 *
 * @category Gutenberg
 * @package  Jankx\Gutenberg\Extra
 * @author   Jankx Team <team@jankx.com>
 * @license  MIT https://opensource.org/licenses/MIT
 * @link     https://jankx.com
 */

namespace Jankx\Gutenberg\Extra;

/**
 * Class LineClamp
 *
 * Handles the server-side registration and rendering of the line-clamp attribute for specific blocks.
 */
class LineClamp extends AbstractBlockExtra
{
    protected static $line_clamp_blocks = [
        'core/post-title',
        'woocommerce/product-title',
        'core/heading'
    ];

    protected static $responsive_dimension_blocks = [
        'core/group',
        'core/columns',
        'core/column',
        'core/stack',
        'core/row',
        'core/heading',
        'core/paragraph',
        'core/post-title',
        'woocommerce/product-title'
    ];

    /**
     * @inheritDoc
     */
    public function getTargetBlockName(): string
    {
        return 'global';
    }

    /**
     * @inheritDoc
     */
    public function register(): void
    {
        // Register attributes for all supported blocks
        add_filter('register_block_type_args', [$this, 'registerExtraAttributes'], 5, 2);

        // Handle dynamic rendering for Line Clamp and Dimensions
        $all_blocks = array_unique(array_merge(self::$line_clamp_blocks, self::$responsive_dimension_blocks));
        foreach ($all_blocks as $block_name) {
            add_filter("render_block_{$block_name}", [$this, 'handleExtraStylesRender'], 10, 2);
        }
    }

    /**
     * Handle the dynamic rendering of line-clamp and responsive dimensions
     *
     * This method injects the necessary CSS variables and class into the block HTML.
     *
     * @param string $block_content The block's HTML content.
     * @param array  $block         The block's data including attributes.
     * @return string
     */
    public function handleExtraStylesRender($block_content, $block)
    {
        $attributes = $block['attrs'] ?? [];
        $classes = [];
        $styles = [];

        // 1. Handle Line Clamp
        $has_clamp = !empty($attributes['jankxLineClamp']) || !empty($attributes['jankxLineClampTablet']) || !empty($attributes['jankxLineClampMobile']);
        if ($has_clamp && in_array($block['blockName'], self::$line_clamp_blocks)) {
            $classes[] = 'has-jankx-line-clamp';
            if (isset($attributes['jankxLineClamp']))
                $styles[] = "--jankx-line-clamp: {$attributes['jankxLineClamp']}";
            if (isset($attributes['jankxLineClampTablet']))
                $styles[] = "--jankx-line-clamp-tablet: {$attributes['jankxLineClampTablet']}";
            if (isset($attributes['jankxLineClampMobile']))
                $styles[] = "--jankx-line-clamp-mobile: {$attributes['jankxLineClampMobile']}";
        }

        // 2. Handle Responsive Dimensions
        $has_dimensions = false;
        if (in_array($block['blockName'], self::$responsive_dimension_blocks)) {
            $mapping = [
                'jankxPaddingDesktop' => '--jankx-padding-desktop',
                'jankxPaddingTablet' => '--jankx-padding-tablet',
                'jankxPaddingMobile' => '--jankx-padding-mobile',
                'jankxMarginDesktop' => '--jankx-margin-desktop',
                'jankxMarginTablet' => '--jankx-margin-tablet',
                'jankxMarginMobile' => '--jankx-margin-mobile',
                'jankxGapDesktop' => '--jankx-gap-desktop',
                'jankxGapTablet' => '--jankx-gap-tablet',
                'jankxGapMobile' => '--jankx-gap-mobile',
                'jankxFlexOrderDesktop' => '--jankx-flex-order-desktop',
                'jankxFlexOrderTablet' => '--jankx-flex-order-tablet',
                'jankxFlexOrderMobile' => '--jankx-flex-order-mobile'
            ];

            foreach ($mapping as $attr => $var) {
                if (isset($attributes[$attr])) {
                    $has_dimensions = true;
                    $value = $attributes[$attr] . (strpos($var, 'order') !== false ? '' : 'px');
                    $styles[] = "{$var}: {$value}";
                }
            }

            if ($has_dimensions) {
                $classes[] = 'has-jankx-responsive-dimensions';
                if (isset($attributes['jankxPaddingDesktop']) || isset($attributes['jankxPaddingTablet']) || isset($attributes['jankxPaddingMobile']))
                    $classes[] = 'has-jankx-padding';
                if (isset($attributes['jankxMarginDesktop']) || isset($attributes['jankxMarginTablet']) || isset($attributes['jankxMarginMobile']))
                    $classes[] = 'has-jankx-margin';
                if (isset($attributes['jankxGapDesktop']) || isset($attributes['jankxGapTablet']) || isset($attributes['jankxGapMobile']))
                    $classes[] = 'has-jankx-gap';
                if (isset($attributes['jankxFlexOrderDesktop']) || isset($attributes['jankxFlexOrderTablet']) || isset($attributes['jankxFlexOrderMobile']))
                    $classes[] = 'has-jankx-flex-order';
            }
        }

        if (empty($classes) && empty($styles)) {
            return $block_content;
        }

        // Inject classes and styles into the first tag (root element of the block)
        $class_str = implode(' ', $classes);
        $style_str = implode('; ', $styles);

        // Use regex for robust injection
        if (preg_match('/^<([a-z0-9]+)([^>]*)>/i', $block_content, $matches)) {
            $tag = $matches[1];
            $attrs = $matches[2];

            // Add class
            if (!empty($class_str)) {
                if (preg_match('/class=["\']([^"\']*)["\']/', $attrs, $class_matches)) {
                    $new_attrs = str_replace($class_matches[0], 'class="' . $class_matches[1] . ' ' . $class_str . '"', $attrs);
                } else {
                    $new_attrs = $attrs . ' class="' . $class_str . '"';
                }
                $attrs = $new_attrs; // Update attrs for style injection
            }


            // Add style
            if (!empty($styles)) {
                if (preg_match('/style=["\']([^"\']*)["\']/', $attrs, $style_matches)) {
                    $new_attrs = str_replace($style_matches[0], 'style="' . rtrim($style_matches[1], '; ') . '; ' . $style_str . '"', $attrs);
                } else {
                    $new_attrs = $attrs . ' style="' . $style_str . '"';
                }
                $attrs = $new_attrs; // Update attrs for final replacement
            }

            $block_content = '<' . $tag . $attrs . '>' . substr($block_content, strlen($matches[0]));
        }

        return $block_content;
    }

    /**
     * Register the line-clamp and responsive dimension attributes on the server side
     *
     * @param array  $args       The block registration arguments.
     * @param string $block_name The block name.
     * @return array
     */
    public function registerExtraAttributes($args, $block_name)
    {
        if (!isset($args['attributes'])) {
            $args['attributes'] = [];
        }

        if (in_array($block_name, self::$line_clamp_blocks)) {
            $args['attributes']['jankxLineClamp'] = ['type' => 'number'];
            $args['attributes']['jankxLineClampTablet'] = ['type' => 'number'];
            $args['attributes']['jankxLineClampMobile'] = ['type' => 'number'];
        }

        if (in_array($block_name, self::$responsive_dimension_blocks)) {
            $dimension_attrs = [
                'jankxPaddingDesktop',
                'jankxPaddingTablet',
                'jankxPaddingMobile',
                'jankxMarginDesktop',
                'jankxMarginTablet',
                'jankxMarginMobile',
                'jankxGapDesktop',
                'jankxGapTablet',
                'jankxGapMobile',
                'jankxFlexOrderDesktop',
                'jankxFlexOrderTablet',
                'jankxFlexOrderMobile'
            ];
            foreach ($dimension_attrs as $attr) {
                $args['attributes'][$attr] = ['type' => 'number'];
            }
        }

        return $args;
    }

    /**
     * This method is part of AbstractBlockExtra but we handle rendering dynamically.
     *
     * @param string $block_content The block's HTML content.
     * @param array  $block         The block's data.
     * @return string
     */
    public function handle(string $block_content, array $block): string
    {
        return $block_content;
    }
}
