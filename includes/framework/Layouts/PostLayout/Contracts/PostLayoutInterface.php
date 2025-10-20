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
}