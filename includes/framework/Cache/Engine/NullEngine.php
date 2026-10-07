<?php

namespace Jankx\Cache\Engine;

/**
 * Null Object engine: keeps the whole system runnable (and testable) when the
 * cache is switched off — every operation reports a miss without conditions
 * scattered through the callers.
 *
 * @package Jankx\Cache\Engine
 * @since 2.0.0
 */
class NullEngine extends AbstractEngine
{
    /**
     * @inheritdoc
     */
    public function getName(): string
    {
        return 'null';
    }

    /**
     * @inheritdoc
     */
    public function isPersistent(): bool
    {
        return false;
    }

    /**
     * @inheritdoc
     */
    protected function read(string $key, string $group): array
    {
        return ['value' => null, 'found' => false];
    }

    /**
     * @inheritdoc
     */
    protected function write(string $key, $value, int $ttl, string $group): bool
    {
        return false;
    }

    /**
     * @inheritdoc
     */
    protected function erase(string $key, string $group): bool
    {
        return false;
    }

    /**
     * @inheritdoc
     */
    protected function eraseGroup(string $group): bool
    {
        return true;
    }
}
