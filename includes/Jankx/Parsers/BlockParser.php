<?php

namespace Jankx\Parsers;

/**
 * Block Parser for Jankx Framework
 *
 * Parses and analyzes Gutenberg blocks from content.
 *
 * @package Jankx\Parsers
 * @author Puleeno Nguyen <puleeno@gmail.com>
 * @version 2.0.0
 * @license MIT
 */
class BlockParser
{
    /**
     * Parse blocks from content
     *
     * @param string $content
     * @return array
     * @since 2.0.0
     */
    public function parse(string $content): array
    {
        if (empty($content)) {
            return [];
        }

        return \parse_blocks($content) ?: [];
    }

    /**
     * Count blocks in content
     *
     * @param string $content
     * @return int
     * @since 2.0.0
     */
    public function countBlocks(string $content): int
    {
        $blocks = $this->parse($content);
        return count($blocks);
    }

    /**
     * Get block types from content
     *
     * @param string $content
     * @return array
     * @since 2.0.0
     */
    public function getBlockTypes(string $content): array
    {
        $blocks = $this->parse($content);
        return $this->extractBlockTypes($blocks);
    }

    /**
     * Extract block types from blocks array
     *
     * @param array $blocks
     * @return array
     * @since 2.0.0
     */
    private function extractBlockTypes(array $blocks): array
    {
        $blockTypes = [];

        foreach ($blocks as $block) {
            if (!empty($block['blockName'])) {
                $blockName = $block['blockName'];
                if (!isset($blockTypes[$blockName])) {
                    $blockTypes[$blockName] = 0;
                }
                $blockTypes[$blockName]++;
            }
        }

        return $blockTypes;
    }
}