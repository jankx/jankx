<?php

namespace Jankx\Layouts\DynamicDataLayout\ContentLoopLayouts;

class HeroOverlayItemLayout extends AbstractContentLoopLayout
{
    public function getName(): string
    {
        return 'hero-overlay';
    }

    public function getTitle(): string
    {
        return 'Hero Overlay';
    }

    public function getSupportedOptions(): array
    {
        return [
            'heroMinHeight',
            'heroOverlayGradient',
            'heroFallbackBackground',
            'heroBorderRadius',
            'heroContentPadding',
        ];
    }

    public function getDefaultTemplate(string $postType): array
    {
        return [
            ['core/post-featured-image', []],
            ['core/post-title', ['isLink' => true]],
            ['jankx/human-readable-post-date', []]
        ];
    }

    public function renderItem(string $content, array $attributes, array $options = []): string
    {
        // The content here is just a placeholder, the generator will handle correctly
        // by calling specific methods if we implement them, or we call this at the end.
        return $content;
    }

    /**
     * Special rendering for Hero Overlay
     */
    public function renderHeroOverlay(string $imageHtml, string $contentHtml, array $attrs): string
    {
        $minHeight       = $attrs['heroMinHeight']         ?? '320px';
        $fallbackBg      = $attrs['heroFallbackBackground'] ?? 'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)';
        $borderRadius    = $attrs['heroBorderRadius']       ?? '12px';
        $overlayGradient = $attrs['heroOverlayGradient']   ?? 'linear-gradient(to top,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.45) 45%,transparent 100%)';
        $contentPadding  = $attrs['heroContentPadding']    ?? '30px 24px 24px';

        $boxStyle  = 'position:relative;overflow:hidden;display:flex;align-items:flex-end;height:100%;';
        $boxStyle .= 'min-height:' . $minHeight . ';';
        $boxStyle .= 'background:' . $fallbackBg . ';';
        $boxStyle .= 'border-radius:' . $borderRadius . ';';
        $boxStyle .= '--jankx-hero-overlay-gradient:' . $overlayGradient . ';';

        $contentStyle = 'width:100%;padding:' . $contentPadding . ';pointer-events:none;';

        return sprintf(
            '<div class="jankx-hero-overlay-box" style="%s">%s<div class="jankx-hero-content" style="%s"><div style="pointer-events:auto;">%s</div></div></div>',
            esc_attr($boxStyle),
            sprintf('<div class="jankx-hero-image">%s</div>', $imageHtml),
            esc_attr($contentStyle),
            $contentHtml
        );
    }
}
