<?php

namespace Jankx\Bootstrappers\Frontend;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


use Illuminate\Container\Container;
use Jankx\Bootstrappers\AbstractBootstrapper;
use Jankx\Helpers\BootstrapperHelper;

/**
 * Class WooCommerceBootstrapper
 *
 * @since 2.0.0
 */
class WooCommerceBootstrapper extends AbstractBootstrapper
{
    protected $priority = 40;

    /**
     * Method getName
     *
     * @since 2.0.0
     */
    public function getName(): string
    {
        return 'woocommerce';
    }

    /**
     * Method shouldRun
     *
     * @since 2.0.0
     */
    public function shouldRun(): bool
    {
        return class_exists('WooCommerce');
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
