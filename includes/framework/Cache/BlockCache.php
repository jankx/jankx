<?php

namespace Jankx\Cache;

/**
 * Block Cache
 *
 * Specialized cache for Gutenberg block data.
 * Uses CacheManager for storage, handles block-specific logic.
 *
 * @package Jankx\Cache
 */
class BlockCache
{
    private CacheManager $cache;
    private const CACHE_TTL = 86400; // 24 hours
    private const CACHE_VERSION = '2.0.0';

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
        $this->cache = CacheManager::instance();
        $this->cache->setPrefix('blocks_');
    }

    /**
     * Check if block cache is valid
     */
    public function isValid(): bool
    {
        $version = $this->cache->get('version');
        if ($version !== self::CACHE_VERSION) {
            return false;
        }

        $lastBuild = $this->cache->get('last_build', 0);
        return (time() - $lastBuild) < self::CACHE_TTL;
    }

    /**
     * Build cache from WordPress block registry
     */
    public function build(): void
    {
        $this->cache->setMany([
            'types' => $this->fetchAllBlockTypes(),
            'patterns' => $this->fetchAllPatterns(),
            'categories' => $this->fetchAllCategories(),
            'version' => self::CACHE_VERSION,
            'last_build' => time(),
        ]);
    }

    /**
     * Get all cached block types
     */
    public function getBlockTypes(): array
    {
        return $this->cache->get('types', []);
    }

    /**
     * Get specific block type
     */
    public function getBlockType(string $name): ?array
    {
        $types = $this->getBlockTypes();
        return $types[$name] ?? null;
    }

    /**
     * Get all cached block patterns
     */
    public function getPatterns(): array
    {
        return $this->cache->get('patterns', []);
    }

    /**
     * Get all cached block categories
     */
    public function getCategories(): array
    {
        return $this->cache->get('categories', []);
    }

    /**
     * Save a block type to cache
     */
    public function saveBlockType(string $name, array $data): bool
    {
        $types = $this->getBlockTypes();
        $types[$name] = $data;
        return $this->cache->set('types', $types);
    }

    /**
     * Delete a block type from cache
     */
    public function deleteBlockType(string $name): bool
    {
        $types = $this->getBlockTypes();
        unset($types[$name]);
        return $this->cache->set('types', $types);
    }

    /**
     * Invalidate cache
     */
    public function invalidate(): bool
    {
        return $this->cache->delete('version');
    }

    /**
     * Delete entire cache
     */
    public function flush(): bool
    {
        return $this->cache->flush();
    }

    /**
     * Get cache stats
     */
    public function stats(): array
    {
        $driverStats = $this->cache->stats();
        $types = $this->getBlockTypes();
        $patterns = $this->getPatterns();
        $categories = $this->getCategories();

        return array_merge($driverStats, [
            'block_count' => count($types),
            'pattern_count' => count($patterns),
            'category_count' => count($categories),
            'is_valid' => $this->isValid(),
            'last_build' => $this->cache->get('last_build', 0),
            'last_build_human' => human_time_diff($this->cache->get('last_build', 0)),
            'cache_version' => $this->cache->get('version', 'none'),
        ]);
    }

    // ─── Private: Fetch from WordPress ──────────────────────────────────

    private function fetchAllBlockTypes(): array
    {
        $registry = \WP_Block_Type_Registry::get_instance();
        $allBlocks = $registry->get_all_registered();
        $blocks = [];

        foreach ($allBlocks as $blockType) {
            $name = $blockType->name;
            $blocks[$name] = [
                'name' => $name,
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
                'is_dynamic' => $blockType->is_dynamic(),
                'editor_script_handles' => $blockType->editor_script_handles,
                'script_handles' => $blockType->script_handles,
                'view_script_handles' => $blockType->view_script_handles,
                'editor_style_handles' => $blockType->editor_style_handles,
                'style_handles' => $blockType->style_handles,
                'view_style_handles' => $blockType->view_style_handles,
            ];
        }

        return $blocks;
    }

    private function fetchAllPatterns(): array
    {
        if (!function_exists('get_block_patterns')) {
            return [];
        }

        $patterns = get_block_patterns();
        $result = [];

        foreach ($patterns as $name => $pattern) {
            $result[$name] = [
                'name' => $name,
                'title' => $pattern['title'] ?? '',
                'content' => $pattern['content'] ?? '',
                'description' => $pattern['description'] ?? '',
                'categories' => $pattern['categories'] ?? [],
                'block_types' => $pattern['block_types'] ?? [],
                'keywords' => $pattern['keywords'] ?? [],
                'viewportWidth' => $pattern['viewportWidth'] ?? 1200,
            ];
        }

        return $result;
    }

    private function fetchAllCategories(): array
    {
        if (!function_exists('get_block_categories_all')) {
            return [];
        }

        $categories = get_block_categories_all(new \WP_Block_Editor_Context());
        $result = [];

        foreach ($categories as $category) {
            $result[$category['slug']] = $category;
        }

        return $result;
    }
}
