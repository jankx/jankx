<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Foundation\Cli\Commands\JankxCommand;
use Jankx\Foundation\Cli\Commands\CacheCommand;
use Jankx\Foundation\Cli\Commands\ConfigCommand;
use Jankx\Facades\Log;
use Jankx\Helper\Environment;

/**
 * WordPress CLI Service Provider
 *
 * This service provider handles WordPress CLI command registration
 * and management for the Jankx Framework.
 *
 * @package Jankx\Support\Providers
 * @since 1.0.0
 */
class WordPressCliServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(Application $app)
    {
        // Register CLI commands as singletons
        $this->app->singleton('jankx.command', function ($app) {
            return new JankxCommand();
        });

        $this->app->singleton('jankx.cache.command', function ($app) {
            return new CacheCommand();
        });

        $this->app->singleton('jankx.config.command', function ($app) {
            return new ConfigCommand();
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
        // Register WP CLI commands
        add_action('cli_init', [$this, 'registerCommands']);
    }

    /**
     * Register WP CLI commands
     *
     * @return void
     */
    public function registerCommands()
    {
        if (!defined('WP_CLI') || !WP_CLI) {
            return;
        }

        // Register main Jankx command
        \WP_CLI::add_command('jankx', $this->app->make('jankx.command'));

        // Register cache management commands
        \WP_CLI::add_command('jankx cache', $this->app->make('jankx.cache.command'));

        // Register config management commands
        \WP_CLI::add_command('jankx config', $this->app->make('jankx.config.command'));

        // Log command registration
        if (Environment::isDebugLog()) {
        }
    }

    /**
     * Get available commands
     *
     * @return array
     */
    public function getAvailableCommands()
    {
        return [
            'jankx' => [
                'info' => 'Show Jankx Framework information',
                'build-blocks' => 'Build Gutenberg blocks',
                'clear-cache' => 'Clear all Jankx caches',
                'cache-status' => 'Show cache status'
            ],
            'jankx cache' => [
                'clear' => 'Clear all Jankx caches',
                'clear-config' => 'Clear config cache',
                'clear-blocks' => 'Clear block cache',
                'clear-widgets' => 'Clear widget cache',
                'clear-users' => 'Clear user cache',
                'status' => 'Show cache status'
            ],
            'jankx config' => [
                'clone' => 'Clone config from parent theme to child theme'
            ]
        ];
    }
}
