<?php
/**
 * Theme Options Integration Test Script
 *
 * Run this script to verify the integration is working:
 * wp eval-file tests/theme-options-integration-test.php
 *
 * Or include in your code for debugging.
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class ThemeOptionsIntegrationTest
{
    public function run(): void
    {
        echo "=== Theme Options Integration Test ===\n\n";

        // Test 1: Check if services are registered
        $this->testServicesRegistered();

        // Test 2: Check helper functions
        $this->testHelperFunctions();

        // Test 3: Check CSS generation
        $this->testCSSGeneration();

        // Test 4: Check theme data
        $this->testThemeData();

        // Test 5: Check theme.json filter
        $this->testThemeJsonFilter();

        echo "\n=== Test Complete ===\n";
    }

    protected function testServicesRegistered(): void
    {
        echo "1. Testing Service Registration:\n";

        $app = \Jankx\Foundation\Application::getInstance();

        $services = [
            'theme-options' => 'ThemeOptionsService',
            'theme-options.css-generator' => 'ThemeOptionsCSSGenerator',
            'theme-options.bridge' => 'ThemeOptionsBridge',
        ];

        foreach ($services as $key => $name) {
            if ($app->bound($key)) {
                echo "   ✓ {$name} ({$key}) is registered\n";
            } else {
                echo "   ✗ {$name} ({$key}) is NOT registered\n";
            }
        }

        echo "\n";
    }

    protected function testHelperFunctions(): void
    {
        echo "2. Testing Helper Functions:\n";

        $functions = [
            'jankx_get_theme_option',
            'jankx_get_theme_color',
            'jankx_get_container_width',
            'jankx_get_body_typography',
            'jankx_get_css_var',
            'jankx_get_theme_options_data',
        ];

        foreach ($functions as $function) {
            if (function_exists($function)) {
                echo "   ✓ {$function}() exists\n";
            } else {
                echo "   ✗ {$function}() does NOT exist\n";
            }
        }

        // Test actual values
        if (function_exists('jankx_get_theme_option')) {
            $primary = jankx_get_theme_option('primary_color', '#default');
            echo "   → Primary color: {$primary}\n";
        }

        if (function_exists('jankx_get_theme_color')) {
            $primaryHex = jankx_get_theme_color('primary', 'hex');
            $primaryCss = jankx_get_theme_color('primary', 'css-var');
            echo "   → Primary (hex): {$primaryHex}\n";
            echo "   → Primary (css): {$primaryCss}\n";
        }

        echo "\n";
    }

    protected function testCSSGeneration(): void
    {
        echo "3. Testing CSS Generation:\n";

        $app = \Jankx\Foundation\Application::getInstance();

        if (!$app->bound('theme-options.css-generator')) {
            echo "   ✗ CSS Generator not available\n";
            return;
        }

        $cssGenerator = $app->make('theme-options.css-generator');

        // Generate CSS
        $css = $cssGenerator->generateCSS();

        if (!empty($css)) {
            echo "   ✓ CSS generated successfully\n";

            // Check for key variables
            $variables = [
                '--jankx-primary-color',
                '--jankx-secondary-color',
                '--jankx-container-width',
                '--jankx-body-font-family',
            ];

            foreach ($variables as $var) {
                if (strpos($css, $var) !== false) {
                    echo "   ✓ {$var} found in CSS\n";
                } else {
                    echo "   ✗ {$var} NOT found in CSS\n";
                }
            }

            // Show first 500 chars of CSS
            echo "\n   CSS Preview (first 500 chars):\n";
            echo "   " . str_replace("\n", "\n   ", substr($css, 0, 500)) . "...\n";
        } else {
            echo "   ✗ CSS generation failed or empty\n";
        }

        echo "\n";
    }

    protected function testThemeData(): void
    {
        echo "4. Testing Theme Options Data:\n";

        if (!function_exists('jankx_get_theme_options_data')) {
            echo "   ✗ Helper function not available\n";
            return;
        }

        $data = jankx_get_theme_options_data();

        if (!empty($data)) {
            echo "   ✓ Theme options data retrieved\n";

            // Check structure
            $keys = ['version', 'colors', 'layout', 'typography', 'cssVars'];
            foreach ($keys as $key) {
                if (isset($data[$key])) {
                    echo "   ✓ Data key '{$key}' exists\n";
                } else {
                    echo "   ✗ Data key '{$key}' missing\n";
                }
            }

            // Show color values
            if (isset($data['colors'])) {
                echo "\n   Colors:\n";
                foreach ($data['colors'] as $key => $value) {
                    echo "   → {$key}: {$value}\n";
                }
            }

            // Show layout
            if (isset($data['layout'])) {
                echo "\n   Layout:\n";
                foreach ($data['layout'] as $key => $value) {
                    echo "   → {$key}: {$value}\n";
                }
            }
        } else {
            echo "   ✗ Theme options data is empty\n";
        }

        echo "\n";
    }

    protected function testThemeJsonFilter(): void
    {
        echo "5. Testing theme.json Filter:\n";

        // Check if filter is registered
        $hasFilter = has_filter('wp_theme_json_data_theme');

        if ($hasFilter) {
            echo "   ✓ wp_theme_json_data_theme filter is registered\n";
            echo "   → Priority: {$hasFilter}\n";
        } else {
            echo "   ✗ wp_theme_json_data_theme filter is NOT registered\n";
        }

        // Test the filter
        $themeJson = new \WP_Theme_JSON_Data([
            'version' => 3,
            'settings' => [
                'color' => [
                    'palette' => [
                        ['slug' => 'primary', 'color' => '#000000', 'name' => 'Test'],
                    ],
                ],
                'layout' => [
                    'contentSize' => '800px',
                ],
            ],
        ], 'theme');

        $filtered = apply_filters('wp_theme_json_data_theme', $themeJson);
        $data = $filtered->get_data();

        if (isset($data['settings']['color']['palette'][0]['color'])) {
            $color = $data['settings']['color']['palette'][0]['color'];
            echo "   → Filtered primary color: {$color}\n";

            // Check if it's different from the test value
            if ($color !== '#000000') {
                echo "   ✓ Filter is modifying values\n";
            } else {
                echo "   ℹ Filter may be using defaults\n";
            }
        }

        echo "\n";
    }
}

// Run the test if this file is executed directly
if (php_sapi_name() === 'cli' || defined('WP_CLI')) {
    $test = new ThemeOptionsIntegrationTest();
    $test->run();
} else {
    // For web access, wrap in admin check
    if (is_admin() && current_user_can('manage_options')) {
        $test = new ThemeOptionsIntegrationTest();
        $test->run();
    } else {
        echo "Access denied. Run via WP-CLI or as admin.\n";
    }
}
