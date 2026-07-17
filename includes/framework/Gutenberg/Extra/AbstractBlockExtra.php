<?php

namespace Jankx\Gutenberg\Extra;

use Jankx\Contracts\Gutenberg\BlockExtraInterface;

/**
 * Class AbstractBlockExtra
 *
 * Provides base functionality for extra block enhancements,
 * including theme-aware asset resolution (Child Theme > Parent Theme).
 *
 * @package Jankx\Gutenberg\Extra
 */
abstract class AbstractBlockExtra implements BlockExtraInterface
{
    /**
     * Cache for resolved asset paths to improve performance
     *
     * @var array
     */
    protected static $resolvedPaths = [];

    /**
     * @inheritDoc
     */
    public function register(): void
    {
        $target = $this->getTargetBlockName();
        // Register the render filter specifically for this block if possible, or use the global one
        add_filter("render_block_{$target}", [$this, 'handle'], 10, 2);
    }

    /**
     * Resolve the asset URL with Child Theme priority.
     * If Child Theme has the file, it will be used exclusively.
     *
     * @param string $relativePath
     * @return string|false
     */
    protected function getAssetUrl(string $relativePath)
    {
        $path = $this->resolvePath($relativePath);
        if (!$path) {
            return false;
        }

        // Determine if it's in child or parent
        if (strpos($path, get_stylesheet_directory()) === 0) {
            return get_stylesheet_directory_uri() . '/' . $relativePath;
        }

        return get_template_directory_uri() . '/' . $relativePath;
    }

    /**
     * Resolve the absolute path of an asset with Child Theme priority.
     *
     * @param string $relativePath
     * @return string|false
     */
    protected function resolvePath(string $relativePath)
    {
        if (isset(self::$resolvedPaths[$relativePath])) {
            return self::$resolvedPaths[$relativePath];
        }

        $childPath = get_stylesheet_directory() . '/' . $relativePath;
        $parentPath = get_template_directory() . '/' . $relativePath;

        if (file_exists($childPath)) {
            self::$resolvedPaths[$relativePath] = $childPath;
            return $childPath;
        }

        if (file_exists($parentPath)) {
            self::$resolvedPaths[$relativePath] = $parentPath;
            return $parentPath;
        }

        return false;
    }

    /**
     * Get the modification time of the resolved asset for versioning.
     *
     * @param string $relativePath
     * @return string|int
     */
    protected function getAssetVersion(string $relativePath)
    {
        $path = $this->resolvePath($relativePath);
        return $path ? filemtime($path) : '1.0.0';
    }
}
