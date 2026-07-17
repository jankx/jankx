<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    'id' => 'general_base',
    'name' => __('General Settings', 'jankx'),
    'description' => __('Basic configuration options', 'jankx'),
    'fields' => [
        [
            'id' => 'site_title',
            'name' => __('Site Title', 'jankx'),
            'type' => 'text',
            'value' => get_option('blogname'),
            'option_name' => 'blogname',
        ],
        [
            'id' => 'site_tagline',
            'name' => __('Tagline', 'jankx'),
            'type' => 'textarea',
            'value' => get_option('blogdescription'),
            'option_name' => 'blogdescription',
        ],
        [
            'id' => 'enable_back_to_top',
            'name' => __('Enable Back to Top', 'jankx'),
            'type' => 'switch',
            'value' => 1,
            'on' => __('On', 'jankx'),
            'off' => __('Off', 'jankx'),
            'description' => __('Display a scroll-to-top button', 'jankx'),
        ],
    ],
];
