<?php

namespace Jankx\Gutenberg\Extra;

/**
 * Class CommentTemplate
 *
 * Implements Flatsome-inspired styling for the core Comment Template block.
 *
 * @package Jankx\Gutenberg\Extra
 */
class CommentTemplate extends AbstractBlockExtra
{
    /**
     * @inheritDoc
     */
    public function getTargetBlockName(): string
    {
        return 'core/comment-template';
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
        // Enqueue the CSS file with Child Theme priority
        $relativePath = 'resources/block-styles/comment-template/comment-template.css';
        $styleUrl = $this->getAssetUrl($relativePath);

        if ($styleUrl) {
            wp_enqueue_style(
                'jankx-block-comment-template',
                $styleUrl,
                [],
                $this->getAssetVersion($relativePath)
            );
        }

        // Define design tokens for Comment Template if needed
        $design_tokens = apply_filters('jankx/block/comment_template/design_tokens', [
            '--jankx-comment-avatar-size' => '40px',
        ]);

        $style_attr = '';
        foreach ($design_tokens as $name => $value) {
            $style_attr .= "{$name}: {$value}; ";
        }

        /**
         * Inject the style attribute into the opening tag.
         */
        if (preg_match('/<([a-z0-9]+)([^>]*class="[^"]*wp-block-comment-template[^"]*"[^>]*)>/i', $block_content, $matches)) {
            $tag_name = $matches[1];
            $attributes = $matches[2];

            if (preg_match('/style="([^"]*)"/i', $attributes, $style_matches)) {
                $existing_style = $style_matches[1];
                $new_style = rtrim($existing_style, '; ') . '; ' . $style_attr;
                $new_attributes = str_replace($style_matches[0], 'style="' . $new_style . '"', $attributes);
            } else {
                $new_attributes = $attributes . ' style="' . trim($style_attr) . '" ';
            }

            $new_opening_tag = "<{$tag_name}{$new_attributes}>";
            $block_content = str_replace($matches[0], $new_opening_tag, $block_content);
        }

        return $block_content;
    }
}
