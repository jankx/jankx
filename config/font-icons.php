<?php

return [
    'icon_types' => [
        // FontAwesome không được enable mặc định
        'fontawesome' => [
            'enabled' => false,
            'auto_load' => false,
            'version' => '7.0.0',
            'cdn_url' => 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/{version}/css/all.min.css',
            'prefixes' => ['fa', 'fas', 'far', 'fab', 'fal', 'fat'],
            'categories' => ['solid', 'regular', 'brands', 'light', 'thin']
        ],

        // Material Icons - enabled mặc định
        'material' => [
            'enabled' => true,
            'auto_load' => true,
            'version' => '1.3.0',
            'cdn_url' => 'https://fonts.googleapis.com/icon?family=Material+Icons',
            'prefixes' => ['material-icons'],
            'categories' => ['outlined', 'filled', 'rounded', 'sharp', 'two-tone']
        ],

        // Custom Icons - enabled mặc định
        'custom' => [
            'enabled' => true,
            'auto_load' => true,
            'upload_dir' => 'wp-content/uploads/jankx-icons/',
            'allowed_types' => ['svg', 'png', 'jpg', 'jpeg'],
            'prefixes' => ['icon'],
            'categories' => ['general', 'navigation', 'action', 'status']
        ],

        // SVG Icons - enabled mặc định
        'svg' => [
            'enabled' => true,
            'auto_load' => false,
            'upload_dir' => 'wp-content/uploads/jankx-svg-icons/',
            'prefixes' => ['svg-icon'],
            'categories' => ['general', 'brands', 'ui']
        ]
    ],

    'admin_settings' => [
        'per_page' => 50,
        'search_enabled' => true,
        'categories_enabled' => true,
        'preview_enabled' => true,
        'import_export_enabled' => true
    ],

    'cache' => [
        'enabled' => true,
        'duration' => 3600, // 1 hour
        'auto_clear' => true
    ],

    'auto_update' => [
        'enabled' => true,
        'frequency' => 'weekly', // weekly, daily, monthly
        'types' => ['material', 'custom'] // Không bao gồm fontawesome
    ],

    'gutenberg' => [
        'enabled' => true,
        'icon_picker' => true,
        'block_integration' => true
    ],

    'frontend' => [
        'lazy_loading' => true,
        'preload_critical' => true,
        'cache_duration' => 86400 // 24 hours
    ]
];
