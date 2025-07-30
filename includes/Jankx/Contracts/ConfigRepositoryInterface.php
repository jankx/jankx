<?php

namespace Jankx\Contracts;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


/**
 * Config Repository Interface
 *
 * @package Jankx\Contracts
 * @since 2.0.0
 */
interface ConfigRepositoryInterface extends \ArrayAccess
{
    /**
     * Get configuration value
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function get(string $key, $default = null);

    /**
     * Set configuration value
     *
     * @param string $key
     * @param mixed $value
     * @return void
     */
    public function set(string $key, $value): void;

    /**
     * Check if configuration key exists
     *
     * @param string $key
     * @return bool
     */
    public function has(string $key): bool;

    /**
     * Get all configuration
     *
     * @return array
     */
    public function all(): array;

    /**
     * Get parent theme configuration
     *
     * @return array
     */
    public function getParentConfig(): array;

    /**
     * Get child theme configuration
     *
     * @return array
     */
    public function getChildConfig(): array;

    /**
     * Check if using child theme
     *
     * @return bool
     */
    public function isChildTheme(): bool;

    /**
     * Get loaded config files
     *
     * @return array
     */
    public function getLoadedFiles(): array;

    /**
     * Get configuration for specific section
     *
     * @param string $section
     * @return array
     */
    public function getSection(string $section): array;

    /**
     * Merge additional configuration
     *
     * @param array $config
     * @return void
     */
    public function merge(array $config): void;

    /**
     * Reload configurations
     *
     * @return void
     */
    public function reload(): void;

    /**
     * Get configuration difference between parent and child themes
     *
     * @return array
     */
    public function getConfigDifference(): array;

    /**
     * Clear config cache
     *
     * @param string|null $file Specific file to clear cache for, or null for all
     * @return void
     */
    public function clearCache(string $file = null): void;

    /**
     * Get cache statistics
     *
     * @return array
     */
    public function getCacheStats(): array;

    /**
     * Check if file has changed
     *
     * @param string $file
     * @return bool
     */
    public function hasFileChanged(string $file): bool;

    /**
     * Export configuration to array
     *
     * @return array
     */
    public function toArray(): array;
}