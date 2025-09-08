<?php

return [
    /*
    |--------------------------------------------------------------------------
    | WooCommerce Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration options for WooCommerce integration
    |
    */
    'product' => [
        'price' => [
            /*
            |--------------------------------------------------------------------------
            | Empty Price Text
            |--------------------------------------------------------------------------
            |
            | Text to display when product has no price
            |
            */
            'empty_text' => 'Liên hệ',

            /*
            |--------------------------------------------------------------------------
            | Empty Price CSS Classes
            |--------------------------------------------------------------------------
            |
            | CSS classes to add to empty price element
            |
            */
            'empty_classes' => [
                'price',
                'empty-price',
                'jankx-empty-price'
            ],

            /*
            |--------------------------------------------------------------------------
            | Empty Price HTML Structure
            |--------------------------------------------------------------------------
            |
            | HTML structure for empty price display
            | Available placeholders: {text}, {classes}, {attributes}
            |
            */
            'empty_html' => '<span class="{classes}" {attributes}>{text}</span>',
        ],

        /*
        |--------------------------------------------------------------------------
        | Product Display Options
        |--------------------------------------------------------------------------
        |
        | Options for product display and behavior
        |
        */
        'display' => [
            'show_empty_price' => true,
            'hide_add_to_cart' => false,
            'show_contact_button' => true,
        ],

        /*
        |--------------------------------------------------------------------------
        | Product Types Support
        |--------------------------------------------------------------------------
        |
        | Which product types to apply empty price handling
        |
        */
        'supported_types' => [
            'simple',
            'variable',
            'grouped',
            'external',
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | WooCommerce Hooks
    |--------------------------------------------------------------------------
    |
    | Configuration for WooCommerce hooks and filters
    |
    */
    'hooks' => [
        // WooCommerce original hooks (for triggering empty price hooks)
        'price_html' => [
            'priority' => 10,
            'accepted_args' => 2,
        ],
        'variable_price_html' => [
            'priority' => 10,
            'accepted_args' => 2,
        ],
        'grouped_price_html' => [
            'priority' => 10,
            'accepted_args' => 2,
        ],
        'external_price_html' => [
            'priority' => 10,
            'accepted_args' => 2,
        ],

        // Custom empty price hooks
        'empty_price_html' => [
            'priority' => 10,
            'accepted_args' => 2,
        ],
        'variable_empty_price_html' => [
            'priority' => 10,
            'accepted_args' => 2,
        ],
        'grouped_empty_price_html' => [
            'priority' => 10,
            'accepted_args' => 2,
        ],
        'external_empty_price_html' => [
            'priority' => 10,
            'accepted_args' => 2,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | WooCommerce Filters
    |--------------------------------------------------------------------------
    |
    | Configuration for custom filters
    |
    */
    'filters' => [
        'empty_price_html' => [
            'name' => 'jankx_woocommerce_empty_price_html',
            'priority' => 10,
            'accepted_args' => 3,
        ],
        'empty_price_classes' => [
            'name' => 'jankx_woocommerce_empty_price_classes',
            'priority' => 10,
            'accepted_args' => 2,
        ],
        'empty_price_attributes' => [
            'name' => 'jankx_woocommerce_empty_price_attributes',
            'priority' => 10,
            'accepted_args' => 2,
        ],
    ],
];
