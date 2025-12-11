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
    ],
];
