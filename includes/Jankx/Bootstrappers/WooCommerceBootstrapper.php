<?php

namespace Jankx\Bootstrappers;

use Illuminate\Container\Container;

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
        do_action('jankx/bootstrapper/woocommerce/loaded', $container);
    }
}
