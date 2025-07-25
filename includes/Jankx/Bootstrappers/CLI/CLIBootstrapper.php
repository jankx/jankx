<?php

namespace Jankx\Bootstrappers\CLI;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;
use Jankx\CLI\CLICommands;

/**
 * CLI Bootstrapper
 *
 * @package Jankx\Bootstrappers\CLI
 * @since 2.0.0
 */
class CLIBootstrapper extends AbstractBootstrapper
{
    /**
     * @var int
     * @since 2.0.0
     */
    protected $priority = 30;

    /**
     * Get bootstrapper name
     * @return string
     * @since 2.0.0
     */
    public function getName(): string
    {
        return 'cli';
    }

    /**
     * Check if bootstrapper should run
     * @return bool
     * @since 2.0.0
     */
    public function shouldRun(): bool
    {
        return defined('WP_CLI') && WP_CLI;
    }

    /**
     * Bootstrap CLI commands
     * @param Container $container
     * @since 2.0.0
     */
    public function bootstrap(Container $container): void
    {
        // Register Jankx CLI commands
        CLICommands::register();

        // Fire action for other CLI integrations
        do_action('jankx/bootstrapper/cli/loaded', $container);
    }
}
