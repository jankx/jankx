<?php

namespace Jankx\Layouts\PostLayout\Contracts;

use WP_Query;

/**
 * Post Layout Interface
 *
 * Contract cho tất cả các post layout classes
 *
 * @package Jankx\Layouts\PostLayout\Contracts
 */
interface PostLayoutInterface
{
    /**
     * Get layout name/slug
     *
     * @return string
     */
    public function getName(): string;

    /**
     * Get layout display title
     *
     * @return string
     */
    public function getTitle(): string;

    /**
     * Set layout options từ block attributes
     *
     * @param array $options
     * @return self
     */
    public function setOptions($options): self;

    /**
     * Get layout options
     *
     * @return array
     */
    public function getOptions(): array;

    /**
     * Set WP_Query object
     *
     * @param WP_Query $query
     * @return self
     */
    public function setQuery(WP_Query $query): self;

    /**
     * Render layout HTML
     *
     * @return string
     */
    public function render() : string;

    /**
     * Render preview data for Gutenberg editor
     * Returns JSON object with layout preview data
     *
     * @return array
     */
    public function renderPreview(): array;

    /**
     * Get supported options cho layout
     *
     * @return array
     */
    public function getSupportedOptions(): array;

    /**
     * Get readonly options - những options bắt buộc phải hiển thị
     * (không thể ẩn đi vì sẽ làm layout vô nghĩa)
     *
     * @return array
     */
    public function getReadOnlyOptions(): array;

    /**
     * Set content generator
     *
     * @param \Jankx\Layouts\PostLayout\Contracts\ContentGeneratorInterface $generator
     * @return self
     */
    public function setContentGenerator($generator): self;

    /**
     * Get content generator
     *
     * @return \Jankx\Layouts\PostLayout\Contracts\ContentGeneratorInterface
     */
    public function getContentGenerator();

    /**
     * Check if using custom content generator
     *
     * @return bool
     */
    public function hasCustomGenerator(): bool;

    /**
     * Wrap template HTML theo layout
     *
     * @param string $html
     * @param array $options
     * @return string
     */
    public function wrapTemplateHtml(string $html, array $options = []): string;

    /**
     * Get HTML structure definition for editor rendering
     * Returns array structure that matches TypeScript LayoutStructure interface
     *
     * @param array $options Layout options
     * @return array Structure definition
     */
    public function getHtmlStructure(array $options = []): array;
}