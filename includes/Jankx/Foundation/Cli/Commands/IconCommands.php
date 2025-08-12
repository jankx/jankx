<?php

namespace Jankx\Foundation\Cli\Commands;

use WP_CLI;
use Jankx\Services\FontIcons\IconTransformerService;
use Jankx\Facades\Config;

class IconCommands
{
    /**
     * Transform CSS to JSON for icon metadata
     *
     * ## OPTIONS
     *
     * --type=<type>
     * : Icon type (fontawesome, material, custom, svg)
     *
     * --css-url=<url>
     * : CSS URL to transform
     *
     * --output=<path>
     * : Output JSON file path
     *
     * --force
     * : Force overwrite existing file
     *
     * ## EXAMPLES
     *
     *     # Transform Material Icons CSS to JSON
     *     wp jankx icons transform --type=material --css-url="https://fonts.googleapis.com/icon?family=Material+Icons" --output="resources/icons/material/icons.json"
     *
     *     # Transform FontAwesome CSS to JSON
     *     wp jankx icons transform --type=fontawesome --css-url="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css" --output="resources/icons/fontawesome/icons.json"
     *
     *     # Transform with force overwrite
     *     wp jankx icons transform --type=custom --css-url="https://example.com/icons.css" --output="resources/icons/custom/icons.json" --force
     *
     * @when after_wp_load
     */
    public function transform($args, $assoc_args)
    {
        $type = $assoc_args['type'] ?? '';
        $cssUrl = $assoc_args['css-url'] ?? '';
        $output = $assoc_args['output'] ?? '';
        $force = isset($assoc_args['force']);

        if (empty($type)) {
            WP_CLI::error('Icon type is required. Use --type=<type>');
        }

        if (empty($cssUrl)) {
            WP_CLI::error('CSS URL is required. Use --css-url=<url>');
        }

        if (empty($output)) {
            WP_CLI::error('Output path is required. Use --output=<path>');
        }

        try {
            WP_CLI::log("Transforming CSS to JSON for type: {$type}");
            WP_CLI::log("CSS URL: {$cssUrl}");
            WP_CLI::log("Output: {$output}");

            // Check if output file exists
            if (file_exists($output) && !$force) {
                WP_CLI::warning("Output file already exists. Use --force to overwrite.");
                return;
            }

            // Create output directory if it doesn't exist
            $outputDir = dirname($output);
            if (!is_dir($outputDir)) {
                mkdir($outputDir, 0755, true);
                WP_CLI::log("Created output directory: {$outputDir}");
            }

            // Transform CSS to JSON - sử dụng Config facade trực tiếp
            $result = $this->transformCssToJson($cssUrl, $type);

            // Save to file
            $jsonData = json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            if (file_put_contents($output, $jsonData)) {
                WP_CLI::success("Successfully transformed CSS to JSON!");
                WP_CLI::log("Total icons: " . count($result['icons'] ?? []));
                WP_CLI::log("Categories: " . count($result['categories'] ?? []));
                WP_CLI::log("Saved to: {$output}");
            } else {
                WP_CLI::error("Failed to save JSON file");
            }

        } catch (\Exception $e) {
            WP_CLI::error("Transformation failed: " . $e->getMessage());
        }
    }

    /**
     * Transform CSS to JSON without using IconTransformerService
     */
    private function transformCssToJson($cssUrl, $type)
    {
        // Fetch CSS content
        $cssContent = file_get_contents($cssUrl);
        if ($cssContent === false) {
            throw new \Exception("Failed to fetch CSS from: {$cssUrl}");
        }

        // Simple transformation based on type
        $icons = [];
        $categories = [];

        switch ($type) {
            case 'fontawesome':
                // Parse FontAwesome CSS patterns
                preg_match_all('/\.fa-([a-zA-Z0-9-]+)\s*\{[^}]*\}/i', $cssContent, $matches);
                foreach ($matches[1] as $iconName) {
                    $icons[] = [
                        'name' => $iconName,
                        'class' => "fa-{$iconName}",
                        'type' => 'fontawesome',
                        'tags' => [$iconName],
                        'category' => 'general'
                    ];
                }
                break;

            case 'material':
                // Parse Material Icons CSS patterns
                preg_match_all('/\.material-icons\s*\{[^}]*\}/i', $cssContent, $matches);
                $icons[] = [
                    'name' => 'material-icons',
                    'class' => 'material-icons',
                    'type' => 'material',
                    'tags' => ['material', 'icons'],
                    'category' => 'general'
                ];
                break;

            case 'custom':
                // Parse custom icon patterns
                preg_match_all('/\.icon-([a-zA-Z0-9-]+)\s*\{[^}]*\}/i', $cssContent, $matches);
                foreach ($matches[1] as $iconName) {
                    $icons[] = [
                        'name' => $iconName,
                        'class' => "icon-{$iconName}",
                        'type' => 'custom',
                        'tags' => [$iconName],
                        'category' => 'general'
                    ];
                }
                break;

            case 'svg':
                // Parse SVG icon patterns
                preg_match_all('/\.svg-icon-([a-zA-Z0-9-]+)\s*\{[^}]*\}/i', $cssContent, $matches);
                foreach ($matches[1] as $iconName) {
                    $icons[] = [
                        'name' => $iconName,
                        'class' => "svg-icon-{$iconName}",
                        'type' => 'svg',
                        'tags' => [$iconName],
                        'category' => 'general'
                    ];
                }
                break;

            default:
                throw new \Exception("Unsupported icon type: {$type}");
        }

        $categories = [
            'general' => [
                'id' => 'general',
                'name' => 'General',
                'description' => 'General icons'
            ]
        ];

        return [
            'icons' => $icons,
            'categories' => $categories,
            'metadata' => [
                'type' => $type,
                'parsed_at' => current_time('mysql'),
                'source' => 'css_parser'
            ]
        ];
    }

    /**
     * List all available icon types
     *
     * ## EXAMPLES
     *
     *     # List all icon types
     *     wp jankx icons list
     *
     * @when after_wp_load
     */
    public function list($args, $assoc_args)
    {
        try {
            // Sử dụng Config facade để lấy config
            $iconTypes = Config::get('font-icons.icon_types', []);

            if (empty($iconTypes)) {
                WP_CLI::warning("No icon types configured");
                return;
            }

            WP_CLI::log("Available Icon Types:");
            WP_CLI::log("");

            foreach ($iconTypes as $type => $config) {
                $status = $config['enabled'] ? '✓ Enabled' : '✗ Disabled';
                $autoLoad = $config['auto_load'] ? 'Auto-load' : 'Manual';

                WP_CLI::log("  {$type}:");
                WP_CLI::log("    Status: {$status}");
                WP_CLI::log("    Auto-load: {$autoLoad}");

                if (isset($config['version'])) {
                    WP_CLI::log("    Version: {$config['version']}");
                }

                if (isset($config['prefixes'])) {
                    $prefixes = implode(', ', $config['prefixes']);
                    WP_CLI::log("    Prefixes: {$prefixes}");
                }

                WP_CLI::log("");
            }

        } catch (\Exception $e) {
            WP_CLI::error("Failed to list icon types: " . $e->getMessage());
        }
    }

    /**
     * Activate an icon type
     *
     * ## OPTIONS
     *
     * <type>
     * : Icon type to activate
     *
     * ## EXAMPLES
     *
     *     # Activate FontAwesome
     *     wp jankx icons activate fontawesome
     *
     *     # Activate Material Icons
     *     wp jankx icons activate material
     *
     * @when after_wp_load
     */
    public function activate($args, $assoc_args)
    {
        $type = $args[0] ?? '';

        if (empty($type)) {
            WP_CLI::error('Icon type is required');
        }

        try {
            // Sử dụng Config facade để lấy config
            $iconTypes = Config::get('font-icons.icon_types', []);

            if (!isset($iconTypes[$type])) {
                WP_CLI::error("Icon type '{$type}' not found in configuration");
            }

            $typeConfig = $iconTypes[$type];
            if (!$typeConfig['enabled']) {
                WP_CLI::error("Icon type '{$type}' is disabled in configuration");
            }

            // Get active types from WordPress options
            $activeTypes = get_option('jankx_font_icons_active_types', []);

            if (in_array($type, $activeTypes)) {
                WP_CLI::warning("Icon type '{$type}' is already active");
                return;
            }

            // Add to active types
            $activeTypes[] = $type;
            update_option('jankx_font_icons_active_types', $activeTypes);

            WP_CLI::success("Icon type '{$type}' activated successfully!");

        } catch (\Exception $e) {
            WP_CLI::error("Failed to activate icon type: " . $e->getMessage());
        }
    }

    /**
     * Deactivate an icon type
     *
     * ## OPTIONS
     *
     * <type>
     * : Icon type to deactivate
     *
     * ## EXAMPLES
     *
     *     # Deactivate FontAwesome
     *     wp jankx icons deactivate fontawesome
     *
     * @when after_wp_load
     */
    public function deactivate($args, $assoc_args)
    {
        $type = $args[0] ?? '';

        if (empty($type)) {
            WP_CLI::error('Icon type is required');
        }

        try {
            // Get active types from WordPress options
            $activeTypes = get_option('jankx_font_icons_active_types', []);

            if (!in_array($type, $activeTypes)) {
                WP_CLI::warning("Icon type '{$type}' is not active");
                return;
            }

            // Remove from active types
            $activeTypes = array_diff($activeTypes, [$type]);
            update_option('jankx_font_icons_active_types', $activeTypes);

            WP_CLI::success("Icon type '{$type}' deactivated successfully!");

        } catch (\Exception $e) {
            WP_CLI::error("Failed to deactivate icon type: " . $e->getMessage());
        }
    }

    /**
     * Clear icon cache
     *
     * ## EXAMPLES
     *
     *     # Clear all icon cache
     *     wp jankx icons clear-cache
     *
     * @when after_wp_load
     */
    public function clear_cache($args, $assoc_args)
    {
        try {
            // Clear WordPress object cache for icons
            wp_cache_flush_group('jankx_font_icons');

            // Clear any transient options
            delete_transient('jankx_icons_cache');
            delete_transient('jankx_icons_active_types');

            WP_CLI::success("Icon cache cleared successfully!");

        } catch (\Exception $e) {
            WP_CLI::error("Failed to clear cache: " . $e->getMessage());
        }
    }

    /**
     * Refresh icon data from CSS sources
     *
     * ## OPTIONS
     *
     * --type=<type>
     * : Specific icon type to refresh (optional)
     *
     * ## EXAMPLES
     *
     *     # Refresh all icon types
     *     wp jankx icons refresh
     *
     *     # Refresh specific icon type
     *     wp jankx icons refresh --type=material
     *
     * @when after_wp_load
     */
    public function refresh($args, $assoc_args)
    {
        $specificType = $assoc_args['type'] ?? null;

        try {
            // Sử dụng Config facade để lấy config
            $iconTypes = Config::get('font-icons.icon_types', []);
            $autoUpdateTypes = Config::get('font-icons.auto_update.types', []);

            if ($specificType) {
                // Refresh specific type
                if (!isset($iconTypes[$specificType])) {
                    WP_CLI::error("Icon type '{$specificType}' not found in configuration");
                }

                $this->refreshIconType($specificType, $iconTypes[$specificType]);
                WP_CLI::success("Icon type '{$specificType}' refreshed successfully!");

            } else {
                // Refresh all auto-update types
                WP_CLI::log("Refreshing all auto-update icon types...");

                foreach ($autoUpdateTypes as $type) {
                    if (isset($iconTypes[$type])) {
                        WP_CLI::log("Refreshing {$type}...");
                        $this->refreshIconType($type, $iconTypes[$type]);
                    }
                }

                WP_CLI::success("All icon types refreshed successfully!");
            }

        } catch (\Exception $e) {
            WP_CLI::error("Failed to refresh icons: " . $e->getMessage());
        }
    }

    /**
     * Refresh a specific icon type
     */
    private function refreshIconType($type, $config)
    {
        if (!$config['enabled']) {
            return;
        }

        // Get CSS URL from config
        $cssUrl = $config['cdn_url'] ?? '';
        if (empty($cssUrl)) {
            WP_CLI::warning("No CSS URL configured for type '{$type}'");
            return;
        }

        // Transform and save using our local method
        $result = $this->transformCssToJson($cssUrl, $type);

        // Get base path from WordPress theme directory
        $basePath = get_template_directory();
        $outputPath = $basePath . "/resources/icons/{$type}/icons.json";

        // Save to file
        $outputDir = dirname($outputPath);
        if (!is_dir($outputDir)) {
            mkdir($outputDir, 0755, true);
        }

        $jsonData = json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        file_put_contents($outputPath, $jsonData);
    }
}
