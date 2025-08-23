<?php

namespace Jankx\Gutenberg\Blocks;

/**
 * Base Block Class for Jankx Framework
 *
 * This class provides the foundation for all custom Gutenberg blocks
 * in the Jankx Framework. It handles block registration, rendering,
 * and common functionality shared across all blocks.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 1.0.0
 */
abstract class Block
{
    /**
     * Block name (namespace/block-name)
     *
     * @var string
     */
    protected $name;

    /**
     * Block configuration
     *
     * @var array
     */
    protected $config;

    /**
     * Block attributes
     *
     * @var array
     */
    protected $attributes;

    /**
     * Constructor
     *
     * @param string $name Block name
     * @param array $config Block configuration
     */
    public function __construct($name, array $config = [])
    {
        $this->name = $name;
        $this->config = $config;
        $this->attributes = $config['attributes'] ?? [];
    }

    /**
     * Get block name
     *
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * Get block configuration
     *
     * @return array
     */
    public function getConfig()
    {
        return $this->config;
    }

    /**
     * Get block attributes
     *
     * @return array
     */
    public function getAttributes()
    {
        return $this->attributes;
    }

    /**
     * Register the block
     *
     * This method should be implemented by child classes to handle
     * the specific registration logic for each block type.
     *
     * @return void
     */
    abstract public function register();

    /**
     * Render the block content
     *
     * This method should be implemented by child classes to handle
     * the specific rendering logic for each block type.
     *
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @return string Rendered HTML
     */
    abstract public function render($attributes, $content = '');

    /**
     * Get block metadata from block.json file
     *
     * @param string $blockPath Path to block directory
     * @return array Block metadata
     */
    protected function getBlockMetadata($blockPath)
    {
        $blockJsonPath = $blockPath . '/block.json';

        if (!file_exists($blockJsonPath)) {
            return [];
        }

        $blockJson = file_get_contents($blockJsonPath);
        return json_decode($blockJson, true) ?: [];
    }

    /**
     * Enqueue block assets
     *
     * @param string $blockPath Path to block directory
     * @param array $metadata Block metadata
     * @return void
     */
    protected function enqueueAssets($blockPath, $metadata)
    {
        // Cache asset data for 1 hour
        $cacheKey = 'jankx_block_assets_' . $this->name;
        $assetData = wp_cache_get($cacheKey, 'jankx_blocks');

        if ($assetData === false) {
            $assetData = $this->getAssetData($blockPath, $metadata);
            wp_cache_set($cacheKey, $assetData, 'jankx_blocks', 3600);
        }

        // Enqueue script if available
        if ($assetData['script']) {
            wp_enqueue_script(
                $this->name . '-editor',
                $assetData['script']['url'],
                $assetData['script']['dependencies'],
                $assetData['script']['version'],
                true
            );
        }

        // Enqueue style if available
        if ($assetData['style']) {
            wp_enqueue_style(
                $this->name . '-style',
                $assetData['style']['url'],
                [],
                $assetData['style']['version']
            );
        }
    }

    /**
     * Get asset data for block
     *
     * @param string $blockPath Path to block directory
     * @param array $metadata Block metadata
     * @return array
     */
    protected function getAssetData($blockPath, $metadata)
    {
        $assetData = [
            'script' => null,
            'style' => null
        ];

        // Get script data
        if (isset($metadata['editorScript'])) {
            $scriptPath = $blockPath . '/' . $metadata['editorScript'];
            $assetPath = $blockPath . '/build/index.asset.php';

            if (file_exists($scriptPath)) {
                $dependencies = ['wp-blocks', 'wp-element', 'wp-editor'];
                $version = filemtime($scriptPath);

                // Load dependencies from asset file if exists
                if (file_exists($assetPath)) {
                    $asset = include $assetPath;
                    if (is_array($asset) && isset($asset['dependencies'])) {
                        $dependencies = $asset['dependencies'];
                    }
                    if (is_array($asset) && isset($asset['version'])) {
                        $version = $asset['version'];
                    }
                }

                $assetData['script'] = [
                    'url' => \Jankx\Facades\Url::blockAsset($this->getBlockNameFromPath($blockPath) . '/' . $metadata['editorScript']),
                    'dependencies' => $dependencies,
                    'version' => $version
                ];
            }
        }

        // Get style data
        if (isset($metadata['style'])) {
            $stylePath = $blockPath . '/' . $metadata['style'];
            if (file_exists($stylePath)) {
                $assetData['style'] = [
                    'url' => \Jankx\Facades\Url::blockAsset($this->getBlockNameFromPath($blockPath) . '/' . $metadata['style']),
                    'version' => filemtime($stylePath)
                ];
            }
        }

        return $assetData;
    }

    /**
     * Get block name from path
     *
     * @param string $blockPath Block path
     * @return string Block name
     */
    protected function getBlockNameFromPath($blockPath)
    {
        return basename($blockPath);
    }

    /**
     * Register block with WordPress
     *
     * @param string $blockPath Path to block directory
     * @param array $metadata Block metadata
     * @return void
     */
    protected function registerBlock($blockPath, $metadata)
    {
        $blockArgs = [
            'render_callback' => [$this, 'render'],
        ];

        // Merge with metadata
        $blockArgs = array_merge($metadata, $blockArgs);

        register_block_type($blockPath, $blockArgs);
    }

    protected function getBlockMetadataUrls($blockPath, $metadata)
    {
        $blockName = $this->getBlockNameFromPath($blockPath);
        $urls = [];
        if (isset($metadata['editorScript'])) {
            $urls['editorScript'] = [
                'url' => \Jankx\Facades\Url::blockAsset($blockName . '/' . $metadata['editorScript'])
            ];
        }
        if (isset($metadata['style'])) {
            $urls['style'] = [
                'url' => \Jankx\Facades\Url::blockAsset($blockName . '/' . $metadata['style'])
            ];
        }
        return $urls;
    }

    /**
     * Get block assets
     *
     * @return array
     */
    protected function getBlockAssets()
    {
        $blockPath = $this->getBlockPath();
        $metadata = $this->getMetadata();

        $assets = [];

        if (isset($metadata['editorScript'])) {
            $assets['editorScript'] = [
                'url' => \Jankx\Facades\Url::blockAsset($this->getBlockNameFromPath($blockPath) . '/' . $metadata['editorScript']),
                'path' => $blockPath . '/' . $metadata['editorScript']
            ];
        }

        if (isset($metadata['style'])) {
            $assets['style'] = [
                'url' => \Jankx\Facades\Url::blockAsset($this->getBlockNameFromPath($blockPath) . '/' . $metadata['style']),
                'path' => $blockPath . '/' . $metadata['style']
            ];
        }

        return $assets;
    }
}
