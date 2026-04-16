<?php

namespace App\Services\ThemeOptions;

use App\Services\ThemeOptions\Contracts\BlockDefaultApplierInterface;
use App\Services\ThemeOptions\Appliers\TypographyBlockApplier;
use App\Services\ThemeOptions\Appliers\AdvancedButtonBlockApplier;
use App\Services\ThemeOptions\Appliers\CoreButtonBlockApplier;

/**
 * Registry for block default appliers
 *
 * Registry Pattern: Central registration and lookup of block appliers
 */
class BlockDefaultApplierRegistry
{
    /**
     * @var array Registered appliers
     */
    private static $appliers = [];

    /**
     * @var bool Whether default appliers are initialized
     */
    private static $initialized = false;

    /**
     * Initialize default appliers
     *
     * @return void
     */
    public static function init(): void
    {
        if (self::$initialized) {
            return;
        }

        // Register default block appliers
        self::register(new TypographyBlockApplier());
        self::register(new AdvancedButtonBlockApplier());
        self::register(new CoreButtonBlockApplier());

        // Allow external registration
        do_action('jankx/theme_options/register_block_appliers');

        self::$initialized = true;
    }

    /**
     * Register an applier
     *
     * @param BlockDefaultApplierInterface $applier
     * @return void
     */
    public static function register(BlockDefaultApplierInterface $applier): void
    {
        foreach ($applier->getSupportedBlocks() as $blockName) {
            self::$appliers[$blockName] = $applier;
        }
    }

    /**
     * Find applier for given block
     *
     * @param string $blockName
     * @return BlockDefaultApplierInterface|null
     */
    public static function resolve(string $blockName): ?BlockDefaultApplierInterface
    {
        self::init();

        // Direct lookup
        if (isset(self::$appliers[$blockName])) {
            return self::$appliers[$blockName];
        }

        // Fallback: check supports() method
        foreach (self::$appliers as $applier) {
            if ($applier->supports($blockName)) {
                return $applier;
            }
        }

        return null;
    }

    /**
     * Check if applier exists for block
     *
     * @param string $blockName
     * @return bool
     */
    public static function has(string $blockName): bool
    {
        return self::resolve($blockName) !== null;
    }

    /**
     * Get all registered appliers
     *
     * @return array
     */
    public static function all(): array
    {
        self::init();
        return self::$appliers;
    }

    /**
     * Clear all registered appliers (mainly for testing)
     *
     * @return void
     */
    public static function clear(): void
    {
        self::$appliers = [];
        self::$initialized = false;
    }
}
