<?php

namespace Jankx\Gutenberg\Blocks\AdvancedButton;

/**
 * Button Styler
 *
 * Handles button styling: colors, border radius, classes
 * Applies default styles when needed
 *
 * @package Jankx\Gutenberg\Blocks\AdvancedButton
 */
class ButtonStyler
{
    /**
     * Check if button has background color or gradient set
     *
     * @param array $attributes Block attributes
     * @param string $content Button content HTML
     * @return bool True if has background color
     */
    public static function hasBackgroundColor(array $attributes, string $content): bool
    {
        // Check attributes
        if (!empty($attributes['backgroundColor']) ||
            !empty($attributes['gradient']) ||
            !empty($attributes['style']['color']['background']) ||
            !empty($attributes['style']['color']['gradient'])
        ) {
            return true;
        }

        // Check content HTML
        return (
            preg_match('/has-[a-z0-9\-]+-background-color/', $content) ||
            preg_match('/has-[a-z0-9\-]+-gradient-background/', $content) ||
            preg_match('/background-color\s*:\s*[^;]+/', $content) ||
            preg_match('/background\s*:\s*[^;]*gradient/', $content)
        );
    }

    /**
     * Check if button is in outline mode
     *
     * @param array $classes Array of CSS classes
     * @return bool True if outline mode
     */
    public static function isOutlineMode(array $classes): bool
    {
        return in_array('is-style-outline', $classes);
    }

    /**
     * Apply default color classes if no background color is set
     *
     * @param string $content Button content HTML
     * @param array $attributes Block attributes
     * @param bool $isOutlineMode Is outline mode
     * @param bool $hasBackgroundColor Has background color
     * @return string Updated content
     */
    public static function applyDefaultColors(
        string $content,
        array $attributes,
        bool $isOutlineMode,
        bool $hasBackgroundColor
    ): string {
        if ($hasBackgroundColor) {
            return $content;
        }

        $buttonElement = ContentExtractor::getButtonElement($content);
        if (!$buttonElement) {
            return $content;
        }

        $additionalClasses = $isOutlineMode
            ? 'has-primary-color has-base-color'
            : 'has-primary-background-color has-contrast-color has-base-color';

        $newButtonClass = str_replace(
            'class="jankx-advanced-button__link',
            'class="jankx-advanced-button__link ' . $additionalClasses,
            $buttonElement['class_attr']
        );

        return str_replace($buttonElement['class_attr'], $newButtonClass, $content);
    }

    /**
     * Get border radius from attributes or content
     *
     * @param array $attributes Block attributes
     * @param string $content Button content HTML
     * @return string|null Border radius value or null
     */
    public static function getBorderRadius(array $attributes, string $content): ?string
    {
        // Get from attributes
        if (!empty($attributes['style']['border']['radius'])) {
            return $attributes['style']['border']['radius'];
        }

        // Check if already in content HTML
        if (preg_match('/style\s*=\s*["\'][^"\']*border-radius\s*:\s*([^;]+)/i', $content, $matches)) {
            return trim($matches[1]);
        }

        return null;
    }

    /**
     * Apply border radius to button element
     *
     * @param string $content Button content HTML
     * @param string $borderRadius Border radius value
     * @return string Updated content
     */
    public static function applyBorderRadius(string $content, string $borderRadius): string
    {
        if (empty($borderRadius)) {
            return $content;
        }

        $buttonElement = ContentExtractor::getButtonElement($content);
        if (!$buttonElement) {
            return $content;
        }

        $buttonAttrs = $buttonElement['other_attrs'];

        // Check if style attribute already exists
        if (preg_match('/style\s*=\s*["\']([^"\']*)["\']/', $buttonAttrs, $styleMatches)) {
            $existingStyles = $styleMatches[1];

            // Remove existing border-radius if any
            $existingStyles = preg_replace('/border-radius\s*:\s*[^;]+;?/i', '', $existingStyles);
            $existingStyles = trim($existingStyles, '; ');

            // Add border-radius
            $newStyles = $existingStyles;
            if (!empty($newStyles)) {
                $newStyles .= '; ';
            }
            $newStyles .= 'border-radius: ' . esc_attr($borderRadius);

            // Replace existing style attribute
            $newButtonAttrs = preg_replace(
                '/style\s*=\s*["\'][^"\']*["\']/',
                'style="' . esc_attr($newStyles) . '"',
                $buttonAttrs
            );

            // Reconstruct button tag
            $newButtonTag = '<' . $buttonElement['tag'] . $buttonElement['class_attr'] . ' ' . $newButtonAttrs . '>';
            
            return str_replace($buttonElement['full'], $newButtonTag, $content);
        } else {
            // No style attribute, add it
            $newButtonAttrs = 'style="border-radius: ' . esc_attr($borderRadius) . ';"';
            if (!empty(trim($buttonAttrs))) {
                $newButtonAttrs = ' ' . $newButtonAttrs;
            }

            // Reconstruct button tag
            $newButtonTag = '<' . $buttonElement['tag'] . $buttonElement['class_attr'] . $newButtonAttrs . $buttonAttrs . '>';
            
            return str_replace($buttonElement['full'], $newButtonTag, $content);
        }
    }

    /**
     * Build button classes string
     *
     * @param array $attributes Block attributes
     * @param string $baseClass Base class name
     * @return string Classes string
     */
    public static function buildButtonClasses(array $attributes, string $baseClass = 'jankx-advanced-button__link'): string
    {
        $classes = [$baseClass];

        $backgroundColor = $attributes['backgroundColor'] ?? null;
        $textColor = $attributes['textColor'] ?? null;
        $gradient = $attributes['gradient'] ?? null;
        $iconPosition = $attributes['iconPosition'] ?? 'left';

        if ($backgroundColor && isset($backgroundColor['slug'])) {
            $classes[] = "has-{$backgroundColor['slug']}-background-color";
        }

        if ($textColor && isset($textColor['slug'])) {
            $classes[] = "has-{$textColor['slug']}-color";
        }

        if ($gradient && isset($gradient['slug'])) {
            $classes[] = "has-{$gradient['slug']}-gradient-background";
        }

        if (!empty($attributes['useIconBlocks']) && $iconPosition) {
            $classes[] = "icon-position-{$iconPosition}";
        }

        // Check if has custom colors
        $hasNoColorSettings = !$backgroundColor &&
            !$textColor &&
            !$gradient &&
            empty($attributes['style']['color']['background']) &&
            empty($attributes['style']['color']['text']) &&
            empty($attributes['style']['color']['gradient']);

        if ($hasNoColorSettings) {
            $classes[] = 'has-base-color';
        }

        if (!empty($attributes['style']['color']['background']) || !empty($attributes['style']['color']['gradient'])) {
            $classes[] = 'has-background';
        }

        if (!empty($attributes['style']['color']['text'])) {
            $classes[] = 'has-text-color';
        }

        return implode(' ', $classes);
    }

    /**
     * Build button styles array
     *
     * @param array $attributes Block attributes
     * @return array Styles array
     */
    public static function buildButtonStyles(array $attributes): array
    {
        $styles = [];

        // Copy border radius
        if (!empty($attributes['style']['border']['radius'])) {
            $styles['border-radius'] = $attributes['style']['border']['radius'];
        }

        // Copy custom background color
        if (!empty($attributes['style']['color']['background'])) {
            $styles['background-color'] = $attributes['style']['color']['background'];
        }

        // Copy custom text color
        if (!empty($attributes['style']['color']['text'])) {
            $styles['color'] = $attributes['style']['color']['text'];
        }

        // Copy gradient (takes priority over background color)
        if (!empty($attributes['style']['color']['gradient'])) {
            $styles['background'] = $attributes['style']['color']['gradient'];
            unset($styles['background-color']);
        }

        return $styles;
    }
}

