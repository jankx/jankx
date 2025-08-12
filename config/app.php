<?php

return [
    'name' => 'Jankx Framework',
    'version' => '2.0.0',
    'providers' => [
        Jankx\Support\Providers\FontsServiceProvider::class,
        Jankx\Support\Providers\FontIconsServiceProvider::class
    ],
    'aliases' => [
        'log' => ['\Jankx\Foundation\Log\Logger'],
        'cache' => ['\Jankx\Services\CacheService'],
        'url' => ['\Jankx\Managers\UrlManager'],
    ],
    'options' => [
        'framework' => 'auto', // auto, jankx, kirki, redux, wordpress
    ],
];
