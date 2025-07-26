<?php

namespace Jankx\Bootstrappers\Dashboard;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;
use Jankx\Facades\Logger;

/**
 * Admin Bootstrapper
 *
 * Handles admin dashboard initialization and setup
 *
 * @package Jankx\Bootstrappers\Dashboard
 * @since 2.0.1
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
        $contextProvider = new \Jankx\Providers\ContextualServiceProvider($container);
        $contextProvider->register();

        // Setup deferred service resolver
        $container->singleton('deferred.resolver', \Jankx\Services\DeferredServiceResolver::class);

        // Load essential admin services immediately
        $this->loadEssentialServices($container);

        // Defer heavy services
        $this->deferHeavyServices($container);

        // Set up admin hooks
        $this->setupAdminHooks();

        do_action('jankx/bootstrapper/admin/loaded', $container);
    }

    private function loadEssentialServices(Container $container): void
    {
        // Services needed immediately
        $container->singleton(\Jankx\Admin\MenuManager::class);
        $container->singleton(\Jankx\Admin\AssetManager::class);
        $container->singleton(\Jankx\Admin\NoticeManager::class);
    }

    private function deferHeavyServices(Container $container): void
    {
        // Defer heavy services until actually needed
        \Jankx\Context\ContextualServiceRegistry::defer(\Jankx\Context\ContextualServiceRegistry::ADMIN, function(Container $container) {
            $container->singleton(\Jankx\Admin\AnalyticsManager::class);
            $container->singleton(\Jankx\Admin\ReportManager::class);
            $container->singleton(\Jankx\Admin\DashboardWidgetManager::class);
        });
    }

    private function setupAdminHooks(): void
    {
        // Hook into WordPress to load services when needed
        add_action('admin_init', [$this, 'loadAdminServices']);
        add_action('admin_enqueue_scripts', [$this, 'loadAdminAssets']);
    }

    public function loadAdminServices(): void
    {
        try {
            // Get container from global Jankx instance
            $container = \Jankx\Jankx::getInstance();

            if (!$container || !$container->bound('deferred.resolver')) {
                return;
            }

            $resolver = $container->make('deferred.resolver');

            // Load admin services only when in admin context
            if (is_admin()) {
                $resolver->resolve(\Jankx\Admin\DashboardManager::class);
            }
        } catch (\Exception $e) {
            // Log error but don't break the application
            Logger::error('Jankx AdminBootstrapper error: ' . $e->getMessage());
        }
    }

    public function loadAdminAssets(): void
    {
        try {
            // Get container from global Jankx instance
            $container = \Jankx\Jankx::getInstance();

            if (!$container || !$container->bound('deferred.resolver')) {
                return;
            }

            // Load admin assets when needed
            $resolver = $container->make('deferred.resolver');

            if ($resolver->has(\Jankx\Admin\AssetManager::class)) {
                $assetManager = $resolver->resolve(\Jankx\Admin\AssetManager::class);
                $assetManager->enqueueAdminAssets();
            }
        } catch (\Exception $e) {
            // Log error but don't break the application
            Logger::error('Jankx AdminBootstrapper error: ' . $e->getMessage());
        }
    }
}
