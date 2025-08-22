<?php

namespace Jankx\Models;

/**
 * Base Model Class
 *
 * Common model class for all database queries in Jankx Framework.
 * Provides basic functionality for data handling and validation.
 *
 * @package Jankx\Models
 * @since 2.0.0
 */
abstract class Model
{
    /**
     * Model attributes
     *
     * @var array
     */
    protected $attributes = [];

    /**
     * Original attributes (before modifications)
     *
     * @var array
     */
    protected $original = [];

    /**
     * Constructor
     *
     * @param array|object $data
     */
    public function __construct($data = [])
    {
        $this->fill($data);
    }

    /**
     * Fill model with data
     *
     * @param array|object $data
     * @return $this
     */
    public function fill($data)
    {
        if (is_object($data)) {
            $data = (array) $data;
        }

        $this->attributes = $data;
        $this->original = $data;

        return $this;
    }

    /**
     * Get attribute value
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function get($key, $default = null)
    {
        return $this->attributes[$key] ?? $default;
    }

    /**
     * Set attribute value
     *
     * @param string $key
     * @param mixed $value
     * @return $this
     */
    public function set($key, $value)
    {
        $this->attributes[$key] = $value;
        return $this;
    }

    /**
     * Check if attribute exists
     *
     * @param string $key
     * @return bool
     */
    public function has($key)
    {
        return isset($this->attributes[$key]);
    }

    /**
     * Get all attributes
     *
     * @return array
     */
    public function toArray()
    {
        return $this->attributes;
    }

    /**
     * Get original attributes
     *
     * @return array
     */
    public function getOriginal()
    {
        return $this->original;
    }

    /**
     * Check if model has been modified
     *
     * @return bool
     */
    public function isDirty()
    {
        return $this->attributes !== $this->original;
    }

    /**
     * Magic getter for attributes
     *
     * @param string $key
     * @return mixed
     */
    public function __get($key)
    {
        return $this->get($key);
    }

    /**
     * Magic setter for attributes
     *
     * @param string $key
     * @param mixed $value
     * @return void
     */
    public function __set($key, $value)
    {
        $this->set($key, $value);
    }

    /**
     * Magic isset for attributes
     *
     * @param string $key
     * @return bool
     */
    public function __isset($key)
    {
        return $this->has($key);
    }
}
