<?php

namespace Jankx\Bootstrappers;

use Illuminate\Container\Container;
use Jankx\Contracts\BootstrapperInterface;

/**
 * Admin Bootstrapper
 *
 * Bootstrap admin-specific features
 *
 * @package Jankx\Bootstrappers
 */
class AdminBootstrapper implements BootstrapperInterface
{
    /**
     * @var int
     */
    protected $priority = 20;

    /**
     * @var array
     */
    protected $dependencies = [];

    /**
     * Get bootstrapper name
     */
    public function getName(): string
    {
        return 'admin';
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
        return is_admin();
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
        // Register admin-specific services or hooks here
        add_action('admin_init', [$this, 'initializeAdminFeatures']);
        add_action('admin_menu', [$this, 'registerAdminMenus']);
        add_action('admin_enqueue_scripts', [$this, 'enqueueAdminScripts']);

        do_action('jankx/bootstrapper/admin/loaded', $container);
    }

    /**
     * Initialize admin features
     */
    public function initializeAdminFeatures(): void
    {
        // Add admin-specific initialization logic here
    }

    /**
     * Register admin menus
     */
    public function registerAdminMenus(): void
    {
        // Add admin menu items here if needed
    }

    /**
     * Enqueue admin scripts and styles
     */
    public function enqueueAdminScripts(): void
    {
        // Enqueue admin-specific scripts and styles here
    }
}