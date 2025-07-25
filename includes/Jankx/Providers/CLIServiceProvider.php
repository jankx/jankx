<?php

namespace Jankx\Providers;

use Jankx\CLI\CLICommands;
use Jankx\CLI\Commands\CodingStandardCommand;
use Jankx\CLI\Commands\GenerateBlockCommand;
use Jankx\CLI\Commands\CreateBootstrapperCommand;

/**
 * CLI Service Provider
 *
 * @package Jankx\Providers
 * @since 2.0.0
 */
class CLIServiceProvider extends ServiceProvider
{
    /**
     * Register CLI services
     *
     * @since 2.0.0
     */
    public function register()
    {
        // Register CLI commands container bindings
        $this->singleton('cli.commands', function ($container) {
            return new CLICommands();
        });

        // Register individual command classes
        $this->singleton('cli.command.code', function ($container) {
            return new CodingStandardCommand();
        });

        $this->singleton('cli.command.generate-block', function ($container) {
            return new GenerateBlockCommand();
        });

        $this->singleton('cli.command.create-bootstrapper', function ($container) {
            return new CreateBootstrapperCommand();
        });
    }

    /**
     * Boot CLI services
     *
     * @since 2.0.0
     */
    public function boot()
    {
        // Only register commands in CLI context
        if (!defined('WP_CLI') || !WP_CLI) {
            return;
        }

        // Register all CLI commands
        CLICommands::register();
    }

    /**
     * Check if this service provider should be loaded
     *
     * @return bool
     * @since 2.0.0
     */
    public function shouldLoad()
    {
        // Only load in CLI context
        return defined('WP_CLI') && WP_CLI;
    }
}
