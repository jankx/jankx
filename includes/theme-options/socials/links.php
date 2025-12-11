<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    'id' => 'socials_links',
    'name' => 'Liên kết mạng xã hội',
    'description' => 'Thêm URL các mạng xã hội để hiển thị ở header, footer hoặc widget. Bạn có thể tự thêm mạng xã hội mới bằng nút "Add Custom Profile"',
    'fields' => [
        [
            'id' => 'social_profiles',
            'name' => 'Mạng xã hội',
            'type' => 'social_profiles',
            'subtitle' => 'Quản lý các liên kết mạng xã hội. Click vào icon để bật/tắt, kéo thả để sắp xếp thứ tự.',
        ],
    ],
];
