<?php

namespace Jankx\Layouts\AdvancedFilters\Strategies;

/**
 * Meta filter data attribute strategy
 */
class MetaFilterStrategy extends AbstractFilterStrategy
{
    /**
     * @var array Required attribute keys for meta filter
     */
    protected $attributeKeys = ['metaKey', 'filterValue'];

    /**
     * @var array Mapping of attribute keys to data attribute names
     */
    protected $attributeMapping = [
        'metaKey' => 'data-meta-key',
        'filterValue' => 'data-filter-value',
    ];

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct('meta');
    }
}
