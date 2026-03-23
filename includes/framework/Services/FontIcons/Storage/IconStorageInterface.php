<?php

namespace Jankx\Services\FontIcons\Storage;

interface IconStorageInterface
{
    /**
     * Store icon set data
     */
    public function store($key, array $data);

    /**
     * Retrieve icon set data
     */
    public function retrieve($key);

    /**
     * Remove icon set data
     */
    public function remove($key);

    /**
     * Clear all cached data
     */
    public function clear();

    /**
     * Get stats from storage
     */
    public function getStats();
}
