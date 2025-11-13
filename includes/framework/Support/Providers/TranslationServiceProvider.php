<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;

/**
 * Translation Service Provider
 *
 * Handles multi-language support for Jankx Framework:
 *
 * - Text domain loading
 * - RTL/LTR support
 * - Language detection
 * - Translation file management
 * - Polylang/WPML integration
 * - Language switcher
 * - Direction support
 *
 * @package Jankx\Support\Providers
 * @since 2.0.0
 */
class TranslationServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(Application $app)
    {
        // Load text domain after init to avoid timing issues
        add_action('after_setup_theme', [$this, 'loadTextDomain']);

        // Add direction support
        add_filter('body_class', [$this, 'addDirectionBodyClass']);
    }


    /**
     * Bootstrap any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function boot(Application $app)
    {
        add_filter('frontpage_template_hierarchy', [$this, 'filterFrontpageTemplateHierarchy']);
        add_filter('404_template_hierarchy', [$this, 'filterFrontpageTemplateHierarchy']);
        add_filter('archive_template_hierarchy', [$this, 'filterFrontpageTemplateHierarchy']);
        add_filter('attachment_template_hierarchy', [$this, 'filterFrontpageTemplateHierarchy']);
        add_filter('author_template_hierarchy', [$this, 'filterFrontpageTemplateHierarchy']);
        add_filter('category_template_hierarchy', [$this, 'filterFrontpageTemplateHierarchy']);
        add_filter('date_template_hierarchy', [$this, 'filterFrontpageTemplateHierarchy']);
        add_filter('embed_template_hierarchy', [$this, 'filterFrontpageTemplateHierarchy']);
        add_filter('frontpage_template_hierarchy', [$this, 'filterFrontpageTemplateHierarchy']);
        add_filter('home_template_hierarchy', [$this, 'filterFrontpageTemplateHierarchy']);
        add_filter('index_template_hierarchy', [$this, 'filterFrontpageTemplateHierarchy']);
        add_filter('page_template_hierarchy', [$this, 'filterFrontpageTemplateHierarchy']);
        add_filter('paged_template_hierarchy', [$this, 'filterFrontpageTemplateHierarchy']);
        add_filter('privacypolicy_template_hierarchy', [$this, 'filterFrontpageTemplateHierarchy']);
        add_filter('search_template_hierarchy', [$this, 'filterFrontpageTemplateHierarchy']);
        add_filter('single_template_hierarchy', [$this, 'filterFrontpageTemplateHierarchy']);
        add_filter('singular_template_hierarchy', [$this, 'filterFrontpageTemplateHierarchy']);
        add_filter('tag_template_hierarchy', [$this, 'filterFrontpageTemplateHierarchy']);
        add_filter('taxonomy_template_hierarchy', [$this, 'filterFrontpageTemplateHierarchy']);
    }

    public function filterFrontpageTemplateHierarchy($templates)
    {
        $currentLanguage = $this->getCurrentLanguage();
        foreach ($templates as $index => $template) {
            if (strpos($template, '.php') === false) {
                continue;
            }

            $templateFile = 'templates/' . str_replace('.php', '-' . $currentLanguage . '.html', $template);
            $exitings = locate_template($templateFile, false);
            if (!empty($exitings)) {
                $languageTemplate = str_replace('.php', '-' . $currentLanguage . '.php', $template);            
                $templates[$index] = $languageTemplate;
            }
        }
        return $templates;
    }

    /**
     * Load text domain for translations
     *
     * @return void
     */
    public function loadTextDomain()
    {
        load_theme_textdomain('jankx', get_template_directory() . '/languages');
    }

    /**
     * Add direction body class
     *
     * @param array $classes
     * @return array
     */
    public function addDirectionBodyClass($classes)
    {
        $direction = $this->getCurrentDirection();
        if ($direction) {
            $classes[] = 'direction-' . $direction;
        }

        $language = $this->getCurrentLanguage();
        if ($language) {
            $classes[] = 'lang-' . $language;
        }

        return $classes;
    }

    /**
     * Get current language
     *
     * @return string|null
     */
    public function getCurrentLanguage()
    {
        // Check Polylang
        if (function_exists('pll_current_language')) {
            return pll_current_language();
        }

        // Check WPML
        if (defined('ICL_LANGUAGE_CODE')) {
            return ICL_LANGUAGE_CODE;
        }

        // Fallback to WordPress locale
        return get_locale();
    }

    /**
     * Get current direction (RTL/LTR)
     *
     * @return string|null
     */
    public function getCurrentDirection()
    {
        $language = $this->getCurrentLanguage();

        // RTL languages
        $rtlLanguages = [
            'ar', 'he', 'fa', 'ur', 'ps', 'sd', 'ku', 'yi'
        ];

        return in_array($language, $rtlLanguages) ? 'rtl' : 'ltr';
    }

    /**
     * Get available languages
     *
     * @return array
     */
    public function getLanguages()
    {
        // Check Polylang
        if (function_exists('pll_the_languages')) {
            $languages = pll_the_languages(['raw' => 1]);
            return array_keys($languages);
        }

        // Check WPML
        if (function_exists('icl_get_languages')) {
            $languages = icl_get_languages('skip_missing=0');
            return array_keys($languages);
        }

        // Fallback to WordPress locale
        return [get_locale()];
    }

    /**
     * Get language URL
     *
     * @param string $language
     * @return string
     */
    protected function getLanguageUrl($language)
    {
        // Check Polylang
        if (function_exists('pll_home_url')) {
            return pll_home_url($language);
        }

        // Check WPML
        if (function_exists('icl_get_languages')) {
            $languages = icl_get_languages('skip_missing=0');
            if (isset($languages[$language]['url'])) {
                return $languages[$language]['url'];
            }
        }

        // Fallback to current URL
        return home_url();
    }

    /**
     * Get language name
     *
     * @param string $language
     * @return string
     */
    protected function getLanguageName($language)
    {
        $names = [
            'en_US' => 'English',
            'vi' => 'Tiếng Việt',
            'ar' => 'العربية',
            'he' => 'עברית',
            'fa' => 'فارسی',
            'ur' => 'اردو',
            'ps' => 'پښتو',
            'sd' => 'سنڌي',
            'ku' => 'کوردی',
            'yi' => 'יידיש'
        ];

        return $names[$language] ?? $language;
    }
}
