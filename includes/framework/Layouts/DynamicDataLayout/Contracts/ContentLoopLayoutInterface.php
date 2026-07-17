<?php

namespace Jankx\Layouts\DynamicDataLayout\Contracts;

/**
 * Content Loop Layout Interface
 *
 * Interface for layouts of individual items in a dynamic data loop.
 */
interface ContentLoopLayoutInterface
{
    /**
     * Get layout name
     *
     * @return string
     */
    public function getName(): string;

    /**
     * Get layout title
     *
     * @return string
     */
    public function getTitle(): string;

    /**
     * Get supported options for this layout
     *
     * @return array
     */
    public function getSupportedOptions(): array;

    /**
     * Get default inner blocks template for this layout
     *
     * @param string $postType
     * @return array
     */
    public function getDefaultTemplate(string $postType): array;

    /**
     * Change HTML structure if needed
     *
     * @param string $content The rendered content of inner blocks
     * @param array $attributes Block attributes
     * @param array $options Rendering options
     * @return string
     */
    public function renderItem(string $content, array $attributes, array $options = []): string;

    /**
     * Build wrapper classes for the item
     *
     * @param array $attributes
     * @return array
     */
    public function getItemClasses(array $attributes): array;

    /**
     * Inject scripts or styles if needed
     *
     * @return void
     */
    public function enqueueAssets(): void;
}
