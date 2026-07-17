<?php

namespace App\Services\ThemeOptions\Contracts;

/**
 * Interface for block default appliers
 *
 * Strategy Pattern: Each block type has its own default applier
 */
interface BlockDefaultApplierInterface
{
    /**
     * Check if this applier supports the given block
     *
     * @param string $blockName
     * @return bool
     */
    public function supports(string $blockName): bool;

    /**
     * Apply theme defaults to block content
     *
     * @param string $content Block HTML content
     * @param array $block Block data
     * @param array $themeOptions Theme options service
     * @return string Modified content
     */
    public function apply(string $content, array $block, $themeOptions): string;

    /**
     * Get supported block names
     *
     * @return array
     */
    public function getSupportedBlocks(): array;
}
