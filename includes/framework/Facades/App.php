<?php

namespace Jankx\Facades;

use Jankx\Facades\Facade;

/**
 * @method static \Jankx\Foundation\Application make(string $abstract, array $parameters = [])
 * @method static \Jankx\Foundation\Application bind(string $abstract, \Closure|string|null $concrete = null, bool $shared = false)
 * @method static \Jankx\Foundation\Application singleton(string $abstract, \Closure|string|null $concrete = null)
 * @method static \Jankx\Foundation\Application instance(string $abstract, mixed $instance)
 * @method static mixed resolve(string $abstract, array $parameters = [])
 * @method static bool bound(string $abstract)
 * @method static bool isShared(string $abstract)
 * @method static void flush()
 * @method static string version()
 * @method static string basePath(string $path = '')
 * @method static string configPath(string $path = '')
 * @method static string bootstrapPath(string $path = '')
 * @method static bool hasBeenBootstrapped()
 * @method static void setBooted()
 * @method static void booted(callable $callback)
 * @method static void callBootedCallbacks()
 * @method static void booting(callable $callback)
 * @method static void callBootingCallbacks()
 * @method static void bootstrapWith(array $bootstrappers)
 * @method static void boot()
 *
 * @see \Jankx\Foundation\Application
 */
class App extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'app';
    }


    public static function getInstance() {
        return Facade::getFacadeRoot();
    }
}
