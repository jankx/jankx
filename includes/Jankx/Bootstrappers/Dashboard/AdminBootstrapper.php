<?php

namespace Jankx\Bootstrappers\Dashboard;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;
use Jankx\Facades\Logger;
use Jankx\Helpers\ErrorHandlingHelper;
use Jankx\Helpers\BootstrapperHelper;

/**
 * Admin Bootstrapper
 *
 * Handles admin dashboard initialization and setup
 *
 * @package Jankx\Bootstrappers\Dashboard
 * @since 2.0.0
 */
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
        // Register context-aware services
        BootstrapperHelper::registerContextProvider($container);

        // Setup deferred service resolver
        BootstrapperHelper::setupDeferredResolver($container);

        // Load essential admin services immediately
        $this->loadEssentialServices($container);

        // Defer heavy services
        $this->deferHeavyServices($container);

        // Set up admin hooks
        $this->setupAdminHooks();

        // Fire loaded action
        BootstrapperHelper::fireLoadedAction($this->getName(), $container);
    }

    private function loadEssentialServices(Container $container): void
    {
        // Services needed immediately - now registered through AdminKernel
        // No need to create new AdminServiceProvider instance here
    }

    private function deferHeavyServices(Container $container): void
    {
        // Defer heavy services until actually needed - now through AdminKernel
        // No need to create new AdminServiceProvider instance here
    }

    private function setupAdminHooks(): void
    {
        // Hook into WordPress to load services when needed
        add_action('admin_init', [$this, 'loadAdminServices']);
        add_action('admin_enqueue_scripts', [$this, 'loadAdminAssets']);
    }

    public function loadAdminServices(): void
    {
        ErrorHandlingHelper::safeExecute(function() {
            // Get container from global Jankx instance
            $container = BootstrapperHelper::getGlobalContainer();

            $resolver = BootstrapperHelper::getDeferredResolver($container);
            if (!$resolver) {
                return;
            }

            // Load admin services only when in admin context
            if (is_admin()) {
                $resolver->resolve(\Jankx\Admin\DashboardManager::class);
            }
        }, 'AdminBootstrapper loadAdminServices');
    }

    public function loadAdminAssets(): void
    {
        ErrorHandlingHelper::safeExecute(function() {
            // Get container from global Jankx instance
            $container = BootstrapperHelper::getGlobalContainer();

            $resolver = BootstrapperHelper::getDeferredResolver($container);
            if (!$resolver) {
                return;
            }

            // Load admin assets when needed
            if ($resolver->has(\Jankx\Admin\AssetManager::class)) {
                $assetManager = $resolver->resolve(\Jankx\Admin\AssetManager::class);
                $assetManager->enqueueAdminAssets();
            }
        }, 'AdminBootstrapper loadAdminAssets');
    }
}
