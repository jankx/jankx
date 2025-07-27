<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Deferred Service Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for deferred service loading and context-aware service management
    |
    */

    'enabled' => env('JANKX_DEFERRED_SERVICES', true),

    'monitoring' => [
        'enabled' => env('JANKX_SERVICE_MONITORING', false),
        'log_metrics' => env('JANKX_LOG_SERVICE_METRICS', false),
    ],

    'contexts' => [
        'admin' => [
            'services' => [
                \Jankx\Admin\AdminManager::class,
                \Jankx\Admin\MenuManager::class,
                \Jankx\Admin\AssetManager::class,
                \Jankx\Admin\NoticeManager::class,
                \Jankx\Services\UserService::class,
            ],
            'deferred' => [
                \Jankx\Admin\DashboardManager::class,
                \Jankx\Admin\SettingsManager::class,
                \Jankx\Admin\AnalyticsManager::class,
                \Jankx\Admin\ReportManager::class,
                \Jankx\Admin\DashboardWidgetManager::class,
            ],
            'priority' => 20,
        ],

        'frontend' => [
            'services' => [
                \Jankx\Frontend\AssetManager::class,
                \Jankx\Frontend\TemplateManager::class,
                \Jankx\Frontend\ContentManager::class,
                \Jankx\Services\UserService::class,
            ],
            'deferred' => [
                \Jankx\SEO\SEOManager::class,
                \Jankx\Analytics\AnalyticsManager::class,
                \Jankx\Template\TemplateRenderer::class,
                \Jankx\Frontend\AssetOptimizer::class,
            ],
            'priority' => 15,
        ],

        'api' => [
            'services' => [
                \Jankx\API\APIManager::class,
                \Jankx\API\EndpointManager::class,
                \Jankx\API\AuthenticationManager::class,
                \Jankx\API\ResponseFormatter::class,
            ],
            'deferred' => [
                \Jankx\API\RateLimiter::class,
                \Jankx\API\CacheManager::class,
            ],
            'priority' => 10,
        ],

        'cli' => [
            'services' => [
                // CLI services are minimal for now
                // Will be implemented when needed
                // \Jankx\CLI\CommandManager::class,
                // \Jankx\CLI\OutputManager::class,
                // \Jankx\CLI\ProgressBar::class,
            ],
            'deferred' => [
                // \Jankx\CLI\ReportGenerator::class,
                // \Jankx\CLI\DataExporter::class,
            ],
            'priority' => 5,
        ],

        'gutenberg' => [
            'services' => [
                \Jankx\Gutenberg\EditorManager::class,
                \Jankx\Gutenberg\BlockRenderer::class,
                \Jankx\Gutenberg\LayoutManager::class,
            ],
            'deferred' => [
                \Jankx\Gutenberg\BlockRegistry::class,
                \Jankx\Gutenberg\LayoutRegistry::class,
                \Jankx\Gutenberg\AjaxHandler::class,
            ],
            'priority' => 25,
        ],

        'woocommerce' => [
            'services' => [
                \Jankx\WooCommerce\WooCommerceManager::class,
                \Jankx\WooCommerce\ProductManager::class,
                \Jankx\WooCommerce\CartManager::class,
            ],
            'deferred' => [
                \Jankx\WooCommerce\CheckoutManager::class,
                \Jankx\WooCommerce\OrderManager::class,
                \Jankx\WooCommerce\PaymentManager::class,
            ],
            'priority' => 30,
        ],
    ],

    'core_services' => [
        \Jankx\Config\ConfigManager::class,
        \Jankx\Logger\Logger::class,
        \Jankx\Security\SecurityManager::class,
        \Jankx\Performance\PerformanceMonitor::class,
    ],

    'performance' => [
        'max_memory_usage' => env('JANKX_MAX_MEMORY_USAGE', 128 * 1024 * 1024), // 128MB
        'max_load_time' => env('JANKX_MAX_LOAD_TIME', 0.5), // 500ms
        'cache_ttl' => env('JANKX_SERVICE_CACHE_TTL', 3600), // 1 hour
    ],

    'debug' => [
        'log_resolution' => env('JANKX_LOG_SERVICE_RESOLUTION', false),
        'log_performance' => env('JANKX_LOG_SERVICE_PERFORMANCE', false),
        'show_metrics' => env('JANKX_SHOW_SERVICE_METRICS', false),
    ],
];