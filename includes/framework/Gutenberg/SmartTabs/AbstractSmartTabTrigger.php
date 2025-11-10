<?php

namespace Jankx\Gutenberg\SmartTabs;

/**
 * Base class for Smart Tab triggers.
 *
 * Provides sensible defaults for optional methods.
 */
abstract class AbstractSmartTabTrigger implements SmartTabTriggerInterface
{
    /**
     * {@inheritdoc}
     */
    public function isAvailable(array $context = []): bool
    {
        return true;
    }

    /**
     * {@inheritdoc}
     */
    public function getEditorSettings(array $context = []): array
    {
        return [
            'key' => $this->getKey(),
            'label' => $this->getLabel(),
            'description' => $this->getDescription(),
            'supports' => [
                'customTitle' => true,
                'customContent' => true,
                'icon' => true,
            ],
            'settingsSchema' => [],
        ];
    }

    /**
     * {@inheritdoc}
     */
    public function prepareAttributes(array $attributes): array
    {
        return $attributes;
    }

    /**
     * {@inheritdoc}
     */
    public function resolveTitle(string $baseTitle, array $attributes, array $context = []): string
    {
        if (!empty($baseTitle)) {
            return (string) $baseTitle;
        }

        return $this->getLabel();
    }

    /**
     * {@inheritdoc}
     */
    public function filterContent(string $content, array $attributes, array $context = []): string
    {
        return $content;
    }
}


