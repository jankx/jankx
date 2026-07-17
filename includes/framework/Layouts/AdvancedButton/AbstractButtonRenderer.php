<?php

namespace Jankx\Layouts\AdvancedButton;

abstract class AbstractButtonRenderer implements ButtonRendererInterface
{
    protected function buildStyleAttribute(array $styles): string
    {
        if (empty($styles)) {
            return '';
        }
        $styleParts = [];
        foreach ($styles as $property => $value) {
            if (!empty($value)) {
                // Handle array values like border-radius
                if (is_array($value)) {
                    $value = implode(' ', $value);
                }
                $styleParts[] = esc_attr($property) . ': ' . esc_attr($value);
            }
        }
        return implode('; ', $styleParts);
    }

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

    protected function getAnimationAttributes(array $attributes): array
    {
        $aniAttrs = [];
        if (!empty($attributes['hoverAnimation']) && $attributes['hoverAnimation'] !== 'none') {
            $aniAttrs['data-hover-ani'] = $attributes['hoverAnimation'];
        }
        if (!empty($attributes['unhoverAnimation']) && $attributes['unhoverAnimation'] !== 'none') {
            $aniAttrs['data-unhover-ani'] = $attributes['unhoverAnimation'];
        }
        return $aniAttrs;
    }
}

