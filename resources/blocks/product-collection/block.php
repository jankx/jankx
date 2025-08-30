<?php
/**
 * Product Collection Block
 *
 * @package CheepHub
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}

/**
 * Register Product Collection Block
 */
function cheephub_register_product_collection_block() {
    // Register block script
    wp_register_script(
        'cheephub-product-collection',
        get_template_directory_uri() . '/resources/blocks/product-collection/build/index.js',
        array(
            'wp-block-editor',
            'wp-blocks',
            'wp-components',
            'wp-compose',
            'wp-core-data',
            'wp-data',
            'wp-editor',
            'wp-element',
            'wp-hooks',
            'wp-html-entities',
            'wp-i18n',
            'wp-primitives'
        ),
        filemtime( get_template_directory() . '/resources/blocks/product-collection/build/index.js' ),
        true
    );

    // Register block styles
    wp_register_style(
        'cheephub-product-collection-editor',
        get_template_directory_uri() . '/resources/blocks/product-collection/build/editor.css',
        array(),
        filemtime( get_template_directory() . '/resources/blocks/product-collection/build/editor.css' )
    );

    wp_register_style(
        'cheephub-product-collection-style',
        get_template_directory_uri() . '/resources/blocks/product-collection/build/style.css',
        array(),
        filemtime( get_template_directory() . '/resources/blocks/product-collection/build/style.css' )
    );

    // Register block
    register_block_type(
        'cheephub/product-collection',
        array(
            'editor_script' => 'cheephub-product-collection',
            'editor_style'  => 'cheephub-product-collection-editor',
            'style'         => 'cheephub-product-collection-style',
            'attributes'    => array(
                'columns' => array(
                    'type'    => 'number',
                    'default' => 3,
                ),
                'rows' => array(
                    'type'    => 'number',
                    'default' => 3,
                ),
                'orderby' => array(
                    'type'    => 'string',
                    'default' => 'date',
                ),
                'order' => array(
                    'type'    => 'string',
                    'default' => 'DESC',
                ),
                'categories' => array(
                    'type'    => 'array',
                    'default' => array(),
                ),
                'tags' => array(
                    'type'    => 'array',
                    'default' => array(),
                ),
                'productsToShow' => array(
                    'type'    => 'number',
                    'default' => 9,
                ),
                'align' => array(
                    'type'    => 'string',
                    'default' => 'wide',
                ),
            ),
            'render_callback' => 'cheephub_render_product_collection_block',
        )
    );
}
add_action( 'init', 'cheephub_register_product_collection_block' );

/**
 * Render Product Collection Block
 */
function cheephub_render_product_collection_block( $attributes ) {
    // Get settings
    $columns = isset( $attributes['columns'] ) ? $attributes['columns'] : 3;
    $rows = isset( $attributes['rows'] ) ? $attributes['rows'] : 3;
    $orderby = isset( $attributes['orderby'] ) ? $attributes['orderby'] : 'date';
    $order = isset( $attributes['order'] ) ? $attributes['order'] : 'DESC';
    $categories = isset( $attributes['categories'] ) ? $attributes['categories'] : array();
    $tags = isset( $attributes['tags'] ) ? $attributes['tags'] : array();
    $products_to_show = isset( $attributes['productsToShow'] ) ? $attributes['productsToShow'] : 9;
    $align = isset( $attributes['align'] ) ? $attributes['align'] : 'wide';

    // Build query args
    $args = array(
        'post_type'      => 'product',
        'post_status'    => 'publish',
        'posts_per_page' => $products_to_show,
        'orderby'        => $orderby,
        'order'          => $order,
    );

    // Add category filter
    if ( ! empty( $categories ) ) {
        $args['tax_query'][] = array(
            'taxonomy' => 'product_cat',
            'field'    => 'term_id',
            'terms'    => $categories,
        );
    }

    // Add tag filter
    if ( ! empty( $tags ) ) {
        $args['tax_query'][] = array(
            'taxonomy' => 'product_tag',
            'field'    => 'term_id',
            'terms'    => $tags,
        );
    }

    // Query products
    $products = new WP_Query( $args );

    // Start output buffering
    ob_start();

    if ( $products->have_posts() ) {
        echo '<div class="wp-block-cheephub-product-collection align' . esc_attr( $align ) . '" data-columns="' . esc_attr( $columns ) . '" data-rows="' . esc_attr( $rows ) . '">';
        echo '<div class="product-collection-grid" style="grid-template-columns: repeat(' . esc_attr( $columns ) . ', 1fr);">';

        while ( $products->have_posts() ) {
            $products->the_post();
            global $product;

            if ( ! $product ) {
                continue;
            }

            echo '<div class="product-collection-item">';
            echo '<div class="product-image">';
            if ( has_post_thumbnail() ) {
                echo get_the_post_thumbnail( $product->get_id(), 'medium' );
            } else {
                echo wc_placeholder_img( 'medium' );
            }
            echo '</div>';

            echo '<div class="product-content">';
            echo '<h3 class="product-title"><a href="' . esc_url( get_permalink() ) . '">' . esc_html( get_the_title() ) . '</a></h3>';

            if ( $product->get_price() ) {
                echo '<div class="product-price">' . $product->get_price_html() . '</div>';
            }

            echo '<div class="product-actions">';
            echo '<a href="' . esc_url( get_permalink() ) . '" class="button">' . esc_html__( 'View Product', 'cheephub' ) . '</a>';
            echo '</div>';
            echo '</div>';
            echo '</div>';
        }

        echo '</div>';
        echo '</div>';
    } else {
        echo '<p>' . esc_html__( 'No products found.', 'cheephub' ) . '</p>';
    }

    wp_reset_postdata();

    return ob_get_clean();
}

/**
 * Add wcSettings to frontend
 */
function cheephub_add_wc_settings() {
    if ( ! is_admin() ) {
        ?>
        <script id="wc-settings-js-before">
        var wcSettings = wcSettings || JSON.parse( decodeURIComponent( '%7B%22shippingCostRequiresAddress%22%3Afalse%2C%22wcBlocksConfig%22%3A%7B%22pluginUrl%22%3A%22<?php echo esc_js( get_template_directory_uri() ); ?>%2F%22%2C%22restApiRoutes%22%3A%7B%22%5C%2Fwc%5C%2Fstore%5C%2Fv1%22%3A%5B%5D%7D%2C%22defaultAvatar%22%3A%22https%3A%5C%2F%5C%2Fsecure.gravatar.com%5C%2Favatar%5C%2F%3Fs%3D96%26d%3Dmm%26f%3Dy%26r%3Dg%22%2C%22wordCountType%22%3A%22words%22%2C%22experimentalBlocksEnabled%22%3Atrue%2C%22productCount%22%3A%22<?php echo esc_js( wc_get_total_product_count() ); ?>%22%7D%2C%22isStepperLayoutFeatureEnabled%22%3Atrue%2C%22isBlockTheme%22%3Atrue%2C%22hasFilterableProducts%22%3Atrue%2C%22minColumns%22%3A1%2C%22maxColumns%22%3A6%2C%22defaultColumns%22%3A3%2C%22minRows%22%3A1%2C%22maxRows%22%3A6%2C%22defaultRows%22%3A3%2C%22reviewRatingsEnabled%22%3Atrue%2C%22showAvatars%22%3Atrue%2C%22attributes%22%3A%5B%5D%2C%22queryState%22%3A%5B%5D%2C%22defaultHeight%22%3A500%2C%22displayCartPricesIncludingTax%22%3A<?php echo esc_js( wc_tax_enabled() ? 'true' : 'false' ); ?>%2C%22loopShopPerPage%22%3A<?php echo esc_js( get_option( 'posts_per_page', 12 ) ); ?>%2C%22stockStatusOptions%22%3A%7B%22instock%22%3A%22<?php echo esc_js( __( 'In stock', 'woocommerce' ) ); ?>%22%2C%22outofstock%22%3A%22<?php echo esc_js( __( 'Out of stock', 'woocommerce' ) ); ?>%22%2C%22onbackorder%22%3A%22<?php echo esc_js( __( 'On backorder', 'woocommerce' ) ); ?>%22%7D%2C%22hideOutOfStockItems%22%3A<?php echo esc_js( get_option( 'woocommerce_hide_out_of_stock_items', 'no' ) === 'yes' ? 'true' : 'false' ); ?>%2C%22hasTags%22%3A<?php echo esc_js( get_terms( array( 'taxonomy' => 'product_tag', 'hide_empty' => false ) ) ? 'true' : 'false' ); ?>%2C%22limitTags%22%3Afalse%2C%22storeHasDownloadableProducts%22%3A<?php echo esc_js( wc_get_products( array( 'type' => 'downloadable', 'limit' => 1 ) ) ? 'true' : 'false' ); ?>%2C%22additionalAddressFields%22%3A%5B%5D%2C%22additionalFields%22%3A%5B%5D%2C%22additionalContactFields%22%3A%5B%5D%2C%22delayedAccountCreationEnabled%22%3Afalse%2C%22registrationGeneratePassword%22%3Atrue%7D' ) );
        </script>
        <?php
    }
}
add_action( 'wp_head', 'cheephub_add_wc_settings' );
