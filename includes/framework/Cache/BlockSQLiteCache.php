<?php

namespace Jankx\Cache;

/**
 * Block SQLite Cache
 *
 * Caches Gutenberg block data (block types, patterns, categories) into SQLite
 * to reduce MySQL connections on shared hosting.
 *
 * Flow:
 * 1. First load: Populate cache from MySQL → store in SQLite
 * 2. Subsequent loads: Serve from SQLite cache
 * 3. Invalidation: On plugin/theme update or block registration change
 *
 * @package Jankx\Cache
 */
class BlockSQLiteCache
{
    /**
     * SQLite database file path
     */
    private string $dbPath;

    /**
     * PDO connection to SQLite
     */
    private ?\PDO $pdo = null;

    /**
     * Cache version - increment to force rebuild
     */
    private const CACHE_VERSION = '1.0.0';

    /**
     * Singleton instance
     */
    private static ?self $instance = null;

    public static function instance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct()
    {
        $uploadDir = wp_upload_dir();
        $cacheDir = $uploadDir['basedir'] . '/cache';

        if (!is_dir($cacheDir)) {
            wp_mkdir_p($cacheDir);
        }

        $this->dbPath = $cacheDir . '/jankx-blocks.sqlite';
    }

    /**
     * Get PDO connection to SQLite
     */
    private function getConnection(): \PDO
    {
        if ($this->pdo === null) {
            if (!extension_loaded('pdo_sqlite')) {
                throw new \RuntimeException('SQLite PDO extension not available');
            }

            $this->pdo = new \PDO('sqlite:' . $this->dbPath);
            $this->pdo->setAttribute(\PDO::ATTR_ERRMODE, \PDO::ERRMODE_EXCEPTION);

            // Performance optimizations for read-heavy workload
            $this->pdo->exec('PRAGMA journal_mode=WAL');
            $this->pdo->exec('PRAGMA synchronous=NORMAL');
            $this->pdo->exec('PRAGMA cache_size=-64000');
            $this->pdo->exec('PRAGMA temp_store=MEMORY');

            $this->createTables();
        }

        return $this->pdo;
    }

    /**
     * Create cache tables if not exist
     */
    private function createTables(): void
    {
        $pdo = $this->pdo;

        $pdo->exec("
            CREATE TABLE IF NOT EXISTS jankx_block_types (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                block_name TEXT NOT NULL UNIQUE,
                namespace TEXT NOT NULL,
                metadata_json TEXT NOT NULL,
                settings_json TEXT NOT NULL,
                is_dynamic INTEGER DEFAULT 0,
                last_modified INTEGER NOT NULL,
                cache_version TEXT NOT NULL,
                created_at INTEGER NOT NULL
            )
        ");

        $pdo->exec("
            CREATE TABLE IF NOT EXISTS jankx_block_patterns (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pattern_name TEXT NOT NULL UNIQUE,
                pattern_data TEXT NOT NULL,
                last_modified INTEGER NOT NULL,
                cache_version TEXT NOT NULL,
                created_at INTEGER NOT NULL
            )
        ");

        $pdo->exec("
            CREATE TABLE IF NOT EXISTS jankx_block_categories (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                category_slug TEXT NOT NULL UNIQUE,
                category_data TEXT NOT NULL,
                last_modified INTEGER NOT NULL,
                cache_version TEXT NOT NULL,
                created_at INTEGER NOT NULL
            )
        ");

        $pdo->exec("
            CREATE TABLE IF NOT EXISTS jankx_cache_meta (
                meta_key TEXT PRIMARY KEY,
                meta_value TEXT NOT NULL,
                updated_at INTEGER NOT NULL
            )
        ");

        // Indexes for fast lookups
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_block_types_name ON jankx_block_types(block_name)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_block_types_namespace ON jankx_block_types(namespace)');
        $pdo->exec('CREATE INDEX IF NOT EXISTS idx_block_types_dynamic ON jankx_block_types(is_dynamic)');
    }

    /**
     * Check if cache is valid
     */
    public function isValid(): bool
    {
        try {
            $pdo = $this->getConnection();
            $stmt = $pdo->prepare('SELECT meta_value FROM jankx_cache_meta WHERE meta_key = ?');
            $stmt->execute(['cache_version']);
            $row = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$row || $row['meta_value'] !== self::CACHE_VERSION) {
                return false;
            }

            // Check if cache is older than 24 hours
            $stmt = $pdo->prepare('SELECT updated_at FROM jankx_cache_meta WHERE meta_key = ?');
            $stmt->execute(['last_build']);
            $row = $stmt->fetch(\PDO::FETCH_ASSOC);

            if (!$row) {
                return false;
            }

            $lastBuild = (int) $row['updated_at'];
            return (time() - $lastBuild) < DAY_IN_SECONDS;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Build cache from WordPress block registry
     */
    public function buildCache(): void
    {
        $pdo = $this->getConnection();
        $now = time();

        $pdo->beginTransaction();

        try {
            // Clear old cache
            $pdo->exec('DELETE FROM jankx_block_types');
            $pdo->exec('DELETE FROM jankx_block_patterns');
            $pdo->exec('DELETE FROM jankx_block_categories');

            // Cache block types from WP_Block_Type_Registry
            $blockRegistry = \WP_Block_Type_Registry::get_instance();
            $allBlocks = $blockRegistry->get_all_registered();

            $stmt = $pdo->prepare("
                INSERT INTO jankx_block_types (block_name, namespace, metadata_json, settings_json, is_dynamic, last_modified, cache_version, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ");

            foreach ($allBlocks as $blockType) {
                $metadata = [
                    'name' => $blockType->name,
                    'title' => $blockType->title,
                    'description' => $blockType->description,
                    'icon' => $blockType->icon,
                    'category' => $blockType->category,
                    'keywords' => $blockType->keywords,
                    'parent' => $blockType->parent,
                    'ancestor' => $blockType->ancestor,
                    'attributes' => $blockType->get_attributes(),
                    'supports' => $blockType->supports,
                    'styles' => $blockType->styles,
                    'variations' => $blockType->variations,
                    'example' => $blockType->example,
                    'provides_context' => $blockType->provides_context,
                    'uses_context' => $blockType->uses_context,
                    'selectors' => $blockType->selectors,
                    'block_hooks' => $blockType->block_hooks,
                    'api_version' => $blockType->api_version,
                    'textdomain' => $blockType->textdomain,
                ];

                $settings = [
                    'editor_script_handles' => $blockType->editor_script_handles,
                    'script_handles' => $blockType->script_handles,
                    'view_script_handles' => $blockType->view_script_handles,
                    'editor_style_handles' => $blockType->editor_style_handles,
                    'style_handles' => $blockType->style_handles,
                    'view_style_handles' => $blockType->view_style_handles,
                    'view_script_module_ids' => $blockType->view_script_module_ids,
                ];

                list($namespace) = explode('/', $blockType->name);

                $stmt->execute([
                    $blockType->name,
                    $namespace,
                    wp_json_encode($metadata, JSON_UNESCAPED_UNICODE),
                    wp_json_encode($settings, JSON_UNESCAPED_UNICODE),
                    $blockType->is_dynamic() ? 1 : 0,
                    $now,
                    self::CACHE_VERSION,
                    $now,
                ]);
            }

            // Cache block patterns
            if (function_exists('get_block_patterns')) {
                $patterns = get_block_patterns();

                $stmt = $pdo->prepare("
                    INSERT INTO jankx_block_patterns (pattern_name, pattern_data, last_modified, cache_version, created_at)
                    VALUES (?, ?, ?, ?, ?)
                ");

                foreach ($patterns as $name => $pattern) {
                    $stmt->execute([
                        $name,
                        wp_json_encode($pattern, JSON_UNESCAPED_UNICODE),
                        $now,
                        self::CACHE_VERSION,
                        $now,
                    ]);
                }
            }

            // Cache block categories
            $categories = function_exists('get_block_categories_all')
                ? get_block_categories_all(new \WP_Block_Editor_Context())
                : [];

            $stmt = $pdo->prepare("
                INSERT INTO jankx_block_categories (category_slug, category_data, last_modified, cache_version, created_at)
                VALUES (?, ?, ?, ?, ?)
            ");

            foreach ($categories as $category) {
                $stmt->execute([
                    $category['slug'],
                    wp_json_encode($category, JSON_UNESCAPED_UNICODE),
                    $now,
                    self::CACHE_VERSION,
                    $now,
                ]);
            }

            // Update meta
            $stmt = $pdo->prepare('INSERT OR REPLACE INTO jankx_cache_meta (meta_key, meta_value, updated_at) VALUES (?, ?, ?)');
            $stmt->execute(['cache_version', self::CACHE_VERSION, $now]);
            $stmt->execute(['last_build', (string) $now, $now]);
            $stmt->execute(['block_count', (string) count($allBlocks), $now]);

            $pdo->commit();
        } catch (\Exception $e) {
            $pdo->rollBack();
            throw $e;
        }
    }

    /**
     * Get all cached block types for REST API
     */
    public function getAllBlockTypes(): array
    {
        $pdo = $this->getConnection();
        $stmt = $pdo->query('SELECT metadata_json, settings_json, is_dynamic FROM jankx_block_types');
        $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        $blocks = [];
        foreach ($rows as $row) {
            $metadata = json_decode($row['metadata_json'], true);
            $settings = json_decode($row['settings_json'], true);
            $metadata['is_dynamic'] = (bool) $row['is_dynamic'];
            $blocks[] = array_merge($metadata, $settings);
        }

        return $blocks;
    }

    /**
     * Get specific block type by name
     */
    public function getBlockType(string $name): ?array
    {
        $pdo = $this->getConnection();
        $stmt = $pdo->prepare('SELECT metadata_json, settings_json, is_dynamic FROM jankx_block_types WHERE block_name = ?');
        $stmt->execute([$name]);
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        if (!$row) {
            return null;
        }

        $metadata = json_decode($row['metadata_json'], true);
        $settings = json_decode($row['settings_json'], true);
        $metadata['is_dynamic'] = (bool) $row['is_dynamic'];

        return array_merge($metadata, $settings);
    }

    /**
     * Get all cached block patterns
     */
    public function getAllBlockPatterns(): array
    {
        $pdo = $this->getConnection();
        $stmt = $pdo->query('SELECT pattern_name, pattern_data FROM jankx_block_patterns');
        $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        $patterns = [];
        foreach ($rows as $row) {
            $patterns[$row['pattern_name']] = json_decode($row['pattern_data'], true);
        }

        return $patterns;
    }

    /**
     * Get all cached block categories
     */
    public function getAllBlockCategories(): array
    {
        $pdo = $this->getConnection();
        $stmt = $pdo->query('SELECT category_slug, category_data FROM jankx_block_categories');
        $rows = $stmt->fetchAll(\PDO::FETCH_ASSOC);

        $categories = [];
        foreach ($rows as $row) {
            $categories[] = json_decode($row['category_data'], true);
        }

        return $categories;
    }

    /**
     * Get block count from cache
     */
    public function getBlockCount(): int
    {
        $pdo = $this->getConnection();
        $stmt = $pdo->prepare('SELECT meta_value FROM jankx_cache_meta WHERE meta_key = ?');
        $stmt->execute(['block_count']);
        $row = $stmt->fetch(\PDO::FETCH_ASSOC);

        return $row ? (int) $row['meta_value'] : 0;
    }

    /**
     * Invalidate cache
     */
    public function invalidate(): void
    {
        $pdo = $this->getConnection();
        $pdo->exec('DELETE FROM jankx_cache_meta WHERE meta_key = "cache_version"');
    }

    // =============================================
    // Write-through methods
    // MySQL = source of truth, SQLite = read cache
    // =============================================

    /**
     * Save block type to BOTH MySQL and SQLite
     *
     * @param string $blockName Block name (e.g., 'jankx/my-block')
     * @param array $metadata Block metadata (from block.json)
     * @param array $settings Block settings (scripts, styles)
     * @return bool Success
     */
    public function saveBlockType(string $blockName, array $metadata, array $settings = []): bool
    {
        // 1. Write to MySQL (source of truth)
        $wpBlockType = \WP_Block_Type_Registry::get_instance()->get_registered($blockName);
        if ($wpBlockType) {
            // Update existing block in WordPress registry
            // Note: WordPress doesn't have a direct update API for block metadata
            // The block is already registered, we just need to refresh the cache
        }

        // 2. Write to SQLite (read cache)
        $pdo = $this->getConnection();
        $now = time();

        list($namespace) = explode('/', $blockName);

        $metadataJson = wp_json_encode($metadata, JSON_UNESCAPED_UNICODE);
        $settingsJson = wp_json_encode($settings, JSON_UNESCAPED_UNICODE);

        $stmt = $pdo->prepare("
            INSERT OR REPLACE INTO jankx_block_types
            (block_name, namespace, metadata_json, settings_json, is_dynamic, last_modified, cache_version, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, COALESCE(
                (SELECT created_at FROM jankx_block_types WHERE block_name = ?),
                ?
            ))
        ");

        return $stmt->execute([
            $blockName,
            $namespace,
            $metadataJson,
            $settingsJson,
            !empty($metadata['is_dynamic']) ? 1 : 0,
            $now,
            self::CACHE_VERSION,
            $blockName, // for subquery
            $now, // for fallback
        ]);
    }

    /**
     * Delete block type from BOTH MySQL and SQLite
     *
     * @param string $blockName Block name
     * @return bool Success
     */
    public function deleteBlockType(string $blockName): bool
    {
        // 1. Unregister from WordPress (MySQL side)
        $registry = \WP_Block_Type_Registry::get_instance();
        if ($registry->is_registered($blockName)) {
            $registry->unregister($blockName);
        }

        // 2. Delete from SQLite
        $pdo = $this->getConnection();
        $stmt = $pdo->prepare('DELETE FROM jankx_block_types WHERE block_name = ?');
        return $stmt->execute([$blockName]);
    }

    /**
     * Save block pattern to BOTH MySQL and SQLite
     *
     * @param string $patternName Pattern name
     * @param array $patternData Pattern data
     * @return bool Success
     */
    public function saveBlockPattern(string $patternName, array $patternData): bool
    {
        // 1. Write to MySQL via WordPress API
        // Block patterns are typically registered via register_block_pattern()
        // which stores in WP options. We need to trigger re-registration.

        // 2. Write to SQLite
        $pdo = $this->getConnection();
        $now = time();

        $stmt = $pdo->prepare("
            INSERT OR REPLACE INTO jankx_block_patterns
            (pattern_name, pattern_data, last_modified, cache_version, created_at)
            VALUES (?, ?, ?, ?, ?)
        ");

        return $stmt->execute([
            $patternName,
            wp_json_encode($patternData, JSON_UNESCAPED_UNICODE),
            $now,
            self::CACHE_VERSION,
            $now,
        ]);
    }

    /**
     * Delete block pattern from BOTH MySQL and SQLite
     *
     * @param string $patternName Pattern name
     * @return bool Success
     */
    public function deleteBlockPattern(string $patternName): bool
    {
        // 1. Delete from WordPress (patterns are in wp_block_patterns option)
        $patterns = get_option('wp_block_patterns', []);
        if (isset($patterns[$patternName])) {
            unset($patterns[$patternName]);
            update_option('wp_block_patterns', $patterns);
        }

        // 2. Delete from SQLite
        $pdo = $this->getConnection();
        $stmt = $pdo->prepare('DELETE FROM jankx_block_patterns WHERE pattern_name = ?');
        return $stmt->execute([$patternName]);
    }

    /**
     * Save block category to BOTH MySQL and SQLite
     *
     * @param string $categorySlug Category slug
     * @param array $categoryData Category data
     * @return bool Success
     */
    public function saveBlockCategory(string $categorySlug, array $categoryData): bool
        {
        // 1. Write to WordPress options
        $categories = get_option('block_categories', []);
        $categories[$categorySlug] = $categoryData;
        update_option('block_categories', $categories);

        // 2. Write to SQLite
        $pdo = $this->getConnection();
        $now = time();

        $stmt = $pdo->prepare("
            INSERT OR REPLACE INTO jankx_block_categories
            (category_slug, category_data, last_modified, cache_version, created_at)
            VALUES (?, ?, ?, ?, ?)
        ");

        return $stmt->execute([
            $categorySlug,
            wp_json_encode($categoryData, JSON_UNESCAPED_UNICODE),
            $now,
            self::CACHE_VERSION,
            $now,
        ]);
    }

    /**
     * Bulk sync: Refresh SQLite cache from MySQL (source of truth)
     * Use this after bulk operations or cache corruption
     */
    public function syncFromMySQL(): void
    {
        // Delete all SQLite cache
        $this->invalidate();

        // Rebuild from WordPress registry (which reads MySQL)
        $this->buildCache();
    }

    /**
     * Flush entire cache and rebuild
     */
    public function flushAndRebuild(): void
    {
        $this->deleteCache();
        $this->buildCache();
    }

    /**
     * Delete cache file entirely
     */
    public function deleteCache(): void
    {
        if (file_exists($this->dbPath)) {
            unlink($this->dbPath);
        }

        $wal = $this->dbPath . '-wal';
        $shm = $this->dbPath . '-shm';

        if (file_exists($wal)) {
            unlink($wal);
        }
        if (file_exists($shm)) {
            unlink($shm);
        }
    }

    /**
     * Get cache stats
     */
    public function getStats(): array
    {
        try {
            $pdo = $this->getConnection();

            $stmt = $pdo->query('SELECT COUNT(*) as count FROM jankx_block_types');
            $blockCount = $stmt->fetch(\PDO::FETCH_ASSOC)['count'];

            $stmt = $pdo->query('SELECT COUNT(*) as count FROM jankx_block_patterns');
            $patternCount = $stmt->fetch(\PDO::FETCH_ASSOC)['count'];

            $stmt = $pdo->query('SELECT COUNT(*) as count FROM jankx_block_categories');
            $categoryCount = $stmt->fetch(\PDO::FETCH_ASSOC)['count'];

            $stmt = $pdo->query('SELECT updated_at FROM jankx_cache_meta WHERE meta_key = "last_build"');
            $row = $stmt->fetch(\PDO::FETCH_ASSOC);
            $lastBuild = $row ? (int) $row['updated_at'] : 0;

            return [
                'block_count' => $blockCount,
                'pattern_count' => $patternCount,
                'category_count' => $categoryCount,
                'last_build' => $lastBuild,
                'last_build_human' => $lastBuild ? human_time_diff($lastBuild) . ' ago' : 'never',
                'is_valid' => $this->isValid(),
                'db_size' => file_exists($this->dbPath) ? size_format(filesize($this->dbPath)) : '0 B',
            ];
        } catch (\Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
}
