<?php

namespace Jankx\Debug\Services;

use Jankx\Debug\Contracts\QueryCountInterface;

/**
 * Query Count Service
 *
 * Manages database query counting and tracking
 *
 * @package Jankx\Debug\Services
 * @since 2.0.1
 */
class QueryCountService implements QueryCountInterface
{
    /**
     * @var int
     * @since 2.0.1
     */
    private $initialQueryCount = 0;

    /**
     * @var int
     * @since 2.0.1
     */
    private $queryCount = 0;

    /**
     * @var bool
     * @since 2.0.1
     */
    private $isTracking = false;

    /**
     * Start tracking queries
     *
     * @since 2.0.1
     */
    public function startTracking(): void
    {
        global $wpdb;

        // Enable query logging if not already enabled
        if (!defined('SAVEQUERIES')) {
            define('SAVEQUERIES', true);
        }

        // Capture initial query count
        $this->captureInitialQueryCount();

        // Hook into database queries
        add_filter('query', [$this, 'countQuery'], 10, 1);

        // Also hook into wpdb query method
        if (isset($GLOBALS['wpdb'])) {
            add_action('wpdb_query', [$this, 'countWpdbQuery'], 10, 2);
        }

        $this->isTracking = true;
    }

    /**
     * Capture initial query count
     *
     * @since 2.0.1
     */
    private function captureInitialQueryCount(): void
    {
        global $wpdb;

        if (isset($wpdb->num_queries)) {
            $this->initialQueryCount = $wpdb->num_queries;
        }
    }

    /**
     * Get query count
     *
     * @return int
     * @since 2.0.1
     */
    public function getQueryCount(): int
    {
        if (!$this->isTracking) {
            return 0;
        }

        global $wpdb;

        if (isset($wpdb->num_queries)) {
            return $wpdb->num_queries - $this->initialQueryCount;
        }

        return $this->queryCount;
    }

    /**
     * Count a query
     *
     * @param string $query
     * @return string
     * @since 2.0.1
     */
    public function countQuery(string $query): string
    {
        if ($this->isTracking) {
            $this->queryCount++;
        }

        return $query;
    }

    /**
     * Count wpdb query
     *
     * @param string $query
     * @param string $queryType
     * @since 2.0.1
     */
    public function countWpdbQuery(string $query, string $queryType): void
    {
        if ($this->isTracking) {
            $this->queryCount++;
        }
    }
}