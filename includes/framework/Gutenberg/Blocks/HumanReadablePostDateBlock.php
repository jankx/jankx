<?php
/**
 * Human Readable Post Date Block
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 2.0.0
 */

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class HumanReadablePostDateBlock extends Block
{
    /**
     * Block ID.
     *
     * @var string
     */
    protected $blockId = 'jankx/human-readable-post-date';

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

        $diff = human_time_diff(get_the_time('U', $post_id), current_time('timestamp'));
        
        $human_date = sprintf(__('%s ago', 'jankx'), $diff);
        $show_icon = $attributes['showIcon'] ?? true;
        
        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => 'jankx-human-readable-post-date',
        ]);

        return sprintf(
            '<div %1$s>%2$s%3$s</div>',
            $wrapper_attributes,
            $show_icon ? '<span class="post-date-icon" style="margin-right: 6px;">🕒</span>' : '',
            esc_html($human_date)
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
