<?php

namespace Jankx\Bootstrappers;

use Illuminate\Container\Container;
use Jankx\Contracts\BootstrapperInterface;

/**
 * API Bootstrapper
 *
 * Bootstrap API-specific features
 *
 * @package Jankx\Bootstrappers
 */
class APIBootstrapper implements BootstrapperInterface
{
    /**
     * @var int
     */
    protected $priority = 25;

    /**
     * @var array
     */
    protected $dependencies = [];

    /**
     * Get bootstrapper name
     */
    public function getName(): string
    {
        return 'api';
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
        return defined('REST_REQUEST') && REST_REQUEST;
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
        // Register API-specific services or hooks here
        add_action('rest_api_init', [$this, 'initializeAPIEndpoints']);

        do_action('jankx/bootstrapper/api/loaded', $container);
    }

    /**
     * Initialize API endpoints
     */
    public function initializeAPIEndpoints(): void
    {
        // Add API endpoint initialization logic here
    }
}