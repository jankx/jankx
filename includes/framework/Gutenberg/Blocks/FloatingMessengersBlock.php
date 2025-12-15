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
            $iconSvg = '';
            if (!empty($conf['iconSvg']) && is_string($conf['iconSvg'])) {
                $iconSvg = $this->sanitizeSvg($conf['iconSvg']);
            } else {
                $iconSvg = $this->defaultIconSvg($type);
            }
            $itemsHtml .= sprintf(
                '<div class="fm-node fm-%1$s"><a class="fm-button" href="%2$s" target="_blank" rel="noopener"><span class="fm-icon" aria-hidden="true">%4$s</span>%3$s</a></div>',
                esc_attr($type),
                esc_url($href),
                $showLabels ? sprintf('<span class="fm-label">%s</span>', esc_html($label)) : '',
                $iconSvg
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

    protected function defaultIconSvg(string $type): string
    {
        switch ($type) {
            case 'messenger':
                return '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M12 2C6.48 2 2 6.09 2 10.91c0 2.73 1.41 5.18 3.67 6.87v3.22l3.36-1.85c.93.26 1.92.4 2.97.4 5.52 0 10-4.09 10-8.91S17.52 2 12 2zm1.23 10.46l-2.1-2.23-4.1 2.23 4.51-4.87 2.15 2.23 4.03-2.23-4.49 4.87z"/></svg>';
            case 'whatsapp':
                return '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M20.52 3.48A10.69 10.69 0 0012 0C5.37 0 0 5.37 0 12c0 2.1.56 4.16 1.62 5.97L0 24l6.2-1.63A11.97 11.97 0 0012 24c6.63 0 12-5.37 12-12 0-3.21-1.25-6.22-3.48-8.52zm-8.52 18.3c-1.9 0-3.76-.5-5.38-1.45l-.38-.22-3.69.97.99-3.59-.25-.37A9.47 9.47 0 012.56 12C2.56 6.74 6.74 2.56 12 2.56c2.52 0 4.89.98 6.67 2.77a9.41 9.41 0 012.77 6.67c0 5.26-4.18 9.44-9.44 9.44zm5.48-6.96c-.3-.15-1.77-.87-2.05-.96-.28-.1-.48-.15-.68.15-.2.3-.78.95-.96 1.15-.18.2-.35.23-.65.08-.3-.15-1.26-.46-2.4-1.46-.89-.79-1.49-1.77-1.67-2.07-.18-.3-.02-.47.13-.62.13-.13.3-.35.45-.53.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.68-1.65-.94-2.26-.25-.6-.5-.52-.68-.53l-.58-.01c-.2 0-.53.08-.82.38-.3.3-1.08 1.06-1.08 2.58 0 1.51 1.11 2.97 1.26 3.18.15.2 2.18 3.34 5.27 4.54.74.32 1.32.5 1.77.64.74.23 1.41.2 1.94.12.59-.09 1.77-.72 2.02-1.41.25-.69.25-1.28.18-1.41-.07-.13-.27-.2-.58-.34z"/></svg>';
            case 'zalo':
                return '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M4 3h12a5 5 0 015 5v8a5 5 0 01-5 5H4a1 1 0 01-1-1V4a1 1 0 011-1zm3.5 6.5h-2V17h2V9.5zm1.5 0V17h5v-1.5h-3.5V9.5H9zm9.5 0H16V17h2v-4h1.5V9.5z"/></svg>';
            case 'telegram':
                return '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M23.5 2.5L1.5 11.2c-1 .4-.9 1.8.2 2.1l5.5 1.7 2.1 6.7c.3 1 1.6 1.2 2.2.2l3.3-5.2 5.8 4.3c1 .7 2.3.1 2.6-1.1l3.2-15c.3-1.2-1-2.1-2.1-1.6z"/></svg>';
            case 'phone':
                return '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M6.6 10.2c1.2 2.4 3.1 4.3 5.5 5.5l1.8-1.8c.4-.4 1-.5 1.5-.3 1.6.5 3.3.8 5.1.8.8 0 1.5.7 1.5 1.5V20c0 .8-.7 1.5-1.5 1.5C10.7 21.5 2.5 13.3 2.5 3.5 2.5 2.7 3.2 2 4 2h3.6c.8 0 1.5.7 1.5 1.5 0 1.8.3 3.5.8 5.1.2.5.1 1.1-.3 1.5l-2 2.1z"/></svg>';
            case 'sms':
                return '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M20 2H4C2.9 2 2 2.9 2 4v14c0 1.1.9 2 2 2h4l4 4 4-4h4c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 10H6v-2h12v2zm0-4H6V6h12v2zm-6 8H6v-2h6v2z"/></svg>';
            default:
                return '';
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

    protected function sanitizeSvg(string $svg): string
    {
        $allowed = [
            'svg' => [
                'viewBox' => true,
                'width' => true,
                'height' => true,
                'xmlns' => true,
                'fill' => true,
                'stroke' => true,
                'aria-hidden' => true,
                'style' => true,
                'class' => true,
            ],
            'g' => [
                'fill' => true,
                'stroke' => true,
                'opacity' => true,
                'clip-path' => true,
                'transform' => true,
            ],
            'path' => [
                'fill' => true,
                'stroke' => true,
                'd' => true,
                'opacity' => true,
                'fill-rule' => true,
                'clip-rule' => true,
                'transform' => true,
            ],
            'circle' => [
                'cx' => true,
                'cy' => true,
                'r' => true,
                'fill' => true,
                'stroke' => true,
                'opacity' => true,
            ],
            'rect' => [
                'x' => true,
                'y' => true,
                'width' => true,
                'height' => true,
                'rx' => true,
                'ry' => true,
                'fill' => true,
                'stroke' => true,
                'opacity' => true,
            ],
            'polygon' => [
                'points' => true,
                'fill' => true,
                'stroke' => true,
                'opacity' => true,
            ],
            'polyline' => [
                'points' => true,
                'fill' => true,
                'stroke' => true,
                'opacity' => true,
            ],
            'defs' => [],
            'clippath' => [
                'id' => true,
            ],
            'lineargradient' => [
                'id' => true,
                'x1' => true,
                'y1' => true,
                'x2' => true,
                'y2' => true,
                'gradientunits' => true,
                'gradienttransform' => true,
            ],
            'radialgradient' => [
                'id' => true,
                'cx' => true,
                'cy' => true,
                'r' => true,
                'fx' => true,
                'fy' => true,
                'gradientunits' => true,
                'gradienttransform' => true,
            ],
            'stop' => [
                'offset' => true,
                'stop-color' => true,
                'stop-opacity' => true,
            ],
        ];
        return wp_kses($svg, $allowed);
    }
}
