<?php

namespace Jankx\Bootstrappers\Frontend;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;
use Jankx\Facades\Logger;

/**
 * Frontend Bootstrapper
 *
 * Handles frontend initialization and setup
 *
 * @package Jankx\Bootstrappers\Frontend
 * @since 2.0.1
 */
class FrontendBootstrapper extends AbstractBootstrapper
{
    protected $priority = 15;

    public function getName(): string
    {
        return 'frontend';
    }

    public function shouldRun(): bool
    {
        return !is_admin() && !(defined('REST_REQUEST') && REST_REQUEST) && !(defined('WP_CLI') && WP_CLI);
    }

    public function bootstrap(Container $container): void
    {
        // Register context-aware services
        $contextProvider = new \Jankx\Providers\ContextualServiceProvider($container);
        $contextProvider->register();

        // Setup deferred service resolver
        $container->singleton('deferred.resolver', \Jankx\Services\DeferredServiceResolver::class);

        // Load essential frontend services immediately
        $this->loadEssentialServices($container);

        // Defer heavy services
        $this->deferHeavyServices($container);

        // Set up frontend hooks
        $this->setupFrontendHooks();

        do_action('jankx/bootstrapper/frontend/loaded', $container);
    }

    private function loadEssentialServices(Container $container): void
    {
        // Services needed immediately
        $container->singleton(\Jankx\Frontend\AssetManager::class);
        $container->singleton(\Jankx\Frontend\TemplateManager::class);
        $container->singleton(\Jankx\Frontend\ContentManager::class);
    }

    private function deferHeavyServices(Container $container): void
    {
        // Defer heavy services until actually needed
        \Jankx\Context\ContextualServiceRegistry::defer(\Jankx\Context\ContextualServiceRegistry::FRONTEND, function(Container $container) {
            $container->singleton(\Jankx\SEO\SEOManager::class);
            $container->singleton(\Jankx\Analytics\AnalyticsManager::class);
            $container->singleton(\Jankx\Template\TemplateRenderer::class);
            $container->singleton(\Jankx\Frontend\AssetOptimizer::class);
        });
    }

    private function setupFrontendHooks(): void
    {
        // Hook into WordPress to load services when needed
        add_action('wp_loaded', [$this, 'loadFrontendServices']);
        add_action('wp_enqueue_scripts', [$this, 'loadFrontendAssets']);
    }

    public function loadFrontendServices(): void
    {
        try {
            // Get container from global Jankx instance
            $container = \Jankx\Jankx::getInstance();

            if (!$container || !$container->bound('deferred.resolver')) {
                return;
            }

            $resolver = $container->make('deferred.resolver');

            // Load frontend services only when needed
            if (!is_admin()) {
                $resolver->resolve(\Jankx\Frontend\TemplateManager::class);
            }
        } catch (\Exception $e) {
            // Log error but don't break the application
            Logger::error('Jankx FrontendBootstrapper error: ' . $e->getMessage());
        }
    }

    public function loadFrontendAssets(): void
    {
        try {
            // Get container from global Jankx instance
            $container = \Jankx\Jankx::getInstance();

            if (!$container || !$container->bound('deferred.resolver')) {
                return;
            }

            // Load frontend assets when needed
            $resolver = $container->make('deferred.resolver');

            if ($resolver->has(\Jankx\Frontend\AssetManager::class)) {
                $assetManager = $resolver->resolve(\Jankx\Frontend\AssetManager::class);
                $assetManager->enqueueFrontendAssets();
            }
        } catch (\Exception $e) {
            // Log error but don't break the application
            Logger::error('Jankx FrontendBootstrapper error: ' . $e->getMessage());
        }
    }
}
