<?php

namespace Tests\Gutenberg\Blocks;

use Jankx\Foundation\Application;
use Jankx\Gutenberg\Block;
use Jankx\Services\GutenbergService;
use Mockery;
use WP_Block;

/**
 * Block Output Reference Generator
 *
 * Generates HTML output for blocks with various attribute configurations
 * for AI models to understand how various options affect the output.
 */
class BlockOutputReferenceGenerator
{
    protected $app;
    protected $service;
    protected $outputDir;

    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->service = new GutenbergService($app);
        $this->outputDir = dirname(__DIR__) . '/fixtures/blocks/output-references';
    }

    public function generate()
    {
        if (!is_dir($this->outputDir)) {
            mkdir($this->outputDir, 0755, true);
        }

        // Register and initialize blocks in the repository
        $this->service->registerBlocks();
        $this->service->initBlocks();

        $blocks = $this->service->getInstances();
        $summary = [];

        foreach ($blocks as $blockName => $block) {
            echo "Generating reference for: {$blockName}...\n";
            $blockSummary = $this->generateForBlock($blockName, $block);
            if ($blockSummary) {
                $summary[$blockName] = $blockSummary;
            }
        }

        file_put_contents(
            $this->outputDir . '/summary.json',
            json_encode($summary, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES)
        );

        echo "Done! References generated in: {$this->outputDir}\n";
    }

    protected function generateForBlock(string $blockClass, Block $block)
    {
        $blockId = $block->getBlockId();
        $blockPath = $this->getBlockPath($blockId);
        if (!$blockPath || !file_exists($blockPath . '/block.json')) {
            return null;
        }

        $metadata = json_decode(file_get_contents($blockPath . '/block.json'), true);
        $attributes = $metadata['attributes'] ?? [];
        $defaultAttributes = [];
        foreach ($attributes as $key => $attr) {
            $defaultAttributes[$key] = $attr['default'] ?? null;
        }

        $scenarios = $this->getScenariosForBlock($blockId, $defaultAttributes, $attributes);
        $scenarioOutputs = [];

        foreach ($scenarios as $scenarioName => $scenarioAttrs) {
            $html = $this->renderBlock($block, $scenarioAttrs);
            $filename = str_replace(['/', '\\'], '--', $blockId) . '--' . $scenarioName . '.html';
            
            file_put_contents($this->outputDir . '/' . $filename, $html);
            
            $scenarioOutputs[$scenarioName] = [
                'attributes' => $scenarioAttrs,
                'html_file' => $filename
            ];
        }

        return [
            'block_id' => $blockId,
            'metadata' => $metadata,
            'scenarios' => $scenarioOutputs
        ];
    }

    protected function getBlockPath(string $blockId)
    {
        // Simple heuristic: block name is jankx/name
        $name = str_replace('jankx/', '', $blockId);
        
        // Try various possible locations
        $paths = [
            ABSPATH . 'resources/blocks/' . $name,
            get_template_directory() . '/resources/blocks/' . $name,
        ];

        foreach ($paths as $path) {
            if (is_dir($path)) {
                return $path;
            }
        }
        return null;
    }

    protected function renderBlock(Block $block, array $attributes)
    {
        try {
            // Mock WP_Block
            $wpBlock = Mockery::mock(WP_Block::class);
            $wpBlock->attributes = $attributes;

            // Render the block
            if (method_exists($block, 'render')) {
                return $block->render($attributes, '', $wpBlock);
            }

            return "<!-- Static block (No PHP render method) -->";
        } catch (\Throwable $e) {
            echo "Error rendering block {$block->getBlockId()}: " . $e->getMessage() . "\n";
            return "<!-- Error rendering block: " . $e->getMessage() . " -->";
        }
    }

    protected function getScenariosForBlock(string $blockId, array $defaultAttributes, array $attributesMetadata)
    {
        $scenarios = [
            'default' => $defaultAttributes,
        ];

        // 1. Auto-generate scenarios for each attribute based on its metadata
        foreach ($attributesMetadata as $name => $meta) {
            // Handle enums
            if (isset($meta['enum']) && is_array($meta['enum'])) {
                foreach ($meta['enum'] as $value) {
                    if ($value !== ($defaultAttributes[$name] ?? null)) {
                        $scenarios["attr-{$name}-{$value}"] = array_merge($defaultAttributes, [$name => $value]);
                    }
                }
            }
            // Handle booleans
            elseif (isset($meta['type']) && $meta['type'] === 'boolean') {
                $toggleValue = !($defaultAttributes[$name] ?? false);
                $label = $toggleValue ? 'true' : 'false';
                $scenarios["attr-{$name}-{$label}"] = array_merge($defaultAttributes, [$name => $toggleValue]);
            }
        }

        // 2. Add block-specific manual scenarios (more complex combinations)
        switch ($blockId) {
            case 'jankx/advanced-button':
                $scenarios['complex-modal-submit'] = array_merge($defaultAttributes, [
                    'triggerType' => 'button',
                    'buttonType' => 'submit',
                    'text' => 'Submit Form',
                    'iconPosition' => 'right',
                    'showLabel' => true
                ]);
                break;
            case 'jankx/language-switcher':
                $scenarios['dropdown-with-flags'] = array_merge($defaultAttributes, [
                    'displayType' => 'dropdown',
                    'showFlag' => true
                ]);
                break;
        }

        // Limit scenarios to avoid too many files (e.g. max 15 per block)
        if (count($scenarios) > 15) {
            $scenarios = array_slice($scenarios, 0, 15, true);
        }

        return $scenarios;
    }
}
