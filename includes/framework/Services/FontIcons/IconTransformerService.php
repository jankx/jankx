<?php

namespace Jankx\Services\FontIcons;

use Jankx\Foundation\Application;
use Jankx\Services\FontIcons\Transformers\CssToJsonTransformer;
use Jankx\Services\FontIcons\Transformers\GenericIconTransformer;
use Jankx\Facades\Config;

class IconTransformerService
{
    protected $transformers = [];
    protected $cache;
    protected $app;

    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->registerTransformers();
    }

    protected function registerTransformers()
    {
        $this->transformers = [
            'fontawesome' => new GenericIconTransformer('fontawesome'),
        ];
    }

    public function transformFromCss($cssUrl, $type)
    {
        $cacheKey = 'jankx_icons_transformed_' . md5($cssUrl);
        $cached = wp_cache_get($cacheKey, 'jankx_font_icons');

        if ($cached !== false) {
            return $cached;
        }

        if (!isset($this->transformers[$type])) {
            throw new \Exception("No transformer found for type: {$type}");
        }

        $transformer = $this->transformers[$type];
        $result = $transformer->transform($cssUrl);

        // Cache the result
        wp_cache_set($cacheKey, $result, 'jankx_font_icons', 86400); // 24 hours

        return $result;
    }

    public function transformAndSave($cssUrl, $type, $outputPath)
    {
        $result = $this->transformFromCss($cssUrl, $type);

        // Create output directory if it doesn't exist
        $outputDir = dirname($outputPath);
        if (!is_dir($outputDir)) {
            mkdir($outputDir, 0755, true);
        }

        // Save to file
        $jsonData = json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        if (file_put_contents($outputPath, $jsonData)) {
            return $result;
        }

        throw new \Exception("Failed to save transformed data to: {$outputPath}");
    }

    public function getAvailableTransformers()
    {
        return array_keys($this->transformers);
    }

    public function hasTransformer($type)
    {
        return isset($this->transformers[$type]);
    }

    public function addTransformer($type, $transformer)
    {
        if ($transformer instanceof CssToJsonTransformer) {
            $this->transformers[$type] = $transformer;
            return true;
        }

        return false;
    }

    public function removeTransformer($type)
    {
        if (isset($this->transformers[$type])) {
            unset($this->transformers[$type]);
            return true;
        }

        return false;
    }

    // Methods from IconImportService
    public function importFromCssUrl($cssUrl, $iconType, $displayName = null)
    {
        try {
            // Validate URL
            if (!filter_var($cssUrl, FILTER_VALIDATE_URL)) {
                throw new \Exception('Invalid CSS URL provided');
            }

            // Create transformer
            $transformer = new \Jankx\Services\FontIcons\Transformers\GenericIconTransformer($iconType);

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

    protected function getIconOutputPath($iconType)
    {
        $basePath = get_template_directory();
        return $basePath . '/resources/icons/' . $iconType . '/icons.json';
    }

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
