<?php

namespace Jankx\Support\Providers;

use Jankx\Support\Blocks\GutenbergRepository;
use Jankx\Foundation\Application;
use Jankx\Facades\Log;
use Jankx\Helper\Environment;

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
        // Register Gutenberg repository
        $app->singleton('gutenberg.repository', function ($app) {
            return new \Jankx\Support\Blocks\GutenbergRepository();
        });
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
        $this->registerGutenbergHooks();
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
     * Enqueue built block scripts and styles
     */
    public function enqueueBuiltBlockScripts()
    {
        $blocksDir = get_template_directory() . '/resources/blocks';

        if (!is_dir($blocksDir)) {
            return;
        }

        $blockDirs = glob($blocksDir . '/*', GLOB_ONLYDIR);

        foreach ($blockDirs as $blockDir) {
            $blockName = basename($blockDir);
            $buildDir = $blockDir . '/build';

            if (!is_dir($buildDir)) {
                continue;
            }

            // Enqueue built JS file
            $jsFile = $buildDir . '/index.js';
            if (file_exists($jsFile)) {
                $scriptUrl = \Jankx\Facades\Url::blockAsset($blockName . '/build/index.js');
                wp_enqueue_script(
                    'jankx-block-' . $blockName,
                    $scriptUrl,
                    ['wp-blocks', 'wp-element', 'wp-editor'],
                    filemtime($jsFile),
                    true
                );
            }

            // Enqueue built CSS file
            $cssFile = $buildDir . '/index.css.css';
            if (file_exists($cssFile)) {
                $styleUrl = \Jankx\Facades\Url::blockAsset($blockName . '/build/index.css.css');
                wp_enqueue_style(
                    'jankx-block-' . $blockName . '-style',
                    $styleUrl,
                    [],
                    filemtime($cssFile)
                );
            }
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
            if (Environment::isDebugLog()) {
                Log::debug('Blocks path does not exist: ' . $blocksPath);
            }
            return $blocks;
        }

        $blockDirs = glob($blocksPath . '/*', GLOB_ONLYDIR);

        if (Environment::isDebugLog()) {
            Log::debug('Found block directories: ' . print_r($blockDirs, true));
        }

        foreach ($blockDirs as $blockDir) {
            $blockName = basename($blockDir);
            $buildPath = $blockDir . '/build';

            if (is_dir($buildPath)) {
                $blocks[$blockName] = [
                    'buildPath' => $buildPath,
                    'scriptFile' => $buildPath . '/index.js',
                    'styleFile' => $buildPath . '/index.css.css',
                    'assetFile' => $buildPath . '/index.asset.php'
                ];

                if (Environment::isDebugLog()) {
                    Log::debug('Registered block: ' . $blockName . ' at ' . $buildPath);
                }
            } else {
                if (Environment::isDebugLog()) {
                    Log::debug('Build path does not exist: ' . $buildPath);
                }
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
        $styleFile = $buildPath . '/index.css.css';
        $assetFile = $buildPath . '/index.asset.php';

        if (file_exists($scriptFile)) {
            $scriptUrl = \Jankx\Facades\Asset::url('resources/blocks/' . $blockName . '/build/index.js');

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
            $styleUrl = \Jankx\Facades\Asset::url('resources/blocks/' . $blockName . '/build/index.css.css');
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

    /**
     * Register Gutenberg-specific hooks
     */
    protected function registerGutenbergHooks()
    {
        add_action('init', [$this->app->make('gutenberg.repository'), 'init']);

        // Enqueue block editor assets with priority 20 (after wp_enqueue_scripts)
        add_action('enqueue_block_editor_assets', [$this, 'enqueueBlockEditorAssets'], 20);
    }
}
