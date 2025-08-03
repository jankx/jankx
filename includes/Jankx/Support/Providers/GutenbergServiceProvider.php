<?php

namespace Jankx\Support\Providers;

use Jankx\Support\Blocks\GutenbergRepository;
use Jankx\Foundation\Application;

/**
 * Gutenberg Service Provider
 *
 * This service provider handles Gutenberg block registration and management
 * in the Jankx Framework. It initializes the Gutenberg Repository and
 * manages block lifecycle.
 *
 * @package Jankx\Support\Providers
 * @since 1.0.0
 */
class GutenbergServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(Application $app)
    {
        // Register Gutenberg Repository as singleton
        $this->app->singleton('gutenberg.repository', function ($app) {
            return new GutenbergRepository();
        });

        // Register Gutenberg Repository alias
        $this->app->alias('gutenberg.repository', GutenbergRepository::class);
    }

    /**
     * Bootstrap any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function boot(Application $app)
    {
        // Initialize Gutenberg blocks
        $this->app->make('gutenberg.repository')->init();

        // Enqueue block editor assets
        add_action('enqueue_block_editor_assets', [$this, 'enqueueBlockEditorAssets']);
    }

    /**
     * Enqueue block editor assets
     *
     * @return void
     */
    public function enqueueBlockEditorAssets()
    {
        // Enqueue built block scripts
        $this->enqueueBuiltBlockScripts();
    }

    /**
     * Enqueue built block scripts
     *
     * @return void
     */
    protected function enqueueBuiltBlockScripts()
    {
        // Cache block discovery for 1 hour
        $cacheKey = 'jankx_blocks_discovery';
        $blocks = wp_cache_get($cacheKey, 'jankx_blocks');

        if ($blocks === false) {
            $blocks = $this->discoverBlocks();
            wp_cache_set($cacheKey, $blocks, 'jankx_blocks', 3600);
        }

        foreach ($blocks as $blockName => $blockData) {
            $this->enqueueBlockScript($blockName, $blockData['buildPath']);
        }
    }

    /**
     * Discover blocks from filesystem
     *
     * @return array
     */
    protected function discoverBlocks()
    {
        $blocks = [];
        $blocksPath = get_template_directory() . '/resources/blocks';

        if (!is_dir($blocksPath)) {
            return $blocks;
        }

        $blockDirs = glob($blocksPath . '/*', GLOB_ONLYDIR);

        foreach ($blockDirs as $blockDir) {
            $blockName = basename($blockDir);
            $buildPath = $blockDir . '/build';

            if (is_dir($buildPath)) {
                $blocks[$blockName] = [
                    'buildPath' => $buildPath,
                    'scriptFile' => $buildPath . '/index.js',
                    'styleFile' => $buildPath . '/index.css',
                    'assetFile' => $buildPath . '/index.asset.php'
                ];
            }
        }

        return $blocks;
    }

    /**
     * Enqueue block script
     *
     * @param string $blockName Block name
     * @param string $buildPath Build path
     * @return void
     */
    protected function enqueueBlockScript($blockName, $buildPath)
    {
        $scriptFile = $buildPath . '/index.js';
        $styleFile = $buildPath . '/index.css';
        $assetFile = $buildPath . '/index.asset.php';

        if (file_exists($scriptFile)) {
            $scriptUrl = get_template_directory_uri() . '/resources/blocks/' . $blockName . '/build/index.js';

            // Load dependencies from asset file if exists
            $dependencies = ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n'];
            $version = filemtime($scriptFile);

            if (file_exists($assetFile)) {
                $asset = include $assetFile;
                if (is_array($asset) && isset($asset['dependencies'])) {
                    $dependencies = $asset['dependencies'];
                }
                if (is_array($asset) && isset($asset['version'])) {
                    $version = $asset['version'];
                }
            }

            wp_enqueue_script(
                'jankx-block-' . $blockName,
                $scriptUrl,
                $dependencies,
                $version,
                true
            );
        }

        if (file_exists($styleFile)) {
            $styleUrl = get_template_directory_uri() . '/resources/blocks/' . $blockName . '/build/index.css';
            $styleVersion = filemtime($styleFile);

            wp_enqueue_style(
                'jankx-block-' . $blockName . '-style',
                $styleUrl,
                [],
                $styleVersion
            );
        }
    }

    /**
     * Clear block discovery cache
     *
     * @return void
     */
    public static function clearBlockCache()
    {
        wp_cache_flush_group('jankx_blocks');
    }
}
