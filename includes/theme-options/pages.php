<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    [
        'id' => 'general',
        'name' => __('General', 'jankx'),
        'args' => [
            'description' => __('Basic configuration for the entire site', 'jankx'),
            'priority' => 10,
            'icon' => 'dashicons-admin-generic',
        ],
    ],
    [
        'id' => 'branding',
        'name' => __('Branding', 'jankx'),
        'args' => [
            'description' => __('Logo and brand identity colors', 'jankx'),
            'priority' => 30,
            'icon' => 'dashicons-admin-appearance',
        ],
    ],
    [
        'id' => 'layout',
        'name' => __('Layout & Spacing', 'jankx'),
        'args' => [
            'description' => __('Layout, spacing, and slider options', 'jankx'),
            'priority' => 40,
            'icon' => 'dashicons-align-center',
        ],
    ],
    [
        'id' => 'typography',
        'name' => __('Typography', 'jankx'),
        'args' => [
            'description' => __('Fonts and font sizes', 'jankx'),
            'priority' => 50,
            'icon' => 'dashicons-editor-textcolor',
        ],
    ],
    [
        'id' => 'blog',
        'name' => __('Blog', 'jankx'),
        'args' => [
            'description' => __('Blog and post configuration', 'jankx'),
            'priority' => 60,
            'icon' => 'dashicons-admin-post',
        ],
    ],
    [
        'id' => 'socials',
        'name' => __('Social Media', 'jankx'),
        'args' => [
            'description' => __('Social links and sharing options', 'jankx'),
            'priority' => 70,
            'icon' => 'dashicons-share',
        ],
    ],
    [
        'id' => 'preset',
        'name' => __('Preset & Layout', 'jankx'),
        'args' => [
            'description' => __('Choose UI presets and page layouts', 'jankx'),
            'priority' => 80,
            'icon' => 'dashicons-layout',
        ],
    ],
];
