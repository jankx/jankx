<?php

namespace Jankx\Support\Blocks;

/**
 * Language Switcher Block
 *
 * This block displays language switcher for Polylang plugin
 * with customizable display options.
 *
 * @package Jankx\Support\Blocks
 * @since 1.0.0
 */
class LanguageSwitcherBlock extends Block
{
    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct('jankx/language-switcher', [
            'title' => __('Language Switcher', 'jankx'),
            'category' => 'widgets',
            'icon' => 'translation',
            'description' => __('Display language switcher for Polylang plugin', 'jankx'),
            'keywords' => ['language', 'polylang', 'switcher', 'multilingual'],
            'supports' => [
                'html' => false,
                'align' => ['wide', 'full'],
                'spacing' => [
                    'margin' => true,
                    'padding' => true
                ]
            ],
            'attributes' => [
                'showFlags' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'showNames' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'showCurrent' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'displayType' => [
                    'type' => 'string',
                    'default' => 'dropdown'
                ],
                'className' => [
                    'type' => 'string',
                    'default' => ''
                ]
            ]
        ]);
    }

    /**
     * Register the block
     *
     * @return void
     */
    public function register()
    {
        $blockPath = get_template_directory() . '/resources/blocks/language-switcher';
        $buildPath = $blockPath . '/build';
        $metadata = $this->getBlockMetadata($blockPath);

        // Update metadata to use built assets
        if (is_dir($buildPath)) {
            $metadata['editorScript'] = 'build/index.js';
            $metadata['style'] = 'build/style.css';
        }

        // Register block
        $this->registerBlock($blockPath, $metadata);
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
        $showFlags = $attributes['showFlags'] ?? true;
        $showNames = $attributes['showNames'] ?? true;
        $showCurrent = $attributes['showCurrent'] ?? true;
        $displayType = $attributes['displayType'] ?? 'dropdown';
        $className = $attributes['className'] ?? '';

        // Check if Polylang is active
        if (!function_exists('pll_the_languages')) {
            return $this->renderPlaceholder();
        }

        // Get available languages
        $languages = pll_the_languages([
            'raw' => 1,
            'hide_if_empty' => 0,
            'show_flags' => $showFlags,
            'show_names' => $showNames,
            'show_current' => $showCurrent
        ]);

        if (empty($languages)) {
            return $this->renderPlaceholder();
        }

        // Build wrapper classes
        $wrapperClasses = ['jankx-language-switcher'];
        if (!empty($className)) {
            $wrapperClasses[] = $className;
        }
        $wrapperClasses[] = 'jankx-language-switcher--' . $displayType;

        // Build language switcher HTML
        $switcherHtml = $this->renderLanguageSwitcher($languages, $displayType);

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
    protected function renderLanguageSwitcher($languages, $displayType)
    {
        if ($displayType === 'dropdown') {
            return $this->renderDropdown($languages);
        } elseif ($displayType === 'list') {
            return $this->renderList($languages);
        } elseif ($displayType === 'flags') {
            return $this->renderFlags($languages);
        }

        return $this->renderDropdown($languages); // Default
    }

    /**
     * Render dropdown style
     *
     * @param array $languages Available languages
     * @return string HTML
     */
    protected function renderDropdown($languages)
    {
        $currentLang = pll_current_language();
        $currentLangData = $languages[$currentLang] ?? null;

        $html = '<div class="jankx-language-switcher__dropdown">';
        $html .= '<button class="jankx-language-switcher__current" type="button">';

        if ($currentLangData) {
            if ($currentLangData['flag']) {
                $html .= sprintf('<img src="%s" alt="%s" class="jankx-language-switcher__flag">',
                    esc_url($currentLangData['flag']),
                    esc_attr($currentLangData['name'])
                );
            }
            $html .= sprintf('<span class="jankx-language-switcher__name">%s</span>',
                esc_html($currentLangData['name'])
            );
        }

        $html .= '<span class="jankx-language-switcher__arrow">▼</span>';
        $html .= '</button>';

        $html .= '<ul class="jankx-language-switcher__menu">';
        foreach ($languages as $langCode => $langData) {
            $isCurrent = $langCode === $currentLang;
            $itemClasses = ['jankx-language-switcher__item'];
            if ($isCurrent) {
                $itemClasses[] = 'jankx-language-switcher__item--current';
            }

            $html .= sprintf('<li class="%s">', esc_attr(implode(' ', $itemClasses)));
            $html .= sprintf('<a href="%s" class="jankx-language-switcher__link">', esc_url($langData['url']));

            if ($langData['flag']) {
                $html .= sprintf('<img src="%s" alt="%s" class="jankx-language-switcher__flag">',
                    esc_url($langData['flag']),
                    esc_attr($langData['name'])
                );
            }

            $html .= sprintf('<span class="jankx-language-switcher__name">%s</span>',
                esc_html($langData['name'])
            );
            $html .= '</a></li>';
        }
        $html .= '</ul></div>';

        return $html;
    }

    /**
     * Render list style
     *
     * @param array $languages Available languages
     * @return string HTML
     */
    protected function renderList($languages)
    {
        $currentLang = pll_current_language();

        $html = '<ul class="jankx-language-switcher__list">';
        foreach ($languages as $langCode => $langData) {
            $isCurrent = $langCode === $currentLang;
            $itemClasses = ['jankx-language-switcher__item'];
            if ($isCurrent) {
                $itemClasses[] = 'jankx-language-switcher__item--current';
            }

            $html .= sprintf('<li class="%s">', esc_attr(implode(' ', $itemClasses)));
            $html .= sprintf('<a href="%s" class="jankx-language-switcher__link">', esc_url($langData['url']));

            if ($langData['flag']) {
                $html .= sprintf('<img src="%s" alt="%s" class="jankx-language-switcher__flag">',
                    esc_url($langData['flag']),
                    esc_attr($langData['name'])
                );
            }

            $html .= sprintf('<span class="jankx-language-switcher__name">%s</span>',
                esc_html($langData['name'])
            );
            $html .= '</a></li>';
        }
        $html .= '</ul>';

        return $html;
    }

    /**
     * Render flags only style
     *
     * @param array $languages Available languages
     * @return string HTML
     */
    protected function renderFlags($languages)
    {
        $currentLang = pll_current_language();

        $html = '<div class="jankx-language-switcher__flags">';
        foreach ($languages as $langCode => $langData) {
            $isCurrent = $langCode === $currentLang;
            $itemClasses = ['jankx-language-switcher__flag-item'];
            if ($isCurrent) {
                $itemClasses[] = 'jankx-language-switcher__flag-item--current';
            }

            $html .= sprintf('<div class="%s">', esc_attr(implode(' ', $itemClasses)));
            $html .= sprintf('<a href="%s" class="jankx-language-switcher__flag-link" title="%s">',
                esc_url($langData['url']),
                esc_attr($langData['name'])
            );

            if ($langData['flag']) {
                $html .= sprintf('<img src="%s" alt="%s" class="jankx-language-switcher__flag">',
                    esc_url($langData['flag']),
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
        return '<div class="jankx-language-switcher-placeholder">' .
               '<p>' . __('Polylang plugin is not active. Language switcher cannot be displayed.', 'jankx') . '</p>' .
               '</div>';
    }
}
