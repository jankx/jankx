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
        return __('Trigger advanced filter when tab is clicked. Configure filter using Advanced Filter block inside this tab. Updates dynamic-data-layout blocks with filtered results.', 'jankx');
    }

    /**
     * {@inheritdoc}
     */
    public function isAvailable(array $context = []): bool
    {
        // Check if there are any dynamic-data-layout blocks on the page
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
            'customContent' => true, // Allow inner blocks (advanced-filter block)
            'icon' => true,
        ];

        // Settings schema for editor UI
        $settings['settingsSchema'] = [
            [
                'type' => 'select',
                'key' => 'targetBlockId',
                'label' => __('Target Block', 'jankx'),
                'description' => __('Select the Dynamic Data Layout block to filter', 'jankx'),
                'options' => [], // Will be populated by JavaScript
                'required' => true,
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

