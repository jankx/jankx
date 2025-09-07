<?php

return [
    /*
    |--------------------------------------------------------------------------
    | HTTP Kernel Providers
    |--------------------------------------------------------------------------
    |
    | These providers will be loaded for HTTP requests (frontend, admin, etc.)
    |
    */
    'http' => [
        // Frontend providers
        'frontend' => [
            Jankx\Support\Providers\ThemeServiceProvider::class,
            Jankx\Support\Providers\LayoutServiceProvider::class,
            Jankx\Support\Providers\AssetServiceProvider::class,
            Jankx\Support\Providers\PerformanceServiceProvider::class,
            Jankx\Support\Providers\PlatesServiceProvider::class,
            Jankx\Framework\Providers\PageRendererServiceProvider::class,
            Jankx\Framework\Providers\LegacyTemplateLoaderServiceProvider::class,

            App\Providers\GutenbergServiceProvider::class,
            App\Providers\LanguageSwitcherServiceProvider::class,
            App\Providers\NavigationBlockServiceProvider::class,
            App\Providers\WooCommerce\EmptyPriceServiceProvider::class,
            App\Providers\WordPress\ApplyTermHtmlDescriptionServiceProvider::class,
            App\Providers\WooCommerce\BuyNowServiceProvider::class,
            App\Providers\WooCommerce\SaleBadgeServiceProvider::class,
            App\Providers\DefaultThumbnailServiceProvider::class,
        ],

        // Admin providers
        'admin' => [
            Jankx\Support\Providers\ThemeServiceProvider::class,
            Jankx\Support\Providers\PlatesServiceProvider::class,
            Jankx\Support\Providers\PerformanceServiceProvider::class,
            Jankx\Support\Providers\LayoutServiceProvider::class,
            Jankx\Support\Providers\JankxMenuItemsServiceProvider::class,
            Jankx\Support\Providers\ErrorSuppressionServiceProvider::class,
            Jankx\Support\Providers\AssetServiceProvider::class,

            App\Providers\WordPress\VisualTermDescriptionEditorServiceProvider::class,
            App\Providers\NavigationBlockServiceProvider::class,
            App\Providers\GutenbergServiceProvider::class,
        ],

        // REST API providers
        'rest' => [
            Jankx\Support\Providers\ThemeServiceProvider::class,
        ],

        // Admin Ajax providers
        'admin_ajax' => [
            Jankx\Support\Providers\ThemeServiceProvider::class,
            Jankx\Support\Providers\AjaxServiceProvider::class,

            App\Providers\GutenbergServiceProvider::class,
            App\Providers\LanguageSwitcherServiceProvider::class,
            App\Providers\NavigationBlockServiceProvider::class,
            App\Providers\WooCommerce\EmptyPriceServiceProvider::class,
            App\Providers\WooCommerce\BuyNowServiceProvider::class,
            App\Providers\WooCommerce\SaleBadgeServiceProvider::class,
            App\Providers\DefaultThumbnailServiceProvider::class,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Console Kernel Providers
    |--------------------------------------------------------------------------
    |
    | These providers will be loaded for console requests (WP CLI, WP Cron)
    |
    */
    'console' => [
        // WP CLI providers
        'wp_cli' => [
            \Jankx\Support\Providers\WordPressCliServiceProvider::class,
        ],

        // WP Cron providers
        'wp_cron' => [
        ],
    ],
];
