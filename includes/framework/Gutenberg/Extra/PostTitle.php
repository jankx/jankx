<?php

namespace Jankx\Gutenberg\Extra;

/**
 * Class PostTitle
 *
 * Implements Flatsome-inspired styling for the core Post Title block.
 * All styles are applied inline — no external CSS files.
 *
 * @package Jankx\Gutenberg\Extra
 */
class PostTitle extends AbstractBlockExtra
{
    /**
     * @inheritDoc
     */
    public function getTargetBlockName(): string
    {
        return 'core/post-title';
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
        $design_tokens = apply_filters('jankx/block/post_title/design_tokens', [
            'color' => '#1a2b8f',
            'font-family' => '"Outfit", "Inter", sans-serif',
            'transition' => 'color 0.2s ease',
        ]);

        $inline_style = '';
        foreach ($design_tokens as $prop => $value) {
            // Escape quotes for safe HTML attribute output
            $escaped_value = str_replace('"', '&quot;', $value);
            $inline_style .= "{$prop}: {$escaped_value}; ";
        }

        if (empty($inline_style)) {
            return $block_content;
        }

        if (preg_match('/^<([a-z0-9]+)([^>]*class="[^"]*wp-block-post-title[^"]*"[^>]*)>/i', $block_content, $matches)) {
            $tag_name = $matches[1];
            $full_match = $matches[0];
            $attributes = $matches[2];

            if (preg_match('/style="/i', $attributes, $style_pos_match, PREG_OFFSET_CAPTURE)) {
                $style_start = $style_pos_match[0][1];
                $value_start = $style_start + strlen('style="');

                $search_from = $value_start;
                $closing_quote_pos = false;
                $attr_len = strlen($attributes);

                while ($search_from < $attr_len) {
                    $q_pos = strpos($attributes, '"', $search_from);
                    if ($q_pos === false) {
                        break;
                    }
                    $next_char = isset($attributes[$q_pos + 1]) ? $attributes[$q_pos + 1] : '';
                    if ($next_char === '' || $next_char === ' ' || $next_char === '/') {
                        $closing_quote_pos = $q_pos;
                        break;
                    }
                    $search_from = $q_pos + 1;
                }

                if ($closing_quote_pos !== false) {
                    $existing_style = substr($attributes, $value_start, $closing_quote_pos - $value_start);
                    $new_style = rtrim($existing_style, '; ') . '; ' . $inline_style;
                    $new_attributes = substr($attributes, 0, $value_start) . $new_style . substr($attributes, $closing_quote_pos);
                } else {
                    $new_attributes = $attributes . ' style="' . rtrim($inline_style) . '"';
                }
            } else {
                $new_attributes = $attributes . ' style="' . rtrim($inline_style) . '"';
            }

            $new_opening_tag = "<{$tag_name}{$new_attributes}>";
            $block_content = str_replace($full_match, $new_opening_tag, $block_content);
        }

        return $block_content;
    }
}
