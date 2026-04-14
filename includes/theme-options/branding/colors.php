<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    'id' => 'branding_colors',
    'name' => __('Colors & Logo', 'jankx'),
    'description' => __('Configure brand colors and logo', 'jankx'),
    'fields' => [
        [
            'id' => 'logo_image',
            'name' => __('Primary Logo', 'jankx'),
            'type' => 'image',
            'description' => __('Logo displayed in the header', 'jankx'),
        ],
        [
            'id' => 'primary_color',
            'name' => __('Primary Color', 'jankx'),
            'type' => 'color',
            'value' => '#ff5722',
        ],
        [
            'id' => 'secondary_color',
            'name' => __('Secondary Color', 'jankx'),
            'type' => 'color',
            'value' => '#009688',
        ],
    ],
];
