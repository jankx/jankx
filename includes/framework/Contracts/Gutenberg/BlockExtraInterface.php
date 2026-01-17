<?php

namespace Jankx\Contracts\Gutenberg;

/**
 * Interface BlockExtraInterface
 *
 * Standard interface for classes adding extra features to existing Gutenberg blocks.
 *
 * @package Jankx\Contracts\Gutenberg
 */
interface BlockExtraInterface
{
    /**
     * Get the targeted block name (e.g. 'core/categories')
     *
     * @return string
     */
    public function getTargetBlockName(): string;

    /**
     * Run any preliminary registration logic (e.g. add_filter('render_block_...'))
     *
     * @return void
     */
    public function register(): void;

    /**
     * Handle the block rendering.
     * Often used inside the render_block filter.
     *
     * @param string $block_content
     * @param array $block
     * @return string
     */
    public function handle(string $block_content, array $block): string;
}
