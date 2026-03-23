<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    [
        'id' => 'general',
        'name' => 'Tổng quan',
        'args' => [
            'description' => 'Cấu hình cơ bản cho toàn site',
            'priority' => 1,
            'icon' => 'dashicons-admin-generic',
        ],
    ],
    [
        'id' => 'branding',
        'name' => 'Thương hiệu',
        'args' => [
            'description' => 'Logo, màu sắc nhận diện',
            'priority' => 2,
            'icon' => 'dashicons-admin-appearance',
        ],
    ],
    [
        'id' => 'layout',
        'name' => 'Bố cục & Khoảng cách',
        'args' => [
            'description' => 'Layout, khoảng cách, slider',
            'priority' => 3,
            'icon' => 'dashicons-align-center',
        ],
    ],
    [
        'id' => 'typography',
        'name' => 'Typography',
        'args' => [
            'description' => 'Phông chữ và cỡ chữ',
            'priority' => 4,
            'icon' => 'dashicons-editor-textcolor',
        ],
    ],
    [
        'id' => 'blog',
        'name' => 'Blog',
        'args' => [
            'description' => 'Cấu hình trang blog và bài viết',
            'priority' => 5,
            'icon' => 'dashicons-admin-post',
        ],
    ],
    [
        'id' => 'socials',
        'name' => 'Mạng xã hội',
        'args' => [
            'description' => 'Liên kết mạng xã hội và chia sẻ',
            'priority' => 6,
            'icon' => 'dashicons-share',
        ],
    ],
    [
        'id' => 'preset',
        'name' => 'Preset & Layout',
        'args' => [
            'description' => 'Chọn preset giao diện và bố cục trang',
            'priority' => 7,
            'icon' => 'dashicons-layout',
        ],
    ],
];
