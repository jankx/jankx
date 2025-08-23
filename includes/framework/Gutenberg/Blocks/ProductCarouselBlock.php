<?php

namespace Jankx\Gutenberg\Blocks;

/**
 * Product Carousel Block
 *
 * This block creates a product carousel that can contain WooCommerce product collections
 * as nested blocks. It transforms product lists into interactive carousels.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class ProductCarouselBlock extends Block
{
    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct('jankx/product-carousel', [
            'title' => __('Product Carousel', 'jankx'),
            'category' => 'woocommerce',
            'icon' => 'slides',
            'description' => __('Product carousel với khả năng kéo product collections của WooCommerce vào làm nested block', 'jankx'),
            'keywords' => ['product', 'carousel', 'woocommerce', 'slider', 'products', 'jankx'],
            'supports' => [
                'html' => false,
                'align' => true,
                'alignWide' => true,
                'spacing' => [
                    'margin' => true,
                    'padding' => true
                ],
                'color' => [
                    'text' => true,
                    'background' => true,
                    'gradients' => true
                ],
                'typography' => [
                    'fontSize' => true,
                    'lineHeight' => true,
                    'fontFamily' => true,
                    'fontWeight' => true,
                    'fontStyle' => true,
                    'letterSpacing' => true
                ],
                'border' => [
                    'color' => true,
                    'radius' => true,
                    'style' => true,
                    'width' => true
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
        $blockPath = get_template_directory() . '/resources/blocks/product-carousel';
        $buildPath = $blockPath . '/build';
        $metadata = $this->getBlockMetadata($blockPath);

        // Update metadata to use built assets
        if (is_dir($buildPath)) {
            $metadata['editorScript'] = 'build/index.js';
            $metadata['style'] = 'style-index.css';
        }

        // Register block
        $this->registerBlock($blockPath, $metadata);
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
        $title = $attributes['title'] ?? 'Featured Products';
        $showTitle = $attributes['showTitle'] ?? true;
        $titleTag = $attributes['titleTag'] ?? 'h2';
        $titleAlignment = $attributes['titleAlignment'] ?? 'center';
        $carouselType = $attributes['carouselType'] ?? 'swiper';
        $slidesPerView = $attributes['slidesPerView'] ?? 4;
        $slidesPerViewMobile = $attributes['slidesPerViewMobile'] ?? 1;
        $slidesPerViewTablet = $attributes['slidesPerViewTablet'] ?? 2;
        $spaceBetween = $attributes['spaceBetween'] ?? 20;
        $autoplay = $attributes['autoplay'] ?? true;
        $autoplayDelay = $attributes['autoplayDelay'] ?? 3000;
        $loop = $attributes['loop'] ?? true;
        $showNavigation = $attributes['showNavigation'] ?? true;
        $showPagination = $attributes['showPagination'] ?? true;
        $navigationStyle = $attributes['navigationStyle'] ?? 'arrows';
        $paginationStyle = $attributes['paginationStyle'] ?? 'dots';
        $showProductImage = $attributes['showProductImage'] ?? true;
        $showProductTitle = $attributes['showProductTitle'] ?? true;
        $showProductPrice = $attributes['showProductPrice'] ?? true;
        $showProductRating = $attributes['showProductRating'] ?? true;
        $showAddToCart = $attributes['showAddToCart'] ?? true;
        $imageSize = $attributes['imageSize'] ?? 'medium';
        $customClassName = $attributes['customClassName'] ?? '';
        $anchor = $attributes['anchor'] ?? '';

        if (empty($content)) {
            return $this->renderPlaceholder();
        }

        // Build carousel classes
        $carouselClasses = [
            'jankx-product-carousel',
            "jankx-product-carousel--{$carouselType}",
            $customClassName
        ];

        // Build carousel data attributes
        $carouselData = [
            'data-carousel-type' => $carouselType,
            'data-slides-per-view' => $slidesPerView,
            'data-slides-per-view-mobile' => $slidesPerViewMobile,
            'data-slides-per-view-tablet' => $slidesPerViewTablet,
            'data-space-between' => $spaceBetween,
            'data-autoplay' => $autoplay ? 'true' : 'false',
            'data-autoplay-delay' => $autoplayDelay,
            'data-loop' => $loop ? 'true' : 'false',
            'data-navigation' => $showNavigation ? 'true' : 'false',
            'data-pagination' => $showPagination ? 'true' : 'false',
            'data-navigation-style' => $navigationStyle,
            'data-pagination-style' => $paginationStyle
        ];

        // Build final HTML
        $className = implode(' ', array_filter($carouselClasses));
        $dataAttributes = implode(' ', array_map(function ($key, $value) {
            return sprintf('%s="%s"', esc_attr($key), esc_attr($value));
        }, array_keys($carouselData), $carouselData));

        $id = !empty($anchor) ? sprintf(' id="%s"', esc_attr($anchor)) : '';

        $output = sprintf('<div class="%s"%s %s>', esc_attr(trim($className)), $id, $dataAttributes);

        // Render title
        if ($showTitle && !empty($title)) {
            $titleStyle = sprintf('text-align: %s;', esc_attr($titleAlignment));
            $output .= sprintf(
                '<%1$s class="jankx-product-carousel__title" style="%2$s">%3$s</%1$s>',
                esc_attr($titleTag),
                esc_attr($titleStyle),
                esc_html($title)
            );
        }

        // Render carousel container
        $output .= '<div class="jankx-product-carousel__container">';
        $output .= '<div class="jankx-product-carousel__content">';
        $output .= $content;
        $output .= '</div>';

        // Render navigation
        if ($showNavigation) {
            $output .= $this->renderNavigation($navigationStyle);
        }

        // Render pagination
        if ($showPagination) {
            $output .= $this->renderPagination($paginationStyle);
        }

        $output .= '</div>';

        // Render carousel configuration
        $output .= $this->renderCarouselConfig($attributes);

        $output .= '</div>';

        return $output;
    }

    /**
     * Render navigation controls
     *
     * @param string $style Navigation style
     * @return string HTML for navigation
     */
    protected function renderNavigation($style)
    {
        if ($style === 'dots') {
            return '';
        }

        $output = '<div class="jankx-product-carousel__navigation">';

        if ($style === 'arrows' || $style === 'both') {
            $output .= '<button class="jankx-product-carousel__nav-prev" aria-label="' . esc_attr__('Previous', 'jankx') . '">';
            $output .= '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">';
            $output .= '<path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
            $output .= '</svg>';
            $output .= '</button>';

            $output .= '<button class="jankx-product-carousel__nav-next" aria-label="' . esc_attr__('Next', 'jankx') . '">';
            $output .= '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">';
            $output .= '<path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
            $output .= '</svg>';
            $output .= '</button>';
        }

        $output .= '</div>';

        return $output;
    }

    /**
     * Render pagination controls
     *
     * @param string $style Pagination style
     * @return string HTML for pagination
     */
    protected function renderPagination($style)
    {
        $output = '<div class="jankx-product-carousel__pagination">';

        switch ($style) {
            case 'dots':
                $output .= '<div class="jankx-product-carousel__dots"></div>';
                break;
            case 'numbers':
                $output .= '<div class="jankx-product-carousel__numbers"></div>';
                break;
            case 'progress':
                $output .= '<div class="jankx-product-carousel__progress">';
                $output .= '<div class="jankx-product-carousel__progress-bar"></div>';
                $output .= '</div>';
                break;
        }

        $output .= '</div>';

        return $output;
    }

    /**
     * Render carousel configuration as JSON
     *
     * @param array $attributes Block attributes
     * @return string HTML script tag with configuration
     */
    protected function renderCarouselConfig($attributes)
    {
        $config = [
            'type' => $attributes['carouselType'] ?? 'swiper',
            'slidesPerView' => [
                'desktop' => $attributes['slidesPerView'] ?? 4,
                'tablet' => $attributes['slidesPerViewTablet'] ?? 2,
                'mobile' => $attributes['slidesPerViewMobile'] ?? 1
            ],
            'spaceBetween' => $attributes['spaceBetween'] ?? 20,
            'autoplay' => $attributes['autoplay'] ?? true,
            'autoplayDelay' => $attributes['autoplayDelay'] ?? 3000,
            'loop' => $attributes['loop'] ?? true,
            'navigation' => $attributes['showNavigation'] ?? true,
            'pagination' => $attributes['showPagination'] ?? true,
            'navigationStyle' => $attributes['navigationStyle'] ?? 'arrows',
            'paginationStyle' => $attributes['paginationStyle'] ?? 'dots'
        ];

        return sprintf(
            '<script type="application/json" class="jankx-product-carousel__config">%s</script>',
            wp_json_encode($config)
        );
    }

    /**
     * Render placeholder when no content
     *
     * @return string
     */
    protected function renderPlaceholder()
    {
        return '<div class="jankx-product-carousel jankx-product-carousel--empty">' .
               '<div class="jankx-product-carousel__placeholder">' .
               '<p>' . __('Kéo product collections của WooCommerce vào đây để tạo carousel', 'jankx') . '</p>' .
               '</div>' .
               '</div>';
    }
}
