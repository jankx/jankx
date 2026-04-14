<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    'id' => 'typography_fonts',
    'name' => __('Fonts', 'jankx'),
    'description' => __('Configure fonts for headings and content', 'jankx'),
    'fields' => [
        [
            'id' => 'body_typography',
            'name' => __('Body Font', 'jankx'),
            'type' => 'typography',
            'font-family' => 'Inter',
            'font-size' => '16px',
            'font-weight' => '400',
            'line-height' => '1.6',
            'color' => '#222222',
        ],
    ],
];
