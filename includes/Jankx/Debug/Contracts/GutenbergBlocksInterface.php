<?php

namespace Jankx\Debug\Contracts;

/**
 * Gutenberg Blocks Interface
 *
 * @package Jankx\Debug\Contracts
 * @since 2.0.1
 */
interface GutenbergBlocksInterface
{
    /**
     * Capture Gutenberg blocks information
     *
     * @since 2.0.1
     */
    public function captureInfo(): void;

    /**
     * Get Gutenberg blocks information
     *
     * @return array
     * @since 2.0.1
     */
    public function getBlocksInfo(): array;
}