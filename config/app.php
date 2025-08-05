<?php

return [
    'name' => 'Jankx Framework',
    'version' => '2.0.0',
    'providers' => [
        Jankx\Support\Providers\SystemServiceProvider::class,
        Jankx\Support\Providers\DeferredServiceProvider::class,
        Jankx\Support\Providers\TranslationServiceProvider::class,
    ],
    'aliases' => [
        'log' => ['\Jankx\Foundation\Log\Logger'],
        'cache' => ['\Jankx\Services\CacheService'],
        'url' => ['\Jankx\Managers\UrlManager'],
    ],
    'options' => [
        'framework' => 'jankx', // auto, jankx, kirki, redux, wordpress
    ],
];
