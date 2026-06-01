<?php
/**
 * Post Terms Block
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 2.0.0
 */

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class PostTermsBlock extends Block
{
    /**
     * Block ID.
     *
     * @var string
     */
    protected $blockId = 'jankx/post-terms';

    /**
     * Render the block on the frontend.
     *
     * @param array $attributes Block attributes.
     * @param string $content Inner block content.
     * @param \WP_Block|null $block Block instance.
     *
     * @return string
     */
    public function render($attributes, $content = '', $block = null)
    {
        $post_id = $this->resolvePostId($block);
        if (!$post_id) {
            return '';
        }

        $taxonomy = $attributes['taxonomy'] ?? 'category';
        $display_style = $attributes['displayStyle'] ?? 'default';
        $separator = $attributes['separator'] ?? ', ';
        $layout = $attributes['layout'] ?? 'inline';
        $link_to_term = $attributes['linkToTerm'] ?? true;
        $term_text_color = $attributes['termTextColor'] ?? '';
        $term_bg_color = $attributes['termBackgroundColor'] ?? '';

        $term_style = '';
        if ($term_text_color) {
            $term_style .= sprintf('color: %s;', $term_text_color);
        }
        if ($term_bg_color) {
            $term_style .= sprintf('background-color: %s; padding: 2px 8px; border-radius: 4px;', $term_bg_color);
        }

        $terms = get_the_terms($post_id, $taxonomy);

        if (is_wp_error($terms) || empty($terms)) {
            return '';
        }

        $term_items = [];
        foreach ($terms as $term) {
            $label = $term->name;
            if ($display_style === 'hashtag') {
                $label = '#' . $label;
            }

            $item_content = esc_html($label);
            if ($link_to_term) {
                $item_content = sprintf(
                    '<a href="%s" class="jankx-post-term-link" style="color: inherit;">%s</a>',
                    esc_url(get_term_link($term)),
                    $item_content
                );
            }

            $term_items[] = sprintf(
                '<span class="jankx-post-term-inner" style="%s">%s</span>',
                esc_attr($term_style),
                $item_content
            );
        }

        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => sprintf(
                'display-style-%s layout-%s',
                esc_attr($display_style),
                esc_attr($layout)
            ),
        ]);

        $output = '';
        if ($layout === 'inline') {
            $output = implode(
                sprintf('<span class="jankx-post-term-separator">%s</span>', esc_html($separator)),
                array_map(function($item) {
                    return sprintf('<span class="jankx-post-term">%s</span>', $item);
                }, $term_items)
            );
        } else {
            $output = implode('', array_map(function($item) {
                return sprintf('<div class="jankx-post-term">%s</div>', $item);
            }, $term_items));
        }

        return sprintf(
            '<div %s>%s</div>',
            $wrapper_attributes,
            $output
        );
    }

    /**
     * Resolve post ID from block context or current global post.
     *
     * @param \WP_Block|null $block Block instance.
     *
     * @return int
     */
    protected function resolvePostId($block)
    {
        if ($block instanceof \WP_Block && !empty($block->context['postId'])) {
            return (int) $block->context['postId'];
        }

        $post_id = get_the_ID();
        if ($post_id) {
            return (int) $post_id;
        }

        global $post;
        if ($post && isset($post->ID)) {
            return (int) $post->ID;
        }

        return 0;
    }
}
