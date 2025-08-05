<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    'id' => 'primary_colors',
    'name' => __('Primary Colors', 'jankx'),
    'description' => __('Configure primary color scheme', 'jankx'),
    'fields' => [
        [
            'id' => 'primary_color',
            'name' => __('Primary Color', 'jankx'),
            'type' => 'color',
            'value' => '#007cba',
            'default_value' => '#007cba',
            'sub_title' => __('Choose primary color', 'jankx'),
            'description' => __('Main brand color for your theme', 'jankx'),
        ],
        [
            'id' => 'primary_hover',
            'name' => __('Primary Hover', 'jankx'),
            'type' => 'color',
            'value' => '#005a87',
            'default_value' => '#005a87',
            'sub_title' => __('Choose hover color', 'jankx'),
            'description' => __('Color for hover states', 'jankx'),
        ],
        [
            'id' => 'primary_text',
            'name' => __('Primary Text Color', 'jankx'),
            'type' => 'color',
            'value' => '#ffffff',
            'default_value' => '#ffffff',
            'sub_title' => __('Choose text color on primary', 'jankx'),
            'description' => __('Text color on primary background', 'jankx'),
        ],
        [
            'id' => 'primary_border',
            'name' => __('Primary Border Color', 'jankx'),
            'type' => 'color',
            'value' => '#005a87',
            'default_value' => '#005a87',
            'sub_title' => __('Choose border color', 'jankx'),
            'description' => __('Border color for primary elements', 'jankx'),
        ],
    ],
];