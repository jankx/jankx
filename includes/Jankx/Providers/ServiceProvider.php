<?php

namespace Jankx\Providers;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


use Illuminate\Container\Container;

/**
 * Class ServiceProvider
 *
 * @since 2.0.0
 */
abstract class ServiceProvider
{
    protected $container;

    /**
     * Method __construct
     *
     * @since 2.0.0
     */
    public function __construct(Container $container)
    {
        $this->container = $container;
    }

    /**
     * Method register
     *
     * @since 2.0.0
     */
    abstract public function register();

    /**
     * Method boot
     *
     * @since 2.0.0
     */
    public function boot()
    {
        // Phương thức boot có thể được ghi đè nếu cần
    }

    /**
     * Method bind
     *
     * @since 2.0.0
     */
    protected function bind($abstract, $concrete = null, $shared = false)
    {
        $this->container->bind($abstract, $concrete, $shared);
    }

    /**
     * Method singleton
     *
     * @since 2.0.0
     */
    protected function singleton($abstract, $concrete = null)
    {
        $this->bind($abstract, $concrete, true);
    }
}
