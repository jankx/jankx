<?php

namespace Jankx\Gutenberg;

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
     * Get block.json data for the current block
     *
     * @return array|false Block metadata or false if not found
     */
    protected function getBlockJson()
    {
        $blockPath = $this->getBlockPath();
        if (!$blockPath) {
            return false;
        }

        $metadata = $this->getBlockMetadata($blockPath);
        if (empty($metadata)) {
            return false;
        }

        // Merge with constructor config
        $metadata = array_merge($metadata, $this->config);

        return $metadata;
    }

    /**
     * Get the block directory path
     *
     * @return string|false Block directory path or false if not found
     */
    protected function getBlockPath()
    {
        $blockName = $this->getBlockNameFromNamespace($this->name);
        $blockPath = get_template_directory() . '/resources/blocks/' . $blockName;

        if (!is_dir($blockPath)) {
            return false;
        }

        return $blockPath;
    }

    /**
     * Extract block name from namespace
     *
     * @param string $namespace Full namespace (e.g., 'jankx/block-name')
     * @return string Block name (e.g., 'block-name')
     */
    protected function getBlockNameFromNamespace($namespace)
    {
        $parts = explode('/', $namespace);
        return end($parts);
    }

        /**
     * Prioritize build assets over source assets
     *
     * @param array $metadata Block metadata
     * @return void
     */
    protected function prioritizeBuildAssets(&$metadata)
    {
        $blockPath = $this->getBlockPath();
        if (!$blockPath) {
            return;
        }

        $buildPath = $blockPath . '/build';

        // Check if build directory exists and prioritize build assets
        if (is_dir($buildPath)) {
            // Update editorScript to use build version
            if (isset($metadata['editorScript'])) {
                $originalScript = $metadata['editorScript'];
                $buildScript = $this->getBuildAssetPath($originalScript, 'index.js');
                if ($buildScript) {
                    $metadata['editorScript'] = $buildScript;
                }
            }

            // Update editorStyle to use build version
            if (isset($metadata['editorStyle'])) {
                $originalEditorStyle = $metadata['editorStyle'];
                $buildEditorStyle = $this->getBuildAssetPath($originalEditorStyle, 'editor.css');
                if ($buildEditorStyle) {
                    $metadata['editorStyle'] = $buildEditorStyle;
                }
            }

            // Update style to use build version
            if (isset($metadata['style'])) {
                $originalStyle = $metadata['style'];
                $buildStyle = $this->getBuildAssetPath($originalStyle, 'style.css');
                if ($buildStyle) {
                    $metadata['style'] = $buildStyle;
                }
            }

            // Update viewScript to use build version
            if (isset($metadata['viewScript'])) {
                $originalViewScript = $metadata['viewScript'];
                $buildViewScript = $this->getBuildAssetPath($originalViewScript, 'view.js');
                if ($buildViewScript) {
                    $metadata['viewScript'] = $buildViewScript;
                }
            }

            // Update save to use build version
            if (isset($metadata['save'])) {
                $originalSave = $metadata['save'];
                $buildSave = $this->getBuildAssetPath($originalSave, 'save.js');
                if ($buildSave) {
                    $metadata['save'] = $buildSave;
                }
            }
        }
    }

    /**
     * Get build asset path
     *
     * @param string $originalPath Original asset path
     * @param string $buildFilename Build filename
     * @return string|false Build asset path or false if not found
     */
    protected function getBuildAssetPath($originalPath, $buildFilename)
    {
        $blockPath = $this->getBlockPath();
        if (!$blockPath) {
            return false;
        }

        $buildPath = $blockPath . '/build/' . $buildFilename;

        if (file_exists($buildPath)) {
            return 'file:./build/' . $buildFilename;
        }

        return false;
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
            wp_cache_set($cacheKey, 'jankx_blocks', $assetData, 3600);
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

        // CSS is handled automatically by block.json
        // No manual CSS enqueue to avoid iframe warnings
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

    /**
     * Register block with metadata array
     *
     * @param array $metadata Block metadata
     * @return void
     */
    protected function registerBlockWithMetadata($metadata)
    {
        $blockPath = $this->getBlockPath();
        if (!$blockPath) {
            return;
        }

        $this->registerBlock($blockPath, $metadata);

        // Add hooks to enqueue assets at the right time
        add_action('wp_enqueue_scripts', [$this, 'enqueueBlockAssets']);
        add_action('enqueue_block_assets', [$this, 'enqueueBlockAssets']);
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

    /**
     * Enqueue block assets
     *
     * @return void
     */
    public function enqueueBlockAssets()
    {
        $blockPath = $this->getBlockPath();
        if (!$blockPath) {
            return;
        }

        $blockName = $this->getBlockNameFromNamespace($this->name);
        $buildPath = $blockPath . '/build';
        $metadata = $this->getBlockJson();

        if (is_dir($buildPath)) {
            // Frontend assets (wp_enqueue_scripts)
            if (!is_admin()) {
                // Enqueue frontend style
                $stylePath = $buildPath . '/style.css';
                if (file_exists($stylePath)) {
                    wp_enqueue_style(
                        $this->name . '-style',
                        get_template_directory_uri() . '/resources/blocks/' . $blockName . '/build/style.css',
                        [],
                        filemtime($stylePath)
                    );
                }

                // Enqueue view script for frontend
                $viewScriptPath = $buildPath . '/view.js';
                if (file_exists($viewScriptPath)) {
                    $dependencies = [];

                    // Add Swiper dependency for carousel block
                    if ($this->name === 'jankx/carousel') {
                        $dependencies[] = 'swiper-js';
                    }

                    wp_enqueue_script(
                        $this->name . '-view',
                        get_template_directory_uri() . '/resources/blocks/' . $blockName . '/build/view.js',
                        $dependencies,
                        filemtime($viewScriptPath),
                        true
                    );
                }

                // Enqueue script for frontend if declared in block.json (only if no viewScript)
                if ($metadata && isset($metadata['script']) && !isset($metadata['viewScript'])) {
                    $scriptPath = $buildPath . '/view.js';
                    if (file_exists($scriptPath)) {
                        wp_enqueue_script(
                            $this->name . '-script',
                            get_template_directory_uri() . '/resources/blocks/' . $blockName . '/build/view.js',
                            [],
                            filemtime($scriptPath),
                            true
                        );
                    }
                }
            }

            // Admin assets (enqueue_block_assets)
            if (is_admin() && function_exists('get_current_screen') && get_current_screen() && get_current_screen()->is_block_editor) {
                // Enqueue editor script
                $scriptPath = $buildPath . '/index.js';
                if (file_exists($scriptPath)) {
                    wp_enqueue_script(
                        $this->name . '-editor',
                        get_template_directory_uri() . '/resources/blocks/' . $blockName . '/build/index.js',
                        ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n'],
                        filemtime($scriptPath),
                        true
                    );
                }

                // CSS is handled automatically by block.json
                // No manual CSS enqueue to avoid iframe warnings

                // Enqueue script for editor if declared in block.json (only if no viewScript)
                if ($metadata && isset($metadata['script']) && !isset($metadata['viewScript'])) {
                    $scriptPath = $buildPath . '/view.js';
                    if (file_exists($scriptPath)) {
                        wp_enqueue_script(
                            $this->name . '-script',
                            get_template_directory_uri() . '/resources/blocks/' . $blockName . '/build/view.js',
                            [],
                            filemtime($scriptPath),
                            true
                        );
                    }
                }
            }
        }
    }
}
