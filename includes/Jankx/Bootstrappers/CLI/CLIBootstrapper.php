<?php

namespace Jankx\Bootstrappers\CLI;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;
use Jankx\Helpers\BootstrapperHelper;
use Jankx\Providers\CLIServiceProvider;

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
        // Setup deferred service resolver
        BootstrapperHelper::setupDeferredResolver($container);

        // CLI services are now registered through CLIKernel

        // Fire loaded action
        BootstrapperHelper::fireLoadedAction($this->getName(), $container);
    }
}
