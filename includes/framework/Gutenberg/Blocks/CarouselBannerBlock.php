<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Carousel Banner Block
 *
 * Banner slide for Carousel with customizable styles and links
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class CarouselBannerBlock extends Block
{
    protected $blockId = 'jankx/carousel-banner';

    /**
     * Render the Carousel Banner block
     *
     * @param array $attributes Block attributes
     * @param string $content Inner blocks content
     * @param object|null $block Block object
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '', $block = null)
    {
        // Get attributes with defaults
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
        $image_size = $attributes['imageSize'] ?? 'cover';
        $class_name = $attributes['className'] ?? '';

        // Get image URL from WordPress attachment if imageId is provided
        if ($image_id > 0 && empty($image_url)) {
            $image_url = wp_get_attachment_image_url($image_id, 'full');
            if (empty($image_alt)) {
                $image_alt = get_post_meta($image_id, '_wp_attachment_image_alt', true);
            }
            if (empty($image_caption)) {
                $attachment = get_post($image_id);
                $image_caption = $attachment ? $attachment->post_excerpt : '';
            }
        }

        // If no image, return empty
        if (empty($image_url)) {
            return '';
        }

        // Build wrapper classes
        $wrapper_classes = ['embla__slide', 'embla-banner'];
        if (!empty($banner_style)) {
            $wrapper_classes[] = 'banner-style-' . esc_attr($banner_style);
        }
        if (!empty($text_position)) {
            $wrapper_classes[] = 'text-position-' . esc_attr($text_position);
        }
        if (!empty($text_align)) {
            $wrapper_classes[] = 'text-' . esc_attr($text_align);
        }
        if (!empty($image_size)) {
            $wrapper_classes[] = 'image-size-' . esc_attr($image_size);
        }
        if (!empty($class_name)) {
            $wrapper_classes[] = esc_attr($class_name);
        }

        // Build wrapper attributes
        $wrapper_attributes = [
            'class' => implode(' ', $wrapper_classes),
            'style' => ''
        ];

        // Add height if specified
        if ($height > 0) {
            $wrapper_attributes['style'] .= sprintf('--banner-height: %dpx;', $height);
        }

        // Get WordPress block wrapper attributes
        $block_wrapper_attrs = get_block_wrapper_attributes($wrapper_attributes);





        // Build banner wrapper classes using BEM
        $banner_classes = ['embla-banner'];
        if (!empty($banner_style)) {
            $banner_classes[] = 'embla-banner--' . esc_attr($banner_style);
        }
        if (!empty($text_align)) {
            $banner_classes[] = 'text-' . esc_attr($text_align);
        }
        if (!empty($text_position)) {
            $banner_classes[] = 'text-position-' . esc_attr($text_position);
        }

        // Process content - carousel-banner doesn't support inner blocks normally
        // But if content exists and contains nested carousel-banner blocks, ignore it
        $processed_content = '';
        if (!empty($content)) {
            // Check if content contains nested banner block (this shouldn't happen but WordPress might render it)
            if (strpos($content, 'wp-block-jankx-carousel-banner') !== false || strpos($content, 'embla-banner__image') !== false) {
                // Content contains a nested banner block, ignore it completely
                // This prevents double rendering of banner structure
                $processed_content = '';
            } else {
                // Normal content (text, HTML), use it
                $processed_content = trim($content);
            }
        }

        ob_start();
        ?>
        <div <?php echo $block_wrapper_attrs; ?>>
            <?php if (!empty($link_url)) : ?>
                <a href="<?php echo esc_url($link_url); ?>" 
                   target="<?php echo esc_attr($link_target); ?>"
                   class="embla-banner__link"
                   aria-label="<?php echo esc_attr($image_alt); ?>">
            <?php endif; ?>
            
            <div class="<?php echo esc_attr(implode(' ', $banner_classes)); ?>">
                <?php
                // Build image styles based on imageSize
                $image_styles = ['background-image: url(\'' . esc_url($image_url) . '\')'];
                
                if ($image_size === 'fullwidth') {
                    $image_styles[] = 'background-size: 100% 100%';
                    $image_styles[] = 'background-position: center';
                } elseif ($image_size === 'contain') {
                    $image_styles[] = 'background-size: contain';
                } else {
                    $image_styles[] = 'background-size: cover';
                }
                
                $image_style_attr = implode('; ', $image_styles);
                ?>
                <div class="embla-banner__image image-size-<?php echo esc_attr($image_size); ?>" style="<?php echo esc_attr($image_style_attr); ?>">
                    <?php if (!empty($processed_content) || ($show_caption && !empty($image_caption))) : ?>
                        <div class="embla-banner__caption">
                            <?php if (!empty($processed_content)) : ?>
                                <div class="embla-banner__caption-content">
                                    <?php echo wp_kses_post($processed_content); ?>
                                </div>
                            <?php endif; ?>
                            <?php if ($show_caption && !empty($image_caption)) : ?>
                                <div class="embla-banner__caption-text">
                                    <?php echo esc_html($image_caption); ?>
                                </div>
                            <?php endif; ?>
                        </div>
                    <?php endif; ?>
                </div>
            </div>
            
            <?php if (!empty($link_url)) : ?>
                </a>
            <?php endif; ?>
        </div>
        <?php
        return ob_get_clean();
    }
}
