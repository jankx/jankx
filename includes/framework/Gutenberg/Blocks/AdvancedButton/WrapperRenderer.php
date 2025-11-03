<?php

namespace Jankx\Gutenberg\Blocks\AdvancedButton;

/**
 * Wrapper Renderer
 *
 * Handles wrapper div rendering with proper classes
 * Matches JavaScript save function wrapper structure
 *
 * @package Jankx\Gutenberg\Blocks\AdvancedButton
 */
class WrapperRenderer
{
    /**
     * Build wrapper classes
     *
     * @param array $attributes Block attributes
     * @param array $existingClasses Existing classes from content
     * @return array Array of class names
     */
    public static function buildWrapperClasses(array $attributes, array $existingClasses = []): array
    {
        $wrapperClasses = [
            'wp-block-jankx-advanced-button',
            'jankx-advanced-button',
        ];

        // Preserve style classes (is-style-fill, is-style-outline, etc.)
        // and alignment classes (has-text-align-*)
        foreach ($existingClasses as $class) {
            if (strpos($class, 'is-style-') === 0 || strpos($class, 'has-text-align-') === 0) {
                $wrapperClasses[] = $class;
            }
        }

        // Get alignment from attributes
        $textAlign = self::getTextAlign($attributes);
        if ($textAlign) {
            $alignClass = "has-text-align-{$textAlign}";
            if (!in_array($alignClass, $wrapperClasses)) {
                $wrapperClasses[] = $alignClass;
            }
        }

        // Add icon position class if needed
        $iconPosition = $attributes['iconPosition'] ?? 'left';
        if (!empty($attributes['useIconBlocks']) && $iconPosition) {
            $wrapperClasses[] = "icon-position-{$iconPosition}";
        }

        return $wrapperClasses;
    }

    /**
     * Get text alignment from attributes
     *
     * @param array $attributes Block attributes
     * @return string|null Alignment value or null
     */
    public static function getTextAlign(array $attributes): ?string
    {
        // Get from textAlign attribute
        if (!empty($attributes['textAlign'])) {
            return $attributes['textAlign'];
        }

        // Get from align attribute
        if (!empty($attributes['align'])) {
            return $attributes['align'];
        }

        // Check className attribute for text alignment
        if (!empty($attributes['className'])) {
            if (preg_match('/has-text-align-(\w+)/', $attributes['className'], $matches)) {
                return $matches[1];
            }
        }

        return null;
    }

    /**
     * Render wrapper HTML
     *
     * @param string $content Button content
     * @param array $attributes Block attributes
     * @param array $existingClasses Existing classes from content
     * @return string Wrapped HTML
     */
    public static function render(string $content, array $attributes, array $existingClasses = []): string
    {
        $wrapperClasses = self::buildWrapperClasses($attributes, $existingClasses);
        
        $wrapperAttributes = sprintf(
            'class="%s"',
            esc_attr(implode(' ', $wrapperClasses))
        );

        return sprintf(
            '<div %s>%s</div>',
            $wrapperAttributes,
            $content
        );
    }
}

