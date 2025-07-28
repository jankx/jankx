<?php

namespace Jankx\Parsers;

/**
 * Gutenberg Block Extractor - Regex-based
 *
 * High-performance block extraction using optimized regex patterns
 *
 * @since 2.0.0
 */
class GutenbergBlockExtractor
{
    private $content;

    public function __construct(string $content)
    {
        $this->content = $content;
    }

    /**
     * Extract block names and count blocks using optimized regex
     */
    public function extractBlockInfo(): array
    {
        $blockCounts = [];
        $blockNames = [];
        $totalBlocks = 0;

        // Optimized pattern: match opening blocks only (including self-closing)
        $pattern = '/<!--\s*wp:([^\s\/>]+)/';

        if (preg_match_all($pattern, $this->content, $matches, PREG_SET_ORDER)) {
            foreach ($matches as $match) {
                $blockName = $match[1];

                if (!isset($blockCounts[$blockName])) {
                    $blockCounts[$blockName] = 0;
                }
                $blockCounts[$blockName]++;
                $blockNames[] = $blockName;
                $totalBlocks++;
            }
        }

        return [
            'total_blocks' => $totalBlocks,
            'block_types' => $blockCounts,
            'unique_block_types' => count($blockCounts),
            'block_names' => $blockNames
        ];
    }

    /**
     * Get only block names (for backward compatibility)
     */
    public function getBlockNames(): array
    {
        $info = $this->extractBlockInfo();
        return $info['block_names'];
    }

    /**
     * Get block statistics
     */
    public function getBlockStats(): array
    {
        return $this->extractBlockInfo();
    }

    /**
     * Count total blocks
     */
    public function countTotalBlocks(): int
    {
        $info = $this->extractBlockInfo();
        return $info['total_blocks'];
    }

    /**
     * Check if content has blocks
     */
    public function hasBlocks(): bool
    {
        return strpos($this->content, '<!-- wp:') !== false;
    }
}