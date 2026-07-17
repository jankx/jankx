<?php

namespace Jankx\Layouts\AdvancedFilters;

use Jankx\Layouts\AdvancedFilters\Contracts\FilterDataAttributeStrategyInterface;
use Jankx\Layouts\AdvancedFilters\Strategies\TaxonomyFilterStrategy;
use Jankx\Layouts\AdvancedFilters\Strategies\MetaFilterStrategy;
use Jankx\Layouts\AdvancedFilters\Strategies\PriceFilterStrategy;
use Jankx\Layouts\AdvancedFilters\Strategies\DateFilterStrategy;
use Jankx\Layouts\AdvancedFilters\Strategies\SimpleValueFilterStrategy;

/**
 * Registry for filter data attribute strategies
 *
 * Registry Pattern: Central registration and lookup of filter strategies
 */
class FilterDataAttributeStrategyRegistry
{
    /**
     * @var array Registered strategies
     */
    private static $strategies = [];

    /**
     * @var bool Whether default strategies are initialized
     */
    private static $initialized = false;

    /**
     * Initialize default strategies
     *
     * @return void
     */
    public static function init(): void
    {
        if (self::$initialized) {
            return;
        }

        // Register default filter type strategies
        self::register(new TaxonomyFilterStrategy());
        self::register(new MetaFilterStrategy());
        self::register(new PriceFilterStrategy());
        self::register(new DateFilterStrategy());
        self::register(SimpleValueFilterStrategy::forAuthor());
        self::register(SimpleValueFilterStrategy::forKeyword());

        // Allow external registration
        do_action('jankx/filters/register_data_attribute_strategies');

        self::$initialized = true;
    }

    /**
     * Register a strategy
     *
     * @param FilterDataAttributeStrategyInterface $strategy
     * @return void
     */
    public static function register(FilterDataAttributeStrategyInterface $strategy): void
    {
        self::$strategies[$strategy->getType()] = $strategy;
    }

    /**
     * Find strategy for given filter type
     *
     * @param string $filterType
     * @return FilterDataAttributeStrategyInterface|null
     */
    public static function resolve(string $filterType): ?FilterDataAttributeStrategyInterface
    {
        self::init();

        // Direct lookup by type
        if (isset(self::$strategies[$filterType])) {
            return self::$strategies[$filterType];
        }

        // Fallback: check supports() method
        foreach (self::$strategies as $strategy) {
            if ($strategy->supports($filterType)) {
                return $strategy;
            }
        }

        return null;
    }

    /**
     * Check if strategy exists for filter type
     *
     * @param string $filterType
     * @return bool
     */
    public static function has(string $filterType): bool
    {
        return self::resolve($filterType) !== null;
    }

    /**
     * Get all registered strategies
     *
     * @return array
     */
    public static function all(): array
    {
        self::init();
        return self::$strategies;
    }

    /**
     * Clear all registered strategies (mainly for testing)
     *
     * @return void
     */
    public static function clear(): void
    {
        self::$strategies = [];
        self::$initialized = false;
    }
}
