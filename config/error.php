<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Error Suppression Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains the error suppression configuration for the theme.
    | Suppress doing_it_wrong messages and other plugin conflicts.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Doing It Wrong Suppression
    |--------------------------------------------------------------------------
    |
    | Suppress doing_it_wrong messages from plugins
    |
    */
    'suppression' => [
        'doing_it_wrong' => [
            'enabled' => false,  // Enable suppression
            'functions' => [
                // Specific functions to suppress
                'wp_enqueue_script',
                'wp_enqueue_style',
            ],
            'patterns' => [
                // Message patterns to suppress
                'wp-editor',
                'widgets editor',
                'customize-widgets',
                'gutenberg-widgets',
            ],
        ],

        /*
        |--------------------------------------------------------------------------
        | PHP Error Suppression
        |--------------------------------------------------------------------------
        |
        | Suppress specific PHP error messages
        |
        */
        'php_errors' => [
            'enabled' => false,  // Disable by default
            'messages' => [
                // Specific error messages to suppress
            ],
        ],

        /*
        |--------------------------------------------------------------------------
        | Admin Notice Suppression
        |--------------------------------------------------------------------------
        |
        | Suppress admin notices from plugins
        |
        */
        'admin_notices' => [
            'enabled' => false,  // Disable by default
            'notices' => [
                // Specific notice callbacks to suppress
            ],
        ],
    ],
];
