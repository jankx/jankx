<?php

namespace Jankx\Debug\Contracts;

/**
 * Query Count Interface
 *
 * @package Jankx\Debug\Contracts
 * @since 2.0.0
 */
interface QueryCountInterface
{
    /**
     * Start tracking queries
     *
     * @since 2.0.0
     */
    public function startTracking(): void;

    /**
     * Get query count
     *
     * @return int
     * @since 2.0.0
     */
    public function getQueryCount(): int;

    /**
     * Count a query
     *
     * @param string $query
     * @return string
     * @since 2.0.0
     */
    public function countQuery(string $query): string;

    /**
     * Count wpdb query
     *
     * @param string $query
     * @param string $queryType
     * @since 2.0.0
     */
    public function countWpdbQuery(string $query, string $queryType): void;
}
