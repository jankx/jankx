<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Swiper Banner Block
 *
 * Banner slide for Swiper with customizable styles and links
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class SwiperBannerBlock extends Block
{
    protected $blockId = 'jankx/swiper-banner';

    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Render the banner block
     *
     * @param array $attributes Block attributes
     * @param string $content Block content (may contain old HTML structure with .swiper-banner__content)
     * @param \WP_Block $block Block instance
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '', $block = null)
    {
        $image_id = $attributes['imageId'] ?? 0;
        $image_url = $attributes['imageUrl'] ?? '';
        $image_alt = $attributes['imageAlt'] ?? '';
        $image_caption = $attributes['imageCaption'] ?? '';
        $link_url = $attributes['linkUrl'] ?? '';
        $link_target = $attributes['linkTarget'] ?? '_self';
        $banner_style = $attributes['bannerStyle'] ?? 'banner';
        $overlay_opacity = $attributes['overlayOpacity'] ?? 0.3;
        $overlay_color = $attributes['overlayColor'] ?? '#000000';
        $text_align = $attributes['textAlign'] ?? 'center';
        $text_position = $attributes['textPosition'] ?? 'middle';
        $show_caption = $attributes['showCaption'] ?? true;
        $height = $attributes['height'] ?? 0;

        // Build wrapper attributes
        $wrapper_attributes = [
            'class' => sprintf(
                'swiper-slide swiper-banner swiper-banner--%s text-%s text-position-%s',
                esc_attr($banner_style),
                esc_attr($text_align),
                esc_attr($text_position)
            )
        ];

        // Add height data attribute if set (for circle style width calculation)
        if ($height > 0) {
            $wrapper_attributes['data-banner-height'] = intval($height);
        }

        // Add custom CSS variables for overlay
        $overlay_styles = [];
        if ($image_url) {
            $overlay_styles[] = sprintf('--overlay-color: %s', esc_attr($overlay_color));
            $overlay_styles[] = sprintf('--overlay-opacity: %s', esc_attr($overlay_opacity));
        }
        if (!empty($overlay_styles)) {
            $wrapper_attributes['style'] = implode('; ', $overlay_styles);
        }

        // Get WordPress block wrapper attributes
        $block_wrapper_attrs = get_block_wrapper_attributes($wrapper_attributes);

        // Always build fresh banner content (WordPress will handle migration automatically)
        $banner_content = $this->buildBannerContent(
            $image_url,
            $image_alt,
            $image_caption,
            $show_caption
        );

        // Wrap with link if provided
        if ($link_url) {
            $link_attributes = [
                'href' => esc_url($link_url),
                'target' => esc_attr($link_target),
                'class' => 'swiper-banner__link'
            ];

            if ($link_target === '_blank') {
                $link_attributes['rel'] = 'noopener noreferrer';
            }

            $link_attrs = '';
            foreach ($link_attributes as $key => $value) {
                $link_attrs .= sprintf(' %s="%s"', $key, $value);
            }

            return sprintf(
                '<div %s><a%s>%s</a></div>',
                $block_wrapper_attrs,
                $link_attrs,
                $banner_content
            );
        }

        return sprintf(
            '<div %s>%s</div>',
            $block_wrapper_attrs,
            $banner_content
        );
    }

    /**
     * Build banner content HTML
     *
     * @param string $image_url Image URL
     * @param string $image_alt Image alt text
     * @param string $image_caption Image caption
     * @param bool $show_caption Whether to show caption
     * @return string Banner content HTML
     */
    protected function buildBannerContent($image_url, $image_alt, $image_caption, $show_caption)
    {
        if (!$image_url) {
            return '<div class="swiper-banner__placeholder">' . 
                   __('No image selected', 'jankx') . 
                   '</div>';
        }

        // Image container
        $content = sprintf(
            '<div class="swiper-banner__image" style="background-image: url(%s);">',
            esc_url($image_url)
        );
        
        // Overlay
        $content .= '<div class="swiper-banner__overlay"></div>';
        
        // Caption
        if ($show_caption && $image_caption) {
            $content .= sprintf(
                '<div class="swiper-banner__caption">
                    <div class="swiper-banner__caption-content">%s</div>
                </div>',
                esc_html($image_caption)
            );
        }
        
        $content .= '</div>'; // Close image container

        return $content;
    }
}
