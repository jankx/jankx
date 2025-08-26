<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Scattered Product List Block
 *
 * Display a scattered/masonry layout of products
 */
class ScatteredProductListBlock extends Block
{
    /**
     * Block constructor
     */
    public function __construct()
    {
        parent::__construct('jankx/scattered-product-list', [
            'title' => __('Scattered Product List', 'jankx'),
            'description' => __('Display products in a scattered or masonry layout.', 'jankx'),
            'category' => 'widgets',
            'icon' => 'grid-view',
            'keywords' => ['products', 'scattered', 'masonry', 'woocommerce'],
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
            'title' => 'Featured Products',
            'products' => [],
            'columns' => 4,
            'gap' => 20,
            'masonry' => true,
            'animation' => 'fade-in'
        ];

        $attributes = wp_parse_args($attributes, $defaults);

        // Get featured products if no specific products are set
        if (empty($attributes['products'])) {
            $args = [
                'post_type' => 'product',
                'post_status' => 'publish',
                'posts_per_page' => 8,
                'meta_query' => [
                    [
                        'key' => '_featured',
                        'value' => 'yes',
                        'compare' => '='
                    ]
                ]
            ];

            $products = get_posts($args);
        } else {
            $products = $attributes['products'];
        }

        $align_class = isset($attributes['align']) && $attributes['align'] ? " align{$attributes['align']}" : '';
        $block_class = "wp-block-jankx-scattered-product-list{$align_class}";

        // Add animation class
        if ($attributes['animation']) {
            $block_class .= " animate-{$attributes['animation']}";
        }

        $grid_class = $attributes['masonry'] ? 'masonry' : 'grid';
        $grid_style = $attributes['masonry'] ? '' : "grid-template-columns: repeat({$attributes['columns']}, 1fr); gap: {$attributes['gap']}px;";

        ob_start();
        ?>
        <div class="<?php echo esc_attr($block_class); ?>">
            <h2 class="section-title"><?php echo esc_html($attributes['title']); ?></h2>

            <div class="products-grid <?php echo esc_attr($grid_class); ?>"<?php echo $grid_style ? " style=\"{$grid_style}\"" : ''; ?>>
                <?php if ($products && !is_wp_error($products)) : ?>
                    <?php foreach ($products as $index => $product_post) : ?>
                        <?php
                        $product = wc_get_product($product_post->ID);
                        if (!$product) continue;

                        // Determine height class for masonry layout
                        $height_class = '';
                        if ($attributes['masonry']) {
                            $height_variations = ['height-tall', 'height-medium', 'height-short'];
                            $height_class = $height_variations[$index % count($height_variations)];
                        }
                        ?>
                        <div class="product-item <?php echo esc_attr($height_class); ?>">
                            <div class="product-image">
                                <a href="<?php echo esc_url($product->get_permalink()); ?>">
                                    <?php echo wp_kses_post($product->get_image('medium')); ?>
                                </a>
                            </div>
                            <div class="product-info">
                                <h3 class="product-title">
                                    <a href="<?php echo esc_url($product->get_permalink()); ?>">
                                        <?php echo esc_html($product->get_name()); ?>
                                    </a>
                                </h3>
                                <div class="product-price">
                                    <?php echo wp_kses_post($product->get_price_html()); ?>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php else : ?>
                    <?php for ($i = 1; $i <= 8; $i++) : ?>
                        <?php
                        $height_class = '';
                        if ($attributes['masonry']) {
                            $height_variations = ['height-tall', 'height-medium', 'height-short'];
                            $height_class = $height_variations[($i - 1) % count($height_variations)];
                        }
                        ?>
                        <div class="product-item <?php echo esc_attr($height_class); ?>">
                            <div class="product-image">
                                <?php echo wp_kses_post(wc_placeholder_img()); ?>
                            </div>
                            <div class="product-info">
                                <h3 class="product-title"><?php printf(__('Sample Book %d', 'jankx'), $i); ?></h3>
                                <div class="product-price">$<?php echo number_format(19.99 + ($i * 5), 2); ?></div>
                            </div>
                        </div>
                    <?php endfor; ?>
                <?php endif; ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}
