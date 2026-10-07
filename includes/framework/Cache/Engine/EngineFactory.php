<?php

namespace Jankx\Cache\Engine;

use Jankx\Cache\Contracts\CacheEngineInterface;

/**
 * Creates the storage engine from configuration (Factory pattern).
 *
 * `auto` picks a persistent object cache when one is loaded and falls back to
 * files, so the same config works on a Redis-less local machine and on
 * production. A fully qualified class name may be used as the driver to plug a
 * custom implementation without touching this file.
 *
 * @package Jankx\Cache\Engine
 * @since 2.0.0
 */
class EngineFactory
{
    /**
     * @param array $config cache.engine configuration.
     * @return CacheEngineInterface
     */
    public static function make(array $config = []): CacheEngineInterface
    {
        $driver = isset($config['driver']) ? (string) $config['driver'] : 'auto';
        $prefix = isset($config['prefix']) ? (string) $config['prefix'] : 'jankx';
        $group = isset($config['group']) ? (string) $config['group'] : 'cache';

        switch ($driver) {
            case 'auto':
                return self::makeAuto($config, $prefix, $group);
            case 'object':
            case 'wp_cache':
                return new ObjectCacheEngine($prefix, $group);
            case 'file':
            case 'filesystem':
                return self::makeFilesystem($config, $prefix, $group);
            case 'null':
            case 'none':
            case 'off':
                return new NullEngine($prefix, $group);
        }

        return self::makeCustom($driver, $config);
    }

    /**
     * @param array  $config cache.engine configuration.
     * @param string $prefix Key prefix.
     * @param string $group  Default group.
     * @return CacheEngineInterface
     */
    private static function makeAuto(array $config, string $prefix, string $group): CacheEngineInterface
    {
        $object = new ObjectCacheEngine($prefix, $group);
        if ($object->isPersistent()) {
            return $object;
        }

        return self::makeFilesystem($config, $prefix, $group);
    }

    /**
     * @param array  $config cache.engine configuration.
     * @param string $prefix Key prefix.
     * @param string $group  Default group.
     * @return FilesystemEngine
     */
    private static function makeFilesystem(array $config, string $prefix, string $group): FilesystemEngine
    {
        $directory = '';
        if (!empty($config['file']['directory'])) {
            $directory = (string) $config['file']['directory'];
        }

        $mode = !empty($config['file']['mode']) ? (int) $config['file']['mode'] : 0755;

        return new FilesystemEngine($prefix, $group, $directory, $mode);
    }

    /**
     * Instantiate a custom driver: no constructor arguments when it takes
     * none, the whole engine config otherwise.
     *
     * @param string $class  Fully qualified class name.
     * @param array  $config cache.engine configuration.
     * @return CacheEngineInterface
     *
     * @throws \InvalidArgumentException When the class is unusable.
     */
    private static function makeCustom(string $class, array $config): CacheEngineInterface
    {
        if (!class_exists($class)) {
            throw new \InvalidArgumentException(
                sprintf('Unknown cache engine driver "%s".', $class)
            );
        }

        $reflection = new \ReflectionClass($class);
        $constructor = $reflection->getConstructor();
        $engine = $constructor !== null && $constructor->getNumberOfRequiredParameters() > 0
            ? $reflection->newInstance($config)
            : $reflection->newInstance();

        if (!$engine instanceof CacheEngineInterface) {
            throw new \InvalidArgumentException(
                sprintf('%s must implement %s.', $class, CacheEngineInterface::class)
            );
        }

        return $engine;
    }
}
