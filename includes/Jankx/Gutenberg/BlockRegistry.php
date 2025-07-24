<?php

namespace Jankx\Gutenberg;

use Jankx\Gutenberg\Blocks\TestimonialBlock;
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

        add_action('init', [self::class, 'registerBlocks']);
        add_action('enqueue_block_editor_assets', [self::class, 'enqueueEditorAssets']);
        // Note: Frontend assets are handled by GutenbergFrontendBootstrapper
        // to avoid duplicate enqueuing

        self::$initialized = true;
    }

    public static function boot()
    {
        self::init();
    }

    public static function registerBlocks()
    {
        // Check if blocks already registered
        if (!empty(self::$blocks)) {
            Logger::debug('Jankx Gutenberg: Blocks already registered, skipping');
            return;
        }

        // Register testimonial block
        self::registerBlock('jankx/testimonial', TestimonialBlock::class);

        // Debug logging
        Logger::debug('Jankx Gutenberg: Registered blocks', [
            'blocks' => array_keys(self::$blocks),
            'count' => count(self::$blocks)
        ]);
    }

    public static function registerBlock($name, $class)
    {
        if (!class_exists($class)) {
            Logger::error("Jankx Gutenberg: Block class {$class} not found");
            return;
        }

        self::$blocks[$name] = $class;

        // Check if register_block_type function exists
        if (!function_exists('register_block_type')) {
            Logger::error("Jankx Gutenberg: register_block_type function not available");
            return;
        }

        // Debug logging
        Logger::debug('Jankx Gutenberg: Registering block', [
            'name' => $name,
            'class' => $class
        ]);

        // Register block with WordPress
        register_block_type($name, [
            'editor_script' => 'jankx-gutenberg-editor',
            'editor_style' => 'jankx-gutenberg-editor-style',
            'style' => 'jankx-gutenberg-frontend-style',
            'render_callback' => [$class, 'render'],
            'attributes' => $class::getAttributes(),
            'category' => 'widgets', // Add category to PHP registration
        ]);

        Logger::debug('Jankx Gutenberg: Block registered successfully', [
            'name' => $name,
            'class' => $class
        ]);
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

        // Enqueue testimonial block script
        wp_enqueue_script(
            'jankx-testimonial-block',
            get_template_directory_uri() . '/assets/gutenberg/js/blocks/testimonial/index.js',
            ['jankx-gutenberg-editor', 'wp-blocks', 'wp-block-editor', 'wp-components', 'wp-i18n'],
            JANKX_VERSION
        );

        wp_enqueue_style(
            'jankx-gutenberg-editor-style',
            get_template_directory_uri() . '/assets/gutenberg/css/editor.css',
            [],
            JANKX_VERSION
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
            JANKX_VERSION
        );
    }

    public static function getBlockData()
    {
        $data = [];
        foreach (self::$blocks as $name => $class) {
            $data[$name] = [
                'name' => $name,
                'title' => $class::getTitle(),
                'description' => $class::getDescription(),
                'category' => $class::getCategory(),
                'icon' => $class::getIcon(),
                'keywords' => $class::getKeywords(),
                'supports' => $class::getSupports(),
            ];
        }
        return $data;
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