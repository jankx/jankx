<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Advanced Tabs Block
 *
 * This block displays content in interactive tabs with customizable styling.
 * Supports icons, separators, and various layout options.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class AdvancedTabsBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/advanced-tabs';

    /**
     * Block attributes
     *
     * @var array
     */
    protected $attributes = [];

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

        $uniqueId = $attributes['uniqueId'] ?? 'jankx-tabs-' . uniqid();
        $tabTitles = $attributes['tabTitles'] ?? [];
        $activeTab = $attributes['activeTab'] ?? '1';
        $iconPosition = $attributes['iconPosition'] ?? 'left';
        $showSeparator = $attributes['showSeparator'] ?? true;
        $className = $attributes['className'] ?? '';

        // Build wrapper classes
        $wrapperClasses = ['advanced-tabs-block'];
        if (!empty($className)) {
            $wrapperClasses[] = $className;
        }

        // Build tabs HTML
        $tabsHtml = $this->renderTabs($tabTitles, $activeTab, $iconPosition, $showSeparator, $uniqueId);

        return sprintf(
            '<div class="%s" data-unique-id="%s">%s</div>',
            esc_attr(implode(' ', $wrapperClasses)),
            esc_attr($uniqueId),
            $tabsHtml
        );
    }

    /**
     * Render tabs structure
     *
     * @param array $tabTitles Tab titles configuration
     * @param string $activeTab Active tab ID
     * @param string $iconPosition Icon position
     * @param bool $showSeparator Show separator
     * @param string $uniqueId Unique block ID
     * @return string HTML
     */
    protected function renderTabs($tabTitles, $activeTab, $iconPosition, $showSeparator, $uniqueId)
    {
        $html = '<div class="tabs-container">';

        // Render tab navigation
        $html .= $this->renderTabNavigation($tabTitles, $activeTab, $iconPosition, $showSeparator);

        // Render tab content
        $html .= '<div class="tabs-content">';
        $html .= $this->renderTabContent($tabTitles, $activeTab, $uniqueId);
        $html .= '</div>';

        $html .= '</div>';

        return $html;
    }

    /**
     * Render tab navigation
     *
     * @param array $tabTitles Tab titles configuration
     * @param string $activeTab Active tab ID
     * @param string $iconPosition Icon position
     * @param bool $showSeparator Show separator
     * @return string HTML
     */
    protected function renderTabNavigation($tabTitles, $activeTab, $iconPosition, $showSeparator)
    {
        $html = '<div class="tabs-nav">';
        $html .= '<ul class="tabs-titles">';

        foreach ($tabTitles as $index => $tab) {
            $isActive = $tab['id'] === $activeTab;
            $tabClasses = ['tab-title', $iconPosition];

            if ($isActive) {
                $tabClasses[] = 'active';
            }

            $html .= sprintf(
                '<li class="%s" data-title-tab-id="%s" role="button" tabindex="0" aria-selected="%s">',
                esc_attr(implode(' ', $tabClasses)),
                esc_attr($tab['id']),
                $isActive ? 'true' : 'false'
            );

            // Render icon if enabled
            if (!empty($tab['hasMedia']) && $tab['hasMedia']) {
                $html .= '<div class="tab-title-media">';

                if ($tab['mediaType'] === 'iconLibrary' && !empty($tab['icon'])) {
                    $html .= sprintf(
                        '<i class="bi bi-%s"></i>',
                        esc_attr($tab['icon'])
                    );
                } elseif ($tab['mediaType'] === 'uploadSVG' && !empty($tab['customSVG'])) {
                    $html .= $tab['customSVG'];
                }

                $html .= '</div>';
            }

            // Render tab title
            $html .= sprintf(
                '<span class="tab-title-text">%s</span>',
                esc_html($tab['title'])
            );

            $html .= '</li>';
        }

        $html .= '</ul>';
        $html .= '</div>';

        return $html;
    }

    /**
     * Render tab content
     *
     * @param array $tabTitles Tab titles configuration
     * @param string $activeTab Active tab ID
     * @param string $uniqueId Unique block ID
     * @return string HTML
     */
    protected function renderTabContent($tabTitles, $activeTab, $uniqueId)
    {
        $html = '';

        foreach ($tabTitles as $tab) {
            $isActive = $tab['id'] === $activeTab;
            $tabClasses = ['single-tab'];

            if ($isActive) {
                $tabClasses[] = 'active';
            }

            $html .= sprintf(
                '<div class="%s" data-tab-id="%s" data-tab-parent-id="%s" style="display: %s;" role="tabpanel" aria-hidden="%s">',
                esc_attr(implode(' ', $tabClasses)),
                esc_attr($tab['id']),
                esc_attr($uniqueId),
                $isActive ? 'block' : 'none',
                $isActive ? 'false' : 'true'
            );

            // This will be populated by the tab content blocks
            $html .= '<div class="tab-content-inner">';
            $html .= sprintf(
                '<p>%s</p>',
                sprintf(__('Content for %s', 'jankx'), esc_html($tab['title']))
            );
            $html .= '</div>';

            $html .= '</div>';
        }

        return $html;
    }

    /**
     * Get block attributes schema
     *
     * @return array
     */
    public function getAttributes()
    {
        return [
            'uniqueId' => [
                'type' => 'string',
                'default' => ''
            ],
            'tabTitles' => [
                'type' => 'array',
                'default' => [
                    [
                        'id' => '1',
                        'title' => 'Tab 1',
                        'hasMedia' => false,
                        'mediaType' => 'iconLibrary',
                        'icon' => '0-circle',
                        'customSVG' => ''
                    ],
                    [
                        'id' => '2',
                        'title' => 'Tab 2',
                        'hasMedia' => false,
                        'mediaType' => 'iconLibrary',
                        'icon' => '0-circle',
                        'customSVG' => ''
                    ],
                    [
                        'id' => '3',
                        'title' => 'Tab 3',
                        'hasMedia' => false,
                        'mediaType' => 'iconLibrary',
                        'icon' => '0-circle',
                        'customSVG' => ''
                    ]
                ]
            ],
            'tabChildCount' => [
                'type' => 'number',
                'default' => 3
            ],
            'activeTab' => [
                'type' => 'string',
                'default' => '1'
            ],
            'iconPosition' => [
                'type' => 'string',
                'default' => 'left'
            ],
            'showSeparator' => [
                'type' => 'boolean',
                'default' => true
            ],
            'className' => [
                'type' => 'string',
                'default' => ''
            ]
        ];
    }
}
