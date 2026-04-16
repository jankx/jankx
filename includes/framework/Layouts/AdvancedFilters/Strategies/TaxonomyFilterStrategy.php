<?php

namespace Jankx\Layouts\AdvancedFilters\Strategies;

/**
 * Taxonomy filter data attribute strategy
 */
class TaxonomyFilterStrategy extends AbstractFilterStrategy
{
    /**
     * @var array Required attribute keys for taxonomy filter
     */
    protected $attributeKeys = ['taxonomy', 'filterValue'];

    /**
     * @var array Mapping of attribute keys to data attribute names
     */
    protected $attributeMapping = [
        'taxonomy' => 'data-taxonomy',
        'filterValue' => 'data-filter-value',
    ];

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct('taxonomy');
    }
}
