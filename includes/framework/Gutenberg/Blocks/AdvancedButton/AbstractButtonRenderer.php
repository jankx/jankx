<?php

namespace Jankx\Gutenberg\Blocks\AdvancedButton;

/**
 * Abstract Button Renderer
 *
 * Base class for button renderers with common functionality
 *
 * @package Jankx\Gutenberg\Blocks\AdvancedButton
 */
abstract class AbstractButtonRenderer implements ButtonRendererInterface
{
    /**
     * Build style attribute string from styles array
     *
     * @param array $styles Styles array
     * @return string Style attribute value
     */
    protected function buildStyleAttribute(array $styles): string
    {
        if (empty($styles)) {
            return '';
        }

        $styleParts = [];
        foreach ($styles as $property => $value) {
            if (!empty($value)) {
                $styleParts[] = esc_attr($property) . ': ' . esc_attr($value);
            }
        }

        return implode('; ', $styleParts);
    }

    /**
     * Build HTML attributes string
     *
     * @param array $attributes HTML attributes
     * @return string Attributes string
     */
    protected function buildAttributes(array $attributes): string
    {
        $attrParts = [];
        foreach ($attributes as $name => $value) {
            if ($value !== null && $value !== '') {
                $attrParts[] = esc_attr($name) . '="' . esc_attr($value) . '"';
            }
        }

        return !empty($attrParts) ? ' ' . implode(' ', $attrParts) : '';
    }
}

