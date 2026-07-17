<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class SafeIframeBlock extends Block
{
    protected $blockId = 'jankx/safe-iframe';

    public function render($attributes, $content = '', $block = null)
    {
        $url = $attributes['url'] ?? '';

        // Security: Validate URL
        if (empty($url) || !filter_var($url, FILTER_VALIDATE_URL)) {
            return sprintf(
                '<div class="safe-iframe-block safe-iframe-error">
                    <p>%s</p>
                </div>',
                esc_html__('Invalid iframe URL', 'jankx')
            );
        }

        $title = $attributes['title'] ?? 'Embedded Content';
        $width = $attributes['width'] ?? '100%';
        $height = $attributes['height'] ?? '500px';
        $aspectRatio = $attributes['aspectRatio'] ?? '';
        $useAspectRatio = $attributes['useAspectRatio'] ?? false;
        $allowFullscreen = $attributes['allowFullscreen'] ?? true;
        $loading = $attributes['loading'] ?? 'lazy';
        $sandbox = $attributes['sandbox'] ?? ['allow-scripts', 'allow-same-origin'];
        $allow = $attributes['allow'] ?? '';
        $borderRadius = $attributes['borderRadius'] ?? 0;
        $showBorder = $attributes['showBorder'] ?? false;
        $borderWidth = $attributes['borderWidth'] ?? 1;
        $borderColor = $attributes['borderColor'] ?? '#ddd';
        $showShadow = $attributes['showShadow'] ?? false;
        $customCSS = $attributes['customCSS'] ?? '';

        // Build iframe styles
        $iframeStyles = [];
        if ($useAspectRatio) {
            $iframeStyles[] = 'width: 100%';
            $iframeStyles[] = 'height: 100%';
        } else {
            $iframeStyles[] = sprintf('width: %s', esc_attr($width));
            $iframeStyles[] = sprintf('height: %s', esc_attr($height));
        }

        if ($showBorder) {
            $iframeStyles[] = sprintf(
                'border: %dpx solid %s',
                absint($borderWidth),
                esc_attr($borderColor)
            );
        } else {
            $iframeStyles[] = 'border: none';
        }

        if ($borderRadius > 0) {
            $iframeStyles[] = sprintf('border-radius: %dpx', absint($borderRadius));
        }

        if ($showShadow) {
            $iframeStyles[] = 'box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1)';
        }

        // Build container styles for aspect ratio
        $containerStyles = [];
        $containerClasses = ['safe-iframe-block'];

        if ($useAspectRatio && !empty($aspectRatio)) {
            $containerStyles[] = 'position: relative';
            $containerStyles[] = 'width: 100%';
            $containerStyles[] = sprintf('padding-bottom: calc(100%% / (%s))', esc_attr($aspectRatio));
            $containerClasses[] = 'safe-iframe-block--aspect-ratio';
        }

        // Build iframe attributes
        $iframeAttrs = [
            'src' => esc_url($url),
            'title' => esc_attr($title),
            'style' => implode('; ', $iframeStyles),
            'loading' => esc_attr($loading),
        ];

        // Add sandbox attribute
        if (!empty($sandbox) && is_array($sandbox)) {
            $iframeAttrs['sandbox'] = esc_attr(implode(' ', $sandbox));
        }

        // Add allow attribute
        if (!empty($allow)) {
            $iframeAttrs['allow'] = esc_attr($allow);
        }

        // Add allowfullscreen attribute
        if ($allowFullscreen) {
            $iframeAttrs['allowfullscreen'] = 'allowfullscreen';
        }

        // Build iframe HTML
        $iframeHtml = '<iframe';
        foreach ($iframeAttrs as $key => $value) {
            if ($key === 'allowfullscreen') {
                $iframeHtml .= ' ' . $key;
            } else {
                $iframeHtml .= sprintf(' %s="%s"', $key, $value);
            }
        }
        $iframeHtml .= '></iframe>';

        // Wrap in aspect ratio container if needed
        if ($useAspectRatio && !empty($aspectRatio)) {
            $innerContainerStyles = 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;';
            $iframeHtml = sprintf(
                '<div style="%s">%s</div>',
                esc_attr($innerContainerStyles),
                $iframeHtml
            );
        }

        // Build wrapper attributes
        $wrapperAttrs = get_block_wrapper_attributes([
            'class' => implode(' ', $containerClasses),
            'style' => !empty($containerStyles) ? implode('; ', $containerStyles) : null,
        ]);

        // Add custom CSS if provided
        $customCSSHtml = '';
        if (!empty($customCSS)) {
            $customCSSHtml = sprintf('<style>%s</style>', wp_kses_post($customCSS));
        }

        return sprintf(
            '<div %s>%s%s</div>',
            $wrapperAttrs,
            $iframeHtml,
            $customCSSHtml
        );
    }
}
