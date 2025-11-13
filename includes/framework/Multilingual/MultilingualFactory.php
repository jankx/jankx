<?php

namespace Jankx\Multilingual;

/**
 * Multilingual Factory
 *
 * Factory class to detect and instantiate the appropriate
 * multilingual plugin adapter
 *
 * @package Jankx\Multilingual
 * @since 1.0.0
 */
class MultilingualFactory
{
    /**
     * Cached adapter instance
     *
     * @var MultilingualInterface|null
     */
    protected static $adapter = null;

    /**
     * Available adapter classes
     *
     * @var array
     */
    protected static $adapters = [
        PolylangAdapter::class,
        WPMLAdapter::class,
    ];

    /**
     * Get active multilingual adapter
     *
     * Auto-detects which multilingual plugin is active
     * and returns the appropriate adapter
     *
     * @param bool $force_refresh Force refresh cached adapter
     * @return MultilingualInterface|null
     */
    public static function getAdapter(bool $force_refresh = false): ?MultilingualInterface
    {
        // Return cached instance if available
        if (self::$adapter !== null && !$force_refresh) {
            return self::$adapter;
        }

        // Try each adapter until we find an active one
        foreach (self::$adapters as $adapter_class) {
            $adapter = new $adapter_class();
            
            if ($adapter instanceof MultilingualInterface && $adapter->isActive()) {
                self::$adapter = $adapter;
                return self::$adapter;
            }
        }

        // No active multilingual plugin found
        self::$adapter = null;
        return null;
    }

    /**
     * Check if any multilingual plugin is active
     *
     * @return bool
     */
    public static function hasActivePlugin(): bool
    {
        return self::getAdapter() !== null;
    }

    /**
     * Get current language code
     *
     * @return string|null
     */
    public static function getCurrentLanguage(): ?string
    {
        $adapter = self::getAdapter();
        return $adapter ? $adapter->getCurrentLanguage() : null;
    }

    /**
     * Get default language code
     *
     * @return string|null
     */
    public static function getDefaultLanguage(): ?string
    {
        $adapter = self::getAdapter();
        return $adapter ? $adapter->getDefaultLanguage() : null;
    }

    /**
     * Get all available languages
     *
     * @return array
     */
    public static function getLanguages(): array
    {
        $adapter = self::getAdapter();
        return $adapter ? $adapter->getLanguages() : [];
    }

    /**
     * Set current language context
     *
     * @param string $language_code Language code to set
     * @return bool
     */
    public static function setCurrentLanguage(string $language_code): bool
    {
        $adapter = self::getAdapter();
        return $adapter ? $adapter->setCurrentLanguage($language_code) : false;
    }

    /**
     * Filter WP_Query by language
     *
     * @param \WP_Query $query Query object
     * @param string $language_code Language code
     * @return \WP_Query
     */
    public static function filterQuery(\WP_Query $query, string $language_code): \WP_Query
    {
        $adapter = self::getAdapter();
        return $adapter ? $adapter->filterQuery($query, $language_code) : $query;
    }

    /**
     * Add language to query arguments
     *
     * @param array $query_args WP_Query arguments
     * @param string|null $language_code Language code (null = current language)
     * @return array
     */
    public static function addLanguageToQueryArgs(array $query_args, ?string $language_code = null): array
    {
        $adapter = self::getAdapter();
        
        if (!$adapter) {
            return $query_args;
        }

        // Use current language if not specified
        if ($language_code === null) {
            $language_code = $adapter->getCurrentLanguage();
        }

        if (!$language_code) {
            return $query_args;
        }

        return $adapter->addLanguageToQueryArgs($query_args, $language_code);
    }

    /**
     * Get translated post ID
     *
     * @param int $post_id Original post ID
     * @param string $language_code Target language code
     * @return int|null
     */
    public static function getTranslatedPostId(int $post_id, string $language_code): ?int
    {
        $adapter = self::getAdapter();
        return $adapter ? $adapter->getTranslatedPostId($post_id, $language_code) : null;
    }

    /**
     * Get post language
     *
     * @param int $post_id Post ID
     * @return string|null
     */
    public static function getPostLanguage(int $post_id): ?string
    {
        $adapter = self::getAdapter();
        return $adapter ? $adapter->getPostLanguage($post_id) : null;
    }

    /**
     * Get active plugin name
     *
     * @return string|null
     */
    public static function getPluginName(): ?string
    {
        $adapter = self::getAdapter();
        return $adapter ? $adapter->getPluginName() : null;
    }

    /**
     * Register a custom adapter
     *
     * Allows third-party code to register custom multilingual adapters
     *
     * @param string $adapter_class Fully qualified class name
     * @return bool True if registered, false if invalid
     */
    public static function registerAdapter(string $adapter_class): bool
    {
        if (!class_exists($adapter_class)) {
            return false;
        }

        $reflection = new \ReflectionClass($adapter_class);
        
        if (!$reflection->implementsInterface(MultilingualInterface::class)) {
            return false;
        }

        // Add to beginning of array (higher priority)
        array_unshift(self::$adapters, $adapter_class);

        // Clear cached adapter
        self::$adapter = null;

        return true;
    }

    /**
     * Reset factory (mainly for testing)
     *
     * @return void
     */
    public static function reset(): void
    {
        self::$adapter = null;
    }
}

