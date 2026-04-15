<?php

namespace Jankx\Foundation\Cli\Seeders;

/**
 * Seeder Registry — discovers and manages all registered seeders.
 *
 * Seeders can be registered in two ways:
 *  1. Programmatically via SeederRegistry::register().
 *  2. Via the 'jankx/cli/seeders' filter (for plugins / child themes).
 *
 * ## Example: registering via filter
 *
 *     add_filter('jankx/cli/seeders', function(array $seeders) {
 *         $seeders['my-seeder'] = MyPlugin\Seeders\MySeeder::class;
 *         return $seeders;
 *     });
 *
 * @package Jankx\Foundation\Cli\Seeders
 * @since 2.1.0
 */
class SeederRegistry
{
    /**
     * Registered seeder classes keyed by name.
     *
     * @var array<string, class-string<SeederInterface>>
     */
    protected static array $seeders = [];

    /**
     * Whether the WordPress filter has been applied yet.
     *
     * @var bool
     */
    protected static bool $filteredApplied = false;

    // ─── Registration ─────────────────────────────────────────────────────────

    /**
     * Register a seeder class.
     *
     * @param class-string<SeederInterface> $class
     * @return void
     * @throws \InvalidArgumentException If class does not implement SeederInterface.
     */
    public static function register(string $class): void
    {
        if (!is_a($class, SeederInterface::class, true)) {
            throw new \InvalidArgumentException(
                sprintf('Seeder class "%s" must implement SeederInterface.', $class)
            );
        }

        /** @var SeederInterface $class */
        $name = $class::getName();
        static::$seeders[$name] = $class;
    }

    /**
     * Register multiple seeder classes at once.
     *
     * @param array<class-string<SeederInterface>> $classes
     * @return void
     */
    public static function registerMany(array $classes): void
    {
        foreach ($classes as $class) {
            static::register($class);
        }
    }

    // ─── Resolution ───────────────────────────────────────────────────────────

    /**
     * Return all registered seeders (after applying the WordPress filter).
     *
     * @return array<string, class-string<SeederInterface>>
     */
    public static function all(): array
    {
        static::applyFilter();
        return static::$seeders;
    }

    /**
     * Resolve a seeder by name, returning a ready-to-run instance.
     *
     * @param string $name
     * @return SeederInterface
     * @throws \RuntimeException If no seeder is registered with that name.
     */
    public static function resolve(string $name): SeederInterface
    {
        static::applyFilter();

        // 1. Direct match by alias
        if (isset(static::$seeders[$name])) {
            return new static::$seeders[$name]();
        }

        // 2. Match by class name (FQCN or short name)
        foreach (static::$seeders as $alias => $class) {
            if ($class === $name) {
                return new $class();
            }
            $parts = explode('\\', $class);
            if (end($parts) === $name) {
                return new $class();
            }
        }

        // 3. Fallback: fully qualified class name that isn't registered
        if (class_exists($name) && is_a($name, SeederInterface::class, true)) {
            return new $name();
        }

        throw new \RuntimeException(
            sprintf('Seeder "%s" is not registered. Run `wp jankx seed list` to see available seeders.', $name)
        );
    }

    /**
     * Check whether a seeder with the given name is registered.
     *
     * @param string $name
     * @return bool
     */
    public static function has(string $name): bool
    {
        static::applyFilter();
        return isset(static::$seeders[$name]);
    }

    /**
     * Return seeders grouped by their group identifier.
     *
     * @return array<string, array<string, class-string<SeederInterface>>>
     */
    public static function grouped(): array
    {
        $groups = [];
        foreach (static::all() as $name => $class) {
            /** @var SeederInterface $class */
            $group            = $class::getGroup();
            $groups[$group][$name] = $class;
        }

        return $groups;
    }

    // ─── Internal ─────────────────────────────────────────────────────────────

    /**
     * Apply the 'jankx/cli/seeders' WordPress filter once.
     *
     * @return void
     */
    protected static function applyFilter(): void
    {
        if (static::$filteredApplied) {
            return;
        }

        static::$filteredApplied = true;

        if (function_exists('apply_filters')) {
            $filtered = apply_filters('jankx/cli/seeders', static::$seeders);
            if (is_array($filtered)) {
                // Validate each class from filter
                foreach ($filtered as $name => $class) {
                    if (
                        is_string($class) &&
                        class_exists($class) &&
                        is_a($class, SeederInterface::class, true)
                    ) {
                        static::$seeders[$name] = $class;
                    }
                }
            }
        }
    }
}
