<?php

/**
 * Config Repository Usage Example
 *
 * Demonstrates how to use the Jankx Config Repository
 * with deep merge functionality for child theme overrides
 *
 * @package Jankx\Examples
 * @since 2.0.0
 */

// Example 1: Basic usage with Facade
use Jankx\Facades\Config;

// Get a simple configuration value
$themeName = Config::get('theme.info.name', 'Default Theme');
echo "Theme Name: {$themeName}\n";

// Get nested configuration value using dot notation
$primaryColor = Config::get('theme.colors.primary', '#000000');
echo "Primary Color: {$primaryColor}\n";

// Check if configuration exists
if (Config::has('theme.layout.sidebar_position')) {
    $sidebarPosition = Config::get('theme.layout.sidebar_position');
    echo "Sidebar Position: {$sidebarPosition}\n";
}

// Get entire section
$typographySettings = Config::section('theme.typography');
echo "Typography Settings: " . print_r($typographySettings, true) . "\n";

// Example 2: Using Container directly
use Jankx\Config\Repository;

$container = \Jankx\Jankx::getInstance();
$config = $container->make('config');

// Check if using child theme
if ($config->isChildTheme()) {
    echo "Using Child Theme\n";

    // Get differences between parent and child themes
    $differences = $config->getConfigDifference();
    echo "Configuration Differences: " . print_r($differences, true) . "\n";
} else {
    echo "Using Parent Theme Only\n";
}

// Example 3: Setting configuration values
Config::set('theme.custom_setting', 'custom_value');
Config::set('theme.nested.setting', 'nested_value');

// Example 4: Merging additional configuration
$additionalConfig = [
    'theme' => [
        'custom_features' => [
            'feature_1' => true,
            'feature_2' => false,
        ],
        'colors' => [
            'accent' => '#ff6b6b',
        ],
    ],
];

Config::merge($additionalConfig);

// Example 5: Practical usage in theme development
class ThemeConfigManager
{
    public function getLayoutSettings()
    {
        return [
            'container_width' => Config::get('theme.layout.container_width', '1200px'),
            'sidebar_position' => Config::get('theme.layout.sidebar_position', 'right'),
            'sidebar_width' => Config::get('theme.layout.sidebar_width', '300px'),
            'blog_layout' => Config::get('theme.layout.blog_layout', 'grid'),
            'blog_columns' => Config::get('theme.layout.blog_columns', 3),
        ];
    }

    public function getColorSettings()
    {
        return [
            'primary' => Config::get('theme.colors.primary', '#007cba'),
            'secondary' => Config::get('theme.colors.secondary', '#6c757d'),
            'body_bg' => Config::get('theme.colors.body_bg', '#ffffff'),
            'body_text' => Config::get('theme.colors.body_text', '#212529'),
        ];
    }

    public function isFeatureEnabled($feature)
    {
        return Config::get("theme.features.{$feature}", false);
    }

    public function getChildSpecificSettings()
    {
        if (!Config::isChildTheme()) {
            return [];
        }

        return [
            'custom_header' => Config::get('theme.child_specific.custom_header', []),
            'custom_footer' => Config::get('theme.child_specific.custom_footer', []),
            'advanced_features' => Config::get('theme.child_specific.advanced_features', []),
        ];
    }
}

// Example 6: Usage in WordPress hooks
add_action('wp_head', function() {
    $configManager = new ThemeConfigManager();

    // Get layout settings
    $layout = $configManager->getLayoutSettings();

    // Generate CSS based on configuration
    $css = "
        .container { max-width: {$layout['container_width']}; }
        .sidebar { width: {$layout['sidebar_width']}; }
        .blog-grid { grid-template-columns: repeat({$layout['blog_columns']}, 1fr); }
    ";

    echo "<style>{$css}</style>";
});

// Example 7: Debug configuration
if (Config::get('app.debug', false)) {
    add_action('wp_footer', function() {
        echo '<div style="background: #f0f0f0; padding: 10px; margin: 10px; border: 1px solid #ccc;">';
        echo '<h3>Configuration Debug Info:</h3>';
        echo '<pre>' . print_r(Config::all(), true) . '</pre>';

        if (Config::isChildTheme()) {
            echo '<h3>Configuration Differences:</h3>';
            echo '<pre>' . print_r(Config::getDifferences(), true) . '</pre>';
        }

        echo '</div>';
    });
}