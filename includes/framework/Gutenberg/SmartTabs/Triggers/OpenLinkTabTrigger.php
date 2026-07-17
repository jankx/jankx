<?php

namespace Jankx\Gutenberg\SmartTabs\Triggers;

use Jankx\Gutenberg\SmartTabs\AbstractSmartTabTrigger;

class OpenLinkTabTrigger extends AbstractSmartTabTrigger
{
    public function getKey(): string
    {
        return 'open-link';
    }

    public function getLabel(): string
    {
        return __('Open Link', 'jankx');
    }

    public function getDescription(): string
    {
        return __('Clicking this tab opens a link. No tab content is displayed.', 'jankx');
    }

    public function getEditorSettings(array $context = []): array
    {
        $settings = parent::getEditorSettings($context);
        $settings['supports'] = [
            'customTitle' => true,
            'customContent' => false,
            'icon' => true,
        ];
        $settings['previewTitle'] = __('Link', 'jankx');
        // Note: editor does not render dynamic schema yet; UI handled in edit.tsx
        $settings['settingsSchema'] = [
            [
                'key' => 'url',
                'type' => 'string',
                'label' => __('URL', 'jankx'),
            ],
            [
                'key' => 'target',
                'type' => 'string',
                'label' => __('Target', 'jankx'),
                'enum' => ['_self', '_blank'],
                'default' => '_self',
            ],
            [
                'key' => 'rel',
                'type' => 'string',
                'label' => __('Rel', 'jankx'),
            ],
        ];
        return $settings;
    }

    public function prepareAttributes(array $attributes): array
    {
        $settings = isset($attributes['triggerSettings']) && is_array($attributes['triggerSettings'])
            ? $attributes['triggerSettings']
            : [];

        // Normalise settings
        $url = isset($settings['url']) ? (string) $settings['url'] : '';
        $target = isset($settings['target']) ? (string) $settings['target'] : '_self';
        $rel = isset($settings['rel']) ? (string) $settings['rel'] : '';

        // Basic sanitization
        $url = esc_url_raw($url);
        $target = in_array($target, ['_self', '_blank'], true) ? $target : '_self';
        $rel = trim($rel);

        $attributes['triggerSettings'] = [
            'url' => $url,
            'target' => $target,
            'rel' => $rel,
        ];

        return $attributes;
    }

    public function resolveTitle(string $baseTitle, array $attributes, array $context = []): string
    {
        if (!empty($baseTitle)) {
            return (string) $baseTitle;
        }
        return __('Link', 'jankx');
    }

    public function filterContent(string $content, array $attributes, array $context = []): string
    {
        // No content for open-link trigger
        return '';
    }
}

