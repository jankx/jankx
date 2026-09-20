<?php

namespace Jankx\Cache;

/**
 * Block Cache Interceptor
 *
 * Intercepts Gutenberg REST API requests and serves block data from cache.
 * Uses WordPress hooks to intercept requests and serve cached responses.
 *
 * @package Jankx\Cache
 */
class BlockCacheInterceptor
{
    private BlockCache $blockCache;

    public function __construct()
    {
        $this->blockCache = BlockCache::instance();
    }

    public function init(): void
    {
        // Build cache on init if not valid
        add_action('init', [$this, 'maybeBuildCache'], 5);

        // REST API interception
        add_filter('rest_dispatch_request', [$this, 'interceptRequest'], 10, 3);

        // Preload block data into editor
        add_filter('block_editor_rest_api_preload_paths', [$this, 'addPreloadPaths'], 10, 2);

        // Write-through: sync when block registered
        add_action('registered_block_type', [$this, 'onBlockRegistered'], 10, 2);

        // Auto-invalidate on updates
        add_action('upgrader_process_complete', [$this, 'invalidate']);
        add_action('switch_theme', [$this, 'invalidate']);

        // Admin page
        add_action('admin_menu', [$this, 'addAdminPage']);
    }

    /**
     * Build cache if needed
     */
    public function maybeBuildCache(): void
    {
        if (!$this->shouldRun()) {
            return;
        }

        try {
            if (!$this->blockCache->isValid()) {
                $this->blockCache->build();
            }
        } catch (\Exception $e) {
            error_log('Jankx Block Cache: build failed - ' . $e->getMessage());
        }
    }

    /**
     * Intercept REST API requests for block-types and block-patterns
     *
     * rest_dispatch_request filter: (mixed $result, WP_REST_Request $request, string $route)
     */
    public function interceptRequest(mixed $result, \WP_REST_Request $request, string $route): mixed
    {
        try {
            if (!$this->shouldRun() || !$this->blockCache->isValid()) {
                return $result;
            }

            // Intercept block-types
            if (str_contains($route, '/block-types') && !str_contains($route, '/block-types/')) {
                return $this->serveBlockTypes($request);
            }

            // Intercept block-patterns
            if (str_contains($route, '/block-patterns/patterns')) {
                return $this->servePatterns();
            }

            // Intercept block-patterns categories
            if (str_contains($route, '/block-patterns/categories')) {
                return $this->serveCategories();
            }
        } catch (\Exception $e) {
            error_log('Jankx Block Cache: intercept failed - ' . $e->getMessage());
        }

        return $result;
    }

    /**
     * Serve block types from cache
     */
    private function serveBlockTypes(\WP_REST_Request $request): \WP_REST_Response
    {
        $blocks = $this->blockCache->getBlockTypes();
        $context = $request->get_param('context') ?: 'view';
        $namespace = $request->get_param('namespace');

        $data = [];
        foreach ($blocks as $blockData) {
            if ($namespace) {
                list($blockNamespace) = explode('/', $blockData['name'] ?? '');
                if ($blockNamespace !== $namespace) {
                    continue;
                }
            }

            $data[] = $this->filterByContext($blockData, $context);
        }

        $response = new \WP_REST_Response($data);
        $response->header('X-Jankx-Cache', 'HIT');
        return $response;
    }

    /**
     * Serve patterns from cache
     */
    private function servePatterns(): \WP_REST_Response
    {
        $patterns = $this->blockCache->getPatterns();
        $response = new \WP_REST_Response(array_values($patterns));
        $response->header('X-Jankx-Cache', 'HIT');
        return $response;
    }

    /**
     * Serve categories from cache
     */
    private function serveCategories(): \WP_REST_Response
    {
        $categories = $this->blockCache->getCategories();
        $response = new \WP_REST_Response(array_values($categories));
        $response->header('X-Jankx-Cache', 'HIT');
        return $response;
    }

    /**
     * Filter data by context
     */
    private function filterByContext(array $data, string $context): array
    {
        if ($context === 'view') {
            unset($data['editor_script_handles'], $data['editor_style_handles']);
        }
        return $data;
    }

    /**
     * Add preload paths to editor
     */
    public function addPreloadPaths(array $preloadPaths, \WP_Block_Editor_Context $context): array
    {
        if (!$this->shouldRun() || !$this->blockCache->isValid()) {
            return $preloadPaths;
        }

        return array_merge($preloadPaths, [
            '/wp/v2/block-types?context=edit',
            '/wp/v2/block-patterns/patterns',
            '/wp/v2/block-patterns/categories',
        ]);
    }

    /**
     * Sync block type to cache when registered
     */
    public function onBlockRegistered(string $name, \WP_Block_Type $blockType): void
    {
        if (!$this->shouldRun()) {
            return;
        }

        try {
            $this->blockCache->saveBlockType($name, [
                'name' => $blockType->name,
                'title' => $blockType->title,
                'description' => $blockType->description,
                'icon' => $blockType->icon,
                'category' => $blockType->category,
                'is_dynamic' => $blockType->is_dynamic(),
                // ... other fields as needed
            ]);
        } catch (\Exception $e) {
            error_log('Jankx Block Cache: sync failed for ' . $name);
        }
    }

    /**
     * Invalidate cache
     */
    public function invalidate(): void
    {
        try {
            $this->blockCache->invalidate();
        } catch (\Exception $e) {
            // Silent fail
        }
    }

    /**
     * Add admin page
     */
    public function addAdminPage(): void
    {
        add_submenu_page(
            'tools.php',
            'Block Cache',
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

        // Handle actions
        if (isset($_POST['action']) && check_admin_referer('jankx_block_cache')) {
            switch ($_POST['action']) {
                case 'build':
                    $this->blockCache->build();
                    wp_redirect(admin_url('tools.php?page=jankx-block-cache&done=build'));
                    exit;
                case 'flush':
                    $this->blockCache->flush();
                    wp_redirect(admin_url('tools.php?page=jankx-block-cache&done=flush'));
                    exit;
                case 'invalidate':
                    $this->blockCache->invalidate();
                    wp_redirect(admin_url('tools.php?page=jankx-block-cache&done=invalidate'));
                    exit;
            }
        }

        $stats = $this->blockCache->stats();
        ?>
        <div class="wrap">
            <h1>Block Cache</h1>
            <p>Caches Gutenberg block data to reduce MySQL connections on shared hosting.</p>

            <?php if (isset($_GET['done'])): ?>
                <div class="notice notice-success"><p>
                    <?php echo esc_html(ucfirst($_GET['done'])) ?> completed successfully.
                </p></div>
            <?php endif; ?>

            <h2>Cache Status</h2>
            <table class="widefat fixed striped" style="max-width:500px">
                <tr><td>Driver</td><td><?php echo esc_html($stats['driver'] ?? 'unknown') ?></td></tr>
                <tr><td>Valid</td><td><?php echo $stats['is_valid'] ? '✅ Yes' : '❌ No' ?></td></tr>
                <tr><td>Block Types</td><td><?php echo (int) ($stats['block_count'] ?? 0) ?></td></tr>
                <tr><td>Patterns</td><td><?php echo (int) ($stats['pattern_count'] ?? 0) ?></td></tr>
                <tr><td>Categories</td><td><?php echo (int) ($stats['category_count'] ?? 0) ?></td></tr>
                <tr><td>Last Built</td><td><?php echo esc_html($stats['last_build_human'] ?? 'never') ?></td></tr>
                <tr><td>Size</td><td><?php echo size_format($stats['size'] ?? 0) ?></td></tr>
            </table>

            <h2>Actions</h2>
            <form method="post" style="display:inline">
                <?php wp_nonce_field('jankx_block_cache') ?>
                <input type="hidden" name="action" value="build">
                <button class="button button-primary">Rebuild Cache</button>
            </form>
            <form method="post" style="display:inline;margin-left:10px">
                <?php wp_nonce_field('jankx_block_cache') ?>
                <input type="hidden" name="action" value="invalidate">
                <button class="button">Invalidate</button>
            </form>
            <form method="post" style="display:inline;margin-left:10px">
                <?php wp_nonce_field('jankx_block_cache') ?>
                <input type="hidden" name="action" value="flush">
                <button class="button">Flush All</button>
            </form>
        </div>
        <?php
    }

    /**
     * Check if interceptor should run
     */
    private function shouldRun(): bool
    {
        if (defined('WP_CLI') && WP_CLI) {
            return true;
        }

        return is_admin() || wp_doing_ajax() || (defined('REST_REQUEST') && REST_REQUEST);
    }
}
