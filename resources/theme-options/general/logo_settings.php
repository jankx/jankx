<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    'id' => 'logo_settings',
    'name' => __('Logo Settings', 'jankx'),
    'description' => __('Configure your site logo and branding', 'jankx'),
    'fields' => [
        [
            'id' => 'site_logo',
            'name' => __('Site Logo', 'jankx'),
            'type' => 'image',
            'value' => '',
            'default_value' => '',
            'sub_title' => __('Upload your site logo', 'jankx'),
            'description' => __('Recommended size: 200x60px', 'jankx'),
            'options' => [
                'preview_size' => 'medium',
            ],
        ],
        [
            'id' => 'logo_width',
            'name' => __('Logo Width', 'jankx'),
            'type' => 'slider',
            'value' => 200,
            'default_value' => 200,
            'sub_title' => __('Set logo width in pixels', 'jankx'),
            'description' => __('Adjust logo width (100-400px)', 'jankx'),
            'options' => [
                'min' => 100,
                'max' => 400,
                'step' => 10,
            ],
        ],
        [
            'id' => 'logo_position',
            'name' => __('Logo Position', 'jankx'),
            'type' => 'select',
            'value' => 'left',
            'default_value' => 'left',
            'sub_title' => __('Choose logo position', 'jankx'),
            'description' => __('Select where to display the logo', 'jankx'),
            'options' => [
                'left' => __('Left', 'jankx'),
                'center' => __('Center', 'jankx'),
                'right' => __('Right', 'jankx'),
            ],
        ],
        [
            'id' => 'show_site_title',
            'name' => __('Show Site Title', 'jankx'),
            'type' => 'switch',
            'value' => true,
            'default_value' => true,
            'sub_title' => __('Display site title next to logo', 'jankx'),
            'description' => __('Show or hide the site title', 'jankx'),
        ],
    ],
];