<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class CategoriesGridBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/categories-grid';

    public function init()
    {
        // Register AJAX handler
        add_action('wp_ajax_jankx_get_category_products', [$this, 'get_category_products']);
        add_action('wp_ajax_nopriv_jankx_get_category_products', [$this, 'get_category_products']);

        // Enqueue AJAX data
        add_action('wp_enqueue_scripts', [$this, 'enqueue_ajax_data']);
    }

    public function render($attributes, $content = '')
    {
        $defaults = [
            'catsPerRow' => 3,
            'productCategories' => [],
        ];
        $attributes = wp_parse_args($attributes, $defaults);

        if (empty($attributes['productCategories'])) {
            return '<p>' . __('No categories selected.', 'jankx') . '</p>';
        }

        ob_start();
        ?>
        <div class="jankx-categories-grid" style="--categories-per-row: <?php echo esc_attr($attributes['catsPerRow']); ?>">
            <div class="jankx-categories-wrapper">
                <?php foreach ($attributes['productCategories'] as $category) : ?>
                    <?php
                    $term = get_term_by('id', $category['id'], 'product_cat');
                    if (!$term) {
                        continue;
                    }

                    $thumbnail_id = get_term_meta($term->term_id, 'thumbnail_id', true);
                    $image_url = $thumbnail_id ? wp_get_attachment_image_url($thumbnail_id, 'medium') : '';
                    ?>
                    <div class="jankx-category-item"
                         data-category-id="<?php echo esc_attr($term->term_id); ?>"
                         data-category-name="<?php echo esc_attr($term->name); ?>">
                        <div class="jankx-category-image">
                            <?php if ($image_url) : ?>
                                <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr($term->name); ?>" />
                            <?php else : ?>
                                <div class="jankx-category-placeholder">
                                    <?php _e('No Image', 'jankx'); ?>
                                </div>
                            <?php endif; ?>
                        </div>
                        <h4><?php echo esc_html($term->name); ?></h4>
                    </div>
                <?php endforeach; ?>
            </div>

            <div class="jankx-products-grid">
                <button class="jankx-close-modal">&times;</button>
                <div class="jankx-products-content"></div>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }

    public function get_category_products()
    {
        check_ajax_referer('jankx_nonce', 'nonce');

        $category_id = intval($_POST['category_id']);
        if (!$category_id) {
            wp_send_json_error('Invalid category ID');
        }

        $args = [
            'post_type' => 'product',
            'posts_per_page' => 12,
            'tax_query' => [
                [
                    'taxonomy' => 'product_cat',
                    'field' => 'term_id',
                    'terms' => $category_id,
                ],
            ],
            'post_status' => 'publish',
        ];

        $products = get_posts($args);
        $products_data = [];

        foreach ($products as $product) {
            $product_obj = wc_get_product($product->ID);
            if (!$product_obj) {
                continue;
            }

            $products_data[] = [
                'id' => $product->ID,
                'title' => $product->post_title,
                'link' => get_permalink($product->ID),
                'image' => get_the_post_thumbnail_url($product->ID, 'medium') ?: wc_placeholder_img_src(),
                'price' => $product_obj->get_price_html(),
            ];
        }

        $category_link = get_term_link($category_id, 'product_cat');

        wp_send_json_success([
            'products' => $products_data,
            'category_link' => is_wp_error($category_link) ? '#' : $category_link,
        ]);
    }

    public function enqueue_ajax_data()
    {
        wp_localize_script('jankx-categories-grid-view', 'jankx_ajax', [
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('jankx_nonce'),
        ]);
    }
}
