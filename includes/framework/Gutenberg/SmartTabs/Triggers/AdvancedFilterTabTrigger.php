<?php

namespace Jankx\Gutenberg\SmartTabs\Triggers;

use Jankx\Gutenberg\SmartTabs\AbstractSmartTabTrigger;

/**
 * Advanced Filter Tab Trigger
 * 
 * Allows tabs to trigger advanced filters and update dynamic-data-layout blocks
 */
class AdvancedFilterTabTrigger extends AbstractSmartTabTrigger
{
    /**
     * {@inheritdoc}
     */
    public function getKey(): string
    {
        return 'advanced-filter';
    }

    /**
     * {@inheritdoc}
     */
    public function getLabel(): string
    {
        return __('Advanced Filter', 'jankx');
    }

    /**
     * {@inheritdoc}
     */
    public function getDescription(): string
    {
        return __('Trigger advanced filter when tab is clicked. Updates dynamic-data-layout blocks with filtered results.', 'jankx');
    }

    /**
     * {@inheritdoc}
     */
    public function isAvailable(array $context = []): bool
    {
        // Check if there are any advanced-filters blocks on the page
        // This will be checked in JavaScript for editor context
        return true;
    }

    /**
     * {@inheritdoc}
     */
    public function getEditorSettings(array $context = []): array
    {
        $settings = parent::getEditorSettings($context);
        
        $settings['supports'] = [
            'customTitle' => true,
            'customContent' => false, // Content is managed by trigger
            'icon' => true,
        ];

        // Settings schema for editor UI
        $settings['settingsSchema'] = [
            [
                'type' => 'select',
                'key' => 'filterBlockId',
                'label' => __('Filter Block', 'jankx'),
                'description' => __('Select the advanced-filters block to use', 'jankx'),
                'options' => [], // Will be populated by JavaScript
                'required' => true,
            ],
            [
                'type' => 'select',
                'key' => 'filterId',
                'label' => __('Filter', 'jankx'),
                'description' => __('Select the filter to apply', 'jankx'),
                'options' => [], // Will be populated by JavaScript
                'required' => true,
            ],
            [
                'type' => 'dynamic',
                'key' => 'filterValue',
                'label' => __('Filter Value', 'jankx'),
                'description' => __('Select or enter the filter value', 'jankx'),
                'required' => true,
                'dependsOn' => [
                    'filterId' => 'filterId',
                ],
            ],
        ];

        return $settings;
    }

    /**
     * {@inheritdoc}
     */
    public function resolveTitle(string $baseTitle, array $attributes, array $context = []): string
    {
        if (!empty($baseTitle)) {
            return $baseTitle;
        }

        $triggerSettings = $attributes['triggerSettings'] ?? [];
        $filterId = $triggerSettings['filterId'] ?? '';
        
        if (!empty($filterId)) {
            return sprintf(__('Filter: %s', 'jankx'), $filterId);
        }

        return __('Advanced Filter Tab', 'jankx');
    }
}

