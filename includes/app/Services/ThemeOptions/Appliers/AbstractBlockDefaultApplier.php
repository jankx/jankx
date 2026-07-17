<?php

namespace App\Services\ThemeOptions\Appliers;

use App\Services\ThemeOptions\Contracts\BlockDefaultApplierInterface;

/**
 * Abstract base class for block default appliers
 */
abstract class AbstractBlockDefaultApplier implements BlockDefaultApplierInterface
{
    /**
     * @var array Supported block names
     */
    protected $supportedBlocks = [];

    /**
     * Check if this applier supports the given block
     *
     * @param string $blockName
     * @return bool
     */
    public function supports(string $blockName): bool
    {
        return in_array($blockName, $this->supportedBlocks, true);
    }

    /**
     * Get supported block names
     *
     * @return array
     */
    public function getSupportedBlocks(): array
    {
        return $this->supportedBlocks;
    }

    /**
     * Get block attributes
     *
     * @param array $block
     * @return array
     */
    protected function getAttributes(array $block): array
    {
        return $block['attrs'] ?? [];
    }

    /**
     * Check if attribute is explicitly set
     *
     * @param array $attrs
     * @param string $key
     * @return bool
     */
    protected function hasExplicitValue(array $attrs, string $key): bool
    {
        return !empty($attrs[$key]);
    }

    /**
     * Check if color is explicitly set
     *
     * @param array $attrs
     * @param string $colorKey
     * @param string $stylePath
     * @return bool
     */
    protected function hasColorSet(array $attrs, string $colorKey, string $stylePath): bool
    {
        return !empty($attrs[$colorKey]) || !empty($attrs['style']['color'][$stylePath]);
    }
}
