<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    'id' => 'layout_main',
    'name' => __('Layout & Spacing', 'jankx'),
    'description' => __('General layout options', 'jankx'),
    'fields' => [
        [
            'id' => 'container_width',
            'name' => __('Container Width', 'jankx'),
            'type' => 'slider',
            'value' => 1200,
            'min' => 960,
            'max' => 1440,
            'step' => 10,
            'units' => 'px',
        ],
        [
            'id' => 'sidebar_position',
            'name' => __('Sidebar Position', 'jankx'),
            'type' => 'radio',
            'options' => [
                'right' => __('Right', 'jankx'),
                'left' => __('Left', 'jankx'),
                'none' => __('No Sidebar', 'jankx'),
            ],
            'value' => 'right',
        ],
    ],
];
