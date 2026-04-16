<?php

namespace App\Services\ThemeOptions\Appliers;

/**
 * Typography block default applier
 */
class TypographyBlockApplier extends AbstractBlockDefaultApplier
{
    /**
     * @var array Supported block names
     */
    protected $supportedBlocks = ['jankx/typography'];

    /**
     * Apply theme defaults to typography block
     *
     * @param string $content Block HTML content
     * @param array $block Block data
     * @param mixed $themeOptions Theme options service
     * @return string Modified content
     */
    public function apply(string $content, array $block, $themeOptions): string
    {
        $bodyTypography = $themeOptions->getOption('body_typography', []);

        // If typography block doesn't have explicit color, apply body color
        if (empty($bodyTypography['color'])) {
            return $content;
        }

        $attrs = $this->getAttributes($block);

        // Only apply if textColor is not explicitly set
        if ($this->hasColorSet($attrs, 'textColor', 'text')) {
            return $content;
        }

        // Add CSS variable for color inheritance
        return str_replace(
            'class="has-jankx-typography"',
            'class="has-jankx-typography jankx-inherit-body-color"',
            $content
        );
    }
}
