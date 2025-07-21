<?php

namespace Jankx\Bootstrappers;

use Illuminate\Container\Container;
use Jankx\Contracts\BootstrapperInterface;

/**
 * CLI Bootstrapper
 *
 * Bootstrap CLI-specific features
 *
 * @package Jankx\Bootstrappers
 */
class CLIBootstrapper implements BootstrapperInterface
{
    /**
     * @var int
     */
    protected $priority = 30;

    /**
     * @var array
     */
    protected $dependencies = [];

    /**
     * Get bootstrapper name
     */
    public function getName(): string
    {
        return 'cli';
    }

    /**
     * Get bootstrapper priority
     */
    public function getPriority(): int
    {
        return $this->priority;
    }

    /**
     * Check if bootstrapper should run
     */
    public function shouldRun(): bool
    {
        return defined('WP_CLI') && WP_CLI;
    }

    /**
     * Get bootstrapper dependencies
     */
    public function getDependencies(): array
    {
        return $this->dependencies;
    }

    /**
     * Bootstrap the application
     */
    public function bootstrap(Container $container): void
    {
        // Register CLI-specific services or hooks here
        add_action('cli_init', [$this, 'initializeCLICommands']);

        do_action('jankx/bootstrapper/cli/loaded', $container);
    }

    /**
     * Initialize CLI commands
     */
    public function initializeCLICommands(): void
    {
        // Add CLI command initialization logic here
    }
}