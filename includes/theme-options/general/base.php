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
        [
            'id' => 'enable_sticky_header',
            'name' => __('Enable Sticky Header', 'jankx'),
            'type' => 'switch',
            'value' => 0,
            'on' => __('On', 'jankx'),
            'off' => __('Off', 'jankx'),
            'description' => __('Make the header sticky when scrolling', 'jankx'),
        ],
        [
            'id' => 'sticky_header_trigger',
            'name' => __('Sticky Header Trigger', 'jankx'),
            'type' => 'select',
            'options' => [
                'top' => __('Top of Page', 'jankx'),
                'hero' => __('After Hero Carousel', 'jankx'),
                'first_group' => __('After First Section', 'jankx'),
            ],
            'value' => 'top',
            'description' => __('Define when the header should become sticky', 'jankx'),
        ],
    ],
];
