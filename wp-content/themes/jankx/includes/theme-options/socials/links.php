<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    'id' => 'socials_links',
    'name' => 'Liên kết mạng xã hội',
    'description' => 'Thêm URL các mạng xã hội để hiển thị ở header, footer hoặc widget',
    'fields' => [
        [
            'id' => 'facebook_url',
            'name' => 'Facebook',
            'type' => 'text',
            'value' => '',
            'description' => 'URL trang Facebook (ví dụ: https://facebook.com/yourpage)',
        ],
        [
            'id' => 'twitter_url',
            'name' => 'Twitter/X',
            'type' => 'text',
            'value' => '',
            'description' => 'URL tài khoản Twitter/X',
        ],
        [
            'id' => 'instagram_url',
            'name' => 'Instagram',
            'type' => 'text',
            'value' => '',
            'description' => 'URL tài khoản Instagram',
        ],
        [
            'id' => 'youtube_url',
            'name' => 'YouTube',
            'type' => 'text',
            'value' => '',
            'description' => 'URL kênh YouTube',
        ],
        [
            'id' => 'linkedin_url',
            'name' => 'LinkedIn',
            'type' => 'text',
            'value' => '',
            'description' => 'URL trang LinkedIn',
        ],
        [
            'id' => 'pinterest_url',
            'name' => 'Pinterest',
            'type' => 'text',
            'value' => '',
            'description' => 'URL tài khoản Pinterest',
        ],
        [
            'id' => 'tiktok_url',
            'name' => 'TikTok',
            'type' => 'text',
            'value' => '',
            'description' => 'URL tài khoản TikTok',
        ],
        [
            'id' => 'zalo_url',
            'name' => 'Zalo',
            'type' => 'text',
            'value' => '',
            'description' => 'URL trang Zalo Official Account',
        ],
        [
            'id' => 'telegram_url',
            'name' => 'Telegram',
            'type' => 'text',
            'value' => '',
            'description' => 'URL kênh Telegram',
        ],
        [
            'id' => 'github_url',
            'name' => 'GitHub',
            'type' => 'text',
            'value' => '',
            'description' => 'URL tài khoản GitHub',
        ],
    ],
];

