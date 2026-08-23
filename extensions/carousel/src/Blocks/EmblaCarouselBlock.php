<?php

namespace Jankx\Extensions\Carousel\Blocks;

class EmblaCarouselBlock
{
    protected $attributes;
    protected $content;

    public function __construct($attributes, $content)
    {
        $this->attributes = $attributes;
        $this->content = $content;
    }

    public function render(): string
    {
        $atts = $this->attributes;

        $wrapper_attrs = [
            'class' => $this->get_wrapper_classes(),
            'style' => $this->get_wrapper_style(),
            'data-variant' => esc_attr($atts['variant'] ?? 'banner'),
            'data-loop' => esc_attr(($atts['loop'] ?? true) ? 'true' : 'false'),
            'data-align' => esc_attr($atts['align'] ?? 'center'),
            'data-drag-free' => esc_attr(($atts['dragFree'] ?? false) ? 'true' : 'false'),
            'data-draggable' => esc_attr(($atts['draggable'] ?? true) ? 'true' : 'false'),
            'data-keyboard' => esc_attr(($atts['keyboardNavigation'] ?? true) ? 'true' : 'false'),
            'data-parallax' => esc_attr(($atts['parallaxDrag'] ?? true) ? 'true' : 'false'),
            'data-transition' => esc_attr($atts['transitionType'] ?? 'slide'),
            'data-duration' => esc_attr($atts['duration'] ?? 25),
            'data-autoplay' => esc_attr(($atts['autoplay'] ?? true) ? 'true' : 'false'),
            'data-autoplay-delay' => esc_attr($atts['autoplayDelay'] ?? 4500),
            'data-stop-on-interaction' => esc_attr(($atts['stopOnInteraction'] ?? true) ? 'true' : 'false'),
            'data-stop-on-hover' => esc_attr(($atts['stopOnMouseEnter'] ?? true) ? 'true' : 'false'),
            'data-show-arrows' => esc_attr(($atts['showArrows'] ?? true) ? 'true' : 'false'),
            'data-arrow-style' => esc_attr($atts['arrowStyle'] ?? 'round'),
            'data-show-dots' => esc_attr(($atts['showDots'] ?? true) ? 'true' : 'false'),
            'data-dot-type' => esc_attr($atts['dotType'] ?? 'bullets'),
            'data-show-progress' => esc_attr(($atts['showProgress'] ?? true) ? 'true' : 'false'),
            'data-slides-per-view' => esc_attr($atts['slidesPerView'] ?? 3),
            'data-gap' => esc_attr($atts['gap'] ?? 20),
            'data-border-radius' => esc_attr($atts['borderRadius'] ?? 16),
        ];

        $wrapper_style = $this->get_wrapper_style();

        $html = '<div ' . $this->build_attrs($wrapper_attrs) . '>';

        $html .= '<div class="embla-carousel__viewport">';
        $html .= '<div class="embla-carousel__container">';
        $html .= $this->content;
        $html .= '</div>';
        $html .= '</div>';

        $html .= $this->render_navigation();

        $html .= '</div>';

        return $html;
    }

    protected function get_wrapper_classes(): string
    {
        $classes = ['wp-block-jankx-embla-carousel'];

        $show_shadow = $this->attributes['showShadow'] ?? true;
        if (!$show_shadow) {
            $classes[] = 'shadow-none';
        }

        return implode(' ', array_map('esc_attr', $classes));
    }

    protected function get_wrapper_style(): string
    {
        $atts = $this->attributes;
        $styles = [];

        // Container
        $styles[] = "--embla-gap: " . ($atts['gap'] ?? 20) . "px";
        $styles[] = "--embla-border-radius: " . ($atts['borderRadius'] ?? 16) . "px";

        // Arrow
        $arrow_size = $atts['arrowSize'] ?? 44;
        $arrow_bg = $atts['arrowBgColor'] ?? '#000000';
        $arrow_bg_opacity = ($atts['arrowBgOpacity'] ?? 40) / 100;
        $arrow_color = $atts['arrowColor'] ?? '#ffffff';
        $arrow_border = $atts['arrowBorderColor'] ?? '#ffffff';
        $arrow_border_opacity = ($atts['arrowBorderOpacity'] ?? 20) / 100;
        $styles[] = "--embla-arrow-size: {$arrow_size}px";
        $styles[] = "--embla-arrow-bg: " . $this->hex_to_rgba($arrow_bg, $arrow_bg_opacity);
        $styles[] = "--embla-arrow-color: {$arrow_color}";
        $styles[] = "--embla-arrow-border: " . $this->hex_to_rgba($arrow_border, $arrow_border_opacity);

        // Dots
        $dot_size = $atts['dotSize'] ?? 8;
        $dot_color = $atts['dotColor'] ?? '#000000';
        $dot_opacity = ($atts['dotColorOpacity'] ?? 20) / 100;
        $dot_active = $atts['dotActiveColor'] ?? '#1e293b';
        $dot_active_width = $atts['dotActiveWidth'] ?? 24;
        $styles[] = "--embla-dot-size: {$dot_size}px";
        $styles[] = "--embla-dot-color: " . $this->hex_to_rgba($dot_color, $dot_opacity);
        $styles[] = "--embla-dot-active-color: {$dot_active}";
        $styles[] = "--embla-dot-active-width: {$dot_active_width}px";

        // Progress bar
        $progress_height = $atts['progressHeight'] ?? 4;
        $track_color = $atts['progressTrackColor'] ?? '#ffffff';
        $track_opacity = ($atts['progressTrackOpacity'] ?? 20) / 100;
        $bar_color = $atts['progressBarColor'] ?? '#16a34a';
        $styles[] = "--embla-progress-height: {$progress_height}px";
        $styles[] = "--embla-progress-track: " . $this->hex_to_rgba($track_color, $track_opacity);
        $styles[] = "--embla-progress-bar: {$bar_color}";

        // Shadow
        $shadow_color = $atts['shadowColor'] ?? '#0f172a';
        $show_shadow = $atts['showShadow'] ?? true;
        if ($show_shadow) {
            $intensity = $atts['shadowIntensity'] ?? 3;
            $shadow_rgb = $this->hex_to_rgb($shadow_color);
            $opacities = [0.10, 0.15, 0.20, 0.30, 0.35];
            $alpha = $opacities[$intensity - 1] ?? 0.20;
            $styles[] = "--embla-shadow: 0 4px 6px -1px rgba({$shadow_rgb}, {$alpha})";
        }

        return implode('; ', $styles);
    }

    protected function hex_to_rgba(string $hex, float $alpha = 1.0): string
    {
        $hex = ltrim($hex, '#');
        if (strlen($hex) === 3) {
            $hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
        }
        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));
        return "rgba({$r}, {$g}, {$b}, {$alpha})";
    }

    protected function hex_to_rgb(string $hex): string
    {
        $hex = ltrim($hex, '#');
        if (strlen($hex) === 3) {
            $hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
        }
        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));
        return "{$r}, {$g}, {$b}";
    }

    protected function render_navigation(): string
    {
        $html = '';
        $atts = $this->attributes;

        $show_arrows = $atts['showArrows'] ?? true;
        $show_dots = $atts['showDots'] ?? true;
        $show_progress = $atts['showProgress'] ?? true;
        $arrow_style = $atts['arrowStyle'] ?? 'round';
        $dot_type = $atts['dotType'] ?? 'bullets';

        if ($show_progress) {
            $html .= '<div class="embla-carousel__progress">';
            $html .= '<div class="embla-carousel__progress-bar" data-embla-progress></div>';
            $html .= '</div>';
        }

        if ($show_arrows) {
            $html .= '<button class="embla-carousel__arrow embla-carousel__arrow--prev" data-embla-prev aria-label="Previous slide">';
            $html .= '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>';
            $html .= '</button>';
            $html .= '<button class="embla-carousel__arrow embla-carousel__arrow--next" data-embla-next aria-label="Next slide">';
            $html .= '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>';
            $html .= '</button>';
        }

        if ($show_dots) {
            $html .= '<div class="embla-carousel__dots" data-embla-dots data-dot-type="' . esc_attr($dot_type) . '">';
            $html .= '</div>';
        }

        return $html;
    }

    protected function build_attrs(array $attrs): string
    {
        $html = '';
        foreach ($attrs as $key => $value) {
            if ($value === '' || $value === null) {
                continue;
            }
            $html .= ' ' . $key . '="' . $value . '"';
        }
        return $html;
    }
}
