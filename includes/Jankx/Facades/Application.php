<?php

namespace Jankx\Facades;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


/**
 * Application Facade
 *
 * Provides a static interface to access the application container.
 *
 * @package Jankx\Facades
 * @author Puleeno Nguyen <puleeno@gmail.com>
 * @version 2.0.0
 * @license MIT
 * @since 2.0.0
 */
class Application extends Facade
{
    /**
     * Get the registered name of the component
     * @return string
     * @since 2.0.0
     */
    protected static function getFacadeAccessor()
    {
        return \Jankx\Jankx::class;
    }

    /**
     * Resolve a service from the container
     * @param string $abstract
     * @return mixed
     * @since 2.0.0
     */
    public static function make(string $abstract)
    {
        return static::getContainer()->make($abstract);
    }

    /**
     * Check if a service is bound to the container
     * @param string $abstract
     * @return bool
     * @since 2.0.0
     */
    public static function bound(string $abstract): bool
    {
        return static::getContainer()->bound($abstract);
    }

    /**
     * Bind a service to the container
     * @param string $abstract
     * @param mixed $concrete
     * @param bool $shared
     * @return void
     * @since 2.0.0
     */
    public static function bind(string $abstract, $concrete = null, bool $shared = false): void
    {
        static::getContainer()->bind($abstract, $concrete, $shared);
    }

    /**
     * Bind a singleton service to the container
     * @param string $abstract
     * @param mixed $concrete
     * @return void
     * @since 2.0.0
     */
    public static function singleton(string $abstract, $concrete = null): void
    {
        static::getContainer()->singleton($abstract, $concrete);
    }

    /**
     * Get the container instance
     * @return \Illuminate\Container\Container
     * @since 2.0.0
     */
    public static function getContainer()
    {
        return \Jankx\Jankx::getInstance();
    }
}
