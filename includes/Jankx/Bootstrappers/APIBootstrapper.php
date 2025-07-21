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
        do_action('jankx/bootstrapper/api/loaded', $container);
    }
}
