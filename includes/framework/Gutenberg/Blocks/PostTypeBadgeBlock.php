<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class PostTypeBadgeBlock extends Block
{
    /**
     * Block ID.
     *
     * @var string
     */
    protected $blockId = 'jankx/post-type-badge';

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
        $is_template_editor = $this->isTemplateEditor();

        if ($is_template_editor) {
            $label = $this->getMockLabel();
        } else {
            $post_id = $this->resolvePostId($block);

            if (!$post_id) {
                return '';
            }

            $ptype = get_post_type($post_id);
            $ptype_obj = get_post_type_object($ptype);
            $label = $ptype_obj ? ($ptype_obj->labels->singular_name ?? $ptype_obj->label) : $ptype;
        }

        $attrs = is_array($attributes) ? $attributes : (array) $attributes;

        $displayType = isset($attrs['displayType']) ? $attrs['displayType'] : 'absolute';
        $position = isset($attrs['position']) ? $attrs['position'] : 'top-right';
        $offsetX = isset($attrs['offsetX']) ? $attrs['offsetX'] : '12px';
        $offsetY = isset($attrs['offsetY']) ? $attrs['offsetY'] : '12px';
        $bg = isset($attrs['backgroundColor']) ? $attrs['backgroundColor'] : '#2e7d32';
        $color = isset($attrs['textColor']) ? $attrs['textColor'] : '#fff';
        $radius = isset($attrs['borderRadius']) ? intval($attrs['borderRadius']) : 8;
        $showLabel = isset($attrs['showLabel']) ? boolval($attrs['showLabel']) : true;

        if (!$showLabel) {
            return '';
        }

        $classes_array = [
            'wp-block-jankx-post-type-badge',
        ];
        if ($displayType === 'absolute') {
            $classes_array[] = 'position-' . esc_attr($position);
        } else {
            $classes_array[] = 'display-normal';
        }

        $classes = implode(' ', array_filter($classes_array));

        $style_parts = [];
        if ($displayType === 'absolute') {
            if (strpos($position, 'top') !== false) {
                $style_parts[] = 'top: ' . esc_attr($offsetY) . ';';
            } else {
                $style_parts[] = 'bottom: ' . esc_attr($offsetY) . ';';
            }

            if (strpos($position, 'right') !== false) {
                $style_parts[] = 'right: ' . esc_attr($offsetX) . ';';
            } else {
                $style_parts[] = 'left: ' . esc_attr($offsetX) . ';';
            }
        }

        $style_parts[] = 'background: ' . esc_attr($bg) . ';';
        $style_parts[] = 'color: ' . esc_attr($color) . ';';
        $style_parts[] = 'border-radius: ' . intval($radius) . 'px;';
        $style = implode(' ', $style_parts);

        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => 'jankx-post-type-badge ' . $classes,
        ]);

        return sprintf(
            '<div %1$s style="%2$s">%3$s</div>',
            $wrapper_attributes,
            esc_attr($style),
            esc_html($label)
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

    /**
     * Check whether the block is rendered inside the template editor.
     *
     * @return bool
     */
    protected function isTemplateEditor()
    {
        if (defined('REST_REQUEST') && REST_REQUEST) {
            $request_uri = $_SERVER['REQUEST_URI'] ?? '';
            if (strpos($request_uri, '/wp-json/wp/v2/template') !== false ||
                strpos($request_uri, '/wp-json/wp/v2/template-part') !== false) {
                return true;
            }
        }

        if (function_exists('get_current_screen')) {
            $screen = get_current_screen();
            if ($screen && ($screen->id === 'site-editor' || $screen->id === 'appearance_page_gutenberg-edit-site')) {
                return true;
            }
        }

        if (isset($_GET['_wp-find-template']) || (isset($_GET['postType']) && $_GET['postType'] === 'wp_template')) {
            return true;
        }

        global $post;
        if ((is_admin() || (defined('REST_REQUEST') && REST_REQUEST)) && (empty($post) || empty($post->post_content))) {
            return true;
        }

        return false;
    }

    /**
     * Get mock label for template editor preview.
     *
     * @return string
     */
    protected function getMockLabel()
    {
        return __('Post', 'jankx');
    }
}
