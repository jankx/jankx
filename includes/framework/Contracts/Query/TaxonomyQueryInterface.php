<?php

/**
 * Taxonomy Query Interface
 *
 * Contract specific cho taxonomy queries
 *
 * @package Jankx\Contracts\Query
 * @since 1.0.0
 */

namespace Jankx\Contracts\Query;

interface TaxonomyQueryInterface
{
    /**
     * Add taxonomy query
     *
     * @param string $taxonomy
     * @param string $field
     * @param array $terms
     * @param string $operator
     * @return self
     */
    public function addTaxonomy(string $taxonomy, string $field, array $terms, string $operator = 'IN'): self;

    /**
     * Get taxonomy queries
     *
     * @return array
     */
    public function getTaxQueries(): array;

    /**
     * Reset taxonomy queries
     *
     * @return self
     */
    public function resetTaxQueries(): self;
}

