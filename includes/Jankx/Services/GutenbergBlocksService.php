<?php

namespace Jankx\Services;

/**
 * Gutenberg Blocks Service
 *
 * @package Jankx\Services
 * @since 2.0.0
 */
class GutenbergBlocksService
{
    private $wordPressAdapter;
    private $blockParser;

    public function __construct(WordPressAdapter $wordPressAdapter, BlockParser $blockParser)
    {
        $this->wordPressAdapter = $wordPressAdapter;
        $this->blockParser = $blockParser;
    }

    /**
     * Get Gutenberg blocks information
     *
     * @return array
     * @since 2.0.0
     */
    public function getBlocksInfo(): array
    {
        $blocksInfo = [
            'total_blocks' => 0,
            'block_types' => [],
            'is_gutenberg_editor' => false,
            'is_gutenberg_frontend' => false
        ];

        // Check editor mode
        if ($this->isGutenbergEditor()) {
            $blocksInfo['is_gutenberg_editor'] = true;
        }

        // Check frontend content
        if ($this->hasGutenbergContent()) {
            $blocksInfo['is_gutenberg_frontend'] = true;
            $blocksInfo = array_merge($blocksInfo, $this->parseBlocks());
        }

        // Check template parts
        $templateParts = $this->getTemplateParts();
        if ($templateParts > 0) {
            $blocksInfo['template_parts'] = $templateParts;
        }

        return $blocksInfo;
    }

    /**
     * Check if currently in Gutenberg editor
     *
     * @return bool
     * @since 2.0.0
     */
    private function isGutenbergEditor(): bool
    {
        return $this->wordPressAdapter->isAdmin() &&
               $this->wordPressAdapter->isBlockEditor();
    }

    /**
     * Check if current content has Gutenberg blocks
     *
     * @return bool
     * @since 2.0.0
     */
    private function hasGutenbergContent(): bool
    {
        $content = $this->wordPressAdapter->getCurrentContent();
        $excerpt = $this->wordPressAdapter->getCurrentExcerpt();

        return $this->wordPressAdapter->hasBlocks($content) ||
               $this->wordPressAdapter->hasBlocks($excerpt);
    }

    /**
     * Parse blocks from content
     *
     * @return array
     * @since 2.0.0
     */
    private function parseBlocks(): array
    {
        $content = $this->wordPressAdapter->getCurrentContent();

        if (empty($content)) {
            return ['total_blocks' => 0, 'block_types' => []];
        }

        $blocks = $this->blockParser->parse($content);

        return [
            'total_blocks' => count($blocks),
            'block_types' => $this->countBlockTypes($blocks)
        ];
    }

    /**
     * Count block types
     *
     * @param array $blocks
     * @return array
     * @since 2.0.0
     */
    private function countBlockTypes(array $blocks): array
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

    /**
     * Get template parts count
     *
     * @return int
     * @since 2.0.0
     */
    private function getTemplateParts(): int
    {
        return $this->wordPressAdapter->getTemplatePartsCount();
    }
}