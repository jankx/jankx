<?php

namespace Jankx\Layouts\PostLayout\Contracts;

use WP_Query;

/**
 * Content Generator Interface
 *
 * Contract cho content generators - tách biệt logic render khỏi PostLayout
 *
 * @package Jankx\Layouts\PostLayout\Contracts
 */
interface ContentGeneratorInterface
{
    /**
     * Generate content for the entire layout
     *
     * @param WP_Query $query The query instance
     * @param array $options Layout options
     * @return string Generated HTML content
     */
    public function generate(WP_Query $query, array $options = []): string;

    /**
     * Generate preview data for Gutenberg editor
     *
     * @param array $options Layout options
     * @return array Preview data
     */
    public function generatePreview(array $options = []): array;

    /**
     * Get generator name
     *
     * @return string
     */
    public function getName(): string;

    /**
     * Get generator title
     *
     * @return string
     */
    public function getTitle(): string;

    /**
     * Check if generator supports specific options
     *
     * @param array $options
     * @return bool
     */
    public function supportsOptions(array $options): bool;
}
