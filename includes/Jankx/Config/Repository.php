<?php

namespace Jankx\Config;

use Illuminate\Contracts\Container\Container;
use Jankx\Facades\Logger;

/**
 * Config Repository
 *
 * Manages configuration with deep merge support for child theme overriding parent theme
 *
 * @package Jankx\Config
 * @since 2.0.0
 */
class Repository
{
    /**
     * @var Container
     */
    protected $container;

    /**
     * @var array
     */
    protected $config = [];

    /**
     * @var array
     */
    protected $parentConfig = [];

    /**
     * @var array
     */
    protected $childConfig = [];

    /**
     * @var string
     */
    protected $parentThemePath;

    /**
     * @var string
     */
    protected $childThemePath;

    /**
     * @var bool
     */
    protected $isChildTheme = false;

    /**
     * @var array
     */
    protected $loadedFiles = [];

    /**
     * @var array
     */
    protected $fileChecksums = [];

    /**
     * @var array
     */
    protected $cacheKeys = [];

    /**
     * Constructor
     *
     * @param Container $container
     */
    public function __construct(Container $container)
    {
        $this->container = $container;
        $this->initializeThemePaths();
        $this->loadConfigurations();
    }

    /**
     * Initialize theme paths
     */
    protected function initializeThemePaths(): void
    {
        $this->parentThemePath = get_template_directory();
        $this->childThemePath = get_stylesheet_directory();
        $this->isChildTheme = $this->parentThemePath !== $this->childThemePath;
    }

    /**
     * Load configurations from parent and child themes
     */
    protected function loadConfigurations(): void
    {
        // Load parent theme config
        $this->loadParentConfig();

        // Load child theme config if exists
        if ($this->isChildTheme) {
            $this->loadChildConfig();
        }

        // Merge configurations
        $this->mergeConfigurations();
    }

    /**
     * Load parent theme configuration
     */
    protected function loadParentConfig(): void
    {
        $parentConfigPath = $this->parentThemePath . '/config';

        if (is_dir($parentConfigPath)) {
            $this->parentConfig = $this->loadConfigFromDirectory($parentConfigPath);
        }
    }

    /**
     * Load child theme configuration
     */
    protected function loadChildConfig(): void
    {
        $childConfigPath = $this->childThemePath . '/config';

        if (is_dir($childConfigPath)) {
            $this->childConfig = $this->loadConfigFromDirectory($childConfigPath);
        }
    }

    /**
     * Load configuration from directory
     *
     * @param string $directory
     * @return array
     */
    protected function loadConfigFromDirectory(string $directory): array
    {
        $config = [];

        if (!is_dir($directory)) {
            return $config;
        }

        $files = glob($directory . '/*.php');

        foreach ($files as $file) {
            $key = basename($file, '.php');
            $config[$key] = $this->loadConfigFile($file);
        }

        return $config;
    }

        /**
     * Load configuration from file with caching
     *
     * @param string $file
     * @return array
     */
    protected function loadConfigFile(string $file): array
    {
        if (!file_exists($file)) {
            return [];
        }

        $this->loadedFiles[] = $file;

        // Generate cache key based on file checksum
        $cacheKey = $this->generateCacheKey($file);

        // Try to get from cache first
        $cachedConfig = $this->getCachedConfig($cacheKey);
        if ($cachedConfig !== false) {
            return $cachedConfig;
        }

        // Load and parse config file
        try {
            $config = require $file;
            $parsedConfig = is_array($config) ? $config : [];

            // Cache the parsed config
            $this->cacheConfig($cacheKey, $parsedConfig);

            return $parsedConfig;
        } catch (\Exception $e) {
            Logger::error("Failed to load config file: {$file}", [
                'file' => $file,
                'exception' => $e->getMessage()
            ]);
            return [];
        }
    }

    /**
     * Merge parent and child configurations
     */
    protected function mergeConfigurations(): void
    {
        // Start with parent config
        $this->config = $this->parentConfig;

        // Deep merge child config over parent config
        if ($this->isChildTheme && !empty($this->childConfig)) {
            $this->config = $this->deepMerge($this->config, $this->childConfig);
        }
    }

    /**
     * Deep merge arrays with child theme overriding parent theme
     *
     * @param array $parent
     * @param array $child
     * @return array
     */
    protected function deepMerge(array $parent, array $child): array
    {
        $result = $parent;

        foreach ($child as $key => $value) {
            if (is_array($value) && isset($result[$key]) && is_array($result[$key])) {
                // Recursive merge for nested arrays
                $result[$key] = $this->deepMerge($result[$key], $value);
            } else {
                // Child theme value overrides parent theme value
                $result[$key] = $value;
            }
        }

        return $result;
    }

    /**
     * Get configuration value
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function get(string $key, $default = null)
    {
        return $this->getNestedValue($this->config, $key, $default);
    }

    /**
     * Set configuration value
     *
     * @param string $key
     * @param mixed $value
     * @return void
     */
    public function set(string $key, $value): void
    {
        $this->setNestedValue($this->config, $key, $value);
    }

    /**
     * Check if configuration key exists
     *
     * @param string $key
     * @return bool
     */
    public function has(string $key): bool
    {
        return $this->getNestedValue($this->config, $key) !== null;
    }

    /**
     * Get all configuration
     *
     * @return array
     */
    public function all(): array
    {
        return $this->config;
    }

    /**
     * Get parent theme configuration
     *
     * @return array
     */
    public function getParentConfig(): array
    {
        return $this->parentConfig;
    }

    /**
     * Get child theme configuration
     *
     * @return array
     */
    public function getChildConfig(): array
    {
        return $this->childConfig;
    }

    /**
     * Check if using child theme
     *
     * @return bool
     */
    public function isChildTheme(): bool
    {
        return $this->isChildTheme;
    }

    /**
     * Get loaded config files
     *
     * @return array
     */
    public function getLoadedFiles(): array
    {
        return $this->loadedFiles;
    }

    /**
     * Get nested value from array using dot notation
     *
     * @param array $array
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    protected function getNestedValue(array $array, string $key, $default = null)
    {
        $keys = explode('.', $key);
        $current = $array;

        foreach ($keys as $segment) {
            if (!is_array($current) || !array_key_exists($segment, $current)) {
                return $default;
            }
            $current = $current[$segment];
        }

        return $current;
    }

    /**
     * Set nested value in array using dot notation
     *
     * @param array $array
     * @param string $key
     * @param mixed $value
     * @return void
     */
    protected function setNestedValue(array &$array, string $key, $value): void
    {
        $keys = explode('.', $key);
        $current = &$array;

        foreach ($keys as $segment) {
            if (!isset($current[$segment]) || !is_array($current[$segment])) {
                $current[$segment] = [];
            }
            $current = &$current[$segment];
        }

        $current = $value;
    }

        /**
     * Generate cache key based on file checksum
     *
     * @param string $file
     * @return string
     */
    protected function generateCacheKey(string $file): string
    {
        $fileContent = file_get_contents($file);
        $checksum = crc32($fileContent);
        $this->fileChecksums[$file] = $checksum;

        $cacheKey = 'jankx_config_' . md5($file . '_' . $checksum);
        $this->cacheKeys[$file] = $cacheKey;

        return $cacheKey;
    }

    /**
     * Get cached configuration
     *
     * @param string $cacheKey
     * @return array|false
     */
    protected function getCachedConfig(string $cacheKey)
    {
        $cached = wp_cache_get($cacheKey, 'jankx_config');
        return $cached !== false ? $cached : false;
    }

    /**
     * Cache configuration
     *
     * @param string $cacheKey
     * @param array $config
     * @return void
     */
    protected function cacheConfig(string $cacheKey, array $config): void
    {
        // Cache for 1 hour (3600 seconds)
        wp_cache_set($cacheKey, $config, 'jankx_config', 3600);
    }

    /**
     * Clear config cache
     *
     * @param string|null $file Specific file to clear cache for, or null for all
     * @return void
     */
    public function clearCache(string $file = null): void
    {
        if ($file === null) {
            // Clear all config caches
            foreach ($this->cacheKeys as $cacheKey) {
                wp_cache_delete($cacheKey, 'jankx_config');
            }
        } else {
            // Clear cache for specific file
            if (isset($this->cacheKeys[$file])) {
                wp_cache_delete($this->cacheKeys[$file], 'jankx_config');
            }
        }
    }

    /**
     * Get cache statistics
     *
     * @return array
     */
    public function getCacheStats(): array
    {
        $stats = [
            'total_files' => count($this->loadedFiles),
            'cached_files' => 0,
            'cache_keys' => $this->cacheKeys,
            'checksums' => $this->fileChecksums,
        ];

        foreach ($this->cacheKeys as $file => $cacheKey) {
            if (wp_cache_get($cacheKey, 'jankx_config') !== false) {
                $stats['cached_files']++;
            }
        }

        return $stats;
    }

    /**
     * Check if file has changed
     *
     * @param string $file
     * @return bool
     */
    public function hasFileChanged(string $file): bool
    {
        if (!file_exists($file)) {
            return false;
        }

        $currentChecksum = crc32(file_get_contents($file));
        $storedChecksum = $this->fileChecksums[$file] ?? null;

        return $storedChecksum === null || $currentChecksum !== $storedChecksum;
    }

    /**
     * Reload configurations
     *
     * @return void
     */
    public function reload(): void
    {
        $this->config = [];
        $this->parentConfig = [];
        $this->childConfig = [];
        $this->loadedFiles = [];
        $this->fileChecksums = [];
        $this->cacheKeys = [];

        $this->loadConfigurations();
    }

    /**
     * Get configuration for specific section
     *
     * @param string $section
     * @return array
     */
    public function getSection(string $section): array
    {
        return $this->get($section, []);
    }

    /**
     * Merge additional configuration
     *
     * @param array $config
     * @return void
     */
    public function merge(array $config): void
    {
        $this->config = $this->deepMerge($this->config, $config);
    }

    /**
     * Get configuration difference between parent and child themes
     *
     * @return array
     */
    public function getConfigDifference(): array
    {
        if (!$this->isChildTheme) {
            return [];
        }

        $differences = [];

        foreach ($this->childConfig as $key => $childValue) {
            $parentValue = $this->getNestedValue($this->parentConfig, $key);

            if ($parentValue !== $childValue) {
                $differences[$key] = [
                    'parent' => $parentValue,
                    'child' => $childValue,
                    'merged' => $this->get($key)
                ];
            }
        }

        return $differences;
    }

    /**
     * Export configuration to array
     *
     * @return array
     */
    public function toArray(): array
    {
        return [
            'config' => $this->config,
            'parent_config' => $this->parentConfig,
            'child_config' => $this->childConfig,
            'is_child_theme' => $this->isChildTheme,
            'loaded_files' => $this->loadedFiles,
            'differences' => $this->getConfigDifference(),
            'cache_stats' => $this->getCacheStats()
        ];
    }
}