<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    'id' => 'layout_main',
    'name' => 'Bố cục & Khoảng cách',
    'description' => 'Các tuỳ chọn layout chung',
    'fields' => [
        [
            'id' => 'container_width',
            'name' => 'Chiều rộng container',
            'type' => 'slider',
            'value' => 1200,
            'min' => 960,
            'max' => 1440,
            'step' => 10,
            'units' => 'px',
        ],
        [
            'id' => 'content_spacing',
            'name' => 'Khoảng cách nội dung',
            'type' => 'spacing',
            'top' => '24px',
            'right' => '24px',
            'bottom' => '24px',
            'left' => '24px',
            'units' => 'px',
        ],
        [
            'id' => 'sidebar_position',
            'name' => 'Vị trí sidebar',
            'type' => 'radio',
            'options' => [
                'right' => 'Bên phải',
                'left' => 'Bên trái',
                'none' => 'Không sidebar',
            ],
            'value' => 'right',
        ],
        [
            'id' => 'enable_sticky_header',
            'name' => 'Sticky header',
            'type' => 'switch',
            'value' => 1,
            'on' => 'Bật',
            'off' => 'Tắt',
        ],
        [
            'id' => 'enable_boxed',
            'name' => 'Bật layout boxed',
            'type' => 'checkbox',
            'value' => 0,
        ],
    ],
];

