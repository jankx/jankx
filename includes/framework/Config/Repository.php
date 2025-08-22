<?php

namespace Jankx\Config;

use ArrayAccess;
use Illuminate\Contracts\Config\Repository as RepositoryContract;

class Repository implements ArrayAccess, RepositoryContract
{
    /**
     * The configuration data.
     *
     * @var array
     */
    protected $items = [];

    /**
     * Create a new configuration repository.
     *
     * @param  array  $items
     * @return void
     */
    public function __construct(array $items = [])
    {
        $this->items = $items;
    }

    /**
     * Determine if the given configuration value exists.
     *
     * @param  string  $key
     * @return bool
     */
    public function has($key)
    {
        return $this->get($key) !== null;
    }

    /**
     * Get the specified configuration value.
     *
     * @param  string  $key
     * @param  mixed   $default
     * @return mixed
     */
    public function get($key, $default = null)
    {
        if (is_null($key)) {
            return $this->items;
        }

        if (array_key_exists($key, $this->items)) {
            return $this->items[$key];
        }

        if (strpos($key, '.') === false) {
            return $default;
        }

        $array = $this->items;

        foreach (explode('.', $key) as $segment) {
            if (!is_array($array) || !array_key_exists($segment, $array)) {
                return $default;
            }

            $array = $array[$segment];
        }

        return $array;
    }

    /**
     * Set a given configuration value.
     *
     * @param  array|string  $key
     * @param  mixed   $value
     * @return void
     */
    public function set($key, $value = null)
    {
        $keys = is_array($key) ? $key : [$key => $value];

        foreach ($keys as $key => $value) {
            $this->setValue($key, $value);
        }
    }

    /**
     * Set a value in the configuration.
     *
     * @param  string  $key
     * @param  mixed   $value
     * @return void
     */
    protected function setValue($key, $value)
    {
        if (strpos($key, '.') === false) {
            $this->items[$key] = $value;
            return;
        }

        $array = &$this->items;

        foreach (explode('.', $key) as $segment) {
            if (!isset($array[$segment]) || !is_array($array[$segment])) {
                $array[$segment] = [];
            }

            $array = &$array[$segment];
        }

        $array = $value;
    }

    /**
     * Prepend a value onto an array configuration value.
     *
     * @param  string  $key
     * @param  mixed   $value
     * @return void
     */
    public function prepend($key, $value)
    {
        $array = $this->get($key, []);

        array_unshift($array, $value);

        $this->set($key, $array);
    }

    /**
     * Push a value onto an array configuration value.
     *
     * @param  string  $key
     * @param  mixed   $value
     * @return void
     */
    public function push($key, $value)
    {
        $array = $this->get($key, []);

        $array[] = $value;

        $this->set($key, $array);
    }

    /**
     * Merge configuration values.
     *
     * @param  array  $items
     * @return void
     */
    public function merge(array $items)
    {
        $this->items = $this->deepMerge($this->items, $items);
    }

    /**
     * Deep merge arrays with smart handling of associative vs indexed arrays.
     *
     * @param  array  $original
     * @param  array  $new
     * @return array
     */
    protected function deepMerge(array $original, array $new)
    {
        $result = $original;

        foreach ($new as $key => $value) {
            if (array_key_exists($key, $original) && is_array($original[$key]) && is_array($value)) {
                // Both are arrays - check if they are associative or indexed
                if ($this->isAssociative($original[$key]) && $this->isAssociative($value)) {
                    // Both are associative arrays - deep merge
                    $result[$key] = $this->deepMerge($original[$key], $value);
                } else {
                    // At least one is indexed array - replace completely
                    $result[$key] = $value;
                }
            } else {
                // Not both arrays or key doesn't exist - replace
                $result[$key] = $value;
            }
        }

        return $result;
    }

    /**
     * Check if an array is associative (has string keys).
     *
     * @param  array  $array
     * @return bool
     */
    protected function isAssociative(array $array)
    {
        if (empty($array)) {
            return true; // Empty arrays are considered associative
        }

        return array_keys($array) !== range(0, count($array) - 1);
    }

    /**
     * Get all of the configuration items for the application.
     *
     * @return array
     */
    public function all()
    {
        return $this->items;
    }

    /**
     * Determine if the given configuration option exists.
     *
     * @param  string  $key
     * @return bool
     */
    #[\ReturnTypeWillChange]
    public function offsetExists($key)
    {
        return $this->has($key);
    }

    /**
     * Get a configuration option.
     *
     * @param  string  $key
     * @return mixed
     */
    #[\ReturnTypeWillChange]
    public function offsetGet($key)
    {
        return $this->get($key);
    }

    /**
     * Set a configuration option.
     *
     * @param  string  $key
     * @param  mixed   $value
     * @return void
     */
    #[\ReturnTypeWillChange]
    public function offsetSet($key, $value)
    {
        $this->set($key, $value);
    }

    /**
     * Unset a configuration option.
     *
     * @param  string  $key
     * @return void
     */
    #[\ReturnTypeWillChange]
    public function offsetUnset($key)
    {
        $this->set($key, null);
    }
}
