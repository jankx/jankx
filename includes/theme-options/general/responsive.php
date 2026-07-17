<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    'id' => 'general_responsive',
    'name' => __('Responsive Breakpoints', 'jankx'),
    'description' => __('Configure responsive breakpoints used across the theme and blocks', 'jankx'),
    'fields' => [
        [
            'id' => 'breakpoint_ultrawide',
            'name' => __('Ultrawide Min Width', 'jankx'),
            'type' => 'number',
            'value' => 1600,
            'min' => 1400,
            'max' => 3840,
            'step' => 10,
            'description' => __('Screen width (px) where ultrawide breakpoint starts', 'jankx'),
        ],
        [
            'id' => 'breakpoint_desktop_min',
            'name' => __('Desktop Min Width', 'jankx'),
            'type' => 'number',
            'value' => 1025,
            'min' => 769,
            'max' => 1599,
            'step' => 1,
            'description' => __('Screen width (px) where desktop breakpoint starts', 'jankx'),
        ],
        [
            'id' => 'breakpoint_tablet_min',
            'name' => __('Tablet Min Width', 'jankx'),
            'type' => 'number',
            'value' => 768,
            'min' => 480,
            'max' => 1024,
            'step' => 1,
            'description' => __('Screen width (px) where tablet breakpoint starts', 'jankx'),
        ],
        [
            'id' => 'breakpoint_mobile_max',
            'name' => __('Mobile Max Width', 'jankx'),
            'type' => 'number',
            'value' => 767,
            'min' => 320,
            'max' => 768,
            'step' => 1,
            'description' => __('Screen width (px) where mobile breakpoint ends', 'jankx'),
        ],
    ],
];
