<?php

namespace App\Services\ThemeOptions\Appliers;

/**
 * Advanced Button block default applier
 */
class AdvancedButtonBlockApplier extends AbstractBlockDefaultApplier
{
    /**
     * @var array Supported block names
     */
    protected $supportedBlocks = ['jankx/advanced-button'];

    /**
     * Apply theme defaults to advanced button block
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

        // If button doesn't have explicit background color, apply primary color
        if ($this->hasColorSet($attrs, 'backgroundColor', 'background')) {
            return $content;
        }

        // Add inline style for background color
        $style = sprintf('background-color: %s;', esc_attr($primaryColor));

        // Try to inject into the button element
        if (preg_match('/<a[^>]*class="[^"]*jankx-button[^"]*"[^>]*>/', $content, $matches)) {
            $tag = $matches[0];
            if (strpos($tag, 'style=') === false) {
                $newTag = str_replace('>', sprintf(' style="%s">', $style), $tag);
                return str_replace($tag, $newTag, $content);
            }
        }

        return $content;
    }
}
