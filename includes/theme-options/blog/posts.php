<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    'id' => 'blog_posts',
    'name' => __('Blog Posts', 'jankx'),
    'description' => __('Display and metadata settings for blog posts', 'jankx'),
    'fields' => [
        [
            'id' => 'blog_layout',
            'name' => __('Blog Layout', 'jankx'),
            'type' => 'select',
            'options' => [
                'grid' => __('Grid', 'jankx'),
                'list' => __('List', 'jankx'),
                'masonry' => __('Masonry', 'jankx'),
            ],
            'value' => 'grid',
        ],
        [
            'id' => 'show_post_meta',
            'name' => __('Show Post Metadata', 'jankx'),
            'type' => 'checkbox',
            'options' => [
                'author' => __('Author', 'jankx'),
                'date' => __('Date', 'jankx'),
                'category' => __('Category', 'jankx'),
                'tags' => __('Tags', 'jankx'),
                'comment_count' => __('Comment Count', 'jankx'),
            ],
            'default' => ['author', 'date'],
        ],
    ],
];
