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
            'heroOverlayGradient',
            'heroFallbackBackground',
            'heroBorderRadius',
            'heroContentPadding',
            'heroMinHeight',
            'heroAspectRatio',
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
     * Normalise a user supplied ratio ("16:9", "16 / 9") into the CSS
     * aspect-ratio syntax. Returns an empty string when nothing usable is left.
     */
    private function normalizeAspectRatio($value): string
    {
        $raw = is_scalar($value) ? trim((string) $value) : '';
        if ($raw === '') {
            return '';
        }

        $normalized = str_replace(':', '/', $raw);
        $normalized = preg_replace('#\s*/\s*#', '/', $normalized);

        return is_string($normalized) && $normalized !== '' ? $normalized : '';
    }

    /**
     * Special rendering for Hero Overlay
     */
    public function renderHeroOverlay(string $imageHtml, string $contentHtml, array $attrs): string
    {
        $fallbackBg      = $attrs['heroFallbackBackground'] ?? 'linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)';
        $borderRadius    = $attrs['heroBorderRadius']       ?? '';
        $overlayGradient = $attrs['heroOverlayGradient']   ?? 'linear-gradient(to top,rgba(0,0,0,0.88) 0%,rgba(0,0,0,0.45) 45%,transparent 100%)';
        $contentPadding  = $attrs['heroContentPadding']    ?? '5px 10px';
        $minHeight       = is_scalar($attrs['heroMinHeight'] ?? null) ? trim((string) $attrs['heroMinHeight']) : '';
        $aspectRatio     = $this->normalizeAspectRatio($attrs['heroAspectRatio'] ?? null);

        // height:100% would defeat aspect-ratio, so only stretch when no ratio
        // is requested.
        $boxStyle  = 'position:relative;overflow:hidden;display:flex;align-items:flex-end;';
        $boxStyle .= $aspectRatio === '' ? 'height:100%;' : 'height:auto;width:100%;';
        $boxStyle .= 'background:' . $fallbackBg . ';';
        if (!empty($borderRadius)) {
            $boxStyle .= 'border-radius:' . $borderRadius . ';';
        }
        if ($minHeight !== '') {
            $boxStyle .= 'min-height:' . $minHeight . ';';
        }
        if ($aspectRatio !== '') {
            $boxStyle .= 'aspect-ratio:' . $aspectRatio . ';';
        }
        $boxStyle .= '--jankx-hero-overlay-gradient:' . $overlayGradient . ';';

        $contentStyle = 'width:100%;padding:' . $contentPadding . ';pointer-events:none;';

        return sprintf(
            '<div class="jankx-hero-overlay-box" style="%s">%s<div class="jankx-hero-content" style="%s"><div style="pointer-events:auto;">%s</div></div></div>',
            esc_attr($boxStyle),
            $imageHtml,
            esc_attr($contentStyle),
            $contentHtml
        );
    }
}
