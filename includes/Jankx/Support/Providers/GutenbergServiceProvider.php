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
        $blocksPath = get_template_directory() . '/resources/blocks';

        if (!is_dir($blocksPath)) {
            return;
        }

        $blockDirs = glob($blocksPath . '/*', GLOB_ONLYDIR);

        foreach ($blockDirs as $blockDir) {
            $blockName = basename($blockDir);
            $buildPath = $blockDir . '/build';

            if (is_dir($buildPath)) {
                $this->enqueueBlockScript($blockName, $buildPath);
            }
        }
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

        if (file_exists($scriptFile)) {
            $scriptUrl = get_template_directory_uri() . '/resources/blocks/' . $blockName . '/build/index.js';
            $scriptVersion = filemtime($scriptFile);

            wp_enqueue_script(
                'jankx-block-' . $blockName,
                $scriptUrl,
                ['wp-blocks', 'wp-element', 'wp-editor', 'wp-components', 'wp-i18n'],
                $scriptVersion,
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
}
