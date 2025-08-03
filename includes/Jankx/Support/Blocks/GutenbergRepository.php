<?php

namespace Jankx\Support\Blocks;

/**
 * Gutenberg Repository
 *
 * This class manages all Gutenberg blocks in the Jankx Framework.
 * It handles block registration, discovery, and lifecycle management.
 *
 * @package Jankx\Support\Blocks
 * @since 1.0.0
 */
class GutenbergRepository
{
    /**
     * Registered blocks
     *
     * @var array
     */
    protected $blocks = [];

    /**
     * Block instances
     *
     * @var array
     */
    protected $instances = [];

    /**
     * Constructor
     */
    public function __construct()
    {
        // Blocks will be registered in init() method
    }

    /**
     * Register default blocks
     *
     * @return void
     */
    protected function registerDefaultBlocks()
    {
        $this->registerBlock(WidgetRendererBlock::class);
    }

    /**
     * Register a block
     *
     * @param string $blockClass Block class name
     * @return void
     */
    public function registerBlock($blockClass)
    {
        if (!class_exists($blockClass)) {
            return;
        }

        $block = new $blockClass();

        if (!$block instanceof Block) {
            return;
        }

        // Check if block is already registered
        if (isset($this->blocks[$block->getName()])) {
            return;
        }

        $this->blocks[$block->getName()] = $blockClass;
        $this->instances[$block->getName()] = $block;
    }

    /**
     * Get block instance
     *
     * @param string $blockName Block name
     * @return Block|null
     */
    public function getBlock($blockName)
    {
        return $this->instances[$blockName] ?? null;
    }

    /**
     * Get all registered blocks
     *
     * @return array
     */
    public function getBlocks()
    {
        return $this->blocks;
    }

    /**
     * Get all block instances
     *
     * @return array
     */
    public function getInstances()
    {
        return $this->instances;
    }

    /**
     * Register all blocks with WordPress
     *
     * @return void
     */
    public function registerAllBlocks()
    {
        // Register default blocks first
        $this->registerDefaultBlocks();

        // Register discovered blocks
        foreach ($this->instances as $block) {
            $block->register();
        }
    }

    /**
     * Discover blocks from resources/blocks directory
     *
     * @return void
     */
    public function discoverBlocks()
    {
        $blocksPath = get_template_directory() . '/resources/blocks';

        if (!is_dir($blocksPath)) {
            return;
        }

        $blockDirs = glob($blocksPath . '/*', GLOB_ONLYDIR);

        foreach ($blockDirs as $blockDir) {
            $blockName = basename($blockDir);
            $blockClass = $this->getBlockClassFromName($blockName);

            if ($blockClass && class_exists($blockClass)) {
                $this->registerBlock($blockClass);
            }
        }
    }

    /**
     * Get block class name from block directory name
     *
     * @param string $blockName Block directory name
     * @return string|null
     */
    protected function getBlockClassFromName($blockName)
    {
        // Convert kebab-case to PascalCase
        $className = str_replace('-', '', ucwords($blockName, '-')) . 'Block';

        return 'Jankx\\Support\\Blocks\\' . $className;
    }

    /**
     * Get block metadata from resources/blocks directory
     *
     * @return array
     */
    public function getBlocksMetadata()
    {
        $metadata = [];
        $blocksPath = get_template_directory() . '/resources/blocks';

        if (!is_dir($blocksPath)) {
            return $metadata;
        }

        $blockDirs = glob($blocksPath . '/*', GLOB_ONLYDIR);

        foreach ($blockDirs as $blockDir) {
            $blockName = basename($blockDir);
            $blockJsonPath = $blockDir . '/block.json';

            if (file_exists($blockJsonPath)) {
                $blockJson = file_get_contents($blockJsonPath);
                $blockData = json_decode($blockJson, true);

                if ($blockData) {
                    $metadata[$blockName] = $blockData;
                }
            }
        }

        return $metadata;
    }

    /**
     * Enqueue all block assets
     *
     * @return void
     */
    public function enqueueAllBlockAssets()
    {
        $metadata = $this->getBlocksMetadata();

        foreach ($metadata as $blockName => $blockData) {
            $this->enqueueBlockAssets($blockName, $blockData);
        }
    }

    /**
     * Enqueue block assets
     *
     * @param string $blockName
     * @param array $blockData
     */
    protected function enqueueBlockAssets($blockName, $blockData)
    {
        // Enqueue editor script
        if (!empty($blockData['editorScript'])) {
            wp_enqueue_script(
                $blockData['name'] . '-editor',
                \Jankx\Facades\Url::blockAsset($blockName . '/' . $blockData['editorScript']),
                ['wp-blocks', 'wp-element', 'wp-editor'],
                filemtime($blockData['buildPath'] . '/' . $blockData['editorScript']),
                true
            );
        }

        // Enqueue block style
        if (!empty($blockData['style'])) {
            wp_enqueue_style(
                $blockData['name'] . '-style',
                \Jankx\Facades\Url::blockAsset($blockName . '/' . $blockData['style']),
                [],
                filemtime($blockData['buildPath'] . '/' . $blockData['style'])
            );
        }
    }

    /**
     * Initialize blocks
     *
     * @return void
     */
    public function init()
    {
        // Discover blocks from directory
        $this->discoverBlocks();

        // Register all blocks
        $this->registerAllBlocks();
    }
}
