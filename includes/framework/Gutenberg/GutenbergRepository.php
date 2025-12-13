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
     * Registered patterns
     *
     * @var array
     */
    protected $patterns = [];

    /**
     * Pattern instances
     *
     * @var array
     */
    protected $patternInstances = [];

    protected $blockPaths = [];

    /**
     * Constructor
     */
    public function __construct()
    {
        // Repository is ready for block storage
    }

    /**
     * Register a block
     *
     * @param string|Block $blockClass Block class name or instance
     * @param string|null $blockPath Block directory path
     * @return void
     */
    public function registerBlock($blockClass, $blockPath = null)
    {
        if (is_object($blockClass)) {
            if (!$blockClass instanceof BlockInterface) {
                throw new Exception('Block class must be an instance of ' . BlockInterface::class);
            }
            // inited
            $this->blocks[get_class($blockClass)] = true;
            $this->instances[get_class($blockClass)] = $blockClass;

            // Store block path if provided
            if ($blockPath) {
                $this->blockPaths[get_class($blockClass)] = $blockPath;
            }
        } else {
            // not inited
            $this->blocks[$blockClass] = false;

            // Store block path if provided
            if ($blockPath) {
                $this->blockPaths[$blockClass] = $blockPath;
            }
        }
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
     * Check if block exists
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
     * Clear all blocks
     *
     * @return void
     */
    public function clear()
    {
        $this->blocks = [];
        $this->instances = [];
    }

    /**
     * Remove a specific block
     *
     * @param string $blockName Block name
     * @return void
     */
    public function removeBlock($blockName)
    {
        if (isset($this->blocks[$blockName])) {
            unset($this->blocks[$blockName]);
        }

        if (isset($this->instances[$blockName])) {
            unset($this->instances[$blockName]);
        }
    }
}
