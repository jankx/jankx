<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    'id' => 'body_typography',
    'name' => __('Body Typography', 'jankx'),
    'description' => __('Configure body text typography', 'jankx'),
    'fields' => [
        [
            'id' => 'body_font_family',
            'name' => __('Body Font Family', 'jankx'),
            'type' => 'select',
            'value' => 'system-ui',
            'default_value' => 'system-ui',
            'sub_title' => __('Choose body font family', 'jankx'),
            'description' => __('Select font for body text', 'jankx'),
            'options' => [
                'system-ui' => __('System UI', 'jankx'),
                'Arial, sans-serif' => __('Arial', 'jankx'),
                'Georgia, serif' => __('Georgia', 'jankx'),
                'Times New Roman, serif' => __('Times New Roman', 'jankx'),
                'Verdana, sans-serif' => __('Verdana', 'jankx'),
                'Helvetica, sans-serif' => __('Helvetica', 'jankx'),
            ],
        ],
        [
            'id' => 'body_font_size',
            'name' => __('Body Font Size', 'jankx'),
            'type' => 'slider',
            'value' => 16,
            'default_value' => 16,
            'sub_title' => __('Set body font size', 'jankx'),
            'description' => __('Adjust body text size (12-24px)', 'jankx'),
            'options' => [
                'min' => 12,
                'max' => 24,
                'step' => 1,
            ],
        ],
        [
            'id' => 'body_line_height',
            'name' => __('Body Line Height', 'jankx'),
            'type' => 'slider',
            'value' => 1.6,
            'default_value' => 1.6,
            'sub_title' => __('Set line height', 'jankx'),
            'description' => __('Adjust line spacing (1.2-2.0)', 'jankx'),
            'options' => [
                'min' => 1.2,
                'max' => 2.0,
                'step' => 0.1,
            ],
        ],
        [
            'id' => 'body_font_weight',
            'name' => __('Body Font Weight', 'jankx'),
            'type' => 'select',
            'value' => '400',
            'default_value' => '400',
            'sub_title' => __('Choose font weight', 'jankx'),
            'description' => __('Select font weight for body text', 'jankx'),
            'options' => [
                '300' => __('Light (300)', 'jankx'),
                '400' => __('Normal (400)', 'jankx'),
                '500' => __('Medium (500)', 'jankx'),
                '600' => __('Semi Bold (600)', 'jankx'),
                '700' => __('Bold (700)', 'jankx'),
            ],
        ],
        [
            'id' => 'body_text_color',
            'name' => __('Body Text Color', 'jankx'),
            'type' => 'color',
            'value' => '#333333',
            'default_value' => '#333333',
            'sub_title' => __('Choose body text color', 'jankx'),
            'description' => __('Color for body text content', 'jankx'),
        ],
    ],
];