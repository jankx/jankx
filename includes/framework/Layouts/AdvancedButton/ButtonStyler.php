<?php

namespace Jankx\Layouts\AdvancedButton;

class ButtonStyler
{
    public static function hasBackgroundColor(array $attributes, string $content): bool
    {
        if (!empty($attributes['backgroundColor']) ||
            !empty($attributes['gradient']) ||
            !empty($attributes['style']['color']['background']) ||
            !empty($attributes['style']['color']['gradient'])
        ) {
            return true;
        }

        return (
            preg_match('/has-[a-z0-9\-]+-background-color/', $content) ||
            preg_match('/has-[a-z0-9\-]+-gradient-background/', $content) ||
            preg_match('/background-color\s*:\s*[^;]+/', $content) ||
            preg_match('/background\s*:\s*[^;]*gradient/', $content)
        );
    }

    public static function isOutlineMode(array $classes, array $attributes = []): bool
    {
        if (in_array('is-style-outline', $classes)) {
            return true;
        }
        if (!empty($attributes['className']) && strpos($attributes['className'], 'is-style-outline') !== false) {
            return true;
        }
        return false;
    }

    public static function isTextLinkMode(array $classes, array $attributes = []): bool
    {
        if (in_array('is-style-text-link', $classes)) {
            return true;
        }
        if (!empty($attributes['className']) && strpos($attributes['className'], 'is-style-text-link') !== false) {
            return true;
        }
        return false;
    }

    public static function applyDefaultColors(
        string $content,
        array $attributes,
        bool $isOutlineMode,
        bool $hasBackgroundColor,
        bool $isTextLinkMode = false
    ): string {
        if ($isOutlineMode) {
            // Strip any background color and contrast classes in outline mode
            $content = preg_replace('/\bhas-[a-z0-9\-]+-background-color\s*/', '', $content);
            $content = preg_replace('/\bhas-contrast-color\s*/', '', $content);
        }

        if (($hasBackgroundColor && !$isOutlineMode) || $isTextLinkMode) {
            return $content;
        }

        $buttonElement = ContentExtractor::getButtonElement($content);
        if (!$buttonElement) {
            return $content;
        }

        $additionalClasses = $isOutlineMode
            ? 'has-primary-color is-default-colors'
            : 'has-primary-background-color has-contrast-color is-default-colors';

        // Prevent duplicate class injection if already present
        if ($isOutlineMode && strpos($buttonElement['class_attr'], 'has-primary-color') !== false) {
            return $content;
        }

        $newButtonClass = str_replace(
            'class="jankx-advanced-button__link',
            'class="jankx-advanced-button__link ' . $additionalClasses,
            $buttonElement['class_attr']
        );

        return str_replace($buttonElement['class_attr'], $newButtonClass, $content);
    }

    public static function getBorderRadius(array $attributes, string $content): ?string
    {
        if (!empty($attributes['style']['border']['radius'])) {
            $radius = $attributes['style']['border']['radius'];
            // Convert array to string if needed
            if (is_array($radius)) {
                return implode(' ', $radius);
            }
            return (string) $radius;
        }

        if (preg_match('/style\s*=\s*["\'][^"\']*border-radius\s*:\s*([^;]+)/i', $content, $matches)) {
            return trim($matches[1]);
        }

        return null;
    }

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

        if (preg_match('/style\s*=\s*["\']([^"\']*)["\']/', $buttonAttrs, $styleMatches)) {
            $existingStyles = $styleMatches[1];
            $existingStyles = preg_replace('/border-radius\s*:\s*[^;]+;?/i', '', $existingStyles);
            $existingStyles = trim($existingStyles, '; ');
            $newStyles = $existingStyles;
            if (!empty($newStyles)) {
                $newStyles .= '; ';
            }
            $newStyles .= 'border-radius: ' . esc_attr($borderRadius);

            $newButtonAttrs = preg_replace(
                '/style\s*=\s*["\'][^"\']*["\']/',
                'style="' . esc_attr($newStyles) . '"',
                $buttonAttrs
            );

            $newButtonTag = '<' . $buttonElement['tag'] . $buttonElement['class_attr'] . ' ' . $newButtonAttrs . '>';
            return str_replace($buttonElement['full'], $newButtonTag, $content);
        } else {
            $newButtonAttrs = 'style="border-radius: ' . esc_attr($borderRadius) . ';"';
            if (!empty(trim($buttonAttrs))) {
                $newButtonAttrs = ' ' . $newButtonAttrs;
            }
            $newButtonTag = '<' . $buttonElement['tag'] . $buttonElement['class_attr'] . $newButtonAttrs . $buttonAttrs . '>';
            return str_replace($buttonElement['full'], $newButtonTag, $content);
        }
    }

    public static function buildButtonClasses(array $attributes, string $baseClass = 'jankx-advanced-button__link'): string
    {
        $classes = [$baseClass];

        $backgroundColor = $attributes['backgroundColor'] ?? null;
        $textColor = $attributes['textColor'] ?? null;
        $gradient = $attributes['gradient'] ?? null;
        $iconPosition = $attributes['iconPosition'] ?? 'left';

        $isOutline = self::isOutlineMode([], $attributes);

        if ($backgroundColor && isset($backgroundColor['slug']) && !$isOutline) {
            $classes[] = "has-{$backgroundColor['slug']}-background-color";
        }

        if ($textColor && isset($textColor['slug'])) {
            $classes[] = "has-{$textColor['slug']}-color";
        }

        if ($gradient && isset($gradient['slug']) && !$isOutline) {
            $classes[] = "has-{$gradient['slug']}-gradient-background";
        }

        if (!empty($attributes['useIconBlocks']) && $iconPosition) {
            $classes[] = "icon-position-{$iconPosition}";
        }

        if (!empty($attributes['hoverAnimation']) && $attributes['hoverAnimation'] !== 'none') {
            $classes[] = "hover-ani-{$attributes['hoverAnimation']}";
        }

        if (!empty($attributes['unhoverAnimation']) && $attributes['unhoverAnimation'] !== 'none') {
            $classes[] = "unhover-ani-{$attributes['unhoverAnimation']}";
        }

        $hasNoColorSettings = !$backgroundColor &&
            !$textColor &&
            !$gradient &&
            empty($attributes['style']['color']['background']) &&
            empty($attributes['style']['color']['text']) &&
            empty($attributes['style']['color']['gradient']);

        if ($hasNoColorSettings) {
            $classes[] = 'is-default-colors';
        }

        if (!empty($attributes['style']['color']['background']) || !empty($attributes['style']['color']['gradient'])) {
            $classes[] = 'has-background';
        }

        if (!empty($attributes['style']['color']['text'])) {
            $classes[] = 'has-text-color';
        }

        return implode(' ', $classes);
    }

    public static function buildButtonStyles(array $attributes, array $classes = []): array
    {
        $styles = [];

        if (!empty($attributes['style']['border']['radius'])) {
            $styles['border-radius'] = $attributes['style']['border']['radius'];
        }

        if (!empty($attributes['style']['color']['background'])) {
            $styles['background-color'] = $attributes['style']['color']['background'];
        }

        if (!empty($attributes['style']['color']['text'])) {
            $styles['color'] = $attributes['style']['color']['text'];
        }

        if (!empty($attributes['style']['color']['gradient'])) {
            $styles['background'] = $attributes['style']['color']['gradient'];
            unset($styles['background-color']);
        }

        // For text link style, force these styles in PHP renderer
        $isTextLink = (isset($attributes['className']) && strpos($attributes['className'], 'is-style-text-link') !== false) || in_array('is-style-text-link', $classes);
        if ($isTextLink) {
            $styles['background-color'] = 'transparent !important';
            $styles['background'] = 'transparent !important';
            $styles['border'] = 'none !important';
            $styles['padding'] = '0 !important';
        }

        return $styles;
    }
}

