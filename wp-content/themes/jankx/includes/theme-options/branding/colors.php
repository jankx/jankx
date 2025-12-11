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
            'id' => 'logo_dark',
            'name' => 'Logo nền sáng',
            'type' => 'image',
        ],
        [
            'id' => 'logo_light',
            'name' => 'Logo nền tối',
            'type' => 'image',
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
        [
            'id' => 'background_global',
            'name' => 'Background chung',
            'type' => 'background',
            'background-color' => '#ffffff',
            'background-image' => '',
            'background-repeat' => 'no-repeat',
            'background-position' => 'center center',
            'background-size' => 'cover',
        ],
        [
            'id' => 'favicon_icon',
            'name' => 'Favicon',
            'type' => 'icon',
            'description' => 'Dùng cho hiển thị favicon hoặc icon set',
        ],
    ],
];

