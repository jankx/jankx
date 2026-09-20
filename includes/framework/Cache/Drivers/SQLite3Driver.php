<?php

namespace Jankx\Cache\Drivers;

use Jankx\Cache\Contracts\CacheDriverInterface;

/**
 * SQLite3 Cache Driver
 *
 * Uses native PHP sqlite3 extension for caching.
 * Falls back to PDO if sqlite3 is not available.
 *
 * @package Jankx\Cache\Drivers
 */
class SQLite3Driver implements CacheDriverInterface
{
    private \SQLite3 $db;
    private string $dbPath;
    private bool $connected = false;

    public static function isAvailable(): bool
    {
        return extension_loaded('sqlite3');
    }

    public function __construct(array $config = [])
    {
        if (!self::isAvailable()) {
            throw new \RuntimeException('SQLite3 extension is not available');
        }

        $this->dbPath = $config['path'] ?? $this->getDefaultPath();
        $this->connect();
    }

    /**
     * Get default database path
     */
    private function getDefaultPath(): string
    {
        $uploadDir = wp_upload_dir();
        $cacheDir = $uploadDir['basedir'] . '/cache';

        if (!is_dir($cacheDir)) {
            wp_mkdir_p($cacheDir);
        }

        return $cacheDir . '/jankx-cache.sqlite';
    }

    /**
     * Connect to SQLite database
     */
    private function connect(): void
    {
        if ($this->connected) {
            return;
        }

        $this->db = new \SQLite3($this->dbPath);

        // Performance optimizations
        $this->db->exec('PRAGMA journal_mode=WAL');
        $this->db->exec('PRAGMA synchronous=NORMAL');
        $this->db->exec('PRAGMA cache_size=-64000');
        $this->db->exec('PRAGMA temp_store=MEMORY');

        $this->createTables();
        $this->connected = true;
    }

    /**
     * Create cache tables
     */
    private function createTables(): void
    {
        $this->db->exec("
            CREATE TABLE IF NOT EXISTS cache (
                key TEXT PRIMARY KEY,
                value TEXT NOT NULL,
                expires_at INTEGER,
                created_at INTEGER NOT NULL
            )
        ");

        $this->db->exec('CREATE INDEX IF NOT EXISTS idx_cache_expires ON cache(expires_at)');
    }

    /**
     * {@inheritdoc}
     */
    public function get(string $key, mixed $default = null): mixed
    {
        if (!$this->has($key)) {
            return $default;
        }

        $stmt = $this->db->prepare('SELECT value FROM cache WHERE key = :key');
        $stmt->bindValue(':key', $key, SQLITE3_TEXT);
        $result = $stmt->execute();
        $row = $result->fetchArray(SQLITE3_ASSOC);

        if (!$row) {
            return $default;
        }

        $value = json_decode($row['value'], true);

        return $value === null && json_last_error() !== JSON_ERROR_NONE
            ? $row['value']
            : $value;
    }

    /**
     * {@inheritdoc}
     */
    public function set(string $key, mixed $value, ?int $ttl = null): bool
    {
        $jsonValue = is_string($value) ? $value : wp_json_encode($value, JSON_UNESCAPED_UNICODE);
        $expiresAt = $ttl ? time() + $ttl : null;
        $now = time();

        $stmt = $this->db->prepare('
            INSERT OR REPLACE INTO cache (key, value, expires_at, created_at)
            VALUES (:key, :value, :expires_at, :created_at)
        ');

        $stmt->bindValue(':key', $key, SQLITE3_TEXT);
        $stmt->bindValue(':value', $jsonValue, SQLITE3_TEXT);
        $stmt->bindValue(':expires_at', $expiresAt, SQLITE3_INTEGER);
        $stmt->bindValue(':created_at', $now, SQLITE3_INTEGER);

        $result = $stmt->execute();

        return $result !== false;
    }

    /**
     * {@inheritdoc}
     */
    public function delete(string $key): bool
    {
        $stmt = $this->db->prepare('DELETE FROM cache WHERE key = :key');
        $stmt->bindValue(':key', $key, SQLITE3_TEXT);
        $result = $stmt->execute();

        return $result !== false;
    }

    /**
     * {@inheritdoc}
     */
    public function has(string $key): bool
    {
        $now = time();

        $stmt = $this->db->prepare('
            SELECT 1 FROM cache
            WHERE key = :key
            AND (expires_at IS NULL OR expires_at > :now)
        ');
        $stmt->bindValue(':key', $key, SQLITE3_TEXT);
        $stmt->bindValue(':now', $now, SQLITE3_INTEGER);
        $result = $stmt->execute();
        $row = $result->fetchArray();

        return $row !== false;
    }

    /**
     * {@inheritdoc}
     */
    public function setMany(array $values, ?int $ttl = null): bool
    {
        $this->db->exec('BEGIN TRANSACTION');

        try {
            foreach ($values as $key => $value) {
                $this->set($key, $value, $ttl);
            }
            $this->db->exec('COMMIT');
            return true;
        } catch (\Exception $e) {
            $this->db->exec('ROLLBACK');
            return false;
        }
    }

    /**
     * {@inheritdoc}
     */
    public function getMany(array $keys, mixed $default = null): array
    {
        $results = [];
        foreach ($keys as $key) {
            $results[$key] = $this->get($key, $default);
        }
        return $results;
    }

    /**
     * {@inheritdoc}
     */
    public function deleteMany(array $keys): bool
    {
        $this->db->exec('BEGIN TRANSACTION');

        try {
            foreach ($keys as $key) {
                $this->delete($key);
            }
            $this->db->exec('COMMIT');
            return true;
        } catch (\Exception $e) {
            $this->db->exec('ROLLBACK');
            return false;
        }
    }

    /**
     * {@inheritdoc}
     */
    public function flush(): bool
    {
        return $this->db->exec('DELETE FROM cache') !== false;
    }

    /**
     * {@inheritdoc}
     */
    public function stats(): array
    {
        $total = $this->db->querySingle('SELECT COUNT(*) FROM cache');
        $valid = $this->db->querySingle("
            SELECT COUNT(*) FROM cache
            WHERE expires_at IS NULL OR expires_at > " . time()
        );
        $expired = $total - $valid;

        return [
            'driver' => 'sqlite3',
            'path' => $this->dbPath,
            'size' => file_exists($this->dbPath) ? filesize($this->dbPath) : 0,
            'total_items' => $total,
            'valid_items' => $valid,
            'expired_items' => $expired,
        ];
    }

    /**
     * Get the underlying SQLite3 instance
     */
    public function getDatabase(): \SQLite3
    {
        return $this->db;
    }

    /**
     * Close the connection
     */
    public function close(): void
    {
        if ($this->connected) {
            $this->db->close();
            $this->connected = false;
        }
    }
}
