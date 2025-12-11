<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    'id' => 'branding_colors',
    'name' => 'Màu sắc & Logo',
    'description' => 'Thiết lập màu nhận diện và logo',
    'fields' => [
        [
            'id' => 'logo_image',
            'name' => 'Logo chính',
            'type' => 'image',
            'description' => 'Logo hiển thị ở header',
        ],
        [
            'id' => 'primary_color',
            'name' => 'Màu chủ đạo',
            'type' => 'color',
            'value' => '#ff5722',
        ],
        [
            'id' => 'secondary_color',
            'name' => 'Màu phụ',
            'type' => 'color',
            'value' => '#009688',
        ],
    ],
];
