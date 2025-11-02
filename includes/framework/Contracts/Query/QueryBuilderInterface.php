<?php

/**
 * Query Builder Interface
 *
 * Contract cho tất cả query builder implementations
 * Follows Interface Segregation Principle
 *
 * @package Jankx\Contracts\Query
 * @since 1.0.0
 */

namespace Jankx\Contracts\Query;

use WP_Query;

interface QueryBuilderInterface
{
    /**
     * Build query arguments
     *
     * @param array $params Query parameters
     * @return array WP_Query compatible arguments
     */
    public function build(array $params): array;

    /**
     * Execute query and return WP_Query instance
     *
     * @param array $params Query parameters
     * @return WP_Query
     */
    public function query(array $params): WP_Query;

    /**
     * Get query instance
     *
     * @return WP_Query|null
     */
    public function getQuery(): ?WP_Query;

    /**
     * Reset builder state
     *
     * @return self
     */
    public function reset(): self;
}

