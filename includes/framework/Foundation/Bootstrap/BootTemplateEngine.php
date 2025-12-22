<?php

namespace Jankx\Foundation\Bootstrap;

use Jankx\Foundation\Application;

/**
 * Boot Template Engine
 *
 * This bootstrap class initializes the Latte template engine for Jankx Framework.
 * It sets up the Latte engine with proper caching, filters, and WordPress integration.
 *
 * @package Jankx\Foundation\Bootstrap
 * @since 2.0.0
 */
class BootTemplateEngine
{
    /**
     * Bootstrap the given application.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function bootstrap(Application $app)
    {
        // Setup Latte template engine
        $this->setupLatteEngine($app);
    }

    /**
     * Setup Latte template engine with proper configuration.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    protected function setupLatteEngine(Application $app)
    {
        if (!class_exists('Latte\Engine')) {
            throw new \RuntimeException('Latte template engine is required. Please run "composer install" to install dependencies.');
        }
        
        $latte = new \Latte\Engine();
        
        // Configure cache based on WP_DEBUG
        $uploads = wp_upload_dir();
        $cache_base_dir = $uploads['basedir'] . '/jankx/cache/views';
        
        // Ensure cache directories exist
        if (!wp_mkdir_p($cache_base_dir)) {
            throw new \RuntimeException("Failed to create cache directory: {$cache_base_dir}");
        }
        $latte->setTempDirectory($cache_base_dir);

        if (defined('WP_DEBUG') && WP_DEBUG) {
            $latte->setAutoRefresh(true);
        } else {
            $latte->setAutoRefresh(false);
        }

        // Register the configured Latte engine in the container
        $app->singleton('latte.engine', function () use ($latte) {
            return $latte;
        });
    }
}
