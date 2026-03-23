<?php

namespace Jankx\Services\FontIcons\Storage;

class StorageFactory
{
    /**
     * Create appropriate storage instance based on system availability
     */
    public static function create($dbPath = null, $cacheDir = null)
    {
        // Ưu tiên SQLite nếu extension đã được cài đặt
        if (extension_loaded('sqlite3')) {
            return new SqliteStorage($dbPath);
        }

        // Fallback về JSON files
        return new JsonStorage($cacheDir);
    }
}
