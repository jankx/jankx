<?php

namespace Jankx\Bootstrappers;

use Illuminate\Container\Container;

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
        add_action('wp_enqueue_scripts', [$this, 'enqueueFrontendScripts']);
        add_action('init', [$this, 'initializeFrontendFeatures']);
        do_action('jankx/bootstrapper/frontend/loaded', $container);
    }

    public function initializeFrontendFeatures(): void
    {
        // Add frontend-specific initialization logic here
    }

    public function enqueueFrontendScripts(): void
    {
        // Enqueue frontend-specific scripts and styles here
    }
}
