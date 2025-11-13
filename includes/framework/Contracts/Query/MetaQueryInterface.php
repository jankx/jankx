<?php

/**
 * Meta Query Interface
 *
 * Contract specific cho meta field queries
 *
 * @package Jankx\Contracts\Query
 * @since 1.0.0
 */

namespace Jankx\Contracts\Query;

interface MetaQueryInterface
{
    /**
     * Add meta query
     *
     * @param string $key
     * @param mixed $value
     * @param string $compare
     * @param string $type
     * @return self
     */
    public function addMeta(string $key, $value, string $compare = '=', string $type = ''): self;

    /**
     * Add meta query relation
     *
     * @param string $relation
     * @return self
     */
    public function setMetaRelation(string $relation): self;

    /**
     * Get meta queries
     *
     * @return array
     */
    public function getMetaQueries(): array;

    /**
     * Reset meta queries
     *
     * @return self
     */
    public function resetMetaQueries(): self;
}

