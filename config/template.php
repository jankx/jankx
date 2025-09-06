<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Template Engine
    |--------------------------------------------------------------------------
    |
    | This option controls the default template engine that will be used
    | by the Jankx framework. You may set this to any of the engines
    | defined in the "engines" array below.
    |
    | Supported: "jankx", "twig", "blade", "plates"
    |
    */
    'default_engine' => env('JANKX_TEMPLATE_ENGINE', 'jankx'),

    /*
    |--------------------------------------------------------------------------
    | Template Engines Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure the template engines that are available to your
    | application. Each engine has its own configuration options.
    |
    */
    'engines' => [
        'jankx' => [
            'cache' => env('JANKX_TEMPLATE_CACHE', false),
            'cache_path' => WP_CONTENT_DIR . '/cache/jankx-templates',
            'auto_reload' => env('JANKX_TEMPLATE_AUTO_RELOAD', true),
        ],

        'twig' => [
            'cache' => WP_CONTENT_DIR . '/cache/twig',
            'debug' => env('WP_DEBUG', false),
            'auto_reload' => env('WP_DEBUG', false),
            'strict_variables' => false,
            'autoescape' => 'html',
        ],

        'blade' => [
            'cache' => WP_CONTENT_DIR . '/cache/blade',
            'auto_reload' => env('WP_DEBUG', false),
        ],

        'plates' => [
            'cache' => env('JANKX_TEMPLATE_CACHE', false),
            'auto_reload' => env('JANKX_TEMPLATE_AUTO_RELOAD', true),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Template Directories
    |--------------------------------------------------------------------------
    |
    | Here you may specify the directories where your templates are located.
    | These directories will be searched in the order they are listed.
    |
    */
    'directories' => [
        'templates' => get_template_directory() . '/templates',
        'components' => get_template_directory() . '/templates/components',
        'layouts' => get_template_directory() . '/templates/layouts',
        'partials' => get_template_directory() . '/templates/partials',
    ],

    /*
    |--------------------------------------------------------------------------
    | Child Theme Directories
    |--------------------------------------------------------------------------
    |
    | If you are using a child theme, these directories will be added
    | to the template search path with higher priority.
    |
    */
    'child_directories' => [
        'templates' => get_stylesheet_directory() . '/templates',
        'components' => get_stylesheet_directory() . '/templates/components',
        'layouts' => get_stylesheet_directory() . '/templates/layouts',
        'partials' => get_stylesheet_directory() . '/templates/partials',
    ],

    /*
    |--------------------------------------------------------------------------
    | Template Extensions
    |--------------------------------------------------------------------------
    |
    | Here you may specify the file extensions for different template engines.
    |
    */
    'extensions' => [
        'jankx' => '.php',
        'twig' => '.twig',
        'blade' => '.blade.php',
        'plates' => '.php',
    ],

    /*
    |--------------------------------------------------------------------------
    | Global Template Variables
    |--------------------------------------------------------------------------
    |
    | These variables will be available in all templates.
    |
    */
    'globals' => [
        'theme' => [
            'name' => get_template(),
            'version' => wp_get_theme()->get('Version'),
            'directory' => get_template_directory(),
            'url' => get_template_directory_uri(),
        ],
        'site' => [
            'name' => get_bloginfo('name'),
            'description' => get_bloginfo('description'),
            'url' => home_url(),
            'admin_url' => admin_url(),
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Template Caching
    |--------------------------------------------------------------------------
    |
    | Enable or disable template caching. When enabled, compiled templates
    | will be cached to improve performance.
    |
    */
    'cache' => [
        'enabled' => env('JANKX_TEMPLATE_CACHE', false),
        'path' => WP_CONTENT_DIR . '/cache/jankx-templates',
        'lifetime' => 3600, // 1 hour
    ],

    /*
    |--------------------------------------------------------------------------
    | Template Debugging
    |--------------------------------------------------------------------------
    |
    | Enable template debugging to help with development.
    |
    */
    'debug' => [
        'enabled' => env('WP_DEBUG', false),
        'show_comments' => true,
        'show_engine_info' => true,
    ],
];
