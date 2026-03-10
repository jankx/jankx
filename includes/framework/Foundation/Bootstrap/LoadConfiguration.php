<?php

namespace Jankx\Foundation\Bootstrap;

use Jankx\Foundation\Application;
use Jankx\Config\Repository;
use Jankx\Helper\Environment;

class LoadConfiguration
{
    /**
     * Bootstrap the given application.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function bootstrap(Application $app)
    {
        $config = $app->make('config');

        // Check for entire config cache first (production optimization)
        $isDev = (defined('WP_DEBUG') && WP_DEBUG);
        $cacheKey = 'jankx_fully_merged_config_' . ($this->isChildThemeActive() ? 'child' : 'parent');
        
        if (!$isDev) {
            $cachedFullConfig = wp_cache_get($cacheKey, 'jankx_config');
            if ($cachedFullConfig !== false && is_array($cachedFullConfig)) {
                foreach ($cachedFullConfig as $key => $value) {
                    $config->set($key, $value);
                }
                return;
            }
        }

        // Load configuration from theme files
        $this->loadThemeConfiguration($app, $config);

        // Cache the fully merged config for production
        if (!$isDev) {
            wp_cache_set($cacheKey, $config->all(), 'jankx_config', 3600);
        }
    }

    protected function isChildThemeActive()
    {
        if (function_exists('get_template_directory') && function_exists('get_stylesheet_directory')) {
            return get_template_directory() !== get_stylesheet_directory();
        }
        return false;
    }

    /**
     * Load configuration from theme files.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @param  \Jankx\Config\Repository  $config
     * @return void
     */
    protected function loadThemeConfiguration(Application $app, Repository $config)
    {
        $envConfigPath = getenv('JANKX_CONFIG_PATH');
        $envChildConfigPath = getenv('JANKX_CHILD_CONFIG_PATH');

        if ($envConfigPath) {
            $parentConfigPath = $envConfigPath;
            $childConfigPath = $envChildConfigPath ?: $envConfigPath;
        } else {
            $parentConfigPath = method_exists($app, 'configPath') ? $app->configPath() : get_template_directory() . '/config';
            $childConfigPath = get_stylesheet_directory() . '/config';
        }

        // Load all config files
        $this->loadConfigFiles($config, $parentConfigPath, $childConfigPath);
    }

    /**
     * Load all config files using glob
     */
    protected function loadConfigFiles(Repository $config, $parentConfigPath, $childConfigPath)
    {
        // Get all PHP files from parent config directory
        $parentConfigFiles = ($parentConfigPath && is_dir($parentConfigPath)) ? (glob($parentConfigPath . '/*.php') ?: []) : [];
        $childConfigFiles = ($childConfigPath && is_dir($childConfigPath)) ? (glob($childConfigPath . '/*.php') ?: []) : [];

        // Track seen filenames to handle overrides
        $processedConfigs = [];

        // Helper to process a directory
        $processDir = function($files, $isChild = false) use (&$processedConfigs) {
            foreach ($files as $file) {
                $filename = basename($file);
                if (substr($filename, -8) === 'Test.php') continue;
                
                $configKey = pathinfo($filename, PATHINFO_FILENAME);
                $content = $this->loadCachedConfig($file, $configKey);
                
                if ($isChild && isset($processedConfigs[$configKey])) {
                    $content = $this->deepMergeConfig($processedConfigs[$configKey], $content);
                }
                
                $processedConfigs[$configKey] = $content;
            }
        };

        // Process parent first, then child overrides
        $processDir($parentConfigFiles);
        $processDir($childConfigFiles, true);

        // Finally set all merged configs into the repository
        foreach ($processedConfigs as $key => $content) {
            $config->set($key, $content);
        }
    }

    /**
     * Load config from cache or file
     *
     * @param string $filePath
     * @param string $configType
     * @return array
     */
    protected function loadCachedConfig($filePath, $configType)
    {
        if (!file_exists($filePath)) {
            return [];
        }

        // Use file modification time for cache invalidation
        $fileMtime = filemtime($filePath);

        // Generate cache key with mtime
        $cacheKey = "file_configs_{$configType}_{$fileMtime}";

        // Try to get from cache first
        $cachedConfig = wp_cache_get($cacheKey, 'jankx_config');

        if ($cachedConfig !== false) {
            return $cachedConfig;
        }

        // Load from file and cache
        $config = require $filePath;

        // Cache for 1 hour (3600 seconds)
        wp_cache_set($cacheKey, $config, 'jankx_config', 3600);

        return $config;
    }

    /**
     * Clear all config cache
     *
     * @return void
     */
    public static function clearConfigCache()
    {
        wp_cache_flush_group('jankx_config');
    }

    /**
     * Clear cache for specific config type
     *
     * @param string $configType
     * @return void
     */
    public static function clearConfigCacheByType($configType)
    {
        // Get all cache keys for this type
        global $wp_object_cache;

        if (isset($wp_object_cache->cache) && is_array($wp_object_cache->cache)) {
            foreach ($wp_object_cache->cache as $key => $value) {
                if (strpos($key, "file_configs_{$configType}_") === 0) {
                    wp_cache_delete($key, 'jankx_config');
                }
            }
        }
    }

    /**
     * Deep merge two config arrays (child overrides parent, only keys present in child)
     */
    protected function deepMergeConfig(array $parent, array $child)
    {
        foreach ($child as $key => $value) {
            if (is_array($value) && isset($parent[$key]) && is_array($parent[$key])) {
                // Check if both arrays are associative or indexed
                if ($this->isAssociative($parent[$key]) && $this->isAssociative($value)) {
                    // Both are associative arrays - deep merge
                    $parent[$key] = $this->deepMergeConfig($parent[$key], $value);
                } else {
                    // At least one is indexed array - replace completely
                    $parent[$key] = $value;
                }
            } else {
                // Not both arrays or key doesn't exist - replace
                $parent[$key] = $value;
            }
        }
        return $parent;
    }

    /**
     * Check if an array is associative (has string keys).
     *
     * @param  array  $array
     * @return bool
     */
    protected function isAssociative(array $array)
    {
        if (empty($array)) {
            return true; // Empty arrays are considered associative
        }

        return array_keys($array) !== range(0, count($array) - 1);
    }
}
