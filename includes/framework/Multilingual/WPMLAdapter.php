<?php

namespace Jankx\Multilingual;

use WP_Query;

/**
 * WPML Adapter
 *
 * Adapter for WPML (WordPress Multilingual Plugin)
 * Implements common multilingual operations for WPML
 *
 * @package Jankx\Multilingual
 * @since 1.0.0
 */
class WPMLAdapter implements MultilingualInterface
{
    /**
     * Check if WPML is active
     *
     * @return bool
     */
    public function isActive(): bool
    {
        return defined('ICL_LANGUAGE_CODE') && function_exists('icl_object_id');
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

        return ICL_LANGUAGE_CODE ?: null;
    }

    /**
     * Get all available languages
     *
     * @return array
     */
    public function getLanguages(): array
    {
        if (!$this->isActive() || !function_exists('icl_get_languages')) {
            return [];
        }

        $languages = icl_get_languages();
        return $languages ?: [];
    }

    /**
     * Get default language code
     *
     * @return string|null
     */
    public function getDefaultLanguage(): ?string
    {
        if (!$this->isActive()) {
            return null;
        }

        global $sitepress;
        
        if ($sitepress && method_exists($sitepress, 'get_default_language')) {
            return $sitepress->get_default_language();
        }

        return null;
    }

    /**
     * Set current language context
     *
     * @param string $language_code Language code to set
     * @return bool
     */
    public function setCurrentLanguage(string $language_code): bool
    {
        if (!$this->isActive()) {
            return false;
        }

        global $sitepress;

        if (!$sitepress || !method_exists($sitepress, 'switch_lang')) {
            return false;
        }

        try {
            $sitepress->switch_lang($language_code);
            return true;
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

        // WPML automatically filters queries based on current language
        // But we can explicitly set it
        global $sitepress;
        
        if ($sitepress) {
            // Temporarily switch language for this query
            $original_lang = $this->getCurrentLanguage();
            $this->setCurrentLanguage($language_code);
            
            // Add filter to restore language after query
            add_action('pre_get_posts', function () use ($original_lang) {
                if ($original_lang) {
                    $this->setCurrentLanguage($original_lang);
                }
            }, 999);
        }

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
        if (!$this->isActive() || !function_exists('icl_object_id')) {
            return null;
        }

        $post_type = get_post_type($post_id);
        $translated_id = icl_object_id($post_id, $post_type, false, $language_code);
        
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
        if (!$this->isActive()) {
            return null;
        }

        global $sitepress;
        
        if (!$sitepress || !method_exists($sitepress, 'get_language_for_element')) {
            return null;
        }

        $post_type = get_post_type($post_id);
        $lang = $sitepress->get_language_for_element($post_id, 'post_' . $post_type);
        
        return $lang ?: null;
    }

    /**
     * Get plugin name
     *
     * @return string
     */
    public function getPluginName(): string
    {
        return 'WPML';
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

        // WPML uses 'suppress_filters' to control language filtering
        // We need to ensure it's not suppressed
        $query_args['suppress_filters'] = false;

        // Set the language for this specific query
        global $sitepress;
        
        if ($sitepress && method_exists($sitepress, 'switch_lang')) {
            // Switch language context before query
            $sitepress->switch_lang($language_code);
        }

        return $query_args;
    }
}

