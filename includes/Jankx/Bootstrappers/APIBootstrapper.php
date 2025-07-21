<?php

namespace Jankx\Bootstrappers;

use Illuminate\Container\Container;

class APIBootstrapper extends AbstractBootstrapper
{
    protected $priority = 25;

    public function getName(): string
    {
        return 'api';
    }

    public function shouldRun(): bool
    {
        return defined('REST_REQUEST') && REST_REQUEST;
    }

    public function bootstrap(Container $container): void
    {
        add_action('rest_api_init', [$this, 'initializeAPIEndpoints']);
        do_action('jankx/bootstrapper/api/loaded', $container);
    }

    public function initializeAPIEndpoints(): void
    {
        // Add API endpoint initialization logic here
    }
}
