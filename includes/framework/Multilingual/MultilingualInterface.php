<?php

namespace Jankx\Multilingual;

/**
 * Multilingual Plugin Interface
 *
 * Interface for multilingual plugin adapters (Polylang, WPML, etc.)
 * Provides abstraction layer for common multilingual operations
 *
 * @package Jankx\Multilingual
 * @since 1.0.0
 */
interface MultilingualInterface
{
    /**
     * Check if multilingual plugin is active
     *
     * @return bool
     */
    public function isActive(): bool;

    /**
     * Get current language code
     *
     * @return string|null Language code (e.g., 'en', 'vi') or null if not available
     */
    public function getCurrentLanguage(): ?string;

    /**
     * Get all available languages
     *
     * @return array Array of language objects/arrays
     */
    public function getLanguages(): array;

    /**
     * Get default language code
     *
     * @return string|null
     */
    public function getDefaultLanguage(): ?string;

    /**
     * Set current language context
     *
     * This method should set the global language context
     * so that subsequent queries will filter by this language
     *
     * @param string $language_code Language code to set
     * @return bool True on success, false on failure
     */
    public function setCurrentLanguage(string $language_code): bool;

    /**
     * Filter WP_Query to include only posts in specific language
     *
     * @param \WP_Query $query Query object to filter
     * @param string $language_code Language code
     * @return \WP_Query Modified query object
     */
    public function filterQuery(\WP_Query $query, string $language_code): \WP_Query;

    /**
     * Get translated post ID for a given language
     *
     * @param int $post_id Original post ID
     * @param string $language_code Target language code
     * @return int|null Translated post ID or null if not found
     */
    public function getTranslatedPostId(int $post_id, string $language_code): ?int;

    /**
     * Get language of a specific post
     *
     * @param int $post_id Post ID
     * @return string|null Language code or null if not found
     */
    public function getPostLanguage(int $post_id): ?string;

    /**
     * Get plugin name
     *
     * @return string Plugin name (e.g., 'Polylang', 'WPML')
     */
    public function getPluginName(): string;

    /**
     * Add language parameter to query args
     *
     * @param array $query_args WP_Query arguments
     * @param string $language_code Language code
     * @return array Modified query arguments
     */
    public function addLanguageToQueryArgs(array $query_args, string $language_code): array;
}

