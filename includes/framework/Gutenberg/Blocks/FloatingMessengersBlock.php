<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class FloatingMessengersBlock extends Block
{
    protected $blockId = 'jankx/floating-messengers';

    public function render($attributes, $content = '')
    {
        $position = $attributes['position'] ?? 'right';
        $bottomOffset = $attributes['bottomOffset'] ?? '24px';
        $showLabels = !empty($attributes['showLabels']);
        $triggerMode = $attributes['triggerMode'] ?? 'toggle';
        $channels = is_array($attributes['channels'] ?? null) ? $attributes['channels'] : [];
        $expandStyle = $attributes['expandStyle'] ?? 'vertical';
        $verticalAlign = $attributes['verticalAlign'] ?? 'bottom';
        $expandDistance = isset($attributes['expandDistance']) ? (int)$attributes['expandDistance'] : 72;
        $idleAnimation = $attributes['idleAnimation'] ?? 'none';

        $classes = [
            'jankx-floating-messengers',
            'position-' . ($position === 'left' ? 'left' : 'right'),
            'trigger-' . ($triggerMode === 'always' ? 'always' : 'toggle'),
            'expand-' . (in_array($expandStyle, ['vertical','fan','bidirectional','split'], true) ? $expandStyle : 'vertical'),
            'v-' . ($verticalAlign === 'center' ? 'center' : 'bottom'),
        ];
        if ($showLabels) {
            $classes[] = 'show-labels';
        }
        if ($idleAnimation !== 'none' && in_array($idleAnimation, ['pulse-ring','wiggle','float'], true)) {
            $classes[] = 'idle-' . $idleAnimation;
        }

        $itemsHtml = '';
        $enabledCount = 0;
        foreach (['messenger', 'whatsapp', 'zalo', 'telegram', 'phone', 'sms'] as $type) {
            $conf = is_array($channels[$type] ?? null) ? $channels[$type] : [];
            if (empty($conf['enabled'])) {
                continue;
            }
            $enabledCount++;
            $href = $this->buildUrl($type, $conf);
            $label = !empty($conf['label']) ? $conf['label'] : $this->defaultLabel($type);
            $itemsHtml .= sprintf(
                '<div class="fm-node fm-%1$s"><a class="fm-button" href="%2$s" target="_blank" rel="noopener"><span class="fm-icon" aria-hidden="true"></span>%3$s</a></div>',
                esc_attr($type),
                esc_url($href),
                $showLabels ? sprintf('<span class="fm-label">%s</span>', esc_html($label)) : ''
            );
        }

        $triggerHtml = $triggerMode === 'toggle'
            ? '<button class="fm-trigger" type="button" aria-label="Toggle contacts"><span class="fm-trigger-dot"></span></button>'
            : '';

        $styleInline = '';
        if ($verticalAlign === 'bottom') {
            $styleInline = 'bottom:' . esc_attr($bottomOffset) . ';';
        } else {
            $styleInline = 'top:50%;transform:translateY(-50%);';
        }
        $styleInline .= '--fm-distance:' . esc_attr($expandDistance) . 'px;';

        // Show helpful placeholder when no channels enabled
        if ($enabledCount === 0) {
            $itemsHtml = '<div class="fm-placeholder">' . esc_html__('Chọn kênh liên hệ trong panel bên phải', 'jankx') . '</div>';
        }

        return sprintf(
            '<div class="%1$s" style="%2$s" data-count="%5$d">%3$s<div class="fm-list">%4$s</div></div>',
            esc_attr(implode(' ', $classes)),
            $styleInline,
            $triggerHtml,
            $itemsHtml,
            (int)$enabledCount
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
