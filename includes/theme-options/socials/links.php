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
        [
            'id' => 'footer_partners',
            'name' => __('Partners/Sponsors', 'jankx'),
            'type' => 'repeater',
            'group_values' => true,
            'fields' => [
                [
                    'id' => 'partner_name',
                    'name' => __('Partner Name', 'jankx'),
                    'type' => 'text',
                ],
                [
                    'id' => 'partner_logo',
                    'name' => __('Logo', 'jankx'),
                    'type' => 'image',
                ],
                [
                    'id' => 'partner_url',
                    'name' => __('Website URL', 'jankx'),
                    'type' => 'text',
                ],
            ],
        ],
    ],
];
