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
        do_action('jankx/bootstrapper/frontend/loaded', $container);
    }
}
