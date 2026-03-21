<?php

namespace Jankx\Gutenberg;

use Exception;
use Jankx\Contracts\BlockInterface;

/**
 * Gutenberg Repository
 *
 * This class manages storage of Gutenberg blocks and patterns in the Jankx Framework.
 * It handles block and pattern registration and storage.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 2.0.0
 */
/**
 * Gutenberg Repository
 *
 * This class manages storage of Gutenberg blocks and patterns in the Jankx Framework.
 * Uses the Application container to resolve block instances lazily.
 *
 * @package Jankx\Gutenberg\Blocks
 * @since 2.0.0
 */
class GutenbergRepository
{
    /**
     * @var \Jankx\Foundation\Application
     */
    protected $app;

    /**
     * Registered blocks metadata (class or name)
     *
     * @var array
     */
    protected $blocks = [];

    /**
     * Block directory paths
     * 
     * @var array
     */
    protected $blockPaths = [];

    /**
     * Registered patterns
     *
     * @var array
     */
    protected $patterns = [];

    /**
     * Constructor
     * 
     * @param \Jankx\Foundation\Application $app
     */
    public function __construct(\Jankx\Foundation\Application $app)
    {
        $this->app = $app;
    }

    /**
     * Register a block
     *
     * @param string|BlockInterface $blockClass Block class name or instance
     * @param string|null $blockPath Block directory path
     * @return void
     */
    public function registerBlock($blockClass, $blockPath = null)
    {
        $className = is_object($blockClass) ? get_class($blockClass) : $blockClass;

        if (is_object($blockClass)) {
            if (!$blockClass instanceof BlockInterface) {
                throw new Exception('Block class must be an instance of ' . BlockInterface::class);
            }
            // If instance is already provided, ensure it's registered in container
            $this->app->instance($className, $blockClass);
        }

        $this->blocks[$className] = true;

        if ($blockPath) {
            $this->blockPaths[$className] = $blockPath;
        }
    }

    /**
     * Get block instance (Lazy resolving via container)
     *
     * @param string $blockName Block class name
     * @return BlockInterface|null
     */
    public function getBlock($blockName)
    {
        if (!$this->hasBlock($blockName)) {
            return null;
        }

        try {
            return $this->app->make($blockName);
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get block path
     *
     * @param string $blockClass Block class name
     * @return string|null
     */
    public function getBlockPath($blockClass)
    {
        return $this->blockPaths[$blockClass] ?? null;
    }

    /**
     * Get all registered block names
     *
     * @return array
     */
    public function getBlocks()
    {
        return array_keys($this->blocks);
    }

    /**
     * Check if block is registered
     *
     * @param string $blockName Block name
     * @return bool
     */
    public function hasBlock($blockName)
    {
        return isset($this->blocks[$blockName]);
    }

    /**
     * Get block count
     *
     * @return int
     */
    public function getBlockCount()
    {
        return count($this->blocks);
    }

    /**
     * Clear all block registrations
     *
     * @return void
     */
    public function clear()
    {
        $this->blocks = [];
        $this->blockPaths = [];
    }

    /**
     * Remove a specific block
     *
     * @param string $blockName Block class name
     * @return void
     */
    public function removeBlock($blockName)
    {
        unset($this->blocks[$blockName]);
        unset($this->blockPaths[$blockName]);
    }
}

