<?php

namespace Jankx\Bootstrappers;

use Illuminate\Container\Container;
use Jankx\Contracts\BootstrapperInterface;

/**
 * Frontend Bootstrapper
 *
 * Bootstrap frontend-specific features
 *
 * @package Jankx\Bootstrappers
 */
class FrontendBootstrapper implements BootstrapperInterface
{
    /**
     * @var int
     */
    protected $priority = 15;

    /**
     * @var array
     */
    protected $dependencies = [];

    /**
     * Get bootstrapper name
     */
    public function getName(): string
    {
        return 'frontend';
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
        return !is_admin() && !(defined('REST_REQUEST') && REST_REQUEST) && !(defined('WP_CLI') && WP_CLI);
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
        // Register frontend-specific services or hooks here
        add_action('wp_enqueue_scripts', [$this, 'enqueueFrontendScripts']);
        add_action('init', [$this, 'initializeFrontendFeatures']);

        do_action('jankx/bootstrapper/frontend/loaded', $container);
    }

    /**
     * Initialize frontend features
     */
    public function initializeFrontendFeatures(): void
    {
        // Add frontend-specific initialization logic here
    }

    /**
     * Enqueue frontend scripts and styles
     */
    public function enqueueFrontendScripts(): void
    {
        // Enqueue frontend-specific scripts and styles here
    }
}