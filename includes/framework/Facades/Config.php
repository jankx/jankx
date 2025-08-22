<?php

namespace Jankx\Facades;

use Jankx\Facades\Facade;

/**
 * @method static mixed get(string $key, mixed $default = null)
 * @method static array all()
 * @method static void set(array|string $key, mixed $value = null)
 * @method static bool has(string $key)
 * @method static mixed prepend(string $key, mixed $value)
 * @method static mixed push(string $key, mixed $value)
 * @method static array getMany(array $keys)
 * @method static void put(string $key, mixed $value)
 * @method static void putMany(array $values)
 * @method static mixed offsetGet(string $key)
 * @method static void offsetSet(string $key, mixed $value)
 * @method static bool offsetExists(string $key)
 * @method static void offsetUnset(string $key)
 *
 * @see \Jankx\Config\Repository
 */
class Config extends Facade
{
    /**
     * Get the registered name of the component.
     *
     * @return string
     */
    protected static function getFacadeAccessor()
    {
        return 'config';
    }
}
