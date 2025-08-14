<?php
/**
 * Swiper Slider Block Render
 *
 * @package Jankx\Blocks\SwiperSlider
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Render Swiper Slider Block
 *
 * @param array $attributes Block attributes
 * @param string $content Block content
 * @return string
 */
function jankx_swiper_slider_render($attributes, $content) {
    // Extract attributes
    $slider_type = $attributes['sliderType'] ?? 'slider';
    $preset = $attributes['preset'] ?? 'default';
    $slides_per_view = $attributes['slidesPerView'] ?? 1;
    $slides_per_group = $attributes['slidesPerGroup'] ?? 1;
    $space_between = $attributes['spaceBetween'] ?? 30;
    $effect = $attributes['effect'] ?? 'slide';
    $direction = $attributes['direction'] ?? 'horizontal';
    $loop = $attributes['loop'] ?? false;
    $autoplay = $attributes['autoplay'] ?? false;
    $autoplay_delay = $attributes['autoplayDelay'] ?? 3000;
    $autoplay_disable_on_interaction = $attributes['autoplayDisableOnInteraction'] ?? true;
    $navigation = $attributes['navigation'] ?? true;
    $pagination = $attributes['pagination'] ?? true;
    $pagination_type = $attributes['paginationType'] ?? 'bullets';
    $scrollbar = $attributes['scrollbar'] ?? false;
    $centered_slides = $attributes['centeredSlides'] ?? false;
    $grab_cursor = $attributes['grabCursor'] ?? true;
    $speed = $attributes['speed'] ?? 300;
    $breakpoints = $attributes['breakpoints'] ?? [];

    // Generate unique ID for this slider
    $slider_id = 'swiper-slider-' . uniqid();

    // Parse content to extract slides
    $slides = jankx_parse_swiper_slides($content);

    // Build Swiper configuration
    $swiper_config = jankx_build_swiper_config($attributes);

    // Enqueue Swiper assets
    jankx_enqueue_swiper_assets($effect);

    // Start output buffering
    ob_start();
    ?>
    <div id="<?php echo esc_attr($slider_id); ?>" class="swiper-slider-block swiper-slider-<?php echo esc_attr($slider_type); ?>">
        <div class="swiper">
            <div class="swiper-wrapper">
                <?php foreach ($slides as $slide): ?>
                    <div class="swiper-slide">
                        <?php echo $slide; ?>
                    </div>
                <?php endforeach; ?>
            </div>

            <?php if ($navigation): ?>
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
            <?php endif; ?>

            <?php if ($pagination): ?>
                <div class="swiper-pagination"></div>
            <?php endif; ?>

            <?php if ($scrollbar): ?>
                <div class="swiper-scrollbar"></div>
            <?php endif; ?>
        </div>
    </div>

    <script type="text/javascript">
        document.addEventListener('DOMContentLoaded', function() {
            // Initialize Swiper
            const swiper = new Swiper('#<?php echo esc_js($slider_id); ?> .swiper', <?php echo wp_json_encode($swiper_config); ?>);
        });
    </script>
    <?php

    return ob_get_clean();
}

/**
 * Parse Swiper slides from block content
 *
 * @param string $content Block content
 * @return array
 */
function jankx_parse_swiper_slides($content) {
    $slides = [];
    
    // Parse content to extract individual slides
    if (preg_match_all('/<div class="swiper-slide-content[^>]*>(.*?)<\/div>/s', $content, $matches)) {
        foreach ($matches[1] as $slide_content) {
            $slides[] = $slide_content;
        }
    }

    // If no slides found, create default slide
    if (empty($slides)) {
        $slides[] = '<div class="swiper-slide-default"><p>No slides configured</p></div>';
    }

    return $slides;
}

/**
 * Build Swiper configuration object
 *
 * @param array $attributes Block attributes
 * @return array
 */
function jankx_build_swiper_config($attributes) {
    $config = [
        'slidesPerView' => $attributes['slidesPerView'] ?? 1,
        'slidesPerGroup' => $attributes['slidesPerGroup'] ?? 1,
        'spaceBetween' => $attributes['spaceBetween'] ?? 30,
        'effect' => $attributes['effect'] ?? 'slide',
        'direction' => $attributes['direction'] ?? 'horizontal',
        'loop' => $attributes['loop'] ?? false,
        'speed' => $attributes['speed'] ?? 300,
        'grabCursor' => $attributes['grabCursor'] ?? true,
        'centeredSlides' => $attributes['centeredSlides'] ?? false,
    ];

    // Add autoplay configuration
    if ($attributes['autoplay'] ?? false) {
        $config['autoplay'] = [
            'delay' => $attributes['autoplayDelay'] ?? 3000,
            'disableOnInteraction' => $attributes['autoplayDisableOnInteraction'] ?? true,
        ];
    }

    // Add navigation configuration
    if ($attributes['navigation'] ?? false) {
        $config['navigation'] = [
            'nextEl' => '.swiper-button-next',
            'prevEl' => '.swiper-button-prev',
        ];
    }

    // Add pagination configuration
    if ($attributes['pagination'] ?? false) {
        $config['pagination'] = [
            'el' => '.swiper-pagination',
            'type' => $attributes['paginationType'] ?? 'bullets',
            'clickable' => true,
        ];
    }

    // Add scrollbar configuration
    if ($attributes['scrollbar'] ?? false) {
        $config['scrollbar'] = [
            'el' => '.swiper-scrollbar',
            'draggable' => true,
        ];
    }

    // Add breakpoints configuration
    if (!empty($attributes['breakpoints'])) {
        $config['breakpoints'] = $attributes['breakpoints'];
    }

    // Add effect-specific configurations
    $effect = $attributes['effect'] ?? 'slide';
    switch ($effect) {
        case 'fade':
            $config['fadeEffect'] = [
                'crossFade' => true,
            ];
            break;

        case 'cube':
            $config['cubeEffect'] = [
                'slideShadows' => true,
                'shadow' => true,
                'shadowOffset' => 20,
                'shadowScale' => 0.94,
            ];
            break;

        case 'coverflow':
            $config['coverflowEffect'] = [
                'rotate' => 50,
                'stretch' => 0,
                'depth' => 100,
                'modifier' => 1,
                'slideShadows' => true,
            ];
            break;

        case 'flip':
            $config['flipEffect'] = [
                'slideShadows' => true,
                'limitRotation' => true,
            ];
            break;

        case 'cards':
            $config['cardsEffect'] = [
                'slideShadows' => true,
                'rotate' => true,
                'perSlideOffset' => 8,
                'perSlideRotate' => 2,
            ];
            break;

        case 'creative':
            $config['creativeEffect'] = [
                'prev' => [
                    'translate' => [0, 0, -400],
                    'rotate' => [0, 0, -15],
                    'scale' => 0.85,
                ],
                'next' => [
                    'translate' => ['100%', 0, 0],
                    'rotate' => [0, 0, 15],
                    'scale' => 0.85,
                ],
            ];
            break;
    }

    return $config;
}

/**
 * Enqueue Swiper assets based on effect
 *
 * @param string $effect Swiper effect
 * @return void
 */
function jankx_enqueue_swiper_assets($effect) {
    // Enqueue Swiper core
    wp_enqueue_script(
        'swiper-core',
        'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js',
        [],
        '11.0.0',
        true
    );

    wp_enqueue_style(
        'swiper-core',
        'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
        [],
        '11.0.0'
    );

    // Enqueue custom Swiper styles
    wp_enqueue_style(
        'jankx-swiper-slider',
        get_template_directory_uri() . '/resources/blocks/swiper-slider/build/style-index.css',
        ['swiper-core'],
        filemtime(get_template_directory() . '/resources/blocks/swiper-slider/build/style-index.css')
    );

    // Enqueue custom Swiper script
    wp_enqueue_script(
        'jankx-swiper-slider',
        get_template_directory_uri() . '/resources/blocks/swiper-slider/build/index.js',
        ['swiper-core'],
        filemtime(get_template_directory() . '/resources/blocks/swiper-slider/build/index.js'),
        true
    );
}

// Register render callback
add_action('init', function() {
    register_block_type('jankx/swiper-slider', [
        'render_callback' => 'jankx_swiper_slider_render',
    ]);
});
