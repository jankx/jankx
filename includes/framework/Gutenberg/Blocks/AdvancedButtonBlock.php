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
        // If content is empty but we have inner blocks, render them
        // This handles cases where save function might not have included inner blocks
        if (empty($content) && $block && !empty($block->inner_blocks)) {
            $inner_content = '';
            foreach ($block->inner_blocks as $inner_block) {
                // $inner_block is a WP_Block object, use render() method instead of render_block()
                if ($inner_block instanceof \WP_Block) {
                    $inner_content .= $inner_block->render();
                } else {
                    // Fallback: if it's an array, use render_block()
                    $inner_content .= render_block($inner_block);
                }
            }
            // If we only have inner blocks, create a basic button structure
            if (!empty($inner_content)) {
                $text = $attributes['text'] ?? '';
                $showLabel = $attributes['showLabel'] ?? true;
                $button_text = ($showLabel && !empty($text)) ? '<span class="button-text">' . esc_html($text) . '</span>' : '';
                $content = sprintf(
                    '<a class="jankx-advanced-button__link" href="%s" data-trigger-type="link">%s<span class="button-icon-wrapper">%s</span></a>',
                    esc_url($attributes['url'] ?? '#'),
                    $button_text,
                    $inner_content
                );
            }
        }
        
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

        // Extract existing wrapper classes including style classes (is-style-fill, is-style-outline)
        $existing_classes = [];
        if (preg_match('/<div[^>]*class="([^"]*)"[^>]*>/', $content, $matches)) {
            $existing_classes = explode(' ', $matches[1]);
        }

        // Get alignment from block attributes (WordPress stores this separately)
        $text_align = '';
        if (!empty($attributes['textAlign'])) {
            $text_align = $attributes['textAlign'];
        } elseif (!empty($attributes['align'])) {
            $text_align = $attributes['align'];
        }

        // Check className attribute for text alignment
        if (empty($text_align) && !empty($attributes['className'])) {
            if (preg_match('/has-text-align-(\w+)/', $attributes['className'], $align_match)) {
                $text_align = $align_match[1];
            }
        }

        // Determine if it's outline mode
        $is_outline_mode = in_array('is-style-outline', $existing_classes);

        // Remove wrapper div but preserve all content inside (button element, text, inner blocks)
        // This preserves the button element and all its content including inner blocks
        // Match opening wrapper div and remove it
        $content = preg_replace('/<div[^>]*class="[^"]*wp-block-jankx-advanced-button[^"]*"[^>]*>/', '', $content);
        // Match closing wrapper div at the end and remove it
        $content = preg_replace('/<\/div>\s*$/', '', $content);

        // Check if button has background color or gradient set
        // This includes preset colors (backgroundColor), custom colors (style.color.background), gradients, and inline styles
        $has_background_color = (
            !empty($attributes['backgroundColor']) ||
            !empty($attributes['gradient']) ||
            !empty($attributes['style']['color']['background']) ||
            !empty($attributes['style']['color']['gradient']) ||
            preg_match('/has-[a-z0-9\-]+-background-color/', $content) ||
            preg_match('/has-[a-z0-9\-]+-gradient-background/', $content) ||
            preg_match('/background-color\s*:\s*[^;]+/', $content) ||
            preg_match('/background\s*:\s*[^;]*gradient/', $content)
        );

        // Apply default color classes based on mode if no background color is set
        if (!$has_background_color) {
            if ($is_outline_mode) {
                // Outline mode: Add primary color for border and text
                // Add has-primary-color for text color
                $content = preg_replace(
                    '/(class="jankx-advanced-button__link[^"]*")/',
                    '$1',
                    $content
                );

                // Add primary color classes to button element
                if (preg_match('/<(a|button)([^>]*class="[^"]*jankx-advanced-button__link[^"]*")([^>]*)>/', $content, $button_matches)) {
                    $button_classes = $button_matches[2];

                    // Add has-primary-color and has-base-color classes
                    $new_button_classes = str_replace(
                        'class="jankx-advanced-button__link',
                        'class="jankx-advanced-button__link has-primary-color has-base-color',
                        $button_classes
                    );

                    $content = str_replace($button_classes, $new_button_classes, $content);
                }
            } else {
                // Fill mode: Add primary background and contrast text color
                // Add has-primary-background-color and has-contrast-color
                if (preg_match('/<(a|button)([^>]*class="[^"]*jankx-advanced-button__link[^"]*")([^>]*)>/', $content, $button_matches)) {
                    $button_classes = $button_matches[2];

                    // Add color classes
                    $new_button_classes = str_replace(
                        'class="jankx-advanced-button__link',
                        'class="jankx-advanced-button__link has-primary-background-color has-contrast-color has-base-color',
                        $button_classes
                    );

                    $content = str_replace($button_classes, $new_button_classes, $content);
                }
            }
        }

        // Build wrapper classes
        $wrapper_classes = [
            'wp-block-jankx-advanced-button',
            'jankx-advanced-button'
        ];

        // Preserve style classes (is-style-fill, is-style-outline, etc.)
        // and alignment classes (has-text-align-*)
        foreach ($existing_classes as $class) {
            if (strpos($class, 'is-style-') === 0 || strpos($class, 'has-text-align-') === 0) {
                $wrapper_classes[] = $class;
            }
        }

        // Add text alignment class from attributes (avoid duplicates)
        if (!empty($text_align)) {
            $align_class = "has-text-align-{$text_align}";
            if (!in_array($align_class, $wrapper_classes)) {
                $wrapper_classes[] = $align_class;
            }
        }

        // Check if content has inner blocks (button-icon-wrapper) with content
        // If not, and we have inner blocks in $block, inject them
        $has_inner_blocks_in_content = false;
        if (preg_match('/<span[^>]*class="[^"]*button-icon-wrapper[^"]*"[^>]*>.*?<\/span>/s', $content, $wrapper_match)) {
            // Check if wrapper has content (not just empty or whitespace)
            $wrapper_content = preg_replace('/<[^>]+>/', '', $wrapper_match[0]);
            $has_inner_blocks_in_content = !empty(trim($wrapper_content));
        }
        
        if (!$has_inner_blocks_in_content && $block && !empty($block->inner_blocks)) {
            // Render inner blocks
            $inner_content = '';
            foreach ($block->inner_blocks as $inner_block) {
                // $inner_block is a WP_Block object, use render() method instead of render_block()
                if ($inner_block instanceof \WP_Block) {
                    $inner_content .= $inner_block->render();
                } else {
                    // Fallback: if it's an array, use render_block()
                    $inner_content .= render_block($inner_block);
                }
            }
            
            if (!empty($inner_content)) {
                // Try to inject inner blocks into button-icon-wrapper
                // First, check if button-icon-wrapper exists (even if empty)
                if (preg_match('/<span[^>]*class="[^"]*button-icon-wrapper[^"]*"[^>]*>.*?<\/span>/s', $content)) {
                    // Already has wrapper, replace its content with inner blocks
                    $content = preg_replace(
                        '/(<span[^>]*class="[^"]*button-icon-wrapper[^"]*"[^>]*>)(.*?)(<\/span>)/s',
                        '$1' . $inner_content . '$3',
                        $content
                    );
                } else {
                    // No button-icon-wrapper, add it with inner blocks
                    $text = $attributes['text'] ?? '';
                    $showLabel = $attributes['showLabel'] ?? true;
                    $button_text = ($showLabel && !empty($text)) ? '<span class="button-text">' . esc_html($text) . '</span>' : '';
                    
                    // Find button element and inject inner blocks and text after opening tag
                    if (preg_match('/(<(a|button)[^>]*class="[^"]*jankx-advanced-button__link[^"]*"[^>]*>)/', $content, $button_match)) {
                        // Inject inner blocks and text after opening tag
                        $content = str_replace(
                            $button_match[0],
                            $button_match[0] . '<span class="button-icon-wrapper">' . $inner_content . '</span>' . $button_text,
                            $content
                        );
                    }
                }
            }
        }
        
        // Add icon position class if needed
        $iconPosition = $attributes['iconPosition'] ?? 'left';
        if (!empty($attributes['useIconBlocks']) && $iconPosition) {
            $wrapper_classes[] = "icon-position-{$iconPosition}";
        }

        $wrapper_attributes = sprintf(
            'class="%s"',
            esc_attr(implode(' ', $wrapper_classes))
        );

        return sprintf(
            '<div %s>%s</div>',
            $wrapper_attributes,
            $content
        );
    }
}
