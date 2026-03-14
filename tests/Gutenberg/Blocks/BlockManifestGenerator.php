<?php

namespace Tests\Gutenberg\Blocks;

use Jankx\Foundation\Application;
use Jankx\Gutenberg\Block;
use Jankx\Services\GutenbergService;

/**
 * Block Manifest Generator
 * 
 * Aggregates all block data into a single AI-friendly JSON file.
 */
class BlockManifestGenerator
{
    protected $app;
    protected $service;
    protected $outputFile;

    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->service = new GutenbergService($app);
        $this->outputFile = $app->basePath('tests/Gutenberg/fixtures/blocks/manifest.json');
    }

    public function generate()
    {
        echo "Initializing blocks...\n";
        $this->service->registerBlocks();
        $this->service->initBlocks();

        $blocks = $this->service->getInstances();
        $manifest = [
            'framework_version' => Application::VERSION,
            'generated_at' => date('c'),
            'blocks' => []
        ];

        foreach ($blocks as $blockName => $block) {
            echo "Processing: {$blockName}...\n";
            $blockData = $this->extractBlockData($block);
            if ($blockData) {
                $manifest['blocks'][] = $blockData;
            }
        }

        $dir = dirname($this->outputFile);
        if (!is_dir($dir)) {
            mkdir($dir, 0755, true);
        }

        file_put_contents(
            $this->outputFile,
            json_encode($manifest, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
        );

        echo "Manifest generated: {$this->outputFile}\n";
    }

    protected function extractBlockData(Block $block)
    {
        $blockId = $block->getBlockId();
        $blockPath = $this->getBlockPath($blockId);
        
        if (!$blockPath || !file_exists($blockPath . '/block.json')) {
            return null;
        }

        $metadata = json_decode(file_get_contents($blockPath . '/block.json'), true);
        
        return [
            'id' => $blockId,
            'title' => $metadata['title'] ?? '',
            'description' => $metadata['description'] ?? '',
            'category' => $metadata['category'] ?? '',
            'attributes' => $metadata['attributes'] ?? [],
            'supports' => $metadata['supports'] ?? [],
            'php_class' => get_class($block),
            'has_php_render' => method_exists($block, 'render'),
        ];
    }

    protected function getBlockPath(string $blockId)
    {
        $name = str_replace('jankx/', '', $blockId);
        $path = $this->app->basePath('resources/blocks/' . $name);
        
        return is_dir($path) ? $path : null;
    }
}
