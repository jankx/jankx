<?php

namespace Jankx\Facades;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


use Jankx\Contracts\ConfigRepositoryInterface;
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
     * @since 2.0.0
     */
    protected static function getFacadeAccessor(): string
    {
        return Repository::class;
    }

    /**
     * Get the facade root
     *
     * @return ConfigRepositoryInterface
     * @since 2.0.0
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
     * @since 2.0.0
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
     * @since 2.0.0
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
     * @since 2.0.0
     */
    public static function has(string $key): bool
    {
        return static::getFacadeRoot()->has($key);
    }

    /**
     * Get all configuration
     *
     * @return array
     * @since 2.0.0
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
     * @since 2.0.0
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
     * @since 2.0.0
     */
    public static function merge(array $config): void
    {
        static::getFacadeRoot()->merge($config);
    }

    /**
     * Reload configurations
     *
     * @return void
     * @since 2.0.0
     */
    public static function reload(): void
    {
        static::getFacadeRoot()->reload();
    }

    /**
     * Check if using child theme
     *
     * @return bool
     * @since 2.0.0
     */
    public static function isChildTheme(): bool
    {
        return static::getFacadeRoot()->isChildTheme();
    }

    /**
     * Get configuration differences
     *
     * @return array
     * @since 2.0.0
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
     * @since 2.0.0
     */
    public static function clearCache(string $file = null): void
    {
        static::getFacadeRoot()->clearCache($file);
    }

    /**
     * Get cache statistics
     *
     * @return array
     * @since 2.0.0
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
     * @since 2.0.0
     */
    public static function hasFileChanged(string $file): bool
    {
        return static::getFacadeRoot()->hasFileChanged($file);
    }
}
