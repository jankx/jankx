<?php

namespace Jankx\Bootstrappers\Frontend;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;
use Jankx\Facades\Logger;
use Jankx\Helpers\ErrorHandlingHelper;
use Jankx\Helpers\BootstrapperHelper;

/**
 * Frontend Bootstrapper
 *
 * Handles frontend initialization and setup
 *
 * @package Jankx\Bootstrappers\Frontend
 * @since 2.0.0
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
        BootstrapperHelper::registerContextProvider($container);

        // Setup deferred service resolver
        BootstrapperHelper::setupDeferredResolver($container);

        // Load essential frontend services immediately
        $this->loadEssentialServices($container);

        // Defer heavy services
        $this->deferHeavyServices($container);

        // Set up frontend hooks
        $this->setupFrontendHooks();

        // Fire loaded action
        BootstrapperHelper::fireLoadedAction($this->getName(), $container);
    }

    private function loadEssentialServices(Container $container): void
    {
        // Services needed immediately - now registered through FrontendServiceProvider
        $provider = new \Jankx\Providers\FrontendServiceProvider($container);
        $provider->register();
    }

    private function deferHeavyServices(Container $container): void
    {
        // Defer heavy services until actually needed - now through FrontendServiceProvider
        $provider = new \Jankx\Providers\FrontendServiceProvider($container);
        $provider->boot();
    }

    private function setupFrontendHooks(): void
    {
        // Hook into WordPress to load services when needed
        add_action('wp_loaded', [$this, 'loadFrontendServices']);
        add_action('wp_enqueue_scripts', [$this, 'loadFrontendAssets']);
    }

    public function loadFrontendServices(): void
    {
        ErrorHandlingHelper::safeExecute(function() {
            // Get container from global Jankx instance
            $container = BootstrapperHelper::getGlobalContainer();

            $resolver = BootstrapperHelper::getDeferredResolver($container);
            if (!$resolver) {
                return;
            }

            // Load frontend services only when needed
            if (!is_admin()) {
                $resolver->resolve(\Jankx\Frontend\TemplateManager::class);
            }
        }, 'FrontendBootstrapper loadFrontendServices');
    }

    public function loadFrontendAssets(): void
    {
        ErrorHandlingHelper::safeExecute(function() {
            // Get container from global Jankx instance
            $container = BootstrapperHelper::getGlobalContainer();

            $resolver = BootstrapperHelper::getDeferredResolver($container);
            if (!$resolver) {
                return;
            }

            // Load frontend assets when needed
            if ($resolver->has(\Jankx\Frontend\AssetManager::class)) {
                $assetManager = $resolver->resolve(\Jankx\Frontend\AssetManager::class);
                $assetManager->enqueueFrontendAssets();
            }
        }, 'FrontendBootstrapper loadFrontendAssets');
    }
}
