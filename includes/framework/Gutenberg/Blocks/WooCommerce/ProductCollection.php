<?php

namespace Jankx\Gutenberg\Blocks\WooCommerce;

use Jankx\Gutenberg\Block;
use Jankx\Gutenberg\Blocks\WooCommerce\ProductCollection\Controller;

/**
 * ProductCollection Block
 *
 * Uses WooCommerce ProductCollection Controller for rendering
 */
class ProductCollection extends Block
{

    protected $blockId = 'jankx/product-collection';

    /**
     * Render the block using WooCommerce Controller
     */
    public function render($attributes, $content = '')
    {
        // Convert jankx attributes to woocommerce format
        $woo_attributes = $this->convertAttributes($attributes);

        // Use WooCommerce Controller's build_frontend_query method
        return $this->renderWithWooCommerceController($woo_attributes, $content);
    }

    /**
     * Render using WooCommerce Controller's query building capabilities
     */
    private function renderWithWooCommerceController($attributes, $content)
    {
        // Create Controller instance
        $controller = new Controller('jankx/product-collection', 'resources/blocks/product-collection');

        // Build block context for Controller
        $block_context = [
            'query' => [
                'isProductCollectionBlock' => true,
                'perPage' => $attributes['query']['perPage'] ?? 12,
                'orderBy' => $attributes['query']['orderBy'] ?? 'date',
                'order' => $attributes['query']['order'] ?? 'desc',
                'featured' => $attributes['query']['featured'] ?? false,
                'woocommerceOnSale' => $attributes['query']['woocommerceOnSale'] ?? false,
            ],
            'collection' => $attributes['collection'] ?? 'all',
            'productCollectionLocation' => 'archive'
        ];

        // Create a mock block object for Controller
        $block = (object) [
            'context' => $block_context
        ];

        // Get current page
        $page = get_query_var('paged') ? get_query_var('paged') : 1;

        // Use Controller's build_frontend_query method
        $query_args = $controller->build_frontend_query([], $block, $page);

        // Execute query
        $products = new \WP_Query($query_args);

        $columns = $attributes['displayLayout']['columns'] ?? 3;
        $collection = $attributes['collection'] ?? 'all';

        ob_start();
        ?>
        <div class="wp-block-jankx-product-collection">
            <div class="jankx-product-collection"
                 data-collection="<?php echo esc_attr($collection); ?>"
                 data-columns="<?php echo esc_attr($columns); ?>"
                 data-posts-per-page="<?php echo esc_attr($attributes['query']['perPage'] ?? 12); ?>">

                <?php if ($products->have_posts()): ?>
                    <div class="jankx-product-collection-grid"
                         style="grid-template-columns: repeat(<?php echo esc_attr($columns); ?>, 1fr);">
                        <?php while ($products->have_posts()):
                            $products->the_post(); ?>
                            <div class="jankx-product-item">
                                <div class="product-image">
                                    <?php if (has_post_thumbnail()): ?>
                                        <a href="<?php the_permalink(); ?>">
                                            <?php the_post_thumbnail('medium'); ?>
                                        </a>
                                    <?php endif; ?>
                                </div>
                                <div class="product-info">
                                    <h3 class="product-title">
                                        <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                                    </h3>
                                    <div class="product-price">
                                        <?php
                                        global $product;
                                        if ($product) {
                                            echo $product->get_price_html();
                                        }
                                        ?>
                                    </div>
                                </div>
                            </div>
                        <?php endwhile; ?>
                    </div>

                    <?php if ($products->max_num_pages > 1): ?>
                        <div class="jankx-pagination">
                            <?php
                            echo paginate_links([
                                'total' => $products->max_num_pages,
                                'current' => max(1, get_query_var('paged')),
                                'prev_text' => __('Previous', 'jankx'),
                                'next_text' => __('Next', 'jankx')
                            ]);
                            ?>
                        </div>
                    <?php endif; ?>
                <?php else: ?>
                    <div class="jankx-no-products">
                        <p><?php _e('No products found.', 'jankx'); ?></p>
                    </div>
                <?php endif; ?>
            </div>
        </div>
        <?php
        wp_reset_postdata();

        return ob_get_clean();
    }

    /**
     * Convert Jankx attributes to WooCommerce format
     */
    private function convertAttributes($attributes)
    {
        $woo_attributes = [
            'query' => [
                'perPage' => $attributes['query']['perPage'] ?? 12,
                'orderBy' => $attributes['query']['orderBy'] ?? 'date',
                'order' => $attributes['query']['order'] ?? 'desc',
                'featured' => $attributes['query']['featured'] ?? false,
                'woocommerceOnSale' => $attributes['query']['woocommerceOnSale'] ?? false,
                'isProductCollectionBlock' => true
            ],
            'displayLayout' => [
                'type' => $attributes['displayLayout']['type'] ?? 'flex',
                'columns' => $attributes['displayLayout']['columns'] ?? 3
            ],
            'collection' => $attributes['collection'] ?? 'all'
        ];

        return $woo_attributes;
    }
}
