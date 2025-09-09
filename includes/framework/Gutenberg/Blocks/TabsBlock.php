<?php

namespace Jankx\Gutenberg\Blocks;

use Jankx\Gutenberg\Block;

/**
 * Tabs Block
 *
 * This block displays content in horizontal tabs with navigation.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
class TabsBlock extends Block
{
    /**
     * Block ID
     *
     * @var string
     */
    protected $blockId = 'jankx/tabs';

    /**
     * Block attributes
     *
     * @var array
     */
    protected $attributes = [];

    /**
     * Constructor
     */
    public function __construct()
    {
        parent::__construct();

        // Enqueue block assets
        add_action('enqueue_block_assets', [$this, 'enqueueBlockAssets']);
    }

    /**
     * Enqueue block assets (CSS and JS)
     */
    public function enqueueBlockAssets()
    {
        // Get theme directory URL
        $theme_url = get_template_directory_uri();

        // Load asset file for version and dependencies
        $asset_file = get_template_directory() . '/resources/assets/global.asset.php';
        $asset = file_exists($asset_file) ? require $asset_file : ['dependencies' => [], 'version' => '1.0.0'];

        // Enqueue global CSS
        wp_enqueue_style(
            'jankx-tabs-global-css',
            $theme_url . '/resources/assets/global.css',
            [],
            $asset['version'],
            'all'
        );

        // Enqueue global JS
        wp_enqueue_script(
            'jankx-tabs-global-js',
            $theme_url . '/resources/assets/global.js',
            $asset['dependencies'],
            $asset['version'],
            true
        );

        // Enqueue admin CSS
        wp_enqueue_style(
            'jankx-tabs-admin-css',
            $theme_url . '/resources/assets/admin/admin.css',
            ['jankx-tabs-global-css'],
            '1.0.0',
            'all'
        );

        // Enqueue admin JS
        wp_enqueue_script(
            'jankx-tabs-admin-js',
            $theme_url . '/resources/assets/admin/admin.js',
            ['jquery', 'jankx-tabs-global-js'],
            '1.0.0',
            true
        );
    }

    /**
     * Render the block content
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @return string Rendered HTML
     */
    public function render($attributes, $content = '')
    {
        // Store attributes for use in other methods
        $this->attributes = $attributes;

        $className = $attributes['className'] ?? '';
        $anchor = $attributes['anchor'] ?? '';

        // Build wrapper classes
        $wrapperClasses = ['wp-block-jankx-tabs'];
        if (!empty($className)) {
            $wrapperClasses[] = $className;
        }

        // Build wrapper attributes
        $wrapperAttrs = [];
        if (!empty($anchor)) {
            $wrapperAttrs['id'] = $anchor;
        }

        $wrapperAttrs['class'] = implode(' ', $wrapperClasses);

        // Build attributes string
        $attrsString = '';
        foreach ($wrapperAttrs as $key => $value) {
            $attrsString .= sprintf(' %s="%s"', esc_attr($key), esc_attr($value));
        }

        return sprintf(
            '<div%s>%s</div>',
            $attrsString,
            $content
        );
    }
}
