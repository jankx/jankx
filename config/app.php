<?php

/**
 * Application Configuration
 *
 * Service providers, bootstrappers, and core configurations
 *
 * @package Jankx\Config
 * @since 2.0.0
 */

return [
    /*
    |--------------------------------------------------------------------------
    | Service Providers
    |--------------------------------------------------------------------------
    |
    | Service providers are loaded based on the current context.
    | Each context can have its own set of service providers.
    |
    */
    'providers' => [
        // Global providers (loaded in all contexts)
        'global' => [
            'Jankx\Providers\CoreServiceProvider',
        ],

        // Admin context providers
        'admin' => [
            'Jankx\Providers\AdminServiceProvider',
            'Jankx\Providers\GutenbergServiceProvider',
        ],

        // Frontend context providers
        'frontend' => [
            'Jankx\Providers\FrontendServiceProvider',
            'Jankx\Providers\AssetServiceProvider',
            'Jankx\Providers\DebugServiceProvider',
        ],

        // CLI context providers
        'cli' => [
            'Jankx\Providers\CLIServiceProvider',
        ],

        // API context providers
        'api' => [
            'Jankx\Providers\APIServiceProvider',
        ],

        // AJAX context providers
        'ajax' => [
            'Jankx\Providers\AdminServiceProvider',
        ],

        // 404 context providers
        'not_found' => [
            // No specific providers for 404 pages
        ],
    ],



    /*
    |--------------------------------------------------------------------------
    | Service Provider Priority
    |--------------------------------------------------------------------------
    |
    | Priority order for loading service providers.
    | Lower numbers are loaded first.
    |
    */
    'provider_priority' => [
        'Jankx\Providers\AdminServiceProvider' => 10,
        'Jankx\Providers\FrontendServiceProvider' => 10,
        'Jankx\Providers\CLIServiceProvider' => 10,
        'Jankx\Providers\APIServiceProvider' => 10,
        'Jankx\Providers\GutenbergServiceProvider' => 20,
        'Jankx\Providers\AssetServiceProvider' => 30,
        'Jankx\Providers\DebugServiceProvider' => 40,
    ],
];
