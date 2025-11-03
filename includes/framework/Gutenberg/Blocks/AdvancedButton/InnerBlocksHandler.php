<?php

namespace Jankx\Gutenberg\Blocks\AdvancedButton;

/**
 * Inner Blocks Handler
 *
 * Handles rendering and injection of inner blocks (icons)
 *
 * @package Jankx\Gutenberg\Blocks\AdvancedButton
 */
class InnerBlocksHandler
{
    /**
     * Render inner blocks from WP_Block instance
     *
     * @param \WP_Block $block Block instance
     * @return string Rendered inner blocks HTML
     */
    public static function renderInnerBlocks(\WP_Block $block): string
    {
        if (empty($block->inner_blocks)) {
            return '';
        }

        $innerContent = '';
        foreach ($block->inner_blocks as $inner_block) {
            if ($inner_block instanceof \WP_Block) {
                $innerContent .= $inner_block->render();
            } else {
                // Fallback: if it's an array, use render_block()
                $innerContent .= render_block($inner_block);
            }
        }

        return $innerContent;
    }

    /**
     * Inject inner blocks into content if missing
     *
     * @param string $content Button content HTML
     * @param \WP_Block $block Block instance
     * @param array $attributes Block attributes
     * @return string Updated content
     */
    public static function injectInnerBlocks(string $content, \WP_Block $block, array $attributes): string
    {
        if (empty($block->inner_blocks)) {
            return $content;
        }

        // Check if content already has inner blocks
        if (ContentExtractor::hasInnerBlocks($content)) {
            return $content;
        }

        $innerContent = self::renderInnerBlocks($block);
        if (empty($innerContent)) {
            return $content;
        }

        // Check if button-icon-wrapper exists (even if empty)
        if (preg_match('/<span[^>]*class="[^"]*button-icon-wrapper[^"]*"[^>]*>.*?<\/span>/s', $content)) {
            // Already has wrapper, replace its content with inner blocks
            $content = preg_replace(
                '/(<span[^>]*class="[^"]*button-icon-wrapper[^"]*"[^>]*>)(.*?)(<\/span>)/s',
                '$1' . $innerContent . '$3',
                $content
            );
        } else {
            // No button-icon-wrapper, add it with inner blocks
            $text = $attributes['text'] ?? '';
            $showLabel = $attributes['showLabel'] ?? true;
            $buttonText = ($showLabel && !empty($text)) ? '<span class="button-text">' . esc_html($text) . '</span>' : '';

            // Find button element and inject inner blocks and text after opening tag
            $buttonElement = ContentExtractor::getButtonElement($content);
            if ($buttonElement) {
                $content = str_replace(
                    $buttonElement['full'],
                    $buttonElement['full'] . '<span class="button-icon-wrapper">' . $innerContent . '</span>' . $buttonText,
                    $content
                );
            }
        }

        return $content;
    }
}

