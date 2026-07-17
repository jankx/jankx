<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Search Results Count Block
 *
 * Displays the number of items found in the current search/query results.
 * Only the numeric count is rendered — no label.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class SearchResultsCountBlock extends Block
{
    /**
     * Block ID.
     *
     * @var string
     */
    protected $blockId = 'jankx/search-results-count';

    /**
     * Render the block on the frontend.
     *
     * @param array         $attributes Block attributes.
     * @param string        $content    Inner block content.
     * @param \WP_Block|null $block     Block instance.
     *
     * @return string
     */
    public function render($attributes, $content = '', $block = null)
    {
        $count = $this->resolveCount($block);

        $wrapper_attributes = get_block_wrapper_attributes([
            'class' => 'jankx-search-results-count',
        ]);

        return sprintf(
            '<span %1$s>%2$s</span>',
            $wrapper_attributes,
            esc_html(number_format_i18n($count))
        );
    }

    /**
     * Resolve the result count from the global query or block query context.
     *
     * @param \WP_Block|null $block Block instance.
     *
     * @return int
     */
    protected function resolveCount($block)
    {
        // If rendered inside a Query Loop block, use its inherited query.
        if ($block instanceof \WP_Block && !empty($block->context['query'])) {
            $query_args = $block->context['query'];
            $query      = new \WP_Query($query_args);
            return (int) $query->found_posts;
        }

        // Fall back to the main global query (search results page, archive, etc.).
        global $wp_query;
        if ($wp_query instanceof \WP_Query) {
            return (int) $wp_query->found_posts;
        }

        return 0;
    }

    /**
     * Get mock count for template editor preview.
     *
     * @return int
     */
    protected function getMockCount()
    {
        return 42;
    }
}
