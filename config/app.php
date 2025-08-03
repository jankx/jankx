<?php

return [
    'name' => 'Jankx Framework',
    'version' => '2.0.0',
    'providers' => [
        Jankx\Support\Providers\SystemServiceProvider::class,
        Jankx\Support\Providers\LazyServiceProvider::class,
        Jankx\Support\Providers\TranslationServiceProvider::class,
    ],
    'aliases' => [
        'log' => ['\Jankx\Foundation\Log\Logger'],
        'cache' => ['\Jankx\Services\CacheService'],
        'url' => ['\Jankx\Managers\UrlManager'],
    ],
];
