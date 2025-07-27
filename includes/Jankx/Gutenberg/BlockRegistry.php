<?php

namespace Jankx\Gutenberg;

use Jankx\Facades\Logger;

class BlockRegistry
{
    protected static $blocks = [];
    protected static $initialized = false;

    public static function init()
    {
        if (self::$initialized) {
            return;
        }

        add_action('enqueue_block_editor_assets', [self::class, 'enqueueEditorAssets']);

        self::$initialized = true;
    }

    public static function boot()
    {
        self::init();
    }

    public static function enqueueEditorAssets()
    {
        $asset_file = include(JANKX_ABSPATH . '/assets/gutenberg/js/editor.asset.php');

        wp_enqueue_script(
            'jankx-gutenberg-editor',
            get_template_directory_uri() . '/assets/gutenberg/js/editor.js',
            $asset_file['dependencies'],
            $asset_file['version']
        );

        wp_enqueue_style(
            'jankx-gutenberg-editor-style',
            get_template_directory_uri() . '/assets/gutenberg/css/editor.css',
            [],
            \Jankx\Jankx::getFrameworkVersion()
        );

        // Localize script with block data
        wp_localize_script('jankx-gutenberg-editor', 'jankxGutenberg', [
            'blocks' => self::getBlockData(),
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('jankx/gutenberg/nonce'),
        ]);
    }

    public static function enqueueFrontendAssets()
    {
        wp_enqueue_style(
            'jankx-gutenberg-frontend-style',
            get_template_directory_uri() . '/assets/gutenberg/css/frontend.css',
            [],
            \Jankx\Jankx::getFrameworkVersion()
        );
    }

    public static function getBlockData()
    {
        return [];
    }

    public static function getBlocks()
    {
        return self::$blocks;
    }

    public static function getBlock($name)
    {
        return self::$blocks[$name] ?? null;
    }
}