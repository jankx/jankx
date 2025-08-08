<?php

return [
    'name' => 'Jankx Framework',
    'version' => '2.0.0',
    'providers' => [
        // App\Providers\ExampleServiceProvider::class
    ],
    'aliases' => [
        'log' => ['\Jankx\Foundation\Log\Logger'],
        'cache' => ['\Jankx\Services\CacheService'],
        'url' => ['\Jankx\Managers\UrlManager'],
    ],
    'options' => [
        'framework' => 'redux', // auto, jankx, kirki, redux, wordpress
    ],
];
