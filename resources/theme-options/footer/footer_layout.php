<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    'id' => 'footer_layout',
    'name' => __('Footer Layout', 'jankx'),
    'description' => __('Configure footer layout and structure', 'jankx'),
    'fields' => [
        [
            'id' => 'footer_columns',
            'name' => __('Footer Columns', 'jankx'),
            'type' => 'select',
            'value' => '4',
            'default_value' => '4',
            'sub_title' => __('Choose number of footer columns', 'jankx'),
            'description' => __('Select how many columns to display', 'jankx'),
            'options' => [
                '1' => __('1 Column', 'jankx'),
                '2' => __('2 Columns', 'jankx'),
                '3' => __('3 Columns', 'jankx'),
                '4' => __('4 Columns', 'jankx'),
            ],
        ],
        [
            'id' => 'footer_width',
            'name' => __('Footer Width', 'jankx'),
            'type' => 'radio',
            'value' => 'container',
            'default_value' => 'container',
            'sub_title' => __('Choose footer width', 'jankx'),
            'description' => __('Select footer container width', 'jankx'),
            'options' => [
                'container' => __('Container (1200px)', 'jankx'),
                'container-fluid' => __('Full Width', 'jankx'),
                'container-large' => __('Large Container (1400px)', 'jankx'),
            ],
        ],
        [
            'id' => 'footer_background',
            'name' => __('Footer Background', 'jankx'),
            'type' => 'color',
            'value' => '#2c3e50',
            'default_value' => '#2c3e50',
            'sub_title' => __('Choose footer background color', 'jankx'),
            'description' => __('Background color for footer area', 'jankx'),
        ],
        [
            'id' => 'footer_text_color',
            'name' => __('Footer Text Color', 'jankx'),
            'type' => 'color',
            'value' => '#ffffff',
            'default_value' => '#ffffff',
            'sub_title' => __('Choose footer text color', 'jankx'),
            'description' => __('Text color for footer content', 'jankx'),
        ],
        [
            'id' => 'show_footer_widgets',
            'name' => __('Show Footer Widgets', 'jankx'),
            'type' => 'switch',
            'value' => true,
            'default_value' => true,
            'sub_title' => __('Display footer widget areas', 'jankx'),
            'description' => __('Show or hide footer widget sections', 'jankx'),
        ],
        [
            'id' => 'footer_padding',
            'name' => __('Footer Padding', 'jankx'),
            'type' => 'slider',
            'value' => 60,
            'default_value' => 60,
            'sub_title' => __('Set footer padding', 'jankx'),
            'description' => __('Adjust footer padding (30-100px)', 'jankx'),
            'options' => [
                'min' => 30,
                'max' => 100,
                'step' => 5,
            ],
        ],
    ],
];
