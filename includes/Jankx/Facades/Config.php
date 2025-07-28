<?php

namespace Jankx\Facades;

use Jankx\Config\Repository;

/**
 * Config Facade
 *
 * Provides easy access to the Config Repository
 *
 * @package Jankx\Facades
 * @since 2.0.0
 */
class Config extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'config';
    }

    /**
     * Get the facade accessor
     *
     * @return Repository
     */
    public static function getFacadeRoot()
    {
        return static::resolveFacadeInstance(static::getFacadeAccessor());
    }

    /**
     * Get configuration value
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public static function get(string $key, $default = null)
    {
        return static::getFacadeRoot()->get($key, $default);
    }

    /**
     * Set configuration value
     *
     * @param string $key
     * @param mixed $value
     * @return void
     */
    public static function set(string $key, $value): void
    {
        static::getFacadeRoot()->set($key, $value);
    }

    /**
     * Check if configuration key exists
     *
     * @param string $key
     * @return bool
     */
    public static function has(string $key): bool
    {
        return static::getFacadeRoot()->has($key);
    }

    /**
     * Get all configuration
     *
     * @return array
     */
    public static function all(): array
    {
        return static::getFacadeRoot()->all();
    }

    /**
     * Get configuration for specific section
     *
     * @param string $section
     * @return array
     */
    public static function section(string $section): array
    {
        return static::getFacadeRoot()->getSection($section);
    }

    /**
     * Merge additional configuration
     *
     * @param array $config
     * @return void
     */
    public static function merge(array $config): void
    {
        static::getFacadeRoot()->merge($config);
    }

    /**
     * Reload configurations
     *
     * @return void
     */
    public static function reload(): void
    {
        static::getFacadeRoot()->reload();
    }

    /**
     * Check if using child theme
     *
     * @return bool
     */
    public static function isChildTheme(): bool
    {
        return static::getFacadeRoot()->isChildTheme();
    }

    /**
     * Get configuration difference between parent and child themes
     *
     * @return array
     */
    public static function getDifferences(): array
    {
        return static::getFacadeRoot()->getConfigDifference();
    }

    /**
     * Clear config cache
     *
     * @param string|null $file Specific file to clear cache for, or null for all
     * @return void
     */
    public static function clearCache(string $file = null): void
    {
        static::getFacadeRoot()->clearCache($file);
    }

    /**
     * Get cache statistics
     *
     * @return array
     */
    public static function getCacheStats(): array
    {
        return static::getFacadeRoot()->getCacheStats();
    }

    /**
     * Check if file has changed
     *
     * @param string $file
     * @return bool
     */
    public static function hasFileChanged(string $file): bool
    {
        return static::getFacadeRoot()->hasFileChanged($file);
    }
}