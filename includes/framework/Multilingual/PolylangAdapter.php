<?php

namespace Jankx\Multilingual;

use WP_Query;

/**
 * Polylang Adapter
 *
 * Adapter for Polylang multilingual plugin
 * Implements common multilingual operations for Polylang
 *
 * @package Jankx\Multilingual
 * @since 1.0.0
 */
class PolylangAdapter implements MultilingualInterface
{
    /**
     * Check if Polylang is active
     *
     * @return bool
     */
    public function isActive(): bool
    {
        return function_exists('pll_current_language') && function_exists('PLL');
    }

    /**
     * Get current language code
     *
     * @return string|null
     */
    public function getCurrentLanguage(): ?string
    {
        if (!$this->isActive()) {
            return null;
        }

        $lang = pll_current_language();
        return $lang ?: null;
    }

    /**
     * Get all available languages
     *
     * @return array
     */
    public function getLanguages(): array
    {
        if (!$this->isActive() || !function_exists('pll_languages_list')) {
            return [];
        }

        $languages = pll_languages_list(['fields' => []]);
        return $languages ?: [];
    }

    /**
     * Get default language code
     *
     * @return string|null
     */
    public function getDefaultLanguage(): ?string
    {
        if (!$this->isActive() || !function_exists('pll_default_language')) {
            return null;
        }

        $default = pll_default_language();
        return $default ?: null;
    }

    /**
     * Set current language context
     *
     * @param string $language_code Language code to set
     * @return bool
     */
    public function setCurrentLanguage(string $language_code): bool
    {
        if (!$this->isActive() || !function_exists('PLL')) {
            return false;
        }

        try {
            $polylang = PLL();
            
            if (!isset($polylang->model)) {
                return false;
            }

            // Get language object
            $lang_obj = $polylang->model->get_language($language_code);
            
            if (!$lang_obj) {
                return false;
            }

            // Set current language
            if (isset($polylang->curlang)) {
                $polylang->curlang = $lang_obj;
                return true;
            }

            return false;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Filter WP_Query to include only posts in specific language
     *
     * @param WP_Query $query Query object to filter
     * @param string $language_code Language code
     * @return WP_Query
     */
    public function filterQuery(WP_Query $query, string $language_code): WP_Query
    {
        if (!$this->isActive()) {
            return $query;
        }

        // Get existing tax_query
        $tax_query = $query->get('tax_query') ?: [];

        // Add language taxonomy
        $tax_query[] = [
            'taxonomy' => 'language',
            'field' => 'slug',
            'terms' => $language_code,
        ];

        $query->set('tax_query', $tax_query);

        return $query;
    }

    /**
     * Get translated post ID for a given language
     *
     * @param int $post_id Original post ID
     * @param string $language_code Target language code
     * @return int|null
     */
    public function getTranslatedPostId(int $post_id, string $language_code): ?int
    {
        if (!$this->isActive() || !function_exists('pll_get_post')) {
            return null;
        }

        $translated_id = pll_get_post($post_id, $language_code);
        return $translated_id ?: null;
    }

    /**
     * Get language of a specific post
     *
     * @param int $post_id Post ID
     * @return string|null
     */
    public function getPostLanguage(int $post_id): ?string
    {
        if (!$this->isActive() || !function_exists('pll_get_post_language')) {
            return null;
        }

        $lang = pll_get_post_language($post_id);
        return $lang ?: null;
    }

    /**
     * Get plugin name
     *
     * @return string
     */
    public function getPluginName(): string
    {
        return 'Polylang';
    }

    /**
     * Add language parameter to query args
     *
     * @param array $query_args WP_Query arguments
     * @param string $language_code Language code
     * @return array
     */
    public function addLanguageToQueryArgs(array $query_args, string $language_code): array
    {
        if (!$this->isActive()) {
            return $query_args;
        }

        // Initialize tax_query if not exists
        if (!isset($query_args['tax_query'])) {
            $query_args['tax_query'] = [];
        }

        // Add language filter
        $query_args['tax_query'][] = [
            'taxonomy' => 'language',
            'field' => 'slug',
            'terms' => $language_code,
        ];

        return $query_args;
    }
}

