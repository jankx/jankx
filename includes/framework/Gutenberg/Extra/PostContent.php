<?php

namespace Jankx\Gutenberg\Extra;

/**
 * Class PostContent
 *
 * Implements Flatsome-inspired styling for the core Post Content block.
 *
 * @package Jankx\Gutenberg\Extra
 */
class PostContent extends AbstractBlockExtra
{
    /**
     * @inheritDoc
     */
    public function getTargetBlockName(): string
    {
        return 'core/post-content';
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
        // CSS for post-content is now managed via theme.json / global styles rather than a hardcoded file.

        // Define design tokens for Post Content if needed via filter
        $design_tokens = apply_filters('jankx/block/post_content/design_tokens', [
            '--jankx-content-max-width' => '100%',
        ]);

        $style_attr = '';
        foreach ($design_tokens as $name => $value) {
            $style_attr .= "{$name}: {$value}; ";
        }

        /**
         * Inject the style attribute into the opening tag of the block content.
         */
        if (preg_match('/<([a-z0-9]+)([^>]*class="[^"]*wp-block-post-content[^"]*"[^>]*)>/i', $block_content, $matches)) {
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
