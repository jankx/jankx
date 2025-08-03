<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Layout Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the layout configuration for the theme.
    | Menu, sidebar, and footer settings are defined here.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Menu Configuration
    |--------------------------------------------------------------------------
    |
    | Primary menu is always available.
    | Secondary and footer menus are optional.
    |
    */
    'menu' => [
        'primary' => true,      // Always available
        'secondary' => false,    // Optional
        'footer' => false,       // Optional
        'mobile' => true,        // Mobile menu support
    ],

    /*
    |--------------------------------------------------------------------------
    | Sidebar Configuration
    |--------------------------------------------------------------------------
    |
    | Primary sidebar is always available.
    | Secondary sidebar is optional.
    |
    */
    'sidebar' => [
        'primary' => true,       // Always available
        'secondary' => false,    // Optional
    ],

    /*
    |--------------------------------------------------------------------------
    | Footer Configuration
    |--------------------------------------------------------------------------
    |
    | Footer menu and widgets are optional.
    | Widgets columns can be configured.
    |
    */
    'footer' => [
        'menu' => [
            'enabled' => false,  // Footer menu
        ],
        'widgets' => [
            'enabled' => true,   // Footer widgets
            'columns' => 4,      // Number of widget columns (1-6)
        ],
        'content' => '',         // Custom footer content
        'layout' => 'default',   // Footer layout type
    ],
];
