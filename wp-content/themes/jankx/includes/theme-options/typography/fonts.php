<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    'id' => 'typography_fonts',
    'name' => 'Phông chữ',
    'description' => 'Thiết lập font cho tiêu đề và nội dung',
    'fields' => [
        [
            'id' => 'body_typography',
            'name' => 'Body font',
            'type' => 'typography',
            'font-family' => 'Inter',
            'font-size' => '16px',
            'font-weight' => '400',
            'line-height' => '1.6',
            'color' => '#222222',
        ],
        [
            'id' => 'heading_typography',
            'name' => 'Heading font',
            'type' => 'typography',
            'font-family' => 'Inter',
            'font-size' => '28px',
            'font-weight' => '700',
            'line-height' => '1.3',
            'color' => '#111111',
        ],
    ],
];

