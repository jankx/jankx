<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Carousel Block
 *
 * This block displays a carousel/slider with customizable options
 * using Swiper.js for smooth animations and interactions.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class CarouselBlock extends Block
{
    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct('jankx/carousel', [
            'title' => __('Carousel', 'jankx'),
            'category' => 'design',
            'icon' => 'slides',
            'description' => __('Slider list of images, cards, logos.', 'jankx'),
            'keywords' => ['carousel', 'slider', 'slideshow', 'swiper'],
            'supports' => [
                'html' => false,
                'align' => ['wide', 'full'],
                'spacing' => [
                    'margin' => true,
                    'padding' => true
                ]
            ],
            'attributes' => [
                'hasTitle' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'title' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'hasDescription' => [
                    'type' => 'boolean',
                    'default' => true
                ],
                'description' => [
                    'type' => 'string',
                    'default' => ''
                ],
                'slidesPerView' => [
                    'type' => 'string',
                    'default' => '3'
                ],
                'spaceBetween' => [
                    'type' => 'string',
                    'default' => '10'
                ],
                'hasPagination' => [
                    'type' => 'string',
                    'default' => 'true'
                ],
                'hasNavigation' => [
                    'type' => 'string',
                    'default' => 'true'
                ],
                'shouldAutoplay' => [
                    'type' => 'string',
                    'default' => 'false'
                ],
                'shouldLoop' => [
                    'type' => 'string',
                    'default' => 'false'
                ],
                'scaleFactor' => [
                    'type' => 'number',
                    'default' => 1
                ],
                'backgroundColor' => [
                    'type' => 'string',
                    'default' => '#ffffff'
                ],
                'color' => [
                    'type' => 'string',
                    'default' => '#000000'
                ],
                'className' => [
                    'type' => 'string',
                    'default' => ''
                ]
            ]
        ]);
    }

    /**
     * Register the block
     *
     * @return void
     */
    public function register()
    {
        $blockPath = get_template_directory() . '/resources/blocks/carousel';
        $buildPath = $blockPath . '/build';
        $metadata = $this->getBlockMetadata($blockPath);

        // Update metadata to use built assets
        if (is_dir($buildPath)) {
            $metadata['editorScript'] = 'build/index.js';
            $metadata['viewScript'] = 'build/view.js';
            $metadata['style'] = 'build/style.css';
            $metadata['editorStyle'] = 'build/editor.css';
        } else {
            // Fallback to source files if build doesn't exist
            $metadata['editorScript'] = 'index.js';
            $metadata['viewScript'] = 'view.js';
            $metadata['style'] = 'style.css';
            $metadata['editorStyle'] = 'editor.css';
        }

        // Add custom CSS for Jankx framework block
        $metadata['style'] = 'jankx-carousel.css';

        // Register block
        $this->registerBlock($blockPath, $metadata);

        // Add hooks to enqueue assets at the right time
        add_action('wp_enqueue_scripts', [$this, 'enqueueBlockAssets']);
        add_action('admin_enqueue_scripts', [$this, 'enqueueBlockAssets']);

        // CSS is handled automatically by block.json
    }

        /**
     * Enqueue custom CSS for the block
     *
     * @return void
     */
    protected function enqueueCustomCSS()
    {
        // Enqueue frontend CSS
        // CSS is handled automatically by block.json
        // No manual CSS enqueue to avoid iframe warnings

        // Enqueue Swiper from CDN
        wp_enqueue_script(
            'swiper-js',
            'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js',
            [],
            '11.2.10',
            true
        );

        wp_enqueue_style(
            'swiper-css',
            'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css',
            [],
            '11.2.10'
        );

        // Note: Editor CSS is handled by block.json editorStyle property
        // WordPress will automatically load it in editor context
    }

    /**
     * Render the block content
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '')
    {
        $hasTitle = $attributes['hasTitle'] ?? true;
        $title = $attributes['title'] ?? '';
        $hasDescription = $attributes['hasDescription'] ?? true;
        $description = $attributes['description'] ?? '';
        $slidesPerView = $attributes['slidesPerView'] ?? '3';
        $spaceBetween = $attributes['spaceBetween'] ?? '10';
        $hasPagination = $attributes['hasPagination'] ?? 'true';
        $hasNavigation = $attributes['hasNavigation'] ?? 'true';
        $shouldAutoplay = $attributes['shouldAutoplay'] ?? 'false';
        $shouldLoop = $attributes['shouldLoop'] ?? 'false';
        $scaleFactor = $attributes['scaleFactor'] ?? 1;
        $backgroundColor = $attributes['backgroundColor'] ?? '#ffffff';
        $color = $attributes['color'] ?? '#000000';
        $className = $attributes['className'] ?? '';

        // Build wrapper classes
        $wrapperClasses = ['wp-block-jankx-carousel'];
        if (!empty($className)) {
            $wrapperClasses[] = $className;
        }

        // Build swiper classes and data attributes
        $swiperClasses = ['swiper'];
        $swiperData = [
            'data-slides-per-view' => $slidesPerView,
            'data-space-between' => $spaceBetween,
            'data-has-pagination' => $hasPagination,
            'data-has-navigation' => $hasNavigation,
            'data-should-autoplay' => $shouldAutoplay,
            'data-should-loop' => $shouldLoop,
        ];

        $swiperAttributes = '';
        foreach ($swiperData as $key => $value) {
            $swiperAttributes .= sprintf(' %s="%s"', esc_attr($key), esc_attr($value));
        }

        // Build inline styles
        $style = sprintf(
            '--scale-factor: %s; --background-color: %s; --color: %s;',
            esc_attr($scaleFactor),
            esc_attr($backgroundColor),
            esc_attr($color)
        );

        ob_start();
        ?>
        <div class="<?php echo esc_attr(implode(' ', $wrapperClasses)); ?>" style="<?php echo esc_attr($style); ?>">
            <div class="wp-block-jankx-carousel__header">
                <?php if ($hasTitle && $title) : ?>
                    <h2 class="wp-block-jankx-carousel__title"><?php echo wp_kses_post($title); ?></h2>
                <?php endif; ?>
                <?php if ($hasDescription && $description) : ?>
                    <div class="wp-block-jankx-carousel__description"><?php echo wp_kses_post($description); ?></div>
                <?php endif; ?>
            </div>
            <div class="<?php echo esc_attr(implode(' ', $swiperClasses)); ?>"<?php echo $swiperAttributes; ?>>
                <div class="swiper-wrapper">
                    <?php echo $content; ?>
                </div>
                <?php if ($hasPagination === 'true') : ?>
                    <div class="swiper-pagination"></div>
                <?php endif; ?>
                <?php if ($hasNavigation === 'true') : ?>
                    <div class="swiper-button-prev" data-swiper-button-prev></div>
                    <div class="swiper-button-next" data-swiper-button-next></div>
                <?php endif; ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}
