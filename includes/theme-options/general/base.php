<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    'id' => 'general_base',
    'name' => 'Thiết lập chung',
    'description' => 'Các tuỳ chọn cơ bản',
    'fields' => [
        [
            'id' => 'site_title',
            'name' => 'Tiêu đề site',
            'type' => 'text',
            'value' => get_option('blogname'),
            'default_value' => 'Jankx Theme',
            'description' => 'Hiển thị tại header và SEO title fallback',
        ],
        [
            'id' => 'site_tagline',
            'name' => 'Mô tả ngắn',
            'type' => 'textarea',
            'value' => get_option('blogdescription'),
            'description' => 'Hiển thị ở một số block hero/footer',
        ],
        [
            'id' => 'enable_back_to_top',
            'name' => 'Bật nút Back to Top',
            'type' => 'switch',
            'value' => 1,
            'on' => 'Bật',
            'off' => 'Tắt',
            'description' => 'Hiển thị nút cuộn lên đầu trang',
        ],
    ],
];
