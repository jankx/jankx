<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class SwiperSliderBlock extends Block
{
    public function __construct()
    {
        parent::__construct('jankx/swiper-slider', [
            'title' => __('Swiper Slider', 'jankx'),
            'category' => 'design',
            'icon' => 'slides',
            'description' => __('Responsive slider with Swiper.js for images, cards, and content.', 'jankx'),
            'keywords' => ['slider', 'carousel', 'swiper', 'slideshow'],
            'supports' => [
                'html' => false,
                'align' => ['wide', 'full'],
                'spacing' => [
                    'margin' => true,
                    'padding' => true
                ]
            ],
            'attributes' => [
                'slidesPerView' => [ 'type' => 'number', 'default' => 1 ],
                'spaceBetween' => [ 'type' => 'number', 'default' => 30 ],
                'autoplay' => [ 'type' => 'boolean', 'default' => true ],
                'autoplayDelay' => [ 'type' => 'number', 'default' => 3000 ],
                'loop' => [ 'type' => 'boolean', 'default' => true ],
                'pagination' => [ 'type' => 'boolean', 'default' => true ],
                'navigation' => [ 'type' => 'boolean', 'default' => true ],
                'className' => [ 'type' => 'string', 'default' => '' ],
            ],
        ]);
    }

    public function register()
    {
        $blockPath = get_template_directory() . '/resources/blocks/swiper-slider';
        $buildPath = $blockPath . '/build';
        $metadata  = $this->getBlockMetadata($blockPath);

        if (is_dir($buildPath)) {
            $metadata['editorScript'] = 'build/index.js';
            $metadata['viewScript'] = 'build/view.js';
            $metadata['style'] = 'build/style.css';
            $metadata['editorStyle'] = 'build/editor.css';
        } else {
            $metadata['editorScript'] = 'src/index.tsx';
            $metadata['viewScript'] = 'src/view.ts';
            $metadata['style'] = 'src/style.scss';
            $metadata['editorStyle'] = 'src/editor.scss';
        }

        $this->registerBlock($blockPath, $metadata);
    }

    public function render($attributes, $content = '')
    {
        $slides_per_view = isset($attributes['slidesPerView']) ? (int) $attributes['slidesPerView'] : 1;
        $space_between = isset($attributes['spaceBetween']) ? (int) $attributes['spaceBetween'] : 30;
        $autoplay = isset($attributes['autoplay']) ? (bool) $attributes['autoplay'] : true;
        $autoplay_delay = isset($attributes['autoplayDelay']) ? (int) $attributes['autoplayDelay'] : 3000;
        $loop = isset($attributes['loop']) ? (bool) $attributes['loop'] : true;
        $pagination = isset($attributes['pagination']) ? (bool) $attributes['pagination'] : true;
        $navigation = isset($attributes['navigation']) ? (bool) $attributes['navigation'] : true;
        $className = isset($attributes['className']) ? (string) $attributes['className'] : '';

        $wrapperClasses = ['jankx-swiper-slider'];
        if (!empty($className)) {
            $wrapperClasses[] = $className;
        }

        $data_attributes = [
            'data-slides-per-view' => $slides_per_view,
            'data-space-between' => $space_between,
            'data-autoplay' => $autoplay ? 'true' : 'false',
            'data-autoplay-delay' => $autoplay_delay,
            'data-loop' => $loop ? 'true' : 'false',
            'data-pagination' => $pagination ? 'true' : 'false',
            'data-navigation' => $navigation ? 'true' : 'false',
        ];

        $data_attr_string = '';
        foreach ($data_attributes as $key => $value) {
            $data_attr_string .= ' ' . esc_attr($key) . '="' . esc_attr($value) . '"';
        }

        $html = '<div class="' . esc_attr(implode(' ', $wrapperClasses)) . '"' . $data_attr_string . '>';
        $html .= '<div class="swiper-container">';
        $html .= '<div class="swiper-wrapper">' . $content . '</div>';

        if ($pagination) {
            $html .= '<div class="swiper-pagination"></div>';
        }

        if ($navigation) {
            $html .= '<div class="swiper-button-next"></div>';
            $html .= '<div class="swiper-button-prev"></div>';
        }

        $html .= '</div>'; // .swiper-container
        $html .= '</div>'; // .jankx-swiper-slider

        return $html;
    }
}
