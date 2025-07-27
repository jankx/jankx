<?php

namespace Jankx\Helpers;

/**
 * Theme Support Helper
 *
 * Manages WordPress theme support features in a DRY way
 *
 * @package Jankx\Helpers
 * @since 2.0.1
 */
class ThemeSupportHelper
{
    /**
     * Basic WordPress theme supports
     */
    private static $basicSupports = [
        'automatic-feed-links',
        'title-tag',
        'post-thumbnails',
        'customize-selective-refresh-widgets',
    ];

    /**
     * Gutenberg theme supports
     */
    private static $gutenbergSupports = [
        'wp-block-styles',
        'align-wide',
        'responsive-embeds',
        'editor-styles',
        'custom-spacing',
        'custom-line-height',
        'custom-units',
        'block-templates',
    ];

    /**
     * HTML5 supports
     */
    private static $html5Supports = [
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ];

    /**
     * Add all basic theme supports
     */
    public static function addBasicSupports(): void
    {
        foreach (self::$basicSupports as $support) {
            add_theme_support($support);
        }

        // HTML5 support with array
        add_theme_support('html5', self::$html5Supports);
    }

    /**
     * Add all Gutenberg theme supports
     */
    public static function addGutenbergSupports(): void
    {
        foreach (self::$gutenbergSupports as $support) {
            add_theme_support($support);
        }
    }

    /**
     * Add custom logo support
     */
    public static function addCustomLogoSupport(array $args = []): void
    {
        $defaults = [
            'height'      => 100,
            'width'       => 400,
            'flex-height' => true,
            'flex-width'  => true,
        ];

        add_theme_support('custom-logo', array_merge($defaults, $args));
    }

    /**
     * Add custom background support
     */
    public static function addCustomBackgroundSupport(array $args = []): void
    {
        $defaults = [
            'default-color' => 'ffffff',
            'default-image' => '',
        ];

        add_theme_support('custom-background', array_merge($defaults, $args));
    }

    /**
     * Add custom header support
     */
    public static function addCustomHeaderSupport(array $args = []): void
    {
        $defaults = [
            'default-image' => '',
            'width'         => 1200,
            'height'        => 400,
            'flex-width'    => true,
            'flex-height'   => true,
        ];

        add_theme_support('custom-header', array_merge($defaults, $args));
    }

    /**
     * Add editor color palette
     */
    public static function addEditorColorPalette(array $colors = []): void
    {
        $defaultColors = [
            [
                'name'  => __('Primary', 'jankx'),
                'slug'  => 'primary',
                'color' => '#007cba',
            ],
            [
                'name'  => __('Secondary', 'jankx'),
                'slug'  => 'secondary',
                'color' => '#6c757d',
            ],
        ];

        $palette = array_merge($defaultColors, $colors);
        add_theme_support('editor-color-palette', $palette);
    }

    /**
     * Add editor font sizes
     */
    public static function addEditorFontSizes(array $sizes = []): void
    {
        $defaultSizes = [
            [
                'name' => __('Small', 'jankx'),
                'size' => 14,
                'slug' => 'small',
            ],
            [
                'name' => __('Normal', 'jankx'),
                'size' => 16,
                'slug' => 'normal',
            ],
            [
                'name' => __('Large', 'jankx'),
                'size' => 20,
                'slug' => 'large',
            ],
        ];

        $fontSizes = array_merge($defaultSizes, $sizes);
        add_theme_support('editor-font-sizes', $fontSizes);
    }

    /**
     * Add custom image sizes
     */
    public static function addCustomImageSizes(): void
    {
        $sizes = [
            'jankx-featured' => [1200, 600, true],
            'jankx-thumbnail' => [350, 250, true],
            'jankx-medium' => [768, 432, true],
        ];

        foreach ($sizes as $name => $params) {
            add_image_size($name, ...$params);
        }
    }

    /**
     * Register navigation menus
     */
    public static function registerNavigationMenus(array $menus = []): void
    {
        $defaultMenus = [
            'primary' => __('Primary Menu', 'jankx'),
            'footer' => __('Footer Menu', 'jankx'),
        ];

        $allMenus = array_merge($defaultMenus, $menus);
        register_nav_menus($allMenus);
    }

    /**
     * Load theme text domain
     */
    public static function loadTextDomain(string $domain = 'jankx', string $path = null): void
    {
        if (!$path) {
            $path = get_template_directory() . '/languages';
        }

        load_theme_textdomain($domain, $path);
    }
}