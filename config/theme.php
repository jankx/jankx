<?php

/**
 * Theme Configuration
 *
 * Theme-specific settings and configurations
 *
 * @package Jankx\Config
 * @since 2.0.0
 */


if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    /*
    |--------------------------------------------------------------------------
    | Theme Information
    |--------------------------------------------------------------------------
    |
    | Basic information about the theme for admin dashboard
    |
    */
    'template' => [
        'info' => [
            'name' => 'Jankx',
            'version' => '2.0.0',
            'description' => 'A modern WordPress theme built with Jankx Framework',
            'author' => 'Jankx Team',
            'author_url' => 'https://puleeno.com',
            'theme_url' => 'https://jankx.github.io/jankx/',
            'license' => 'GPL v2 or later',
            'text_domain' => 'jankx',
        ],
    ],
];
