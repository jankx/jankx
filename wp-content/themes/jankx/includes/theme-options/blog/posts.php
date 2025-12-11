<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    'id' => 'blog_posts',
    'name' => 'Bài viết',
    'description' => 'Hiển thị và meta cho bài viết',
    'fields' => [
        [
            'id' => 'blog_layout',
            'name' => 'Layout blog',
            'type' => 'select',
            'options' => [
                'grid' => 'Lưới',
                'list' => 'Danh sách',
                'masonry' => 'Masonry',
            ],
            'value' => 'grid',
        ],
        [
            'id' => 'show_post_meta',
            'name' => 'Hiển thị meta (tác giả, ngày)',
            'type' => 'checkbox',
            'value' => 1,
        ],
        [
            'id' => 'excerpt_length',
            'name' => 'Độ dài tóm tắt',
            'type' => 'slider',
            'value' => 30,
            'min' => 10,
            'max' => 80,
            'step' => 1,
        ],
        [
            'id' => 'featured_ratio',
            'name' => 'Tỉ lệ ảnh đại diện',
            'type' => 'select',
            'options' => [
                '16x9' => '16:9',
                '4x3' => '4:3',
                '1x1' => '1:1',
            ],
            'value' => '16x9',
        ],
        [
            'id' => 'readmore_label',
            'name' => 'Nhãn nút Đọc tiếp',
            'type' => 'text',
            'value' => 'Đọc tiếp',
        ],
    ],
];

