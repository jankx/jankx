<?php

namespace Jankx\Services;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


use Jankx\Parsers\BlockParser;

/**
 * Gutenberg Blocks Service
 *
 * @package Jankx\Services
 * @since 2.0.0
 */
class GutenbergBlocksService
{
    private $blockParser;

    /**
     * Method __construct
     *
     * @since 2.0.0
     */
    public function __construct(BlockParser $blockParser)
    {
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
        return \is_admin() && $this->isBlockEditor();
    }

    /**
     * Check if current content has Gutenberg blocks
     *
     * @return bool
     * @since 2.0.0
     */
    private function hasGutenbergContent(): bool
    {
        $content = \get_the_content() ?: '';
        $excerpt = \get_the_excerpt() ?: '';

        return \has_blocks($content) || \has_blocks($excerpt);
    }

    /**
     * Parse blocks from content
     *
     * @return array
     * @since 2.0.0
     */
    private function parseBlocks(): array
    {
        $content = \get_the_content() ?: '';

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
     * Check if currently in block editor
     *
     * @return bool
     * @since 2.0.0
     */
    private function isBlockEditor(): bool
    {
        if (!function_exists('get_current_screen')) {
            return false;
        }

        $screen = \get_current_screen();
        return $screen && method_exists($screen, 'is_block_editor') && $screen->is_block_editor();
    }

    /**
     * Get template parts count
     *
     * @return int
     * @since 2.0.0
     */
    private function getTemplateParts(): int
    {
        if (!function_exists('get_block_template_parts')) {
            return 0;
        }

        $templateParts = \get_block_template_parts();
        return is_array($templateParts) ? count($templateParts) : 0;
    }
}
