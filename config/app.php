<?php

return [
    'name' => 'JANKX PRO',
    'menu_title' => 'JANKX PRO',
    'admin_page_title' => 'JANKX PRO',
    'menu_position' => 59,
    'version' => '1.0.0',
    'providers' => [
        Jankx\Support\Providers\AjaxServiceProvider::class,
        Jankx\Support\Providers\AssetServiceProvider::class,
        Jankx\Support\Providers\ErrorSuppressionServiceProvider::class,
        Jankx\Support\Providers\FontIconsServiceProvider::class,
        Jankx\Support\Providers\FontsServiceProvider::class,
        Jankx\Support\Providers\ThemeOptionsServiceProvider::class,
        App\Providers\ThemeOptionsIntegrationServiceProvider::class,
        Jankx\Support\Providers\PerformanceServiceProvider::class,
        Jankx\Support\Providers\TemplateEngineServiceProvider::class,
        Jankx\Support\Providers\ThemeServiceProvider::class,
        Jankx\Support\Providers\WordPressCliServiceProvider::class,
        Jankx\Support\Providers\ExtensionServiceProvider::class,
        Jankx\Support\Providers\EnvatoServiceProvider::class,

        App\Providers\GutenbergServiceProvider::class,
        App\MenuBuilder\ServiceProvider::class,
        Jankx\Support\Providers\ContentLayoutServiceProvider::class,

        // App\Providers\WooCommerce\EmptyPriceServiceProvider::class,
        // App\Providers\WordPress\ApplyTermHtmlDescriptionServiceProvider::class,
        // App\Providers\WordPress\VisualTermDescriptionEditorServiceProvider::class,
        App\Providers\WordPress\AdminThumbnailColumnStyleServiceProvider::class,
        App\Providers\ImageSizeServiceProvider::class,

    ],
    'aliases' => [
        'cache' => ['\Jankx\Services\CacheService'],
        'url' => ['\Jankx\Managers\UrlManager'],
    ],
    'options' => [
        'framework' => 'jankx', // auto, jankx, kirki, redux, wordpress
        'sync_with_customizer' => true, // only for jankx option framework
    ],
    'cli' => [
        'commands' => [
            // Register demo data command from child config; parent provider will bind and register
            // 'jankx demo-data' => \Jankx\Foundation\Cli\Commands\DemoDataCommand::class,
        ],
    ],
    'custom_blocks' => [
        'timeline' => [
            'enabled' => true,
            'post_types' => ['post'],
            'image_enabled' => true,
        ],
        'per_unit' => [
            'enabled' => true,
            'post_types' => ['product'],
            'meta_key' => '_unit',
        ],
    ],
    'extensions' => [
        'jankx_version' => '2.0.0', // Target Jankx version (optional, defaults to current theme version)
        'required' => [
            // 'jankx-ux' => '^1.0.0',
            // 'jankx-dashboard' => 'v1.2.3',
        ],
        'recommended' => [
        ],
    ],
];
