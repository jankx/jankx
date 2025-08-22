<?php

namespace Jankx\Support\Providers;

use Jankx\Services\GutenbergService;
use Jankx\Framework\Services\AdvancedGutenbergService;
use Jankx\Foundation\Application;
use Jankx\Facades\Log;
use Jankx\Helper\Environment;

/**
 * Gutenberg Service Provider
 *
 * This service provider handles Gutenberg block registration and management
 * in the Jankx Framework. It initializes the Gutenberg Service and
 * manages block lifecycle.
 *
 * @package Jankx\Support\Providers
 * @since 2.0.0
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
        // Register Gutenberg service
        $app->singleton('gutenberg.service', function ($app) {
            return new GutenbergService($app);
        });

        // Register Gutenberg repository
        $app->singleton('gutenberg.repository', function ($app) {
            return new \Jankx\Support\Blocks\GutenbergRepository();
        });

        // Register Advanced Gutenberg service
        $app->singleton('advanced.gutenberg.service', function ($app) {
            return new AdvancedGutenbergService();
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
     * Clear block discovery cache
     *
     * @return void
     */
    public static function clearBlockCache()
    {
        // Clear WordPress cache
        wp_cache_flush_group('jankx_blocks');

        // Clear Gutenberg service cache if available
        if (function_exists('jankx')) {
            $app = jankx();
            if ($app && $app->bound('gutenberg.service')) {
                $app->make('gutenberg.service')->clearCache();
            }
        }
    }

    /**
     * Register Gutenberg-specific hooks
     */
    protected function registerGutenbergHooks()
    {
        // Initialize Gutenberg service (includes both blocks and patterns)
        add_action('init', [$this->app->make('gutenberg.service'), 'init']);

        // Enqueue block editor assets with priority 20 (after wp_enqueue_scripts)
        add_action('enqueue_block_editor_assets', [$this, 'enqueueBlockEditorAssets'], 20);
    }
}
