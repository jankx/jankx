<?php

namespace Jankx\Cache\Key;

/**
 * Immutable cache key: value plus the group it belongs to.
 *
 * @package Jankx\Cache\Key
 * @since 2.0.0
 */
class CacheKey
{
    /**
     * @var string
     */
    private $value;

    /**
     * @var string
     */
    private $group;

    /**
     * @param string $value Key value.
     * @param string $group Optional group override.
     */
    public function __construct(string $value, string $group = '')
    {
        $this->value = $value;
        $this->group = $group;
    }

    /**
     * @return string
     */
    public function value(): string
    {
        return $this->value;
    }

    /**
     * Empty string when the generator did not pin a group.
     *
     * @return string
     */
    public function group(): string
    {
        return $this->group;
    }

    /**
     * @param string $suffix Appended to the key value.
     * @return self
     */
    public function withSuffix(string $suffix): self
    {
        return new self($this->value . $suffix, $this->group);
    }

    /**
     * @return string
     */
    public function __toString(): string
    {
        return $this->value;
    }
}
