<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    'id' => 'header_layout',
    'name' => __('Header Layout', 'jankx'),
    'description' => __('Choose your header layout style', 'jankx'),
    'fields' => [
        [
            'id' => 'header_style',
            'name' => __('Header Style', 'jankx'),
            'type' => 'select',
            'value' => 'default',
            'default_value' => 'default',
            'sub_title' => __('Select header layout style', 'jankx'),
            'description' => __('Choose from available header styles', 'jankx'),
            'options' => [
                'default' => __('Default Header', 'jankx'),
                'centered' => __('Centered Header', 'jankx'),
                'minimal' => __('Minimal Header', 'jankx'),
                'transparent' => __('Transparent Header', 'jankx'),
            ],
        ],
        [
            'id' => 'header_width',
            'name' => __('Header Width', 'jankx'),
            'type' => 'radio',
            'value' => 'container',
            'default_value' => 'container',
            'sub_title' => __('Choose header width', 'jankx'),
            'description' => __('Select header container width', 'jankx'),
            'options' => [
                'container' => __('Container (1200px)', 'jankx'),
                'container-fluid' => __('Full Width', 'jankx'),
                'container-large' => __('Large Container (1400px)', 'jankx'),
            ],
        ],
        [
            'id' => 'sticky_header',
            'name' => __('Sticky Header', 'jankx'),
            'type' => 'switch',
            'value' => false,
            'default_value' => false,
            'sub_title' => __('Enable sticky header', 'jankx'),
            'description' => __('Header will stick to top when scrolling', 'jankx'),
        ],
        [
            'id' => 'header_height',
            'name' => __('Header Height', 'jankx'),
            'type' => 'slider',
            'value' => 80,
            'default_value' => 80,
            'sub_title' => __('Set header height in pixels', 'jankx'),
            'description' => __('Adjust header height (60-120px)', 'jankx'),
            'options' => [
                'min' => 60,
                'max' => 120,
                'step' => 5,
            ],
        ],
    ],
];
