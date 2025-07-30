<?php

namespace Jankx\Facades;

use Jankx\Config\Contracts\ConfigRepositoryInterface;
use Jankx\Config\Repository;

/**
 * Config Facade
 *
 * Provides a static interface to the Config Repository
 *
 * @package Jankx\Facades
 * @since 2.0.0
 */
class Config extends Facade
{
    /**
     * Get the facade accessor
     *
     * @return string
     */
    protected static function getFacadeAccessor(): string
    {
        return Repository::class;
    }

    /**
     * Get the facade root
     *
     * @return ConfigRepositoryInterface
     */
    public static function getFacadeRoot(): ConfigRepositoryInterface
    {
        return static::getContainer()->get(static::getFacadeAccessor());
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
     * Get configuration section
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
     * Get configuration differences
     *
     * @return array
     */
    public static function getDifferences(): array
    {
        return static::getFacadeRoot()->getConfigDifference();
    }

    /**
     * Clear cache
     *
     * @param string|null $file
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
