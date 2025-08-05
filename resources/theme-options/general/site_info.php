<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    'id' => 'site_info',
    'name' => __('Site Information', 'jankx'),
    'description' => __('Basic site information settings', 'jankx'),
    'fields' => [
        [
            'id' => 'site_title',
            'name' => __('Site Title', 'jankx'),
            'type' => 'text',
            'value' => '',
            'default_value' => __('My Website', 'jankx'),
            'sub_title' => __('Enter your site title', 'jankx'),
            'description' => __('This will be displayed in browser tab', 'jankx'),
        ],
        [
            'id' => 'site_tagline',
            'name' => __('Site Tagline', 'jankx'),
            'type' => 'text',
            'value' => '',
            'default_value' => __('Just another WordPress site', 'jankx'),
            'sub_title' => __('Enter your site tagline', 'jankx'),
            'description' => __('A short description of your site', 'jankx'),
        ],
        [
            'id' => 'site_description',
            'name' => __('Site Description', 'jankx'),
            'type' => 'textarea',
            'value' => '',
            'default_value' => '',
            'sub_title' => __('Enter your site description', 'jankx'),
            'description' => __('This will be used for SEO meta description', 'jankx'),
        ],
    ],
];