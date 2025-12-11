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
    ],
];
