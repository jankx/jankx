<?php

namespace Jankx\Services\FontIcons;

use Jankx\Foundation\Application;
use Jankx\Services\FontIcons\Transformers\CssToJsonTransformer;
use Jankx\Services\FontIcons\Transformers\FontAwesomeTransformer;
use Jankx\Services\FontIcons\Transformers\MaterialIconsTransformer;
use Jankx\Services\FontIcons\Transformers\CustomIconsTransformer;
use Jankx\Services\FontIcons\Transformers\SvgIconsTransformer;

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
            'fontawesome' => new FontAwesomeTransformer(),
            'material' => new MaterialIconsTransformer(),
            'custom' => new CustomIconsTransformer(),
            'svg' => new SvgIconsTransformer()
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
        $result = $transformer->transform($cssUrl, $type);

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
}
