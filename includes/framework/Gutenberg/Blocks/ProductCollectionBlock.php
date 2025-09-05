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

        // Chỉ load CSS cho editor, script sẽ được load qua block.json
        add_action('enqueue_block_assets', [$this, 'enqueueEditorAssets'], 20);

        // Load frontend assets sau WooCommerce
        add_action('wp_enqueue_scripts', [$this, 'enqueueFrontendAssets'], 25);
    }

        /**
     * Enqueue assets cho Gutenberg editor
     */
    public function enqueueEditorAssets(): void
    {
        // Chỉ load khi WooCommerce đang active
        if (!class_exists('WooCommerce')) {
            return;
        }

        // Chỉ load CSS cho editor, không load script ở đây
        // Script sẽ được load thông qua block.json
        wp_enqueue_style(
            'jankx-product-collection-editor',
            get_template_directory_uri() . '/resources/blocks/product-collection/build/editor.css',
            [],
            filemtime(get_template_directory() . '/resources/blocks/product-collection/build/editor.css')
        );
    }

    /**
     * Enqueue assets cho frontend
     */
    public function enqueueFrontendAssets(): void
    {
        // Chỉ load khi WooCommerce đang active
        if (!class_exists('WooCommerce')) {
            return;
        }

        // Chỉ load CSS cho frontend, script sẽ được load qua block.json
        wp_enqueue_style(
            'jankx-product-collection-frontend',
            get_template_directory_uri() . '/resources/blocks/product-collection/build/style.css',
            [],
            filemtime(get_template_directory() . '/resources/blocks/product-collection/build/style.css')
        );
    }


}
