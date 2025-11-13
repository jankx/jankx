<?php

/**
 * Date Query Interface
 *
 * Contract specific cho date-based queries
 *
 * @package Jankx\Contracts\Query
 * @since 1.0.0
 */

namespace Jankx\Contracts\Query;

interface DateQueryInterface
{
    /**
     * Add date query
     *
     * @param string $column
     * @param string|null $after
     * @param string|null $before
     * @param bool $inclusive
     * @return self
     */
    public function addDate(string $column, ?string $after = null, ?string $before = null, bool $inclusive = true): self;

    /**
     * Get date queries
     *
     * @return array
     */
    public function getDateQueries(): array;

    /**
     * Reset date queries
     *
     * @return self
     */
    public function resetDateQueries(): self;
}

