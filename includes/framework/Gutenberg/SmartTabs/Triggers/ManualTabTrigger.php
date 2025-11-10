<?php

namespace Jankx\Gutenberg\SmartTabs\Triggers;

use Jankx\Gutenberg\SmartTabs\AbstractSmartTabTrigger;

/**
 * Default manual trigger which keeps existing behaviour.
 */
class ManualTabTrigger extends AbstractSmartTabTrigger
{
    /**
     * {@inheritdoc}
     */
    public function getKey(): string
    {
        return 'manual';
    }

    /**
     * {@inheritdoc}
     */
    public function getLabel(): string
    {
        return __('Custom Content', 'jankx');
    }

    /**
     * {@inheritdoc}
     */
    public function getDescription(): string
    {
        return __('Use manual title and inner blocks as tab content.', 'jankx');
    }

    /**
     * {@inheritdoc}
     */
    public function getEditorSettings(array $context = []): array
    {
        $settings = parent::getEditorSettings($context);
        $settings['supports'] = [
            'customTitle' => true,
            'customContent' => true,
            'icon' => true,
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

        $index = $context['tab_index'] ?? null;
        if ($index !== null) {
            return sprintf(__('Tab %d', 'jankx'), ((int) $index) + 1);
        }

        return __('Tab', 'jankx');
    }
}


