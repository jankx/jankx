<?php

namespace Jankx\Layouts\AdvancedButton;

class WrapperRenderer
{
    public static function buildWrapperClasses(array $attributes, array $existingClasses = []): array
    {
        $wrapperClasses = [
            'wp-block-jankx-advanced-button',
            'jankx-advanced-button',
        ];
        foreach ($existingClasses as $class) {
            if (strpos($class, 'is-style-') === 0 || strpos($class, 'has-text-align-') === 0) {
                $wrapperClasses[] = $class;
            }
        }
        $textAlign = self::getTextAlign($attributes);
        if ($textAlign) {
            $alignClass = "has-text-align-{$textAlign}";
            if (!in_array($alignClass, $wrapperClasses)) {
                $wrapperClasses[] = $alignClass;
            }
        }
        $iconPosition = $attributes['iconPosition'] ?? 'left';
        if (!empty($attributes['useIconBlocks']) && $iconPosition) {
            $wrapperClasses[] = "icon-position-{$iconPosition}";
        }
        return $wrapperClasses;
    }

    public static function getTextAlign(array $attributes): ?string
    {
        if (!empty($attributes['textAlign'])) {
            return $attributes['textAlign'];
        }
        if (!empty($attributes['align'])) {
            return $attributes['align'];
        }
        if (!empty($attributes['className'])) {
            if (preg_match('/has-text-align-(\w+)/', $attributes['className'], $matches)) {
                return $matches[1];
            }
        }
        return null;
    }

    public static function render(string $content, array $attributes, array $existingClasses = []): string
    {
        $wrapperClasses = self::buildWrapperClasses($attributes, $existingClasses);
        $wrapperAttributes = sprintf('class="%s"', esc_attr(implode(' ', $wrapperClasses)));
        return sprintf('<div %s>%s</div>', $wrapperAttributes, $content);
    }
}

