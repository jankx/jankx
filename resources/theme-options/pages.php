<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    [
        'id' => 'general',
        'name' => __('General Settings', 'jankx'),
        'args' => [
            'description' => __('General theme settings and basic configuration', 'jankx'),
        ],
    ],
    [
        'id' => 'header',
        'name' => __('Header Settings', 'jankx'),
        'args' => [
            'description' => __('Header layout and styling options', 'jankx'),
        ],
    ],
    [
        'id' => 'colors',
        'name' => __('Color Settings', 'jankx'),
        'args' => [
            'description' => __('Theme color customization', 'jankx'),
        ],
    ],
    [
        'id' => 'typography',
        'name' => __('Typography', 'jankx'),
        'args' => [
            'description' => __('Font settings and text styling', 'jankx'),
        ],
    ],
    [
        'id' => 'footer',
        'name' => __('Footer Settings', 'jankx'),
        'args' => [
            'description' => __('Footer layout and content options', 'jankx'),
        ],
    ],
];