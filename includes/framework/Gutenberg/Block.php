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
     */
    public function __construct($blockPath = null)
    {
        $this->blockPath = $blockPath;
    }

    /**
     * Set block path
     *
     * @param string $path
     * @return void
     */
    public function setBlockPath(string $path): void
    {
        $this->blockPath = $path;
    }

    /**
     * Boot block and initialize its components
     *
     * @return void
     */
    public function boot(): void
    {
        if (!$this->blockPath) {
            $this->blockPath = $this->resolveBlockPathFromContainer();
        }

        $this->registerHooks();

        if (is_admin()) {
            $this->registerEditorAssets();
        } else {
            $this->registerFrontendAssets();
        }
    }

    /**
     * Register WordPress hooks for this block
     *
     * @return void
     */
    protected function registerHooks(): void
    {
        // Override in child classes to register actions/filters
    }

    /**
     * Register assets for the block editor
     *
     * @return void
     */
    protected function registerEditorAssets(): void
    {
        // Override in child classes to enqueue editor scripts/styles
    }

    /**
     * Register assets for the frontend
     *
     * @return void
     */
    protected function registerFrontendAssets(): void
    {
        // Override in child classes to enqueue frontend scripts/styles
    }

    public function register(): void
    {
        $args = [];
        if (method_exists($this, 'render')) {
            $args['render_callback'] = [$this, 'render'];
        }
        $registered = register_block_type_from_metadata($this->blockPath, $args);

        if ($registered instanceof \WP_Block_Type) {
            $this->fixBrokenScriptUrls($registered);
        }
    }

    /**
     * Fix broken script/style URLs for blocks in child theme extensions.
     *
     * On Windows, `get_block_asset_url()` in wp-includes/blocks.php may fall
     * through to `plugins_url()` when the block path doesn't match parent/child
     * theme directories (due to realpath() differences). Polylang's `plugins_url`
     * filter then corrupts the URL (e.g. missing `/` between domain and path).
     *
     * This method detects broken URLs and re-registers the affected assets with
     * correct URLs resolved via `get_theme_file_uri()`.
     */
    protected function fixBrokenScriptUrls(\WP_Block_Type $block): void
    {
        if (!$this->blockPath || !is_child_theme()) {
            return;
        }

        $stylesheetDir = wp_normalize_path(get_stylesheet_directory());
        $templateDir = wp_normalize_path(get_template_directory());
        $blockPathNorm = wp_normalize_path($this->blockPath);

        // Only fix blocks whose path is inside the child theme (stylesheet) directory
        if (strpos($blockPathNorm, trailingslashit($stylesheetDir)) !== 0) {
            return;
        }

        // Skip if path is actually in the parent theme
        if (strpos($blockPathNorm, trailingslashit($templateDir)) === 0) {
            return;
        }

        $fixable = [
            'editor_script',
            'editor_style',
            'style',
            'view_script',
        ];

        foreach ($fixable as $property) {
            $handle = $block->$property ?? '';
            if (empty($handle) || !is_string($handle)) {
                continue;
            }

            if (!wp_script_is($handle, 'registered') && !wp_style_is($handle, 'registered')) {
                continue;
            }

            $isStyle = in_array($property, ['editor_style', 'style'], true);
            $wpAsset = $isStyle ? wp_styles() : wp_scripts();
            $asset = $wpAsset->registered[$handle] ?? null;

            if (!$asset || empty($asset->src)) {
                continue;
            }

            $src = $asset->src;

            // Detect the broken URL pattern: domain concatenated with path without separator
            // e.g. "https://nibitour.localhostassets/..." instead of "https://nibitour.localhost/assets/..."
            $siteUrl = esc_url(get_site_url());
            $siteUrlNorm = rtrim($siteUrl, '/');

            if (strpos($src, $siteUrlNorm) !== 0) {
                continue;
            }

            $pathPart = substr($src, strlen($siteUrlNorm));

            // Check for missing slash: path starts directly with a letter (e.g. "assets/...")
            if (empty($pathPart) || $pathPart[0] === '/') {
                continue;
            }

            // Broken URL detected — resolve the correct URL from the block path
            $blockJsonPath = $this->blockPath . '/block.json';
            if (!file_exists($blockJsonPath)) {
                continue;
            }

            $blockJson = json_decode(file_get_contents($blockJsonPath), true);
            $fieldMap = [
                'editor_script' => 'editorScript',
                'editor_style'  => 'editorStyle',
                'style'         => 'style',
                'view_script'   => 'viewScript',
            ];
            $metaKey = $fieldMap[$property] ?? '';
            $fileRef = $blockJson[$metaKey] ?? '';

            if (empty($fileRef) || strpos($fileRef, 'file:') !== 0) {
                continue;
            }

            $fileRef = substr($fileRef, 5); // strip "file:"
            $fileRef = ltrim($fileRef, './');
            $absoluteFile = wp_normalize_path($this->blockPath . '/' . $fileRef);

            if (!file_exists($absoluteFile)) {
                continue;
            }

            // Build correct URL relative to stylesheet directory
            $fileRelative = ltrim(substr($absoluteFile, strlen(trailingslashit($stylesheetDir))), '/');
            $correctUrl = get_stylesheet_directory_uri() . '/' . $fileRelative;

            if ($correctUrl === $src) {
                continue;
            }

            // Fix the registered asset URL
            $asset->src = $correctUrl;
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
        if (!is_string($handle) || empty($handle)) {
            return;
        }
        
        // Only load translations if script is registered and languages directory exists
        if (wp_script_is($handle, 'registered')) {
            $languages_path = get_template_directory() . '/languages';
            if (is_dir($languages_path)) {
                wp_set_script_translations(
                    $handle,
                    'jankx',
                    $languages_path
                );
            }
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
