<?php

namespace Jankx\Bootstrappers;

use Illuminate\Container\Container;

class AdminBootstrapper extends AbstractBootstrapper
{
    protected $priority = 20;

    public function getName(): string
    {
        return 'admin';
    }

    public function shouldRun(): bool
    {
        return is_admin();
    }

    public function bootstrap(Container $container): void
    {
        add_action('admin_init', [$this, 'initializeAdminFeatures']);
        add_action('admin_menu', [$this, 'registerAdminMenus']);
        add_action('admin_enqueue_scripts', [$this, 'enqueueAdminScripts']);
        do_action('jankx/bootstrapper/admin/loaded', $container);
    }

    public function initializeAdminFeatures(): void
    {
        // Add admin-specific initialization logic here
    }

    public function registerAdminMenus(): void
    {
        // Add admin menu items here if needed
    }

    public function enqueueAdminScripts(): void
    {
        // Enqueue admin-specific scripts and styles here
    }
}
