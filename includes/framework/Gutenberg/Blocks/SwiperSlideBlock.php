<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class SwiperSlideBlock extends Block
{
    public function __construct()
    {
        parent::__construct('jankx/swiper-slide', [
            'title' => __('Swiper Slide', 'jankx'),
            'category' => 'design',
            'icon' => 'format-image',
            'description' => __('Individual slide for the Swiper slider with image and content.', 'jankx'),
            'keywords' => ['slide', 'image', 'content'],
            'supports' => [
                'html' => false,
                'align' => ['wide', 'full']
            ],
            'attributes' => [
                'imageId' => [ 'type' => 'number' ],
                'imageUrl' => [ 'type' => 'string' ],
                'imageAlt' => [ 'type' => 'string' ],
                'title' => [ 'type' => 'string' ],
                'description' => [ 'type' => 'string' ],
                'linkUrl' => [ 'type' => 'string' ],
                'linkTarget' => [ 'type' => 'string', 'default' => '_self' ],
                'className' => [ 'type' => 'string', 'default' => '' ],
            ],
        ]);
    }

    public function register()
    {
        $blockPath = get_template_directory() . '/resources/blocks/swiper-slide';
        $buildPath = $blockPath . '/build';
        $metadata  = $this->getBlockMetadata($blockPath);

        if (is_dir($buildPath)) {
            $metadata['editorScript'] = 'build/index.js';
            $metadata['style'] = 'build/style.css';
            $metadata['editorStyle'] = 'build/editor.css';
        } else {
            $metadata['editorScript'] = 'src/index.tsx';
            $metadata['style'] = 'src/style.scss';
            $metadata['editorStyle'] = 'src/editor.scss';
        }

        $this->registerBlock($blockPath, $metadata);
    }

    public function render($attributes, $content = '')
    {
        $image_id = isset($attributes['imageId']) ? (int) $attributes['imageId'] : 0;
        $image_url = isset($attributes['imageUrl']) ? (string) $attributes['imageUrl'] : '';
        $image_alt = isset($attributes['imageAlt']) ? (string) $attributes['imageAlt'] : '';
        $title = isset($attributes['title']) ? (string) $attributes['title'] : '';
        $description = isset($attributes['description']) ? (string) $attributes['description'] : '';
        $link_url = isset($attributes['linkUrl']) ? (string) $attributes['linkUrl'] : '';
        $link_target = isset($attributes['linkTarget']) ? (string) $attributes['linkTarget'] : '_self';
        $className = isset($attributes['className']) ? (string) $attributes['className'] : '';

        $wrapperClasses = ['swiper-slide'];
        if (!empty($className)) {
            $wrapperClasses[] = $className;
        }

        $html = '<div class="' . esc_attr(implode(' ', $wrapperClasses)) . '">';

        if (!empty($link_url)) {
            $html .= '<a href="' . esc_url($link_url) . '" target="' . esc_attr($link_target) . '">';
        }

        if (!empty($image_url)) {
            $html .= '<div class="slide-image">';
            $html .= '<img src="' . esc_url($image_url) . '" alt="' . esc_attr($image_alt) . '" />';
            $html .= '</div>';
        }

        if (!empty($title) || !empty($description)) {
            $html .= '<div class="slide-content">';
            if (!empty($title)) {
                $html .= '<h3 class="slide-title">' . esc_html($title) . '</h3>';
            }
            if (!empty($description)) {
                $html .= '<div class="slide-description">' . wp_kses_post($description) . '</div>';
            }
            $html .= '</div>';
        }

        if (!empty($content)) {
            $html .= '<div class="slide-inner-content">' . $content . '</div>';
        }

        if (!empty($link_url)) {
            $html .= '</a>';
        }

        $html .= '</div>'; // .swiper-slide

        return $html;
    }
}
