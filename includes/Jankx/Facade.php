<?php

namespace Jankx;

use Illuminate\Container\Container;

/**
 * Facade class for Jankx Framework
 *
 * Provides a static interface to access framework services and components.
 *
 * @package Jankx
 * @author Puleeno Nguyen <puleeno@gmail.com>
 * @version 2.0.0
 * @license MIT
 */
class Facade
{
    /**
     * The container instance
     * @var \Illuminate\Container\Container
     */
    protected static $container;

    /**
     * Set the container instance
     * @param \Illuminate\Container\Container $container
     */
    public static function setContainer(Container $container)
    {
        static::$container = $container;
    }

    /**
     * Get the container instance
     * @return \Illuminate\Container\Container
     */
    public static function getContainer()
    {
        if (!static::$container) {
            static::$container = Jankx::getInstance();
        }
        return static::$container;
    }

    /**
     * Get the registered name of the component
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        throw new \RuntimeException('Facade does not implement getFacadeAccessor method.');
    }

    /**
     * Resolve the facade instance from the container
     * @param string $name
     * @return mixed
     */
    protected static function resolveFacadeInstance($name)
    {
        if (is_object($name)) {
            return $name;
        }
        return static::getContainer()->make($name);
    }

    /**
     * Handle dynamic, static calls to the object
     * @param string $method
     * @param array $args
     * @return mixed
     */
    public static function __callStatic($method, $args)
    {
        $instance = static::resolveFacadeInstance(static::getFacadeAccessor());
        if (!$instance) {
            throw new \RuntimeException('A facade instance has not been set.');
        }
        return $instance->$method(...$args);
    }
}
