<?php

namespace Jankx\Providers;

use WP_CLI;
use Jankx\CLI\Commands\GenerateBlockCommand;
use Jankx\CLI\Commands\CreateBootstrapperCommand;
use Jankx\CLI\Commands\ReleaseCommand;
use Jankx\CLI\Commands\CodingStandardCommand;

/**
 * CLI Service Provider
 *
 * Registers and boots CLI-specific services
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
        // Individual CLI commands - only register classes that actually exist
        $this->singleton('cli.command.generate-block', function ($container) {
            return new GenerateBlockCommand($container);
        });

        $this->singleton('cli.command.create-bootstrapper', function ($container) {
            return new CreateBootstrapperCommand($container);
        });

        $this->singleton('cli.command.release', function ($container) {
            return new ReleaseCommand($container);
        });

        $this->singleton('cli.command.coding-standard', function ($container) {
            return new CodingStandardCommand($container);
        });

        // Shared services that exist in the codebase
        $this->singleton('user.service', \Jankx\Services\UserService::class);
        $this->singleton(\Jankx\Services\BlockParserService::class, \Jankx\Services\BlockParserService::class);
        $this->singleton(\Jankx\Services\DeferredServiceResolver::class);
        $this->singleton(\Jankx\Services\DeferredServiceMonitor::class);
        $this->singleton(\Jankx\Services\GutenbergBlocksService::class);

        // Dependencies for GutenbergBlocksService
        $this->singleton(\Jankx\Adapters\WordPressAdapter::class);
        $this->singleton(\Jankx\Parsers\BlockParser::class);

        // Config Repository
        $this->singleton('config', \Jankx\Config\Repository::class);
        $this->singleton(\Jankx\Config\Repository::class);

        // Note: Other CLI utilities like FileGenerator, CodeGenerator, etc.
        // will be registered when their classes are actually created
        // For now, we only register services that exist in the codebase
    }

    /**
     * Boot CLI services
     *
     * @since 2.0.0
     */
    public function boot()
    {
        // Register CLI commands with WP_CLI
        $this->registerCLICommands();

        // Boot user service
        if ($this->container->has('user.service')) {
            $userService = $this->container->make('user.service');
            if (method_exists($userService, 'initialize')) {
                $userService->initialize();
            }
        }

        // Boot block parser service
        if ($this->container->has(\Jankx\Services\BlockParserService::class)) {
            $blockParserService = $this->container->make(\Jankx\Services\BlockParserService::class);
            if (method_exists($blockParserService, 'initialize')) {
                $blockParserService->initialize();
            }
        }

        // Boot deferred service resolver
        if ($this->container->has(\Jankx\Services\DeferredServiceResolver::class)) {
            $deferredResolver = $this->container->make(\Jankx\Services\DeferredServiceResolver::class);
            if (method_exists($deferredResolver, 'initialize')) {
                $deferredResolver->initialize();
            }
        }

        // Boot Gutenberg blocks service
        if ($this->container->has(\Jankx\Services\GutenbergBlocksService::class)) {
            $gutenbergBlocksService = $this->container->make(\Jankx\Services\GutenbergBlocksService::class);
            if (method_exists($gutenbergBlocksService, 'initialize')) {
                $gutenbergBlocksService->initialize();
            }
        }
    }

    /**
     * Register CLI commands with WP_CLI
     *
     * @since 2.0.0
     */
    private function registerCLICommands(): void
    {
        if (!defined('WP_CLI') || !WP_CLI) {
            return;
        }

        // Register generate-block command
        if ($this->container->has('cli.command.generate-block')) {
            WP_CLI::add_command('jankx generate-block', $this->container->make('cli.command.generate-block'));
        }

        // Register create-bootstrapper command
        if ($this->container->has('cli.command.create-bootstrapper')) {
            WP_CLI::add_command('jankx create-bootstrapper', $this->container->make('cli.command.create-bootstrapper'));
        }

        // Register code command
        if ($this->container->has('cli.command.coding-standard')) {
            WP_CLI::add_command('jankx code', $this->container->make('cli.command.coding-standard'));
        }

        // Register release command
        if ($this->container->has('cli.command.release')) {
            WP_CLI::add_command('jankx release', $this->container->make('cli.command.release'));
        }
    }

    /**
     * Check if service provider should load
     *
     * @since 2.0.0
     * @return bool
     */
    public function shouldLoad(): bool
    {
        return defined('WP_CLI') && WP_CLI;
    }
}
