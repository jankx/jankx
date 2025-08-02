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
            // Jankx\Providers\FrontendServiceProvider::class,
        ],
        
        // Admin providers
        'admin' => [
            // Jankx\Providers\AdminServiceProvider::class,
        ],
        
        // REST API providers
        'rest_api' => [
            // Jankx\Providers\RestApiServiceProvider::class,
        ],
        
        // Admin Ajax providers
        'admin_ajax' => [
            // Jankx\Providers\AdminAjaxServiceProvider::class,
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

    /*
    |--------------------------------------------------------------------------
    | Global Providers
    |--------------------------------------------------------------------------
    |
    | These providers will be loaded for all request types
    |
    */
    'global' => [
        // Jankx\Providers\AppServiceProvider::class,
        // Jankx\Providers\EventServiceProvider::class,
        // Jankx\Providers\RouteServiceProvider::class,
    ],
]; 