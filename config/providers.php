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
        ],

        // Admin providers
        'admin' => [
            Jankx\Support\Providers\ThemeServiceProvider::class,
            Jankx\Support\Providers\LayoutServiceProvider::class,
            Jankx\Support\Providers\AssetServiceProvider::class,
            Jankx\Support\Providers\ErrorSuppressionServiceProvider::class,
            Jankx\Support\Providers\PerformanceServiceProvider::class,
        ],

        // REST API providers
        'rest_api' => [
            Jankx\Support\Providers\ThemeServiceProvider::class,
        ],

        // Admin Ajax providers
        'admin_ajax' => [
            Jankx\Support\Providers\ThemeServiceProvider::class,
            Jankx\Support\Providers\AjaxServiceProvider::class,
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
            // Jankx\Providers\WpCliServiceProvider::class,
        ],

        // WP Cron providers
        'wp_cron' => [
            // Jankx\Providers\WpCronServiceProvider::class,
        ],
    ],
];
