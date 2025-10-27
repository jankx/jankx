<?php

namespace Jankx\Layouts\PostLayout\Examples;

use Jankx\Layouts\PostLayout\Generators\CustomContentGenerator;
use WP_Query;

/**
 * Example: WooCommerce Product Generator
 *
 * Ví dụ sử dụng Content Generator để render WooCommerce products
 *
 * @package Jankx\Layouts\PostLayout\Examples
 */
class WooCommerceProductGenerator
{
    /**
     * Create WooCommerce product generator
     *
     * @return CustomContentGenerator
     */
    public static function create(): CustomContentGenerator
    {
        return new CustomContentGenerator(
            'woocommerce-products',
            __('WooCommerce Products', 'jankx'),
            [self::class, 'renderProducts'],
            [self::class, 'renderPreview'],
            ['columns', 'showPrice', 'showRating', 'showAddToCart']
        );
    }

    /**
     * Render WooCommerce products
     *
     * @param WP_Query $query
     * @param array $options
     * @return string
     */
    public static function renderProducts(WP_Query $query, array $options = []): string
    {
        if (!$query->have_posts()) {
            return '<div class="no-products">' . __('No products found.', 'jankx') . '</div>';
        }

        $columns = $options['columns'] ?? 3;
        $showPrice = $options['showPrice'] ?? true;
        $showRating = $options['showRating'] ?? true;
        $showAddToCart = $options['showAddToCart'] ?? true;

        ob_start();
        ?>
        <div class="woocommerce-products-grid columns-<?php echo esc_attr($columns); ?>">
            <?php while ($query->have_posts()) : $query->the_post(); ?>
                <div class="product-item">
                    <div class="product-thumbnail">
                        <?php if (has_post_thumbnail()) : ?>
                            <a href="<?php the_permalink(); ?>">
                                <?php the_post_thumbnail('woocommerce_thumbnail'); ?>
                            </a>
                        <?php endif; ?>
                    </div>
                    
                    <div class="product-content">
                        <h3 class="product-title">
                            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                        </h3>
                        
                        <?php if ($showPrice) : ?>
                            <div class="product-price">
                                <?php woocommerce_template_loop_price(); ?>
                            </div>
                        <?php endif; ?>
                        
                        <?php if ($showRating) : ?>
                            <div class="product-rating">
                                <?php woocommerce_template_loop_rating(); ?>
                            </div>
                        <?php endif; ?>
                        
                        <?php if ($showAddToCart) : ?>
                            <div class="product-add-to-cart">
                                <?php woocommerce_template_loop_add_to_cart(); ?>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
            <?php endwhile; ?>
        </div>
        <?php
        wp_reset_postdata();
        return ob_get_clean();
    }

    /**
     * Render preview for Gutenberg editor
     *
     * @param array $options
     * @return array
     */
    public static function renderPreview(array $options = []): array
    {
        return [
            'name' => 'woocommerce-products',
            'title' => __('WooCommerce Products', 'jankx'),
            'type' => 'woocommerce',
            'columns' => $options['columns'] ?? 3,
            'supportedOptions' => ['columns', 'showPrice', 'showRating', 'showAddToCart'],
            'previewItems' => [
                [
                    'id' => 1,
                    'title' => __('Sample Product 1', 'jankx'),
                    'price' => '$29.99',
                    'rating' => 4.5,
                    'thumbnail' => true,
                ],
                [
                    'id' => 2,
                    'title' => __('Sample Product 2', 'jankx'),
                    'price' => '$49.99',
                    'rating' => 5.0,
                    'thumbnail' => true,
                ],
            ],
        ];
    }
}
