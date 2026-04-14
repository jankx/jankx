<?php
if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}

return [
    'id' => 'socials_links',
    'name' => __('Social Media Links', 'jankx'),
    'description' => __('Add social media URLs to display in the header, footer, or widgets. You can add custom profiles using the "Add Custom Profile" button.', 'jankx'),
    'fields' => [
        [
            'id' => 'social_profiles',
            'name' => __('Social Profiles', 'jankx'),
            'type' => 'social_profiles',
            'subtitle' => __('Manage your social links. Click an icon to toggle on/off, and drag-and-drop to reorder items.', 'jankx'),
        ],
    ],
];
