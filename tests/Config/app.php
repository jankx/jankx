<?php

return [
    'name' => 'Test App',
    'version' => '1.0.0',
    'debug' => true,
    'aliases' => [
        'user' => ['Jankx\Services\UserService'],
        'cache' => ['Jankx\Services\CacheService'],
        'url' => ['Jankx\Managers\UrlManager'],
        'asset' => ['Jankx\Services\AssetService'],
        'menu' => ['Jankx\Services\MenuManager'],
        'sidebar' => ['Jankx\Services\SidebarManager'],
        'footer' => ['Jankx\Services\FooterManager']
    ]
];
