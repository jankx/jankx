<?php

namespace Jankx\Gutenberg\Helpers;

/**
 * Helper trait for handling heading blocks in layout blocks
 * 
 * This trait provides functionality to:
 * - Extract heading blocks from inner blocks
 * - Render heading only when query has results
 * - Hide heading when query is empty
 */
trait HeadingBlockHandler
{
    /**
     * Extract heading block from inner blocks
     *
     * @param \WP_Block|null $block Block instance
     * @return array|null Heading block data or null
     */
    protected function extractHeadingBlock($block): ?array
    {
        if (!$block instanceof \WP_Block) {
            return null;
        }

        $parsedBlock = $block->parsed_block ?? [];
        if (empty($parsedBlock['innerBlocks'])) {
            return null;
        }

        foreach ($parsedBlock['innerBlocks'] as $innerBlock) {
            if (($innerBlock['blockName'] ?? '') === 'core/heading') {
                return $innerBlock;
            }
        }

        return null;
    }

    /**
     * Render heading block if query has results
     *
     * @param array|null $headingBlock Heading block data
     * @param \WP_Query|\WP_Term_Query|null $query Query object
     * @return string Rendered heading HTML or empty string
     */
    protected function renderHeadingBlock(?array $headingBlock, $query): string
    {
        if (!$headingBlock || !$query) {
            return '';
        }

        // Check if query has results
        $hasResults = false;
        if ($query instanceof \WP_Query) {
            $hasResults = $query->have_posts();
        } elseif ($query instanceof \WP_Term_Query) {
            $terms = $query->get_terms();
            $hasResults = !empty($terms) && !is_wp_error($terms);
        }

        // Don't render heading if no results
        if (!$hasResults) {
            return '';
        }

        // Render the heading block
        return render_block($headingBlock);
    }

    /**
     * Separate heading and template blocks from inner blocks
     *
     * @param \WP_Block|null $block Block instance
     * @return array Array with 'heading' and 'template' keys
     */
    protected function separateInnerBlocks($block): array
    {
        $result = [
            'heading' => null,
            'template' => null,
            'others' => [],
        ];

        if (!$block instanceof \WP_Block) {
            return $result;
        }

        $parsedBlock = $block->parsed_block ?? [];
        if (empty($parsedBlock['innerBlocks'])) {
            return $result;
        }

        foreach ($parsedBlock['innerBlocks'] as $innerBlock) {
            $blockName = $innerBlock['blockName'] ?? '';

            if ($blockName === 'core/heading') {
                $result['heading'] = $innerBlock;
            } elseif (
                in_array($blockName, [
                    'jankx/dynamic-data-template',
                    'jankx/dynamic-ssr-template',
                    'jankx/term-layout-template',
                    'jankx/dynamic-term-template'
                ], true)
            ) {
                $result['template'] = $innerBlock;
            } else {
                $result['others'][] = $innerBlock;
            }
        }

        return $result;
    }
}
