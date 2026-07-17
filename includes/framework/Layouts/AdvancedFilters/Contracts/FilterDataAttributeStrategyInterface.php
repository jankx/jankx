<?php

namespace Jankx\Layouts\AdvancedFilters\Contracts;

/**
 * Interface for filter data attribute strategies
 *
 * Strategy Pattern: Each filter type implements its own data attribute logic
 */
interface FilterDataAttributeStrategyInterface
{
    /**
     * Check if this strategy supports the given filter type
     *
     * @param string $filterType
     * @return bool
     */
    public function supports(string $filterType): bool;

    /**
     * Build data attributes for the filter type
     *
     * @param array $attributes Block attributes
     * @return array Data attributes key-value pairs
     */
    public function buildAttributes(array $attributes): array;

    /**
     * Get filter type name
     *
     * @return string
     */
    public function getType(): string;
}
