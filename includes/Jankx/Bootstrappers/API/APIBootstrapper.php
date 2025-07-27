<?php

namespace Jankx\Bootstrappers\API;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;

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
        BootstrapperHelper::fireLoadedAction($this->getName(), $container);
    }
}
