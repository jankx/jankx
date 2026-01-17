<?php

namespace Jankx\Gutenberg\Extra;

/**
 * Class Categories
 *
 * Implements Flatsome-inspired tree style styling for the core Categories block.
 *
 * @package Jankx\Gutenberg\Extra
 */
class Categories extends AbstractBlockExtra
{
    /**
     * @inheritDoc
     */
    public function getTargetBlockName(): string
    {
        return 'core/categories';
    }

    /**
     * Handle the block rendering.
     *
     * @param string $block_content
     * @param array $block
     * @return string
     */
    public function handle(string $block_content, array $block): string
    {
        // Enqueue the CSS file using theme-aware resolution
        $relativePath = 'resources/block-styles/category/categories.css';
        $styleUrl = $this->getAssetUrl($relativePath);

        if ($styleUrl) {
            wp_enqueue_style(
                'jankx-block-categories',
                $styleUrl,
                [],
                $this->getAssetVersion($relativePath)
            );
        }

        // Define our custom design tokens as CSS variables
        $design_tokens = apply_filters('jankx/block/categories/design_tokens', [
            '--jankx-cat-primary' => '#446084',           // Flatsome Default Navy
            '--jankx-cat-text' => '#555555',              // Neutral Gray
            '--jankx-cat-bg' => '#ffffff',                // Pure white
            '--jankx-cat-border' => '#ececec',            // Light gray border
            '--jankx-cat-shadow' => 'none',               // Remove shadows
            '--jankx-font-family' => 'system-ui, -apple-system, sans-serif',
        ]);

        $style_attr = '';
        foreach ($design_tokens as $name => $value) {
            $style_attr .= "{$name}: {$value}; ";
        }

        /**
         * Inject the style attribute into the opening tag of the block content.
         */
        if (preg_match('/^<([a-z0-9]+)([^>]*class="[^"]*wp-block-categories[^"]*"[^>]*)>/i', $block_content, $matches)) {
            $tag_name = $matches[1];
            $attributes = $matches[2];

            if (preg_match('/style="([^"]*)"/i', $attributes, $style_matches)) {
                $existing_style = $style_matches[1];
                $new_style = rtrim($existing_style, '; ') . '; ' . $style_attr;
                $new_attributes = str_replace($style_matches[0], 'style="' . $new_style . '"', $attributes);
            } else {
                $new_attributes = $attributes . ' style="' . trim($style_attr) . '"';
            }

            $new_opening_tag = "<{$tag_name}{$new_attributes}>";
            $block_content = str_replace($matches[0], $new_opening_tag, $block_content);
        }

        return $block_content;
    }
}
