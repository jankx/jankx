<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

class ProductCollectionBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/product-collection';

    public function register(): void
    {
        parent::register();

        // Load script ở footer của Gutenberg editor sau khi WooCommerce được load
        add_action('enqueue_block_editor_assets', [$this, 'enqueueEditorScripts'], 20); // Load editor scripts
        // Tránh duplicate WooCommerce stores
        add_action('enqueue_block_editor_assets', [$this, 'avoidDuplicateWooCommerceStores'], 25);
    }

    /**
     * Enqueue editor scripts
     */
    public function enqueueEditorScripts(): void
    {
        // Chỉ load khi WooCommerce đang active
        if (!class_exists('WooCommerce')) {
            return;
        }

        // Load script product-collection cho editor
        wp_enqueue_script(
            'jankx-product-collection-editor-script',
            get_template_directory_uri() . '/resources/blocks/product-collection/build/index.js',
            [
                'wp-blocks',
                'wp-element',
                'wp-editor',
                'wp-components',
                'wp-i18n',
                'wp-data',
                'wp-compose',
                'wp-hooks'
            ],
            filemtime(get_template_directory() . '/resources/blocks/product-collection/build/index.js'),
            true // Load ở footer
        );
    }



    /**
     * Kiểm tra và tránh duplicate WooCommerce stores
     */
    public function avoidDuplicateWooCommerceStores(): void
    {
        // Chỉ chạy khi WooCommerce active
        if (!class_exists('WooCommerce')) {
            return;
        }

        // Thêm inline script để kiểm tra stores
        wp_add_inline_script('jankx-product-collection-editor-script', '
            // Kiểm tra và tránh duplicate WooCommerce stores
            if (window.wp && window.wp.data && window.wp.data.select) {
                const existingStores = [
                    "wc/store/validation",
                    "wc/store/payment",
                    "wc/store/cart",
                    "wc/store/checkout",
                    "wc/store/collections",
                    "wc/store/query-state",
                    "wc/store/schema",
                    "wc/store/store-notices"
                ];

                existingStores.forEach(storeName => {
                    if (window.wp.data.select(storeName)) {
                        console.log("WooCommerce store already exists:", storeName);
                    }
                });
            }
        ');
    }
}
