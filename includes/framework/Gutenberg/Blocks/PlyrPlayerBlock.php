<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class PlyrPlayerBlock extends Block
{
    protected $blockId = 'jankx/plyr-player';

    public function render($attributes, $content = '')
    {
        $mediaType = $attributes['mediaType'] ?? 'video';
        $mediaUrl = $attributes['mediaUrl'] ?? '';
        $posterUrl = $attributes['posterUrl'] ?? '';
        $autoplay = (bool) ($attributes['autoplay'] ?? false);
        $loop = (bool) ($attributes['loop'] ?? false);
        $muted = (bool) ($attributes['muted'] ?? false);
        $preload = $attributes['preload'] ?? 'metadata';
        $className = $attributes['className'] ?? '';

        $wrapperClasses = ['plyr-player-block'];
        if (!empty($className) && is_string($className)) {
            $wrapperClasses[] = $className;
        }

        $config = wp_json_encode([
            'autoplay' => $autoplay,
            'loop' => $loop,
            'muted' => $muted,
        ]);

        if (!is_string($mediaUrl) || trim($mediaUrl) === '') {
            return sprintf(
                '<div class="%s" data-plyr-block="1" data-plyr-config="%s"><div class="plyr-player__placeholder"><p>%s</p></div></div>',
                esc_attr(implode(' ', $wrapperClasses)),
                esc_attr($config),
                esc_html__('No media URL provided.', 'jankx')
            );
        }

        $attrs = sprintf(
            'class="plyr-player__media" controls preload="%s"',
            esc_attr($preload)
        );

        if ($autoplay) {
            $attrs .= ' autoplay';
        }
        if ($loop) {
            $attrs .= ' loop';
        }
        if ($muted) {
            $attrs .= ' muted';
        }

        if ($mediaType === 'audio') {
            $html = sprintf(
                '<audio %s src="%s"></audio>',
                $attrs,
                esc_url($mediaUrl)
            );
        } else {
            $posterAttr = '';
            if (is_string($posterUrl) && trim($posterUrl) !== '') {
                $posterAttr = sprintf(' poster="%s"', esc_url($posterUrl));
            }

            $html = sprintf(
                '<video %s src="%s"%s></video>',
                $attrs,
                esc_url($mediaUrl),
                $posterAttr
            );
        }

        return sprintf(
            '<div class="%s" data-plyr-block="1" data-plyr-config="%s">%s</div>',
            esc_attr(implode(' ', $wrapperClasses)),
            esc_attr($config),
            $html
        );
    }
}
