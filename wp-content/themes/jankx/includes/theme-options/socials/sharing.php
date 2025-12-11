<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    'id' => 'socials_sharing',
    'name' => 'Chia sẻ bài viết',
    'description' => 'Cấu hình các nút chia sẻ trên bài viết',
    'fields' => [
        [
            'id' => 'enable_social_sharing',
            'name' => 'Bật nút chia sẻ',
            'type' => 'switch',
            'value' => 1,
            'on' => 'Bật',
            'off' => 'Tắt',
            'description' => 'Hiển thị nút chia sẻ ở cuối bài viết',
        ],
        [
            'id' => 'sharing_networks',
            'name' => 'Mạng xã hội chia sẻ',
            'type' => 'checkbox',
            'options' => [
                'facebook' => 'Facebook',
                'twitter' => 'Twitter/X',
                'linkedin' => 'LinkedIn',
                'pinterest' => 'Pinterest',
                'whatsapp' => 'WhatsApp',
                'telegram' => 'Telegram',
                'email' => 'Email',
            ],
            'value' => ['facebook', 'twitter', 'linkedin'],
            'description' => 'Chọn các mạng xã hội hiển thị nút chia sẻ',
        ],
        [
            'id' => 'sharing_position',
            'name' => 'Vị trí hiển thị',
            'type' => 'radio',
            'options' => [
                'before_content' => 'Trước nội dung',
                'after_content' => 'Sau nội dung',
                'both' => 'Cả hai vị trí',
                'floating' => 'Nổi bên trái/phải',
            ],
            'value' => 'after_content',
        ],
        [
            'id' => 'sharing_style',
            'name' => 'Kiểu hiển thị',
            'type' => 'select',
            'options' => [
                'icons' => 'Chỉ icon',
                'text' => 'Chỉ text',
                'both' => 'Icon + Text',
            ],
            'value' => 'icons',
        ],
    ],
];

