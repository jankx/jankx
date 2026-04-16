<?php

namespace Jankx\Layouts\AdvancedFilters\Strategies;

/**
 * Price filter data attribute strategy
 */
class PriceFilterStrategy extends AbstractFilterStrategy
{
    /**
     * @var array Required attribute keys for price filter
     */
    protected $attributeKeys = ['filterValueMin', 'filterValueMax'];

    /**
     * @var array Mapping of attribute keys to data attribute names
     */
    protected $attributeMapping = [
        'filterValueMin' => 'data-filter-value-min',
        'filterValueMax' => 'data-filter-value-max',
    ];

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct('price');
    }
}
