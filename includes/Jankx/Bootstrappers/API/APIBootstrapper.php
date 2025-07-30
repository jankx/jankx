<?php

namespace Jankx\Bootstrappers\API;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;

/**
 * Class APIBootstrapper
 *
 * @since 2.0.0
 */
class APIBootstrapper extends AbstractBootstrapper
{
    protected $priority = 25;

    /**
     * Method getName
     *
     * @since 2.0.0
     */
    public function getName(): string
    {
        return 'api';
    }

    /**
     * Method shouldRun
     *
     * @since 2.0.0
     */
    public function shouldRun(): bool
    {
        return defined('REST_REQUEST') && REST_REQUEST;
    }

    /**
     * Method bootstrap
     *
     * @since 2.0.0
     */
    public function bootstrap(Container $container): void
    {
        BootstrapperHelper::fireLoadedAction($this->getName(), $container);
    }
}
