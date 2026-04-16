<?php

namespace Jankx\Layouts\AdvancedFilters\Strategies;

use Jankx\Layouts\AdvancedFilters\Contracts\FilterDataAttributeStrategyInterface;

/**
 * Abstract base class for filter strategies
 *
 * Provides common functionality for all filter strategies
 */
abstract class AbstractFilterStrategy implements FilterDataAttributeStrategyInterface
{
    /**
     * @var string Filter type identifier
     */
    protected $type;

    /**
     * @var array Required attribute keys for this filter type
     */
    protected $attributeKeys = [];

    /**
     * @var array Mapping of attribute keys to data attribute names
     */
    protected $attributeMapping = [];

    /**
     * Constructor
     *
     * @param string $type Filter type identifier
     */
    public function __construct(string $type)
    {
        $this->type = $type;
    }

    /**
     * Check if this strategy supports the given filter type
     *
     * @param string $filterType
     * @return bool
     */
    public function supports(string $filterType): bool
    {
        return $filterType === $this->type;
    }

    /**
     * Get filter type name
     *
     * @return string
     */
    public function getType(): string
    {
        return $this->type;
    }

    /**
     * Build data attributes for the filter type
     *
     * @param array $attributes Block attributes
     * @return array Data attributes key-value pairs
     */
    public function buildAttributes(array $attributes): array
    {
        $dataAttributes = [];

        foreach ($this->attributeKeys as $key) {
            $value = $attributes[$key] ?? '';
            if (!empty($value)) {
                $dataAttributeName = $this->attributeMapping[$key] ?? $this->convertToDataAttribute($key);
                $dataAttributes[$dataAttributeName] = $value;
            }
        }

        return $dataAttributes;
    }

    /**
     * Convert camelCase key to kebab-case data attribute
     *
     * @param string $key
     * @return string
     */
    protected function convertToDataAttribute(string $key): string
    {
        // Convert camelCase to kebab-case
        $kebab = preg_replace('/([a-z])([A-Z])/', '$1-$2', $key);
        $kebab = strtolower($kebab);

        return 'data-' . $kebab;
    }
}
