<?php

namespace Jankx\Gutenberg;

use Jankx\Contracts\BlockInterface;
use Jankx\Facades\App;
use Jankx\Foundation\Application;

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
abstract class Block implements BlockInterface
{
    /**
     * Summary of blockId
     * @var
     */
    protected $blockId;

    /**
     * Summary of blockPath
     */
    protected $blockPath;

    /**
     * Get the block ID
     *
     * @return string
     */
    public function getBlockId()
    {
        return $this->blockId;
    }

     /**
     * Constructor
     *
     * @param string|null $blockPath Path to the directory containing block.json
     * @throws \RuntimeException When block path cannot be resolved
     */
    public function __construct($blockPath = null)
    {
        // Resolve blockPath if not provided
        if (!$blockPath) {
            $blockPath = $this->resolveBlockPathFromContainer();
            if (!$blockPath) {
                throw new \RuntimeException(
                    sprintf('Cannot resolve block path for block ID: %s', $this->getBlockId())
                );
            }
        }

        $this->blockPath = $blockPath;
    }

    public function register(): void
    {
        $args = [];
        if (method_exists($this, 'render')) {
            $args['render_callback'] = [$this, 'render'];
        }
        $registered = register_block_type_from_metadata($this->blockPath, $args);
        
        // Load JavaScript translations for the block
        if ($registered && !empty($registered->editor_script)) {
            $this->loadScriptTranslations($registered->editor_script);
        }
        if ($registered && !empty($registered->view_script)) {
            $this->loadScriptTranslations($registered->view_script);
        }
    }
    
    /**
     * Load script translations for a block
     *
     * @param string $handle Script handle
     * @return void
     */
    protected function loadScriptTranslations($handle)
    {
        if (is_string($handle)) {
            wp_set_script_translations(
                $handle,
                'jankx',
                get_template_directory() . '/languages'
            );
        }
    }

    /**
     * Resolve block path from application container
     *
     * @return string|false Block path or false if not found
     */
    protected function resolveBlockPathFromContainer()
    {
        $app = Application::getInstance();
        if (!$app) {
            return false;
        }

        // First, try to get block path from repository
        if ($app->bound('gutenberg.repository')) {
            $repository = $app->make('gutenberg.repository');
            $blockPath = $repository->getBlockPath(get_class($this));
            if ($blockPath && is_dir($blockPath)) {
                return $blockPath;
            }
        }

        // Fallback to default blocks path
        if (!$app->bound('blocks.path')) {
            return false;
        }

        $blocksPath = $app->make('blocks.path');
        $blockId = $this->getBlockId();
        if (empty($blockId)) {
            return false;
        }
        $blockPath = $blocksPath . '/' . basename($blockId);

        if (!is_dir($blockPath)) {
            return false;
        }

        return $blockPath;
    }
}
