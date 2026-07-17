<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class CommentCountBlock extends Block
{
    /**
     * Block ID.
     *
     * @var string
     */
    protected $blockId = 'jankx/comment-count';

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
            $count = $this->getMockCount();
        } else {
            $post_id = $this->resolvePostId($block);

            if (!$post_id) {
                return '';
            }

            $count = get_comments_number($post_id);
        }

        $count = max(0, (int) $count);
        $label = _n('Comment', 'Comments', $count, 'jankx');

        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => 'jankx-comment-count',
        ]);

        return sprintf(
            '<div %1$s><span class="comment-count-number">%2$s</span><span class="comment-count-text">%3$s</span></div>',
            $wrapper_attributes,
            esc_html(number_format_i18n($count)),
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

        if (isset($_GET['_wp-find-template']) ||
            (isset($_GET['postType']) && $_GET['postType'] === 'wp_template')) {
            return true;
        }

        global $post;
        if ((is_admin() || (defined('REST_REQUEST') && REST_REQUEST)) &&
            (empty($post) || empty($post->post_content))) {
            return true;
        }

        return false;
    }

    /**
     * Get mock comment count for template editor preview.
     *
     * @return int
     */
    protected function getMockCount()
    {
        return 12;
    }
}

