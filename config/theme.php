<?php

/**
 * Theme Configuration
 *
 * Theme-specific settings and configurations
 *
 * @package Jankx\Config
 * @since 2.0.0
 */

return [
    /*
    |--------------------------------------------------------------------------
    | Theme Information
    |--------------------------------------------------------------------------
    |
    | Basic information about the theme
    |
    */
    'info' => [
        'name' => 'Bookix',
        'version' => '2.0.0',
        'description' => 'A modern WordPress theme built with Jankx Framework',
        'author' => 'Jankx Team',
        'author_url' => 'https://jankx.com',
        'theme_url' => 'https://jankx.com/bookix',
        'license' => 'GPL v2 or later',
        'text_domain' => 'bookix',
    ],

    /*
    |--------------------------------------------------------------------------
    | Theme Features
    |--------------------------------------------------------------------------
    |
    | Features supported by this theme
    |
    */
    'features' => [
        'post-thumbnails' => true,
        'post-formats' => ['aside', 'image', 'video', 'quote', 'link', 'gallery', 'audio'],
        'custom-background' => true,
        'custom-header' => true,
        'custom-logo' => true,
        'html5' => ['search-form', 'comment-form', 'comment-list', 'gallery', 'caption'],
        'title-tag' => true,
        'automatic-feed-links' => true,
        'responsive-embeds' => true,
        'wp-block-styles' => true,
        'align-wide' => true,
        'editor-styles' => true,
        'custom-line-height' => true,
        'custom-spacing' => true,
        'custom-units' => true,
        'editor-font-sizes' => true,
        'editor-color-palette' => true,
        'disable-custom-colors' => false,
        'disable-custom-font-sizes' => false,
        'disable-custom-gradients' => false,
    ],

    /*
    |--------------------------------------------------------------------------
    | Layout Settings
    |--------------------------------------------------------------------------
    |
    | Theme layout configurations
    |
    */
    'layout' => [
        'container_width' => '1200px',
        'sidebar_position' => 'right', // left, right, none
        'sidebar_width' => '300px',
        'content_width' => 'calc(100% - 320px)',
        'header_style' => 'default', // default, minimal, centered
        'footer_style' => 'default', // default, minimal, widgetized
        'blog_layout' => 'grid', // list, grid, masonry
        'blog_columns' => 3,
        'single_layout' => 'default', // default, full-width, sidebar
        'archive_layout' => 'default', // default, grid, masonry
        'archive_columns' => 2,
    ],

    /*
    |--------------------------------------------------------------------------
    | Typography Settings
    |--------------------------------------------------------------------------
    |
    | Typography configurations
    |
    */
    'typography' => [
        'body_font' => [
            'family' => 'Inter',
            'weight' => '400',
            'size' => '16px',
            'line_height' => '1.6',
        ],
        'heading_font' => [
            'family' => 'Inter',
            'weight' => '700',
            'line_height' => '1.2',
        ],
        'h1' => [
            'size' => '2.5rem',
            'weight' => '700',
        ],
        'h2' => [
            'size' => '2rem',
            'weight' => '600',
        ],
        'h3' => [
            'size' => '1.5rem',
            'weight' => '600',
        ],
        'h4' => [
            'size' => '1.25rem',
            'weight' => '600',
        ],
        'h5' => [
            'size' => '1.125rem',
            'weight' => '600',
        ],
        'h6' => [
            'size' => '1rem',
            'weight' => '600',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Color Settings
    |--------------------------------------------------------------------------
    |
    | Color scheme configurations
    |
    */
    'colors' => [
        'primary' => '#007cba',
        'secondary' => '#6c757d',
        'success' => '#28a745',
        'danger' => '#dc3545',
        'warning' => '#ffc107',
        'info' => '#17a2b8',
        'light' => '#f8f9fa',
        'dark' => '#343a40',
        'body_bg' => '#ffffff',
        'body_text' => '#212529',
        'link_color' => '#007cba',
        'link_hover_color' => '#005a87',
    ],

    /*
    |--------------------------------------------------------------------------
    | Performance Settings
    |--------------------------------------------------------------------------
    |
    | Performance optimization settings
    |
    */
    'performance' => [
        'lazy_loading' => true,
        'minify_css' => true,
        'minify_js' => true,
        'combine_css' => true,
        'combine_js' => true,
        'preload_critical_css' => true,
        'defer_non_critical_js' => true,
        'optimize_images' => true,
        'webp_support' => true,
        'gzip_compression' => true,
        'browser_caching' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | SEO Settings
    |--------------------------------------------------------------------------
    |
    | SEO optimization settings
    |
    */
    'seo' => [
        'meta_description' => true,
        'meta_keywords' => false,
        'open_graph' => true,
        'twitter_cards' => true,
        'schema_markup' => true,
        'breadcrumbs' => true,
        'canonical_urls' => true,
        'noindex_archive' => false,
        'noindex_search' => true,
        'noindex_author' => false,
        'noindex_date' => false,
    ],

    /*
    |--------------------------------------------------------------------------
    | Social Media Settings
    |--------------------------------------------------------------------------
    |
    | Social media integration settings
    |
    */
    'social' => [
        'facebook' => '',
        'twitter' => '',
        'instagram' => '',
        'linkedin' => '',
        'youtube' => '',
        'pinterest' => '',
        'github' => '',
        'show_share_buttons' => true,
        'share_on_posts' => true,
        'share_on_pages' => false,
    ],

    /*
    |--------------------------------------------------------------------------
    | Customizer Settings
    |--------------------------------------------------------------------------
    |
    | WordPress Customizer settings
    |
    */
    'customizer' => [
        'enable_customizer' => true,
        'sections' => [
            'layout' => true,
            'typography' => true,
            'colors' => true,
            'header' => true,
            'footer' => true,
            'blog' => true,
            'social' => true,
        ],
    ],
];