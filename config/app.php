<?php

return [
    'name' => 'Jankx Framework',
    'menu_title' => 'Jankx',
    'admin_page_title' => 'Jankx Framework',
    'menu_position' => 59,
    'version' => '2.0.0',
    'providers' => [
        Jankx\Support\Providers\AjaxServiceProvider::class,
        Jankx\Support\Providers\AssetServiceProvider::class,
        Jankx\Support\Providers\ErrorSuppressionServiceProvider::class,
        Jankx\Support\Providers\FontIconsServiceProvider::class,
        Jankx\Support\Providers\FontsServiceProvider::class,
        Jankx\Support\Providers\PerformanceServiceProvider::class,
        Jankx\Support\Providers\PlatesServiceProvider::class,
        Jankx\Support\Providers\ThemeServiceProvider::class,
        Jankx\Support\Providers\WordPressCliServiceProvider::class,

        App\Providers\GutenbergServiceProvider::class,
        App\Providers\LanguageSwitcherServiceProvider::class,
        App\Providers\NavigationBlockServiceProvider::class,
        // App\Providers\SkeletonServiceProvider::class,

        // App\Providers\WooCommerce\BuyNowServiceProvider::class,
        // App\Providers\WooCommerce\EmptyPriceServiceProvider::class,
        // App\Providers\WooCommerce\SaleBadgeServiceProvider::class,
        // App\Providers\WordPress\ApplyTermHtmlDescriptionServiceProvider::class,
        // App\Providers\WordPress\VisualTermDescriptionEditorServiceProvider::class,
    ],
    'aliases' => [
        'cache' => ['\Jankx\Services\CacheService'],
        'url' => ['\Jankx\Managers\UrlManager'],
    ],
    'options' => [
        'framework' => 'jankx', // auto, jankx, kirki, redux, wordpress
    ],
];
