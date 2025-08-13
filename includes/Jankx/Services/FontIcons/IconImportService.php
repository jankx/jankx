<?php

namespace Jankx\Services\FontIcons;

use Jankx\Services\FontIcons\Transformers\GenericIconTransformer;
use Jankx\Facades\Config;

class IconImportService
{
    protected $app;

    public function __construct($app)
    {
        $this->app = $app;
    }

        /**
     * Import new icon set from CSS URL
     */
    public function importFromCssUrl($cssUrl, $iconType, $displayName = null)
    {
        try {
            error_log("JANKX DEBUG: Starting import for icon type: {$iconType}");
            error_log("JANKX DEBUG: CSS URL: {$cssUrl}");
            error_log("JANKX DEBUG: Display name: " . ($displayName ?: 'null'));

            // Validate URL
            if (!filter_var($cssUrl, FILTER_VALIDATE_URL)) {
                throw new \Exception('Invalid CSS URL provided');
            }

            error_log("JANKX DEBUG: URL validation passed");

            // Create transformer
            $transformer = new GenericIconTransformer($iconType);
            error_log("JANKX DEBUG: Transformer created successfully");

            // Determine output path
            $outputPath = $this->getIconOutputPath($iconType);
            error_log("JANKX DEBUG: Output path: {$outputPath}");

            // Transform CSS to JSON
            error_log("JANKX DEBUG: Starting CSS transformation...");
            $jsonData = $transformer->transformFromUrl($cssUrl, $outputPath);
            error_log("JANKX DEBUG: CSS transformation completed. Icons found: " . count($jsonData['icons']));

            // Update configuration
            error_log("JANKX DEBUG: Updating configuration...");
            $this->addIconTypeToConfig($iconType, $jsonData, $cssUrl, $displayName);
            error_log("JANKX DEBUG: Configuration updated successfully");

            return [
                'success' => true,
                'message' => sprintf('Successfully imported %d icons for "%s"', count($jsonData['icons']), $displayName ?: $iconType),
                'data' => $jsonData
            ];

        } catch (\Exception $e) {
            error_log("JANKX DEBUG: Import failed with exception: " . $e->getMessage());
            error_log("JANKX DEBUG: Exception trace: " . $e->getTraceAsString());
            return [
                'success' => false,
                'message' => 'Import failed: ' . $e->getMessage()
            ];
        }
    }

    /**
     * Get output path for icon type
     */
    protected function getIconOutputPath($iconType)
    {
        $basePath = get_template_directory();
        return $basePath . '/resources/icons/' . $iconType . '/icons.json';
    }

        /**
     * Add icon type to configuration
     */
    protected function addIconTypeToConfig($iconType, $jsonData, $cssUrl, $displayName = null)
    {
        error_log("JANKX DEBUG: addIconTypeToConfig() called");
        error_log("JANKX DEBUG: Icon type: {$iconType}");
        error_log("JANKX DEBUG: CSS URL: {$cssUrl}");
        error_log("JANKX DEBUG: Display name: " . ($displayName ?: 'null'));

        // Get current config
        $config = Config::get('font-icons.icon_types', []);
        error_log("JANKX DEBUG: Current config: " . print_r($config, true));

        // Create new icon type config
        $newConfig = [
            'enabled' => true,
            'auto_load' => false,
            'version' => $jsonData['version'] ?? '1.0.0',
            'cdn_url' => $cssUrl,
            'display_name' => $displayName ?: ucfirst($iconType),
            'prefixes' => $jsonData['prefixes'] ?? [$iconType],
            'categories' => $jsonData['categories'] ?? ['general'],
            'font_family' => $jsonData['font_family'] ?? 'Unknown',
            'total_icons' => count($jsonData['icons']),
            'imported_at' => current_time('mysql')
        ];

        error_log("JANKX DEBUG: New config to add: " . print_r($newConfig, true));

        // Add to config
        $config[$iconType] = $newConfig;
        error_log("JANKX DEBUG: Updated config: " . print_r($config, true));

        // Update config file
        error_log("JANKX DEBUG: Calling updateConfigFile...");
        $this->updateConfigFile($config);
        error_log("JANKX DEBUG: Config file updated successfully");
    }

        /**
     * Update configuration file
     */
    protected function updateConfigFile($config)
    {
        error_log("JANKX DEBUG: updateConfigFile() called");
        error_log("JANKX DEBUG: Config to write: " . print_r($config, true));

        $configPath = get_template_directory() . '/config/font-icons.php';
        error_log("JANKX DEBUG: Config file path: {$configPath}");

        // Create config content
        $configContent = "<?php\n\nreturn " . var_export($config, true) . ";\n";
        error_log("JANKX DEBUG: Config content length: " . strlen($configContent));
        error_log("JANKX DEBUG: Config content preview: " . substr($configContent, 0, 300));

        // Write to file
        $bytesWritten = file_put_contents($configPath, $configContent);
        if ($bytesWritten === false) {
            error_log("JANKX DEBUG: Failed to write config file");
            throw new \Exception('Failed to update configuration file');
        }

        error_log("JANKX DEBUG: Config file written successfully. Bytes written: {$bytesWritten}");
    }

    /**
     * Get available icon types for import
     */
    public function getAvailableIconTypes()
    {
        $suggestedTypes = [
            'elusive' => 'Elusive Icons',
            'feather' => 'Feather Icons',
            'heroicons' => 'Heroicons',
            'tabler' => 'Tabler Icons',
            'bootstrap' => 'Bootstrap Icons',
            'remix' => 'Remix Icons',
            'lucide' => 'Lucide Icons',
            'phosphor' => 'Phosphor Icons'
        ];

        // Filter out already existing types
        $existingTypes = Config::get('font-icons.icon_types', []);
        $availableTypes = [];

        foreach ($suggestedTypes as $type => $name) {
            if (!isset($existingTypes[$type])) {
                $availableTypes[$type] = $name;
            }
        }

        return $availableTypes;
    }

    /**
     * Validate icon type name
     */
    public function validateIconType($iconType)
    {
        // Check if icon type already exists
        $existingTypes = Config::get('font-icons.icon_types', []);
        if (isset($existingTypes[$iconType])) {
            throw new \Exception('Icon type "' . $iconType . '" already exists');
        }

        // Validate icon type format
        if (!preg_match('/^[a-z][a-z0-9-]*$/', $iconType)) {
            throw new \Exception('Icon type must contain only lowercase letters, numbers, and hyphens, and start with a letter');
        }

        return true;
    }
}
