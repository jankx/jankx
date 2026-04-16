<?php

namespace Jankx\Layouts\AdvancedFilters\Strategies;

/**
 * Simple value filter strategy (for author, keyword, etc.)
 * Only requires filterValue attribute
 */
class SimpleValueFilterStrategy extends AbstractFilterStrategy
{
    /**
     * @var array Required attribute keys
     */
    protected $attributeKeys = ['filterValue'];

    /**
     * @var array Mapping of attribute keys to data attribute names
     */
    protected $attributeMapping = [
        'filterValue' => 'data-filter-value',
    ];

    /**
     * Constructor
     *
     * @param string $type Filter type (author, keyword, etc.)
     */
    public function __construct(string $type)
    {
        parent::__construct($type);
    }

    /**
     * Factory method to create author filter strategy
     *
     * @return static
     */
    public static function forAuthor(): self
    {
        return new self('author');
    }

    /**
     * Factory method to create keyword filter strategy
     *
     * @return static
     */
    public static function forKeyword(): self
    {
        return new self('keyword');
    }
}
