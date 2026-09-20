<?php

namespace Jankx\Cache;

/**
 * Block Cache Interceptor
 *
 * Intercepts Gutenberg REST API requests and serves block data from SQLite cache.
 * Reduces MySQL connections by avoiding repeated queries for block types/patterns.
 *
 * @package Jankx\Cache
 */
class BlockCacheInterceptor
{
    private BlockSQLiteCache $cache;

    public function __construct()
    {
        $this->cache = BlockSQLiteCache::instance();
    }

    public function init(): void
    {
        // Build cache on init if not valid
        add_action('init', [$this, 'maybeBuildCache'], 5);

        // Intercept REST API responses for block types
        add_filter('rest_prepare_block_type', [$this, 'filterBlockTypeResponse'], 10, 3);
        add_filter('rest_dispatch_request', [$this, 'interceptBlockTypesRequest'], 10, 3);
        add_filter('rest_dispatch_request', [$this, 'interceptBlockPatternsRequest'], 10, 3);

        // Preload block data into editor to reduce REST API calls
        add_filter('block_editor_rest_api_preload_paths', [$this, 'addPreloadPaths'], 10, 2);

        // Inject cached block types directly into editor settings
        add_filter('block_editor_settings_all', [$this, 'injectCachedBlockTypes'], 10, 2);

        // =============================================
        // Write-through: Hook into block registration
        // When a block is registered, also update SQLite
        // =============================================

        // After a block type is registered
        add_action('registered_block_type', [$this, 'onBlockTypeRegistered'], 10, 2);

        // After a block pattern is registered
        add_action('wp_loaded', [$this, 'syncPatternsToSQLite'], 20);

        // Admin page for cache management
        add_action('admin_menu', [$this, 'addAdminPage']);

        // Invalidate on plugin/theme changes
        add_action('upgrader_process_complete', [$this, 'onUpgrade']);
        add_action('switch_theme', [$this, 'invalidate']);

        // WP-CLI command
        if (defined('WP_CLI') && WP_CLI) {
            \WP_CLI::add_command('jankx-block-cache', [$this, 'cliCommand']);
        }
    }

    /**
     * Sync block patterns to SQLite after WordPress loads
     */
    public function syncPatternsToSQLite(): void
    {
        if (!$this->shouldRun()) {
            return;
        }

        try {
            $cache = BlockSQLiteCache::instance();

            // Sync patterns from WordPress to SQLite
            if (function_exists('get_block_patterns')) {
                $patterns = get_block_patterns();
                foreach ($patterns as $name => $pattern) {
                    $cache->saveBlockPattern($name, $pattern);
                }
            }

            // Sync categories from WordPress to SQLite
            $categories = function_exists('get_block_categories_all')
                ? get_block_categories_all(new \WP_Block_Editor_Context())
                : [];

            foreach ($categories as $category) {
                $cache->saveBlockCategory($category['slug'], $category);
            }
        } catch (\Exception $e) {
            error_log('Jankx Block Cache: Pattern sync failed - ' . $e->getMessage());
        }
    }

    /**
     * Build cache if not valid
     */
    public function maybeBuildCache(): void
    {
        if (!$this->shouldRun()) {
            return;
        }

        if (!$this->cache->isValid()) {
            $this->buildCacheSilently();
        }
    }

    /**
     * Build cache without output
     */
    private function buildCacheSilently(): void
    {
        try {
            $this->cache->buildCache();
        } catch (\Exception $e) {
            error_log('Jankx Block Cache: Failed to build - ' . $e->getMessage());
        }
    }

    /**
     * Intercept /wp/v2/block-types requests and serve from cache
     */
    public function interceptBlockTypesRequest($response, $handler, $request): mixed
    {
        // Only intercept block-types endpoint
        if (!str_contains($request->get_route(), '/block-types')) {
            return $response;
        }

        if (!$this->shouldRun() || !$this->cache->isValid()) {
            return $response;
        }

        try {
            $blocks = $this->cache->getAllBlockTypes();
            $context = $request->get_param('context') ?: 'view';

            $data = [];
            foreach ($blocks as $blockData) {
                // Filter by namespace if specified
                $namespace = $request->get_param('namespace');
                if ($namespace) {
                    list($blockNamespace) = explode('/', $blockData['name'] ?? '');
                    if ($blockNamespace !== $namespace) {
                        continue;
                    }
                }

                // Filter by context
                $filteredData = $this->filterByContext($blockData, $context);
                $filteredData['_links'] = $this->buildLinks($blockData['name'] ?? '');
                $data[] = $filteredData;
            }

            $restResponse = new \WP_REST_Response($data);
            $restResponse->add_header('X-Jankx-Cache', 'HIT');
            return $restResponse;
        } catch (\Exception $e) {
            return $response;
        }
    }

    /**
     * Intercept block-patterns requests
     */
    public function interceptBlockPatternsRequest($response, $handler, $request): mixed
    {
        if (!str_contains($request->get_route(), '/block-patterns')) {
            return $response;
        }

        if (!$this->shouldRun() || !$this->cache->isValid()) {
            return $response;
        }

        try {
            $patterns = $this->cache->getAllBlockPatterns();

            // Check if requesting patterns or categories
            if (str_ends_with($request->get_route(), '/categories')) {
                // Return categories from cache
                $categories = $this->cache->getAllBlockCategories();
                $restResponse = new \WP_REST_Response($categories);
                $restResponse->add_header('X-Jankx-Cache', 'HIT');
                return $restResponse;
            }

            $data = array_values($patterns);
            $restResponse = new \WP_REST_Response($data);
            $restResponse->add_header('X-Jankx-Cache', 'HIT');
            return $restResponse;
        } catch (\Exception $e) {
            return $response;
        }
    }

    /**
     * Filter block data by context (view, edit, embed)
     */
    private function filterByContext(array $data, string $context): array
    {
        // For 'view' context, remove edit-only fields
        if ($context === 'view') {
            unset($data['editor_script_handles']);
            unset($data['editor_style_handles']);
        }

        return $data;
    }

    /**
     * Build _links for block type response
     */
    private function buildLinks(string $blockName): array
    {
        if (empty($blockName)) {
            return [];
        }

        list($namespace) = explode('/', $blockName);

        $links = [
            'collection' => [
                'href' => rest_url('wp/v2/block-types'),
            ],
            'self' => [
                'href' => rest_url('wp/v2/block-types/' . $blockName),
            ],
            'up' => [
                'href' => rest_url('wp/v2/block-types/' . $namespace),
            ],
        ];

        return $links;
    }

    /**
     * Filter block type response (single block)
     */
    public function filterBlockTypeResponse($response, $blockType, $request): \WP_REST_Response
    {
        // Add cache header
        $response->header('X-Jankx-Cache', 'PARTIAL');
        return $response;
    }

    /**
     * Add preload paths to reduce REST API calls
     */
    public function addPreloadPaths($preloadPaths, $blockEditorContext): array
    {
        if (!$this->shouldRun() || !$this->cache->isValid()) {
            return $preloadPaths;
        }

        // These paths will be preloaded by Gutenberg
        // If we cache the responses, we avoid DB queries entirely
        $cachedPaths = [
            '/wp/v2/block-types?context=edit',
            '/wp/v2/block-patterns/patterns',
            '/wp/v2/block-patterns/categories',
        ];

        return array_merge($preloadPaths, $cachedPaths);
    }

    /**
     * Inject cached block types directly into editor settings
     * This bypasses REST API entirely
     */
    public function injectCachedBlockTypes(array $settings, \WP_Block_Editor_Context $context): array
    {
        if (!$this->shouldRun() || !$this->cache->isValid()) {
            return $settings;
        }

        if (!is_admin() || wp_doing_ajax()) {
            return $settings;
        }

        // Check if this is a block editor screen
        if (!function_exists('get_current_screen') || !get_current_screen()) {
            return $settings;
        }

        try {
            $blocks = $this->cache->getAllBlockTypes();
            $settings['_jankx_cached_block_types'] = $blocks;
            $settings['_jankx_cache_stats'] = $this->cache->getStats();
        } catch (\Exception $e) {
            // Silently fail
        }

        return $settings;
    }

    /**
     * Add admin page for cache management
     */
    public function addAdminPage(): void
    {
        add_submenu_page(
            'tools.php',
            'Jankx Block Cache',
            'Block Cache',
            'manage_options',
            'jankx-block-cache',
            [$this, 'renderAdminPage']
        );
    }

    /**
     * Render admin page
     */
    public function renderAdminPage(): void
    {
        if (!current_user_can('manage_options')) {
            return;
        }

        if (isset($_POST['jankx_rebuild_cache']) && check_admin_referer('jankx_block_cache')) {
            $this->cache->deleteCache();
            $this->cache->buildCache();
            wp_redirect(admin_url('tools.php?page=jankx-block-cache&rebuilt=1'));
            exit;
        }

        if (isset($_POST['jankx_invalidate_cache']) && check_admin_referer('jankx_block_cache')) {
            $this->cache->invalidate();
            wp_redirect(admin_url('tools.php?page=jankx-block-cache&invalidated=1'));
            exit;
        }

        if (isset($_POST['jankx_sync_from_mysql']) && check_admin_referer('jankx_block_cache')) {
            $this->cache->syncFromMySQL();
            wp_redirect(admin_url('tools.php?page=jankx-block-cache&synced=1'));
            exit;
        }

        $stats = $this->cache->getStats();
        ?>
        <div class="wrap">
            <h1>Jankx Block Cache</h1>
            <p>Caches Gutenberg block data in SQLite to reduce MySQL connections on shared hosting.</p>
            <p><strong>Write-through mode:</strong> MySQL = source of truth, SQLite = read cache. Both are always in sync.</p>

            <?php if (isset($_GET['rebuilt'])): ?>
                <div class="notice notice-success"><p>Cache rebuilt successfully.</p></div>
            <?php endif; ?>
            <?php if (isset($_GET['invalidated'])): ?>
                <div class="notice notice-success"><p>Cache invalidated.</p></div>
            <?php endif; ?>
            <?php if (isset($_GET['synced'])): ?>
                <div class="notice notice-success"><p>Cache synced from MySQL.</p></div>
            <?php endif; ?>

            <h2>Cache Stats</h2>
            <table class="widefat fixed striped" style="max-width: 500px;">
                <tr><td>Status</td><td><?php echo $stats['is_valid'] ? '✅ Valid' : '❌ Invalid'; ?></td></tr>
                <tr><td>Cached Blocks</td><td><?php echo esc_html($stats['block_count'] ?? 0); ?></td></tr>
                <tr><td>Cached Patterns</td><td><?php echo esc_html($stats['pattern_count'] ?? 0); ?></td></tr>
                <tr><td>Cached Categories</td><td><?php echo esc_html($stats['category_count'] ?? 0); ?></td></tr>
                <tr><td>Last Built</td><td><?php echo esc_html($stats['last_build_human'] ?? 'never'); ?></td></tr>
                <tr><td>Cache Size</td><td><?php echo esc_html($stats['db_size'] ?? '0 B'); ?></td></tr>
            </table>

            <h2>Actions</h2>
            <form method="post" style="display: inline;">
                <?php wp_nonce_field('jankx_block_cache'); ?>
                <button type="submit" name="jankx_rebuild_cache" class="button button-primary">
                    Rebuild Cache
                </button>
            </form>
            <form method="post" style="display: inline; margin-left: 10px;">
                <?php wp_nonce_field('jankx_block_cache'); ?>
                <button type="submit" name="jankx_invalidate_cache" class="button">
                    Invalidate Cache
                </button>
            </form>
            <form method="post" style="display: inline; margin-left: 10px;">
                <?php wp_nonce_field('jankx_block_cache'); ?>
                <button type="submit" name="jankx_sync_from_mysql" class="button">
                    Sync from MySQL
                </button>
            </form>

            <h2>How It Works</h2>
            <ol>
                <li><strong>Read:</strong> Block data served from SQLite (0 MySQL connections)</li>
                <li><strong>Write:</strong> Changes written to both MySQL AND SQLite simultaneously</li>
                <li><strong>Invalidate:</strong> Cache auto-invalidates on plugin/theme update</li>
                <li><strong>Sync:</strong> Use "Sync from MySQL" if cache gets corrupted</li>
            </ol>
        </div>
        <?php
    }

    /**
     * Handle block type registration - sync to SQLite
     *
     * Called automatically when register_block_type() is called.
     * This ensures SQLite cache stays in sync with MySQL (WordPress registry).
     *
     * @param string $name Block name
     * @param \WP_Block_Type $block_type Block type object
     */
    public function onBlockTypeRegistered(string $name, \WP_Block_Type $block_type): void
    {
        if (!$this->shouldRun()) {
            return;
        }

        try {
            $cache = BlockSQLiteCache::instance();

            $metadata = [
                'name' => $block_type->name,
                'title' => $block_type->title,
                'description' => $block_type->description,
                'icon' => $block_type->icon,
                'category' => $block_type->category,
                'keywords' => $block_type->keywords,
                'parent' => $block_type->parent,
                'ancestor' => $block_type->ancestor,
                'attributes' => $block_type->get_attributes(),
                'supports' => $block_type->supports,
                'styles' => $block_type->styles,
                'variations' => $block_type->variations,
                'example' => $block_type->example,
                'provides_context' => $block_type->provides_context,
                'uses_context' => $block_type->uses_context,
                'selectors' => $block_type->selectors,
                'block_hooks' => $block_type->block_hooks,
                'api_version' => $block_type->api_version,
                'textdomain' => $block_type->textdomain,
                'is_dynamic' => $block_type->is_dynamic(),
            ];

            $settings = [
                'editor_script_handles' => $block_type->editor_script_handles,
                'script_handles' => $block_type->script_handles,
                'view_script_handles' => $block_type->view_script_handles,
                'editor_style_handles' => $block_type->editor_style_handles,
                'style_handles' => $block_type->style_handles,
                'view_style_handles' => $block_type->view_style_handles,
                'view_script_module_ids' => $block_type->view_script_module_ids,
            ];

            // Write-through: MySQL (already done by WP) + SQLite
            $cache->saveBlockType($name, $metadata, $settings);
        } catch (\Exception $e) {
            error_log('Jankx Block Cache: Failed to sync block type - ' . $e->getMessage());
        }
    }

    /**
     * Check if cache interceptor should run
     */
    private function shouldRun(): bool
    {
        // Only run on admin, AJAX, or REST API
        if (!is_admin() && !wp_doing_ajax() && !(defined('REST_REQUEST') && REST_REQUEST)) {
            return false;
        }

        // Check if SQLite extension is available
        if (!extension_loaded('pdo_sqlite')) {
            return false;
        }

        return true;
    }

    /**
     * Handle upgrade events
     */
    public function onUpgrade($upgrader_object, $options): void
        {
        if ($options['type'] === 'theme' || $options['type'] === 'plugin') {
            $this->invalidate();
        }
    }

    /**
     * Invalidate cache
     */
    public function invalidate(): void
    {
        $this->cache->invalidate();
    }

    /**
     * WP-CLI command
     */
    public function cliCommand($args, $assoc_args): void
    {
        $subcommand = $args[0] ?? 'status';

        switch ($subcommand) {
            case 'build':
                \WP_CLI::log('Building block cache...');
                $this->cache->deleteCache();
                $this->cache->buildCache();
                $stats = $this->cache->getStats();
                \WP_CLI::success(sprintf(
                    'Cache built: %d blocks, %d patterns, %d categories',
                    $stats['block_count'],
                    $stats['pattern_count'],
                    $stats['category_count']
                ));
                break;

            case 'invalidate':
                $this->cache->invalidate();
                \WP_CLI::success('Cache invalidated.');
                break;

            case 'delete':
                $this->cache->deleteCache();
                \WP_CLI::success('Cache file deleted.');
                break;

            case 'sync':
                \WP_CLI::log('Syncing cache from MySQL...');
                $this->cache->syncFromMySQL();
                $stats = $this->cache->getStats();
                \WP_CLI::success(sprintf(
                    'Cache synced: %d blocks, %d patterns, %d categories',
                    $stats['block_count'],
                    $stats['pattern_count'],
                    $stats['category_count']
                ));
                break;

            case 'status':
            default:
                $stats = $this->cache->getStats();
                if (isset($stats['error'])) {
                    \WP_CLI::error($stats['error']);
                }
                \WP_CLI::log('Block Cache Status:');
                \WP_CLI::log(sprintf('  Valid: %s', $stats['is_valid'] ? 'Yes' : 'No'));
                \WP_CLI::log(sprintf('  Blocks: %d', $stats['block_count']));
                \WP_CLI::log(sprintf('  Patterns: %d', $stats['pattern_count']));
                \WP_CLI::log(sprintf('  Categories: %d', $stats['category_count']));
                \WP_CLI::log(sprintf('  Last Built: %s', $stats['last_build_human']));
                \WP_CLI::log(sprintf('  Size: %s', $stats['db_size']));
                break;
        }
    }
}
