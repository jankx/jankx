<?php

namespace Jankx\Support\Blocks;

/**
 * Base Block Class for Jankx Framework
 *
 * This class provides the foundation for all custom Gutenberg blocks
 * in the Jankx Framework. It handles block registration, rendering,
 * and common functionality shared across all blocks.
 *
 * @package Jankx\Support\Blocks
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
        // Enqueue editor script
        if (isset($metadata['editorScript'])) {
            $scriptPath = $blockPath . '/' . $metadata['editorScript'];
            if (file_exists($scriptPath)) {
                wp_enqueue_script(
                    $this->name . '-editor',
                    get_template_directory_uri() . '/resources/blocks/' . $this->getBlockNameFromPath($blockPath) . '/' . $metadata['editorScript'],
                    ['wp-blocks', 'wp-element', 'wp-editor'],
                    filemtime($scriptPath)
                );
            }
        }

        // Enqueue styles
        if (isset($metadata['style'])) {
            $stylePath = $blockPath . '/' . $metadata['style'];
            if (file_exists($stylePath)) {
                wp_enqueue_style(
                    $this->name . '-style',
                    get_template_directory_uri() . '/resources/blocks/' . $this->getBlockNameFromPath($blockPath) . '/' . $metadata['style'],
                    [],
                    filemtime($stylePath)
                );
            }
        }
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
}