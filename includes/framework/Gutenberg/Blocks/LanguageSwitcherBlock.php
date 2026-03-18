<?php

namespace Jankx\Gutenberg\Blocks;

use App\Services\LanguageSwitcherService;
use Jankx\Facades\App;
use Jankx\Gutenberg\Block;

/**
 * Language Switcher Block
 *
 * This block displays language switcher for Polylang plugin
 * with customizable display options.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class LanguageSwitcherBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/language-switcher';

    /**
     * Block attributes
     *
     * @var array
     */
    protected $attributes = [];

    /**
     * Language service
     *
     * @var \App\Services\LanguageSwitcherService
     */
    protected $languageService;

    /**
     * Constructor
     *
     * @param LanguageSwitcherService $languageService
     * @param string|null $blockPath
     */
    public function __construct(LanguageSwitcherService $languageService, $blockPath = null)
    {
        parent::__construct($blockPath);
        $this->languageService = $languageService;
    }

    /**
     * Render the block content
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '')
    {
        // Store attributes for use in other methods
        $this->attributes = $attributes;

        $showFlags = $attributes['showFlags'] ?? true;
        $showNames = $attributes['showNames'] ?? true;
        $showCurrent = $attributes['showCurrent'] ?? true;
        $displayType = $attributes['displayType'] ?? 'dropdown';
        $className = $attributes['className'] ?? '';

        if (!function_exists('pll_the_languages')) {
            return $this->renderPlaceholder() . ' (P1)';
        }

        // Get available languages with current page URLs
        $languages = $this->languageService->getLanguages(true); // true = get URLs for current page translations

        if (empty($languages)) {
            return $this->renderPlaceholder() . ' (P2)';
        }

        // Build wrapper classes
        $wrapperClasses = ['language-switcher-block'];
        if (!empty($className)) {
            $wrapperClasses[] = $className;
        }


    // Build language switcher HTML
    $switcherHtml = $this->renderLanguageSwitcher($languages, $displayType, $showFlags, $showNames, $showCurrent);

        return sprintf(
            '<div class="%s">%s</div>',
            esc_attr(implode(' ', $wrapperClasses)),
            $switcherHtml
        );
    }

    /**
     * Render language switcher based on display type
     *
     * @param array $languages Available languages
     * @param string $displayType Display type
     * @return string HTML
     */
    protected function renderLanguageSwitcher($languages, $displayType, $showFlags, $showNames, $showCurrent)
    {
        if ($displayType === 'dropdown') {
            return $this->renderDropdown($languages, $showFlags, $showNames, $showCurrent);
        } elseif ($displayType === 'list') {
            return $this->renderList($languages, $showFlags, $showNames, $showCurrent);
        } elseif ($displayType === 'flags') {
            return $this->renderFlags($languages, $showFlags, $showNames, $showCurrent);
        }

        return $this->renderDropdown($languages, $showFlags, $showNames, $showCurrent); // Default
    }


    /**
     * Render dropdown style
     *
     * @param array $languages Available languages
     * @param bool $showFlags Show flags
     * @param bool $showNames Show language names
     * @param bool $showCurrent Show current language in dropdown
     * @return string HTML
     */
    protected function renderDropdown($languages, $showFlags, $showNames, $showCurrent)
    {
        // Get current language data
        $currentLangData = $this->languageService->getCurrentLanguage();
        $currentLangData = apply_filters(
            'jankx/languages/current-language/data',
            $currentLangData
        );

        // Validate current language data
        if (!is_array($currentLangData) || empty($currentLangData['code'])) {
            $currentLangData = null;
        }

        // Apply filters
        $languages = apply_filters(
            'jankx/languages/data',
            $languages
        );

        // Filter out current language if showCurrent is false
        if (!$showCurrent && $currentLangData) {
            $languages = array_filter($languages, function ($langData) use ($currentLangData) {
                return isset($langData['code']) && $langData['code'] !== $currentLangData['code'];
            });
        }

        $dropdownIcon = apply_filters('jankx/languages/switcher/dropdown/icon', '▼');
        $html = '<div class="language-switcher-dropdown-wrapper">';
        $html .= '<button class="language-switcher-dropdown" type="button">';
        if ($currentLangData) {
            if (
                $showFlags &&
                !empty($currentLangData['flag']) &&
                (filter_var($currentLangData['flag'], FILTER_VALIDATE_URL) || strpos($currentLangData['flag'], 'data:image/') === 0)
            ) {
                $html .= sprintf(
                    '<img src="%s" alt="%s" class="language-flag">',
                    esc_attr($currentLangData['flag']),
                    esc_attr($currentLangData['name'])
                );
            }
            if ($showNames) {
                $html .= sprintf(
                    '<span class="language-name">%s</span>',
                    esc_html($currentLangData['name'])
                );
            }
        }

        $html .= '<span class="language-arrow">' . $dropdownIcon . '</span>';
        $html .= '</button>';

        $html .= '<ul class="language-switcher-dropdown-menu">';
        foreach ($languages as $langData) {
            // Validate language data
            if (!is_array($langData) || empty($langData['code'])) {
                continue;
            }

            $isCurrent = $currentLangData && $langData['code'] === $currentLangData['code'];
            $itemClasses = ['language-dropdown-item'];
            if ($isCurrent) {
                $itemClasses[] = 'current-language';
            }

            $html .= sprintf('<li class="%s">', esc_attr(implode(' ', $itemClasses)));
            $html .= sprintf('<a href="%s" class="language-dropdown-link">', esc_url($langData['url']));

            if (
                $showFlags &&
                !empty($langData['flag']) &&
                (filter_var($langData['flag'], FILTER_VALIDATE_URL) || strpos($langData['flag'], 'data:image/') === 0)
            ) {
                $html .= sprintf(
                    '<img src="%s" alt="%s" class="language-flag">',
                    esc_attr($langData['flag']),
                    esc_attr($langData['name'])
                );
            }

            if ($showNames) {
                $html .= sprintf(
                    '<span class="language-name">%s</span>',
                    esc_html($langData['name'])
                );
            }

            $html .= '</a></li>';
        }
        $html .= '</ul></div>';

        return $html;
    }

    /**
     * Render list style
     *
     * @param array $languages Available languages
     * @param bool $showFlags Show flags
     * @param bool $showNames Show language names
     * @param bool $showCurrent Show current language in list
     * @return string HTML
     */
    protected function renderList($languages, $showFlags, $showNames, $showCurrent)
    {
        // Get current language data consistently
        $currentLangData = $this->languageService->getCurrentLanguage();

        // Validate current language data
        if (!is_array($currentLangData) || empty($currentLangData['code'])) {
            $currentLangData = null;
        }

        // Filter out current language if showCurrent is false
        if (!$showCurrent && $currentLangData) {
            $languages = array_filter($languages, function ($langData) use ($currentLangData) {
                return isset($langData['code']) && $langData['code'] !== $currentLangData['code'];
            });
        }

        $html = '<ul class="language-switcher-list">';
        foreach ($languages as $langData) {
            // Validate language data
            if (!is_array($langData) || empty($langData['code'])) {
                continue;
            }

            $isCurrent = $currentLangData && $langData['code'] === $currentLangData['code'];
            $itemClasses = ['language-item'];
            if ($isCurrent) {
                $itemClasses[] = 'current-language';
            }

            $html .= sprintf('<li class="%s">', esc_attr(implode(' ', $itemClasses)));
            $html .= sprintf('<a href="%s" class="language-link">', esc_url($langData['url']));

            if (
                $showFlags &&
                !empty($langData['flag']) &&
                (filter_var($langData['flag'], FILTER_VALIDATE_URL) || strpos($langData['flag'], 'data:image/') === 0)
            ) {
                $html .= sprintf(
                    '<img src="%s" alt="%s" class="language-flag">',
                    esc_attr($langData['flag']),
                    esc_attr($langData['name'])
                );
            }

            if ($showNames) {
                $html .= sprintf(
                    '<span class="language-name">%s</span>',
                    esc_html($langData['name'])
                );
            }

            $html .= '</a></li>';
        }
        $html .= '</ul>';

        return $html;
    }

    /**
     * Render flags only style
     *
     * @param array $languages Available languages
     * @param bool $showFlags Show flags
     * @param bool $showNames Show language names
     * @param bool $showCurrent Show current language in flags
     * @return string HTML
     */
    protected function renderFlags($languages, $showFlags, $showNames, $showCurrent)
    {
        // Get current language data consistently
        $currentLangData = $this->languageService->getCurrentLanguage();

        // Validate current language data
        if (!is_array($currentLangData) || empty($currentLangData['code'])) {
            $currentLangData = null;
        }

        // Filter out current language if showCurrent is false
        if (!$showCurrent && $currentLangData) {
            $languages = array_filter($languages, function ($langData) use ($currentLangData) {
                return isset($langData['code']) && $langData['code'] !== $currentLangData['code'];
            });
        }

        $html = '<div class="language-switcher-flags">';
        foreach ($languages as $langData) {
            // Validate language data
            if (!is_array($langData) || empty($langData['code'])) {
                continue;
            }

            $isCurrent = $currentLangData && $langData['code'] === $currentLangData['code'];
            $itemClasses = ['language-flag-item'];
            if ($isCurrent) {
                $itemClasses[] = 'current-language';
            }

            $html .= sprintf('<div class="%s">', esc_attr(implode(' ', $itemClasses)));
            $html .= sprintf(
                '<a href="%s" class="language-flag-link" title="%s">',
                esc_url($langData['url']),
                esc_attr($langData['name'])
            );

            if (
                $showFlags &&
                !empty($langData['flag']) &&
                (filter_var($langData['flag'], FILTER_VALIDATE_URL) || strpos($langData['flag'], 'data:image/') === 0)
            ) {
                $html .= sprintf(
                    '<img src="%s" alt="%s" class="language-flag">',
                    esc_attr($langData['flag']),
                    esc_attr($langData['name'])
                );
            }

            $html .= '</a></div>';
        }
        $html .= '</div>';

        return $html;
    }

    /**
     * Render placeholder when Polylang is not available
     *
     * @return string
     */
    protected function renderPlaceholder()
    {
        return '<div class="polylang-placeholder">' .
               '<p>' . __('Polylang plugin is not active. Language switcher cannot be displayed.', 'jankx') . '</p>' .
               '</div>';
    }
}
