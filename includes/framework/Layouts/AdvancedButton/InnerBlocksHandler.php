<?php

namespace Jankx\Layouts\AdvancedButton;

class InnerBlocksHandler
{
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
                $innerContent .= render_block($inner_block);
            }
        }
        return $innerContent;
    }

    public static function injectInnerBlocks(string $content, \WP_Block $block, array $attributes): string
    {
        if (empty($block->inner_blocks)) {
            return $content;
        }
        if (ContentExtractor::hasInnerBlocks($content)) {
            return $content;
        }
        $innerContent = self::renderInnerBlocks($block);
        if (empty($innerContent)) {
            return $content;
        }
        if (preg_match('/<span[^>]*class="[^"]*button-icon-wrapper[^"]*"[^>]*>.*?<\/span>/s', $content)) {
            $content = preg_replace(
                '/(<span[^>]*class="[^"]*button-icon-wrapper[^"]*"[^>]*>)(.*?)(<\/span>)/s',
                '$1' . $innerContent . '$3',
                $content
            );
        } else {
            $text = $attributes['text'] ?? '';
            $showLabel = $attributes['showLabel'] ?? true;
            $buttonText = ($showLabel && !empty($text)) ? '<span class="button-text">' . esc_html($text) . '</span>' : '';
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

