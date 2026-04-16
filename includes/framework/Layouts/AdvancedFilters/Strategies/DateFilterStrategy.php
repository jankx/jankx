<?php

namespace Jankx\Layouts\AdvancedFilters\Strategies;

/**
 * Date filter data attribute strategy
 */
class DateFilterStrategy extends AbstractFilterStrategy
{
    /**
     * @var array Required attribute keys for date filter
     */
    protected $attributeKeys = ['filterValueStart', 'filterValueEnd'];

    /**
     * @var array Mapping of attribute keys to data attribute names
     */
    protected $attributeMapping = [
        'filterValueStart' => 'data-filter-value-start',
        'filterValueEnd' => 'data-filter-value-end',
    ];

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct('date');
    }
}
