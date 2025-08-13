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
            // Validate URL
            if (!filter_var($cssUrl, FILTER_VALIDATE_URL)) {
                throw new \Exception('Invalid CSS URL provided');
            }


            // Create transformer
            $transformer = new GenericIconTransformer($iconType);

            // Determine output path
            $outputPath = $this->getIconOutputPath($iconType);

            // Transform CSS to JSON
                        $jsonData = $transformer->transformFromUrl($cssUrl, $outputPath);

            // Update configuration
                        $this->addIconTypeToConfig($iconType, $jsonData, $cssUrl, $displayName);

            return [
                'success' => true,
                'message' => sprintf('Successfully imported %d icons for "%s"', count($jsonData['icons']), $displayName ?: $iconType),
                'data' => $jsonData
            ];
        } catch (\Exception $e) {
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

        // Get current config
        $config = Config::get('font-icons.icon_types', []);

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


        // Add to config
        $config[$iconType] = $newConfig;

        // Update config file
                $this->updateConfigFile($config);
    }

        /**
     * Update configuration file
     */
    protected function updateConfigFile($config)
    {

        $configPath = get_template_directory() . '/config/font-icons.php';

        // Create config content
        $configContent = "<?php\n\nreturn " . var_export($config, true) . ";\n";

        // Write to file
        $bytesWritten = file_put_contents($configPath, $configContent);
        if ($bytesWritten === false) {
                        throw new \Exception('Failed to update configuration file');
        }
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
