<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class FloatingMessengersBlock extends Block
{
    protected $blockId = 'jankx/floating-messengers';

    public function render($attributes, $content = '')
    {
        $position = $attributes['position'] ?? 'right';
        $bottom = $attributes['bottomOffset'] ?? '24px';
        $showLabels = !empty($attributes['showLabels']);
        $triggerMode = $attributes['triggerMode'] ?? 'toggle';
        $channels = is_array($attributes['channels'] ?? null) ? $attributes['channels'] : [];

        $classes = [
            'jankx-floating-messengers',
            'position-' . ($position === 'left' ? 'left' : 'right'),
            'trigger-' . ($triggerMode === 'always' ? 'always' : 'toggle'),
        ];
        if ($showLabels) {
            $classes[] = 'show-labels';
        }

        $itemsHtml = '';
        foreach (['messenger', 'whatsapp', 'zalo', 'telegram', 'phone', 'sms'] as $type) {
            $conf = is_array($channels[$type] ?? null) ? $channels[$type] : [];
            if (empty($conf['enabled'])) {
                continue;
            }
            $href = $this->buildUrl($type, $conf);
            $label = !empty($conf['label']) ? $conf['label'] : $this->defaultLabel($type);
            $itemsHtml .= sprintf(
                '<a class="fm-item fm-%1$s" href="%2$s" target="_blank" rel="noopener"><span class="fm-icon"></span>%3$s</a>',
                esc_attr($type),
                esc_url($href),
                $showLabels ? sprintf('<span class="fm-label">%s</span>', esc_html($label)) : ''
            );
        }

        $triggerHtml = $triggerMode === 'toggle'
            ? '<button class="fm-trigger" type="button" aria-label="Toggle contacts">+</button>'
            : '';

        return sprintf(
            '<div class="%1$s" style="bottom:%2$s">%3$s<div class="fm-list">%4$s</div></div>',
            esc_attr(implode(' ', $classes)),
            esc_attr($bottom),
            $triggerHtml,
            $itemsHtml
        );
    }

    protected function defaultLabel(string $type): string
    {
        switch ($type) {
            case 'messenger': return 'Messenger';
            case 'whatsapp': return 'WhatsApp';
            case 'zalo': return 'Zalo';
            case 'telegram': return 'Telegram';
            case 'phone': return 'Gọi';
            case 'sms': return 'SMS';
            default: return ucfirst($type);
        }
    }

    protected function buildUrl(string $type, array $conf): string
    {
        switch ($type) {
            case 'messenger':
                if (!empty($conf['pageId'])) {
                    return 'https://m.me/' . rawurlencode($conf['pageId']);
                }
                return '#';
            case 'whatsapp':
                if (!empty($conf['phone'])) {
                    return 'https://wa.me/' . preg_replace('/\D+/', '', $conf['phone']);
                }
                return '#';
            case 'zalo':
                if (!empty($conf['phone'])) {
                    return 'https://zalo.me/' . preg_replace('/\D+/', '', $conf['phone']);
                }
                return '#';
            case 'telegram':
                if (!empty($conf['username'])) {
                    $username = ltrim((string) $conf['username'], '@');
                    return 'https://t.me/' . rawurlencode($username);
                }
                return '#';
            case 'phone':
                if (!empty($conf['phone'])) {
                    return 'tel:' . preg_replace('/\s+/', '', $conf['phone']);
                }
                return '#';
            case 'sms':
                if (!empty($conf['phone'])) {
                    return 'sms:' . preg_replace('/\s+/', '', $conf['phone']);
                }
                return '#';
        }
        return '#';
    }
}

