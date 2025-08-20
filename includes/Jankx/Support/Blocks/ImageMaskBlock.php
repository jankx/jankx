<?php

namespace Jankx\Support\Blocks;

use Jankx\Support\Blocks\Block;

/**
 * Image Mask Block
 * 
 * Renders image with creative mask effects like wave, corner blend, etc.
 */
class ImageMaskBlock extends Block
{
    protected $blockName = 'jankx/image-mask';

    public function register()
    {
        parent::register();
        
        // Enqueue custom CSS
        $this->enqueueCustomCSS();
    }

    protected function enqueueCustomCSS()
    {
        // Frontend CSS
        wp_enqueue_style(
            'jankx-image-mask',
            jankx_asset_url('blocks/image-mask/style.css'),
            [],
            jankx_version()
        );

        // Editor CSS
        wp_enqueue_style(
            'jankx-image-mask-editor',
            jankx_asset_url('blocks/image-mask/editor.css'),
            [],
            jankx_version()
        );
    }

    public function render($attributes, $content = '')
    {
        $imageId = $attributes['imageId'] ?? null;
        $imageUrl = $attributes['imageUrl'] ?? '';
        $imageAlt = $attributes['imageAlt'] ?? '';
        $maskType = $attributes['maskType'] ?? 'wave';
        $waveDirection = $attributes['waveDirection'] ?? 'bottom';
        $waveHeight = $attributes['waveHeight'] ?? 50;
        $waveFrequency = $attributes['waveFrequency'] ?? 3;
        $cornerPosition = $attributes['cornerPosition'] ?? 'bottom-right';
        $cornerSize = $attributes['cornerSize'] ?? 100;
        $backgroundColor = $attributes['backgroundColor'] ?? '#ffffff';
        $customMask = $attributes['customMask'] ?? '';
        $className = $attributes['className'] ?? '';

        if (empty($imageUrl)) {
            return '<div class="image-mask-block image-mask-no-image">' . 
                   '<p>' . esc_html__('No image selected', 'jankx') . '</p>' .
                   '</div>';
        }

        // Build CSS variables for mask effects
        $maskStyles = sprintf(
            '--mask-type: %s; --wave-direction: %s; --wave-height: %dpx; --wave-frequency: %s; --corner-position: %s; --corner-size: %dpx; --background-color: %s;',
            esc_attr($maskType),
            esc_attr($waveDirection),
            intval($waveHeight),
            esc_attr($waveFrequency),
            esc_attr($cornerPosition),
            intval($cornerSize),
            esc_attr($backgroundColor)
        );

        $blockClasses = array_filter([
            'image-mask-block',
            'image-mask-' . $maskType,
            $className
        ]);

        $html = sprintf(
            '<div class="%s" style="%s">',
            esc_attr(implode(' ', $blockClasses)),
            $maskStyles
        );

        $html .= '<div class="image-mask-wrapper">';
        
        // Main image
        $html .= sprintf(
            '<img src="%s" alt="%s" class="image-mask-image" />',
            esc_url($imageUrl),
            esc_attr($imageAlt)
        );

        // Mask effect overlay
        $html .= sprintf(
            '<div class="image-mask-effect image-mask-%s"></div>',
            esc_attr($maskType)
        );

        // Background color overlay for seamless blend
        if ($maskType === 'corner') {
            $html .= sprintf(
                '<div class="image-mask-background" style="background-color: %s;"></div>',
                esc_attr($backgroundColor)
            );
        }

        $html .= '</div>'; // .image-mask-wrapper

        // Add custom mask if specified
        if ($maskType === 'custom' && !empty($customMask)) {
            $html .= sprintf(
                '<svg class="image-mask-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <defs>
                        <mask id="custom-mask-%d">
                            <path d="%s" fill="white"/>
                        </mask>
                    </defs>
                </svg>',
                $imageId,
                esc_attr($customMask)
            );
        }

        $html .= '</div>'; // .image-mask-block

        return $html;
    }

    /**
     * Generate CSS for mask effects
     */
    protected function generateMaskCSS()
    {
        $css = '';

        // Wave mask effect
        $css .= '
        .image-mask-wave .image-mask-effect {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            height: var(--wave-height);
            background: var(--background-color);
            mask: url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 100 20\'%3E%3Cpath d=\'M0,20 Q25,0 50,20 T100,20 L100,20 L0,20 Z\' fill=\'%23fff\'/%3E%3C/svg%3E");
            mask-size: calc(100% / var(--wave-frequency)) 100%;
            mask-repeat: repeat-x;
        }';

        // Corner blend effect
        $css .= '
        .image-mask-corner .image-mask-effect {
            position: absolute;
            width: var(--corner-size);
            height: var(--corner-size);
            background: var(--background-color);
        }
        
        .image-mask-corner.image-mask-bottom-right .image-mask-effect {
            bottom: 0;
            right: 0;
            clip-path: polygon(100% 0%, 0% 100%, 100% 100%);
        }
        
        .image-mask-corner.image-mask-bottom-left .image-mask-effect {
            bottom: 0;
            left: 0;
            clip-path: polygon(0% 0%, 0% 100%, 100% 100%);
        }
        
        .image-mask-corner.image-mask-top-right .image-mask-effect {
            top: 0;
            right: 0;
            clip-path: polygon(100% 0%, 0% 0%, 100% 100%);
        }
        
        .image-mask-corner.image-mask-top-left .image-mask-effect {
            top: 0;
            left: 0;
            clip-path: polygon(0% 0%, 100% 0%, 0% 100%);
        }';

        // Circle mask
        $css .= '
        .image-mask-circle .image-mask-effect {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            height: 80%;
            border-radius: 50%;
            background: var(--background-color);
            mask: radial-gradient(circle, transparent 30%, black 70%);
        }';

        // Triangle mask
        $css .= '
        .image-mask-triangle .image-mask-effect {
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 50px solid transparent;
            border-right: 50px solid transparent;
            border-bottom: 100px solid var(--background-color);
        }';

        return $css;
    }
}
