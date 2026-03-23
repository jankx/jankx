<?php

namespace Jankx\Services\FontIcons\Storage;

class StorageFactory
{
    /**
     * Create appropriate storage instance based on system availability
     */
    public static function create($type = 'json', $options = [])
    {
        if ($type === 'sqlite' && extension_loaded('sqlite3')) {
            $dbPath = isset($options['db_path']) ? $options['db_path'] : null;
            return new SqliteStorage($dbPath);
        }

        $cacheDir = isset($options['cache_dir']) ? $options['cache_dir'] : null;
        return new JsonStorage($cacheDir);
    }
}
