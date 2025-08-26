<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Lookbook Reveal Block
 *
 * Display a lookbook with reveal effects for products
 */
class LookbookRevealBlock extends Block
{
    /**
     * Block constructor
     */
    public function __construct()
    {
        parent::__construct('jankx/lookbook-reveal', [
            'title' => __('Lookbook Reveal', 'jankx'),
            'description' => __('Display a lookbook with reveal effects for products.', 'jankx'),
            'category' => 'widgets',
            'icon' => 'visibility',
            'keywords' => ['lookbook', 'reveal', 'products', 'woocommerce'],
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
            'title' => 'Lookbook Collection',
            'description' => 'Discover our latest collection',
            'products' => [],
            'columns' => 3,
            'revealEffect' => 'fade',
            'autoplay' => false,
            'autoplaySpeed' => 5000
        ];

        $attributes = wp_parse_args($attributes, $defaults);

        // Get featured products if no specific products are set
        if (empty($attributes['products'])) {
            $args = [
                'post_type' => 'product',
                'post_status' => 'publish',
                'posts_per_page' => 6,
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
        $block_class = "wp-block-jankx-lookbook-reveal{$align_class}";

        // Add animation class
        if ($attributes['revealEffect']) {
            $block_class .= " animate-{$attributes['revealEffect']}";
        }

        ob_start();
        ?>
        <div class="<?php echo esc_attr($block_class); ?>">
            <div class="lookbook-header">
                <h2 class="lookbook-title"><?php echo esc_html($attributes['title']); ?></h2>
                <p class="lookbook-description"><?php echo esc_html($attributes['description']); ?></p>
            </div>

            <div class="lookbook-grid" style="grid-template-columns: repeat(<?php echo esc_attr($attributes['columns']); ?>, 1fr);">
                <?php if ($products && !is_wp_error($products)) : ?>
                    <?php foreach ($products as $product_post) : ?>
                        <?php
                        $product = wc_get_product($product_post->ID);
                        if (!$product) continue;
                        ?>
                        <div class="lookbook-item">
                            <div class="product-image">
                                <a href="<?php echo esc_url($product->get_permalink()); ?>">
                                    <?php echo wp_kses_post($product->get_image('large')); ?>
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
                    <?php for ($i = 1; $i <= 6; $i++) : ?>
                        <div class="lookbook-item">
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
