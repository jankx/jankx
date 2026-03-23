<?php

namespace Jankx\Services\FontIcons\Storage;

class SqliteStorage implements IconStorageInterface
{
    protected $dbPath;
    protected $db;

    public function __construct($dbPath = null)
    {
        $this->dbPath = $dbPath ?: $this->getDefaultDbPath();
        
        $this->ensureDirectoryExists();
        $this->initializeDatabase();
    }

    protected function getDefaultDbPath()
    {
        $uploadDir = wp_upload_dir();
        return $uploadDir['basedir'] . '/jankx/icons.db';
    }

    protected function ensureDirectoryExists()
    {
        $dir = dirname($this->dbPath);
        if (!is_dir($dir)) {
            wp_mkdir_p($dir);
        }
    }

    protected function initializeDatabase()
    {
        try {
            $this->db = new \SQLite3($this->dbPath);
            
            // Create icons table
            $this->db->exec("CREATE TABLE IF NOT EXISTS icon_sets (
                type TEXT PRIMARY KEY,
                data TEXT,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )");
        } catch (\Exception $e) {
            throw new \Exception(sprintf('Failed to initialize SQLite database: %s', $e->getMessage()));
        }
    }

    public function store($key, array $data)
    {
        $stmt = $this->db->prepare("INSERT OR REPLACE INTO icon_sets (type, data, updated_at) VALUES (:key, :data, CURRENT_TIMESTAMP)");
        $stmt->bindValue(':key', $key, SQLITE3_TEXT);
        $stmt->bindValue(':data', json_encode($data, JSON_UNESCAPED_UNICODE), SQLITE3_TEXT);
        
        return $stmt->execute() !== false;
    }

    public function retrieve($key)
    {
        $stmt = $this->db->prepare("SELECT data FROM icon_sets WHERE type = :key");
        $stmt->bindValue(':key', $key, SQLITE3_TEXT);
        
        $result = $stmt->execute();
        $row = $result->fetchArray(SQLITE3_ASSOC);
        
        if ($row) {
            return json_decode($row['data'], true);
        }

        return null;
    }

    public function remove($key)
    {
        $stmt = $this->db->prepare("DELETE FROM icon_sets WHERE type = :key");
        $stmt->bindValue(':key', $key, SQLITE3_TEXT);
        
        return $stmt->execute() !== false;
    }

    public function clear()
    {
        return $this->db->exec("DELETE FROM icon_sets");
    }

    public function getStats()
    {
        $count = $this->db->querySingle("SELECT COUNT(*) FROM icon_sets");
        return [
            'type' => 'sqlite',
            'icon_sets_count' => $count,
            'db_path' => $this->dbPath
        ];
    }

    public function __destruct()
    {
        if ($this->db) {
            $this->db->close();
        }
    }
}
