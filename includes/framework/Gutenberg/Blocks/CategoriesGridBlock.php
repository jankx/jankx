<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Categories Grid Block
 *
 * Display a grid of product categories with various layout options
 */
class CategoriesGridBlock extends Block
{
    /**
     * Block constructor
     */
    public function __construct()
    {
        parent::__construct('jankx/categories-grid', [
            'title' => __('Product Categories Grid', 'jankx'),
            'description' => __('Display a grid of products from your selected categories.', 'jankx'),
            'category' => 'widgets',
            'icon' => 'grid-view',
            'keywords' => ['product categories', 'grid', 'thumbs'],
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
            'categoryIDs' => '',
            'orderby' => 'menu_order',
            'limit' => 8,
            'columns' => '3',
            'hideEmpty' => false,
            'productCount' => true,
            'parentOnly' => false,
            'align' => 'center',
            'className' => 'is-style-layout-2',
            'queryDisplayType' => 'all_categories',
        ];

        $attributes = wp_parse_args($attributes, $defaults);

        $args = [
            'taxonomy' => 'product_cat',
        ];

        if ($attributes['queryDisplayType'] === 'specific') {
            $args['orderby'] = 'include';
            $args['include'] = $attributes['categoryIDs'];
            $args['hide_empty'] = false;
        } else {
            $args['number'] = $attributes['limit'];
            $args['hide_empty'] = $attributes['hideEmpty'];
            $args['parent'] = ($attributes['parentOnly'] === true) ? 0 : '';

            switch ($attributes['orderby']) {
                case 'menu_order':
                    $args['menu_order'] = 'asc';
                    break;
                case 'title_asc':
                    $args['orderby'] = 'title';
                    $args['order'] = 'asc';
                    break;
                case 'title_desc':
                    $args['orderby'] = 'title';
                    $args['order'] = 'desc';
                    break;
                default:
                    break;
            }
        }

        $product_categories = get_terms($args);

        if ($attributes['className'] === 'is-style-layout-1') {
            $columns = 'columns-' . $attributes['columns'];
        } else {
            $columns = 'columns-' . $attributes['columns'];
        }

        $align_class = $attributes['align'] ? " align{$attributes['align']}" : '';
        $block_class = "wp-block-jankx-categories-grid{$align_class} {$attributes['className']}";

        ob_start();
        ?>
        <section class="<?php echo esc_attr($block_class); ?>">
            <div class="jankx-categories-grid <?php echo esc_attr($columns); ?>">
                <?php if ($product_categories && !is_wp_error($product_categories)) : ?>
                    <?php foreach ($product_categories as $cat) : ?>
                        <div class="jankx-category-grid-item">
                            <a class="jankx-category-grid-item-img" href="<?php echo esc_url(get_term_link($cat->slug, 'product_cat')); ?>">
                                <?php
                                $thumbnail_id = get_term_meta($cat->term_id, 'thumbnail_id', true);
                                $image = wp_get_attachment_image($thumbnail_id, 'large');
                                echo !$image ? wp_kses_post(wc_placeholder_img()) : wp_kses_post($image);
                                ?>
                            </a>
                            <h4 class="jankx-category-grid-item-title">
                                <?php echo esc_html($cat->name); ?>
                                <?php if ($attributes['productCount']) : ?>
                                    <span class="jankx-category-grid-item-count">(<?php echo esc_attr($cat->count); ?>)</span>
                                <?php endif; ?>
                            </h4>
                        </div>
                    <?php endforeach; ?>
                <?php else : ?>
                    <div class="jankx-category-grid-item">
                        <div class="jankx-category-grid-item-img">
                            <?php echo wp_kses_post(wc_placeholder_img()); ?>
                        </div>
                        <h4 class="jankx-category-grid-item-title">
                            <?php _e('No categories found', 'jankx'); ?>
                        </h4>
                    </div>
                <?php endif; ?>
                <div class="clearfix"></div>
            </div>
        </section>
        <?php
        return ob_get_clean();
    }
}
