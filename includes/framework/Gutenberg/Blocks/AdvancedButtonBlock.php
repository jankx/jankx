<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Advanced Button Block
 *
 * An enhanced button block with advanced styling and functionality options.
 * Includes trigger type support: link, button, detail-link, and modal.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class AdvancedButtonBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/advanced-button';

    /**
     * Render the block content
     *
     * This block uses JavaScript save function for most rendering,
     * but we need to handle special trigger types like detail-link
     * which requires PHP to get the current post permalink.
     *
     * @param array $attributes Block attributes
     * @param string $content Block content (HTML from save function)
     * @param \WP_Block $block Block instance
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '', $block = null)
    {
        $triggerType = $attributes['triggerType'] ?? 'link';

        // Fallback: Check HTML content for data-trigger-type if attribute parsing fails
        // This is important for query loops where attributes come from template, not individual posts
        if ($triggerType === 'link' && strpos($content, 'data-trigger-type="detail-link"') !== false) {
            $triggerType = 'detail-link';
        } elseif ($triggerType === 'link' && strpos($content, 'data-trigger-type="modal"') !== false) {
            $triggerType = 'modal';
        } elseif ($triggerType === 'link' && strpos($content, 'data-trigger-type="button"') !== false) {
            $triggerType = 'button';
        }

        // Handle detail-link: Replace placeholder href with actual permalink
        if ($triggerType === 'detail-link') {
            $permalink = get_permalink();

            if ($permalink) {
                // Use regex to replace href="#" with actual permalink
                // This handles cases where there might be spaces or other variations
                $content = preg_replace(
                    '/href\s*=\s*["\']#["\']/',
                    'href="' . esc_url($permalink) . '"',
                    $content
                );
            }
        }

        // Handle modal trigger: add dynamic data attributes
        if ($triggerType === 'modal') {
            $modalId = $attributes['modalId'] ?? '';

            // Build data attributes to inject
            $dataAttrs = [];

            // Replace placeholder data attributes with actual post data
            // Check if we're in a post context (single post, page, custom post type)
            if (is_singular() && have_posts()) {
                the_post();
                $post_id = get_the_ID();
                $post_title = get_the_title();
                $post_url = get_permalink();
                wp_reset_postdata();
            } else {
                // Fallback for archive pages or other contexts
                global $post;
                $post_id = $post ? $post->ID : '';
                $post_title = $post ? $post->post_title : '';
                $post_url = $post ? get_permalink($post) : '';
            }

            if ($post_id && $post_title && $post_url) {
                // Escape data for HTML attributes
                $post_id_escaped = esc_attr($post_id);
                $post_title_escaped = esc_attr($post_title);
                $post_url_escaped = esc_attr($post_url);

                // Replace placeholders
                $content = str_replace('{{CURRENT_POST_ID}}', $post_id_escaped, $content);
                $content = str_replace('{{CURRENT_POST_TITLE}}', $post_title_escaped, $content);
                $content = str_replace('{{CURRENT_POST_URL}}', $post_url_escaped, $content);
            }

            // Inject data attributes into button
            if (!empty($dataAttrs)) {
                // Build attributes string
                $attrsString = '';
                foreach ($dataAttrs as $attrName => $attrValue) {
                    $attrsString .= ' ' . $attrName . '="' . $attrValue . '"';
                }

                // Inject after data-modal-id
                $content = preg_replace(
                    '/(data-modal-id="[^"]*")/',
                    '$1' . $attrsString,
                    $content
                );
            }
        }

        return $content;
    }
}
