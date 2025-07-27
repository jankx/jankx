<?php

namespace Jankx\Bootstrappers\Frontend;

use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;

class WooCommerceBootstrapper extends AbstractBootstrapper
{
    protected $priority = 40;

    public function getName(): string
    {
        return 'woocommerce';
    }

    public function shouldRun(): bool
    {
        return class_exists('WooCommerce');
    }

    public function bootstrap(Container $container): void
    {
        BootstrapperHelper::fireLoadedAction($this->getName(), $container);
    }
}
