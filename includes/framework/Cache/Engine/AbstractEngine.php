<?php

namespace Jankx\Cache\Engine;

use Jankx\Cache\Contracts\CacheEngineInterface;

/**
 * Template Method for every storage engine: the public API (get/set/delete/
 * has/flush) is fixed, subclasses only implement the four raw operations.
 *
 * @package Jankx\Cache\Engine
 * @since 2.0.0
 */
abstract class AbstractEngine implements CacheEngineInterface
{
    /**
     * @var string
     */
    protected $prefix;

    /**
     * @var string
     */
    protected $defaultGroup;

    /**
     * @param string $prefix       Key prefix.
     * @param string $defaultGroup Group used when none is given.
     */
    public function __construct(string $prefix = 'jankx', string $defaultGroup = 'cache')
    {
        $this->prefix = $prefix;
        $this->defaultGroup = $defaultGroup;
    }

    /**
     * @inheritdoc
     */
    public function get(string $key, string $group = '', ?bool &$found = null)
    {
        $result = $this->read($this->normalizeKey($key), $this->normalizeGroup($group));
        $found = !empty($result['found']);

        return $found ? $result['value'] : null;
    }

    /**
     * @inheritdoc
     */
    public function set(string $key, $value, int $ttl = 0, string $group = ''): bool
    {
        return $this->write($this->normalizeKey($key), $value, max(0, $ttl), $this->normalizeGroup($group));
    }

    /**
     * @inheritdoc
     */
    public function delete(string $key, string $group = ''): bool
    {
        return $this->erase($this->normalizeKey($key), $this->normalizeGroup($group));
    }

    /**
     * @inheritdoc
     */
    public function has(string $key, string $group = ''): bool
    {
        $found = false;
        $this->get($key, $group, $found);

        return $found;
    }

    /**
     * Remove every value of a group, or the whole cache when no group is
     * given — an empty group deliberately skips the default group mapping so
     * "flush everything" stays expressible through the same method.
     *
     * @param string $group Cache group/namespace, '' = everything.
     * @return bool
     */
    public function flush(string $group = ''): bool
    {
        return $this->eraseGroup($group);
    }

    /**
     * Raw read.
     *
     * @param string $key   Normalized key.
     * @param string $group Normalized group.
     * @return array{value:mixed,found:bool}
     */
    abstract protected function read(string $key, string $group): array;

    /**
     * Raw write.
     *
     * @param string $key   Normalized key.
     * @param mixed  $value Value.
     * @param int    $ttl   Lifetime in seconds, 0 = no expiry.
     * @param string $group Normalized group.
     * @return bool
     */
    abstract protected function write(string $key, $value, int $ttl, string $group): bool;

    /**
     * Raw delete.
     *
     * @param string $key   Normalized key.
     * @param string $group Normalized group.
     * @return bool
     */
    abstract protected function erase(string $key, string $group): bool;

    /**
     * Raw group flush.
     *
     * @param string $group Normalized group.
     * @return bool
     */
    abstract protected function eraseGroup(string $group): bool;

    /**
     * @param string $key   Raw key.
     * @return string
     */
    protected function normalizeKey(string $key): string
    {
        return $key;
    }

    /**
     * @param string $group Raw group.
     * @return string
     */
    protected function normalizeGroup(string $group): string
    {
        return $group !== '' ? $group : $this->defaultGroup;
    }
}
