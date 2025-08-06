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
        if (Environment::isDebugLog()) {
            error_log('[JANKX DEBUG] Loading configuration...');
        }

        $config = $app->make('config');

        // Load configuration from theme files
        $this->loadThemeConfiguration($app, $config);

        if (Environment::isDebugLog()) {
            error_log('[JANKX DEBUG] Configuration loaded successfully');
        }
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
            $childConfigPath = $envChildConfigPath ?: $envConfigPath; // Use child path if set, otherwise same as parent
        } else {
            $parentConfigPath = get_template_directory() . '/config';
            $childConfigPath = get_stylesheet_directory() . '/config';
        }

        if (Environment::isDebugLog()) {
            error_log(sprintf('[JANKX DEBUG] Loading parent config from: %s', $parentConfigPath));
            error_log(sprintf('[JANKX DEBUG] Loading child config from: %s', $childConfigPath));
        }

        // Load all config files
        $configFiles = [
            'app.php',
            'providers.php',
            'error.php',
            'layout.php'
        ];

        foreach ($configFiles as $configFile) {
            $parentFile = $parentConfigPath . '/' . $configFile;
            $childFile = $childConfigPath . '/' . $configFile;

            $configKey = str_replace('.php', '', $configFile);
            $parentConfig = $this->loadCachedConfig($parentFile, $configKey);
            $childConfig = $this->loadCachedConfig($childFile, $configKey);

            // Deep merge: child override parent
            $mergedConfig = $this->deepMergeConfig($parentConfig, $childConfig);
            $config->set($configKey, $mergedConfig);

            if (Environment::isDebugLog()) {
                error_log(sprintf('[JANKX DEBUG] %s loaded with keys: %s', $configFile, implode(', ', array_keys($mergedConfig))));
            }
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
            if (Environment::isDebugLog()) {
                error_log(sprintf('[JANKX DEBUG] Config loaded from cache: %s', $cacheKey));
            }
            return $cachedConfig;
        }

        // Load from file and cache
        $config = require $filePath;

        // Cache for 1 hour (3600 seconds)
        wp_cache_set($cacheKey, $config, 'jankx_config', 3600);

        if (Environment::isDebugLog()) {
            error_log(sprintf('[JANKX DEBUG] Config cached: %s', $cacheKey));
        }

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

        if (Environment::isDebugLog()) {
            error_log('[JANKX DEBUG] Config cache cleared');
        }
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

        if (Environment::isDebugLog()) {
            error_log(sprintf('[JANKX DEBUG] Config cache cleared for type: %s', $configType));
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
