<?php

namespace App\Services\ThemeOptions\Appliers;

/**
 * Core Button blocks default applier (core/button, core/buttons)
 */
class CoreButtonBlockApplier extends AbstractBlockDefaultApplier
{
    /**
     * @var array Supported block names
     */
    protected $supportedBlocks = ['core/button', 'core/buttons'];

    /**
     * Apply theme defaults to core button blocks
     *
     * @param string $content Block HTML content
     * @param array $block Block data
     * @param mixed $themeOptions Theme options service
     * @return string Modified content
     */
    public function apply(string $content, array $block, $themeOptions): string
    {
        $primaryColor = $themeOptions->getOption('primary_color', '#ff5722');
        $attrs = $this->getAttributes($block);

        // Check if button has background color set via theme palette
        $backgroundColor = $attrs['backgroundColor'] ?? '';

        // If it uses 'primary' from palette, ensure it matches our primary color
        if ($backgroundColor !== 'primary') {
            return $content;
        }

        // WordPress should already handle this via theme.json palette
        // But we can add inline style as fallback
        if (strpos($content, 'style=') !== false) {
            return $content;
        }

        $style = sprintf('background-color: %s;', esc_attr($primaryColor));
        return preg_replace(
            '/<a([^>]*)>/',
            sprintf('<a$1 style="%s">', $style),
            $content,
            1
        );
    }
}
