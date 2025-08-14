<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Facades\Log;
use Jankx\Helper\Environment;

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

        // Add language switcher
        add_action('wp_footer', [$this, 'renderLanguageSwitcher']);
    }

    /**
     * Bootstrap any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function boot(Application $app)
    {

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
     * Render language switcher
     *
     * @return void
     */
    public function renderLanguageSwitcher()
    {
        $languages = $this->getLanguages();
        $currentLanguage = $this->getCurrentLanguage();

        if (count($languages) <= 1) {
            return;
        }

        echo '<div class="language-switcher">';
        echo '<ul>';

        foreach ($languages as $language) {
            $isCurrent = ($language === $currentLanguage);
            $class = $isCurrent ? 'current' : '';

            echo '<li class="' . esc_attr($class) . '">';
            echo '<a href="' . esc_url($this->getLanguageUrl($language)) . '">';
            echo esc_html($this->getLanguageName($language));
            echo '</a>';
            echo '</li>';
        }

        echo '</ul>';
        echo '</div>';
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
