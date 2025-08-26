<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Products Carousel Block
 *
 * Display a carousel of products with various display options
 */
class ProductsCarouselBlock extends Block
{
    /**
     * Block constructor
     */
    public function __construct()
    {
        parent::__construct('jankx/products-carousel', [
            'title' => __('Products Carousel', 'jankx'),
            'description' => __('Display a carousel of products with navigation and pagination.', 'jankx'),
            'category' => 'widgets',
            'icon' => 'slides',
            'keywords' => ['products', 'carousel', 'slider', 'woocommerce'],
            'supports' => [
                'align' => ['center', 'wide', 'full'],
                'html' => false
            ]
        ]);
    }

    /**
     * Register the block
     */
    public function register()
    {
        $block_json = $this->getBlockJson();
        if (!$block_json) {
            return;
        }

        // Prioritize build/ assets
        $this->prioritizeBuildAssets($block_json);

        $this->registerBlockWithMetadata($block_json);
    }

    /**
     * Render the block
     */
    public function render($attributes, $content = '')
    {
        $defaults = [
            'productIDs' => '',
            'align' => 'center',
            'queryOrder' => '',
            'columns' => 3,
            'queryDisplayType' => 'all_products',
            'queryProducts' => 'wc/v3/products?per_page=10',
            'spaceBetween' => 20,
            'autoplay' => false,
            'autoplaySpeed' => 3000,
            'loop' => true,
            'navigation' => true,
            'pagination' => true
        ];

        $attributes = wp_parse_args($attributes, $defaults);

        // Parse query parameters
        $queryProducts = str_replace('wc/v3/products?', '', $attributes['queryProducts']);
        $query = explode('&', $queryProducts);
        $queryParams = [];

        foreach ($query as $q) {
            $temp = explode('=', $q);
            if (isset($temp[0]) && isset($temp[1])) {
                $queryParams[$temp[0]] = $temp[1];
            }
        }

        $args = [
            'post_type' => 'product',
            'post_status' => 'publish',
            'posts_per_page' => isset($queryParams['per_page']) ? $queryParams['per_page'] : 10,
            'tax_query' => [
                [
                    'taxonomy' => 'product_visibility',
                    'terms' => ['exclude-from-catalog'],
                    'field' => 'name',
                    'operator' => 'NOT IN',
                ],
            ],
        ];

        switch ($attributes['queryDisplayType']) {
            case 'specific':
                $args['post__in'] = explode(',', $attributes['productIDs']);
                $args['orderby'] = 'post__in';
                break;
            case 'all_products':
                break;
            case 'filter_by':
                if (isset($queryParams['featured'])) {
                    $args['tax_query'][] = [
                        'taxonomy' => 'product_visibility',
                        'field' => 'name',
                        'terms' => 'featured',
                        'operator' => 'IN',
                    ];
                }
                if (isset($queryParams['on_sale'])) {
                    $args['post__in'] = wc_get_product_ids_on_sale();
                }
                if (isset($queryParams['attribute']) && isset($queryParams['attribute_term'])) {
                    $args['tax_query'][] = [
                        'taxonomy' => $queryParams['attribute'],
                        'field' => 'id',
                        'terms' => explode(',', $queryParams['attribute_term']),
                        'operator' => 'IN',
                    ];
                }
                break;
            case 'by_category':
                if (isset($queryParams['category'])) {
                    $args['tax_query'][] = [
                        'taxonomy' => 'product_cat',
                        'field' => 'id',
                        'terms' => explode(',', $queryParams['category']),
                        'operator' => 'IN',
                    ];
                }
                break;
        }

        if ($attributes['queryDisplayType'] !== 'specific') {
            $args['order'] = isset($queryParams['order']) ? $queryParams['order'] : 'date';
            $args['orderby'] = isset($queryParams['orderby']) ? $queryParams['orderby'] : 'desc';
        }

        $products = get_posts($args);

        $align_class = $attributes['align'] ? " align{$attributes['align']}" : '';
        $block_class = "wp-block-jankx-products-carousel{$align_class}";

        // Carousel data attributes
        $carousel_data = [
            'data-slides-per-view' => $attributes['columns'],
            'data-space-between' => $attributes['spaceBetween'],
            'data-autoplay' => $attributes['autoplay'] ? 'true' : 'false',
            'data-autoplay-speed' => $attributes['autoplaySpeed'],
            'data-loop' => $attributes['loop'] ? 'true' : 'false',
            'data-navigation' => $attributes['navigation'] ? 'true' : 'false',
            'data-pagination' => $attributes['pagination'] ? 'true' : 'false'
        ];

        $data_attributes = '';
        foreach ($carousel_data as $key => $value) {
            $data_attributes .= " {$key}=\"{$value}\"";
        }

        ob_start();
        ?>
        <div class="<?php echo esc_attr($block_class); ?>">
            <div class="jankx-products-carousel-wrapper">
                <div class="jankx-products-carousel swiper"<?php echo $data_attributes; ?>>
                    <?php if ($products) : ?>
                        <?php foreach ($products as $product_post) : ?>
                            <?php
                            $product = wc_get_product($product_post->ID);
                            if (!$product) {
                                continue;
                            }
                            ?>
                            <div class="jankx-product-carousel-item swiper-slide">
                                <div class="product-image">
                                    <a href="<?php echo esc_url($product->get_permalink()); ?>">
                                        <?php echo wp_kses_post($product->get_image('medium')); ?>
                                    </a>
                                </div>
                                <div class="product-info">
                                    <h4 class="product-title">
                                        <a href="<?php echo esc_url($product->get_permalink()); ?>">
                                            <?php echo esc_html($product->get_name()); ?>
                                        </a>
                                    </h4>
                                    <div class="product-price">
                                        <?php echo wp_kses_post($product->get_price_html()); ?>
                                    </div>
                                </div>
                            </div>
                        <?php endforeach; ?>
                    <?php else : ?>
                        <div class="jankx-product-carousel-item">
                            <div class="product-image">
                                <?php echo wp_kses_post(wc_placeholder_img()); ?>
                            </div>
                            <div class="product-info">
                                <h4 class="product-title"><?php _e('No products found', 'jankx'); ?></h4>
                                <div class="product-price">-</div>
                            </div>
                        </div>
                    <?php endif; ?>
                </div>
            </div>

            <?php if ($attributes['navigation']) : ?>
                <div class="swiper-button-next"></div>
                <div class="swiper-button-prev"></div>
            <?php endif; ?>

            <?php if ($attributes['pagination']) : ?>
                <div class="swiper-pagination"></div>
            <?php endif; ?>
        </div>
        <?php
        return ob_get_clean();
    }
}
