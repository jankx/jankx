<?php

/**
 * Responsive CSS Generator for Core Blocks
 *
 * Generates and applies responsive CSS styles for extended core blocks
 * based on their responsive attributes.
 *
 * @package CheepHub
 * @subpackage AdvancedBlocks
 * @since 1.0.0
 */

namespace Jankx\Gutenberg\Blocks\Advanced;

class ResponsiveCSSGenerator
{
    /**
     * Responsive attribute mappings
     */
    protected $responsiveAttributes = [
        'fontSize' => [
            'desktop' => 'fontSize',
            'tablet' => 'fontSizeTablet',
            'mobile' => 'fontSizeMobile'
        ],
        'lineHeight' => [
            'desktop' => 'lineHeight',
            'tablet' => 'lineHeightTablet',
            'mobile' => 'lineHeightMobile'
        ],
        'letterSpacing' => [
            'desktop' => 'letterSpacing',
            'tablet' => 'letterSpacingTablet',
            'mobile' => 'letterSpacingMobile'
        ],
        'margin' => [
            'desktop' => 'margin',
            'tablet' => 'marginTablet',
            'mobile' => 'marginMobile'
        ],
        'padding' => [
            'desktop' => 'padding',
            'tablet' => 'paddingTablet',
            'mobile' => 'paddingMobile'
        ],
        'width' => [
            'desktop' => 'width',
            'tablet' => 'widthTablet',
            'mobile' => 'widthMobile'
        ],
        'height' => [
            'desktop' => 'height',
            'tablet' => 'heightTablet',
            'mobile' => 'heightMobile'
        ],
        'borderRadius' => [
            'desktop' => 'borderRadius',
            'tablet' => 'borderRadiusTablet',
            'mobile' => 'borderRadiusMobile'
        ],
        'borderWidth' => [
            'desktop' => 'borderWidth',
            'tablet' => 'borderWidthTablet',
            'mobile' => 'borderWidthMobile'
        ]
    ];
/**
     * Breakpoints for responsive design
     */
    protected $breakpoints = [
        'tablet' => 768,
        'mobile' => 480
    ];
/**
     * Constructor
     */
    public function __construct()
    {
        $this->init();
    }

    /**
     * Initialize the generator
     */
    protected function init()
    {
        add_action('wp_enqueue_scripts', [$this, 'enqueueStyles']);
        add_filter('render_block', [$this, 'generateResponsiveCSS'], 10, 2);
    }

    /**
     * Enqueue base styles
     */
    public function enqueueStyles()
    {
        wp_enqueue_style('cheephub-responsive-blocks-frontend', get_template_directory_uri() . '/resources/advanced-blocks/build/frontend.css', [], '1.0.0');
    }

    /**
     * Generate responsive CSS for blocks
     */
    public function generateResponsiveCSS($block_content, $block)
    {
        if (empty($block['attrs']) || !is_array($block['attrs'])) {
            return $block_content;
        }

        $attributes = $block['attrs'];
        $css = '';
// Generate CSS for each responsive attribute type
        foreach ($this->responsiveAttributes as $type => $deviceMappings) {
            $css .= $this->generateCSSForType($block, $type, $deviceMappings, $attributes);
        }

        // Add generated CSS to the page
        if (!empty($css)) {
            wp_add_inline_style('cheephub-responsive-blocks-frontend', $css);
        }

        return $block_content;
    }

    /**
     * Generate CSS for a specific attribute type
     */
    protected function generateCSSForType($block, $type, $deviceMappings, $attributes)
    {
        $css = '';
        $blockSelector = $this->getBlockSelector($block);
// Generate CSS for each device
        foreach ($deviceMappings as $device => $attributeName) {
            if ($device === 'desktop') {
                continue;
            // Skip desktop as it uses default attributes
            }

            $value = $attributes[$attributeName] ?? '';
            if (empty($value)) {
                continue;
            }

            $breakpoint = $this->breakpoints[$device];
            $cssProperty = $this->getCSSProperty($type);
            $cssValue = $this->formatCSSValue($type, $value);
            if ($cssProperty && $cssValue) {
                $css .= "@media (max-width: {$breakpoint}px) {";
                $css .= "{$blockSelector} { {$cssProperty}: {$cssValue}; }";
                $css .= "}";
            }
        }

        return $css;
    }

    /**
     * Get CSS selector for a block
     */
    protected function getBlockSelector($block)
    {
        $blockName = $block['blockName'];
// Generate unique selector based on block name and attributes
        $selector = '';
        switch ($blockName) {
            case 'core/heading':
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             $level = $block['attrs']['level'] ?? 2;
                $selector = ".wp-block-heading h{$level}";

                break;
            case 'core/paragraph':
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         $selector = ".wp-block-paragraph p";

                break;
            case 'core/button':
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         $selector = ".wp-block-button .wp-block-button__link";

                break;
            case 'core/image':
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         $selector = ".wp-block-image img";

                break;
            case 'core/columns':
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         $selector = ".wp-block-columns";

                break;
            case 'core/group':
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         $selector = ".wp-block-group";

                break;
            case 'core/spacer':
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         $selector = ".wp-block-spacer";

                break;
            default:
                        // Generate generic selector

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         $selector = ".wp-block-" . str_replace('core/', '', $blockName);

                break;
        }

        // Add unique identifier if available
        if (!empty($block['attrs']['anchor'])) {
            $selector .= "#{$block['attrs']['anchor']}";
        }

        return $selector;
    }

    /**
     * Get CSS property name for attribute type
     */
    protected function getCSSProperty($type)
    {
        $properties = [
            'fontSize' => 'font-size',
            'lineHeight' => 'line-height',
            'letterSpacing' => 'letter-spacing',
            'margin' => 'margin',
            'padding' => 'padding',
            'width' => 'width',
            'height' => 'height',
            'borderRadius' => 'border-radius',
            'borderWidth' => 'border-width'
        ];
        return $properties[$type] ?? null;
    }

    /**
     * Format CSS value based on attribute type
     */
    protected function formatCSSValue($type, $value)
    {
        if (empty($value)) {
            return null;
        }

        switch ($type) {
            case 'fontSize':
                return is_numeric($value) ? "{$value}px" : $value;
            case 'lineHeight':
                return is_numeric($value) ? $value : $value;
            case 'letterSpacing':
                return is_numeric($value) ? "{$value}px" : $value;
            case 'margin':
            case 'padding':
                return $this->formatBoxValue($value);
            case 'width':
            case 'height':
                return is_numeric($value) ? "{$value}px" : $value;
            case 'borderRadius':
                return is_numeric($value) ? "{$value}px" : $value;
            case 'borderWidth':
                return is_numeric($value) ? "{$value}px" : $value;
            default:
                return $value;
        }
    }

    /**
     * Format box control values (margin, padding)
     */
    protected function formatBoxValue($value)
    {
        if (is_string($value)) {
            return $value;
        }

        if (is_array($value)) {
            $top = $value['top'] ?? '0';
            $right = $value['right'] ?? '0';
            $bottom = $value['bottom'] ?? '0';
            $left = $value['left'] ?? '0';
// If all values are the same, use shorthand
            if ($top === $right && $right === $bottom && $bottom === $left) {
                return $this->formatBoxValue($top);
            }

            // If top/bottom and left/right are the same
            if ($top === $bottom && $left === $right) {
                return "{$this->formatBoxValue($top)} {$this->formatBoxValue($left)}";
            }

            // Use individual values
            return "{$this->formatBoxValue($top)} {$this->formatBoxValue($right)} {$this->formatBoxValue($bottom)} {$this->formatBoxValue($left)}";
        }

        return '0';
    }

    /**
     * Get responsive attributes for a block
     */
    public function getResponsiveAttributes($blockName)
    {
        return $this->responsiveAttributes;
    }

    /**
     * Check if a block has responsive attributes
     */
    public function hasResponsiveAttributes($blockName, $attributeName)
    {
        return isset($this->responsiveAttributes[$attributeName]);
    }
}
