<?php
namespace Jankx\Gutenberg\Blocks;
use Jankx\Gutenberg\Block;
class TestimonialsBlock extends Block
{
    protected $blockId = 'jankx/testimonials';
    public function render($attributes, $content = '', $block = null)
    {
        $layout = $attributes['layout'] ?? 'default';
        $className = $attributes['className'] ?? '';
        $anchor = $attributes['anchor'] ?? '';
        $slides = isset($attributes['slidesPerView']) ? intval($attributes['slidesPerView']) : 1;
        $spaceBetween = isset($attributes['spaceBetween']) ? intval($attributes['spaceBetween']) : 30;
        $loop = !empty($attributes['loop']);
        $autoplay = !empty($attributes['autoplay']);
        $autoplayDelay = isset($attributes['autoplayDelay']) ? intval($attributes['autoplayDelay']) : 3000;
        $navigation = !empty($attributes['navigation']);
        $pagination = !empty($attributes['pagination']);
        $height = isset($attributes['height']) ? intval($attributes['height']) : 50;
        $minHeight = isset($attributes['minHeight']) ? intval($attributes['minHeight']) : 50;
        $wrapperAttributes = [];
        if (!empty($anchor)) {
            $wrapperAttributes['id'] = esc_attr($anchor);
        }
        $wrapper = get_block_wrapper_attributes($wrapperAttributes);
        $classes = 'jankx-testimonials-container layout-' . esc_attr($layout);
        if (!empty($className)) {
            $classes = trim($classes . ' ' . esc_attr($className));
        }
        if (preg_match('/class=["\']([^"\']*)["\']/', $wrapper, $matches)) {
            $existing = trim($matches[1]);
            $all = trim($existing . ' ' . $classes);
            $wrapper = preg_replace('/class=["\'][^"\']*["\']/', 'class="' . esc_attr($all) . '"', $wrapper);
        } else {
            $wrapper .= ' class="' . esc_attr($classes) . '"';
        }
        if ($layout === 'carousel' || $layout === 'banner') {
            $style = sprintf('--swiper-height:%dpx; --swiper-min-height:%dpx;', $height, $minHeight);
            $containerAttrs = sprintf(
                'data-slides-per-view="%s" data-space-between="%s" data-loop="%s" data-autoplay="%s" data-autoplay-delay="%s" data-navigation="%s" data-pagination="%s" data-swiper-height="%s"',
                esc_attr($slides),
                esc_attr($spaceBetween),
                $loop ? 'true' : 'false',
                $autoplay ? 'true' : 'false',
                esc_attr($autoplayDelay),
                $navigation ? 'true' : 'false',
                $pagination ? 'true' : 'false',
                intval($height)
            );
            return sprintf(
                '<div %s style="%s"><div class="swiper" %s><div class="swiper-wrapper">%s</div>%s%s</div></div>',
                $wrapper,
                esc_attr($style),
                $containerAttrs,
                $content,
                $navigation ? '<div class="swiper-button-prev"></div><div class="swiper-button-next"></div>' : '',
                $pagination ? '<div class="swiper-pagination"></div>' : ''
            );
        }
        return sprintf('<div %s>%s</div>', $wrapper, $content);
    }
}
