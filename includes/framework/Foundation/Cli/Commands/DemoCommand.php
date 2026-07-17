<?php

namespace Jankx\Foundation\Cli\Commands;

use WP_CLI;
use WP_CLI_Command;

/**
 * Jankx Demo Import Commands
 *
 * Import and manage complete demo content packages for Jankx themes.
 * A "demo" is a curated package containing XML content, widget data,
 * customizer settings, and menu assignments — ready to use out of the box.
 *
 * ## SYNOPSIS
 *
 *     wp jankx demo <command> [--options]
 *
 * ## SUBCOMMANDS
 *
 *     list      List all available demos
 *     import    Import a specific demo
 *     reset     Reset (remove) demo data from the site
 *
 * @package Jankx\Foundation\Cli\Commands
 * @since 2.1.0
 */
class DemoCommand extends WP_CLI_Command
{
    /**
     * Manifest path relative to the theme root.
     */
    protected const MANIFEST_FILE = 'demo/manifest.json';

    // ─────────────────────────────────────────────────────────────────────────

    /**
     * List all available demo packages.
     *
     * ## OPTIONS
     *
     * [--format=<format>]
     * : Output format: table, json, yaml, csv. Default: table.
     *
     * ## EXAMPLES
     *
     *     wp jankx demo list
     *     wp jankx demo list --format=json
     *
     * @when after_wp_load
     */
    public function list($args, $assoc_args)
    {
        $format = $assoc_args['format'] ?? 'table';
        $demos  = $this->loadManifest();

        if (empty($demos)) {
            WP_CLI::warning('No demo packages found. Place a demo/manifest.json in your theme directory.');
            return;
        }

        $items = [];
        $active = get_option('jankx_active_demo', '');

        foreach ($demos as $id => $demo) {
            $items[] = [
                'ID'          => $id,
                'Name'        => $demo['name'] ?? $id,
                'Description' => $demo['description'] ?? '',
                'Version'     => $demo['version']     ?? '1.0.0',
                'Active'      => $active === $id ? '✓' : '',
            ];
        }

        WP_CLI\Utils\format_items($format, $items, ['ID', 'Name', 'Version', 'Active', 'Description']);
    }

    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Import a demo package into the current WordPress installation.
     *
     * The import process:
     *   1. Validate demo package exists
     *   2. Import XML content (posts, pages, taxonomies) via WP Importer
     *   3. Import widget data
     *   4. Import customizer settings
     *   5. Assign menus to theme locations
     *   6. Set demo options (front/blog page, etc.)
     *
     * ## OPTIONS
     *
     * <demo>
     * : Demo ID to import (see `wp jankx demo list`).
     *
     * [--xml-only]
     * : Only import XML content; skip widgets, customizer and menus.
     *
     * [--skip-images]
     * : Skip downloading remote images (faster, but no thumbnails).
     *
     * [--overwrite]
     * : Re-import even if this demo was previously imported.
     *
     * [--yes]
     * : Skip confirmation prompt.
     *
     * ## EXAMPLES
     *
     *     wp jankx demo import gaming-portal
     *     wp jankx demo import gaming-portal --skip-images
     *     wp jankx demo import blog-magazine --xml-only
     *
     * @when after_wp_load
     */
    public function import($args, $assoc_args)
    {
        if (empty($args)) {
            WP_CLI::error('Please specify a demo ID. Run `wp jankx demo list` to see available demos.');
        }

        $demoId    = $args[0];
        $xmlOnly   = isset($assoc_args['xml-only']);
        $skipImages = isset($assoc_args['skip-images']);
        $overwrite  = isset($assoc_args['overwrite']);
        $yes       = isset($assoc_args['yes']);

        // Validate demo exists
        $demos = $this->loadManifest();
        if (!isset($demos[$demoId])) {
            WP_CLI::error(sprintf(
                'Demo "%s" not found. Run `wp jankx demo list` to see available demos.',
                $demoId
            ));
        }

        $demo    = $demos[$demoId];
        $demoDir = $this->getDemoPath($demoId);

        // Check if already imported
        $activeDemo = get_option('jankx_active_demo', '');
        if ($activeDemo === $demoId && !$overwrite) {
            WP_CLI::warning(sprintf('Demo "%s" is already active. Use --overwrite to re-import.', $demoId));
            return;
        }

        // Confirm
        if (!$yes) {
            WP_CLI::confirm(sprintf(
                'Import demo "%s"? This will add content to your WordPress installation.',
                $demo['name'] ?? $demoId
            ));
        }

        WP_CLI::log('');
        WP_CLI::log(sprintf('Importing demo: %s', $demo['name'] ?? $demoId));
        WP_CLI::log(str_repeat('─', 50));

        $steps = 0;
        $errors = [];

        // ── Step 1: XML content ───────────────────────────────────────────
        $xmlFile = $demoDir . '/content.xml';
        if (file_exists($xmlFile)) {
            WP_CLI::log('');
            WP_CLI::log('[1/5] Importing XML content...');
            $result = $this->importXml($xmlFile, $skipImages);
            if ($result['success']) {
                WP_CLI::log(sprintf('  ✓ Imported: %d posts, %d terms, %d users',
                    $result['posts'] ?? 0,
                    $result['terms'] ?? 0,
                    $result['users'] ?? 0
                ));
                $steps++;
            } else {
                $errors[] = 'XML import: ' . $result['error'];
                WP_CLI::warning('  ✗ XML import failed: ' . $result['error']);
            }
        } else {
            WP_CLI::log('[1/5] No content.xml found — skipping XML import.');
        }

        if (!$xmlOnly) {
            // ── Step 2: Widgets ───────────────────────────────────────────
            $widgetsFile = $demoDir . '/widgets.json';
            WP_CLI::log('');
            WP_CLI::log('[2/5] Importing widgets...');
            if (file_exists($widgetsFile)) {
                $result = $this->importWidgets($widgetsFile);
                if ($result) {
                    WP_CLI::log('  ✓ Widgets imported.');
                    $steps++;
                } else {
                    WP_CLI::warning('  ✗ Widget import failed.');
                    $errors[] = 'Widget import failed.';
                }
            } else {
                WP_CLI::log('  No widgets.json found — skipping.');
            }

            // ── Step 3: Customizer ────────────────────────────────────────
            $customizerFile = $demoDir . '/customizer.json';
            WP_CLI::log('');
            WP_CLI::log('[3/5] Importing customizer settings...');
            if (file_exists($customizerFile)) {
                $result = $this->importCustomizer($customizerFile);
                if ($result) {
                    WP_CLI::log('  ✓ Customizer settings applied.');
                    $steps++;
                } else {
                    WP_CLI::warning('  ✗ Customizer import failed.');
                    $errors[] = 'Customizer import failed.';
                }
            } else {
                WP_CLI::log('  No customizer.json found — skipping.');
            }

            // ── Step 4: Menus ─────────────────────────────────────────────
            $menusFile = $demoDir . '/menus.json';
            WP_CLI::log('');
            WP_CLI::log('[4/5] Assigning menus...');
            if (file_exists($menusFile)) {
                $result = $this->importMenus($menusFile);
                if ($result) {
                    WP_CLI::log('  ✓ Menus assigned.');
                    $steps++;
                } else {
                    WP_CLI::warning('  ✗ Menu assignment failed.');
                    $errors[] = 'Menu assignment failed.';
                }
            } else {
                WP_CLI::log('  No menus.json found — skipping.');
            }

            // ── Step 5: Options ───────────────────────────────────────────
            $optionsFile = $demoDir . '/options.json';
            WP_CLI::log('');
            WP_CLI::log('[5/5] Applying site options...');
            if (file_exists($optionsFile)) {
                $result = $this->importOptions($optionsFile);
                if ($result) {
                    WP_CLI::log('  ✓ Options applied.');
                    $steps++;
                } else {
                    WP_CLI::warning('  ✗ Options import failed.');
                    $errors[] = 'Options import failed.';
                }
            } else {
                WP_CLI::log('  No options.json found — skipping.');
            }
        }

        // Mark demo as active
        update_option('jankx_active_demo', $demoId);
        update_option('jankx_demo_imported_at', current_time('mysql'));

        WP_CLI::log('');
        WP_CLI::log(str_repeat('─', 50));

        if (empty($errors)) {
            WP_CLI::success(sprintf('Demo "%s" imported successfully!', $demo['name'] ?? $demoId));
        } else {
            WP_CLI::warning(sprintf(
                'Demo imported with %d issue(s): %s',
                count($errors),
                implode('; ', $errors)
            ));
        }

        $this->showPostImportTips($demo);
    }

    // ─────────────────────────────────────────────────────────────────────────

    /**
     * Reset (remove) demo content from the site.
     *
     * ## OPTIONS
     *
     * [<demo>]
     * : Demo ID to reset. Defaults to the currently active demo.
     *
     * [--yes]
     * : Skip confirmation prompt.
     *
     * ## EXAMPLES
     *
     *     wp jankx demo reset
     *     wp jankx demo reset gaming-portal --yes
     *
     * @when after_wp_load
     */
    public function reset($args, $assoc_args)
    {
        $demoId = $args[0] ?? get_option('jankx_active_demo', '');

        if (empty($demoId)) {
            WP_CLI::error('No active demo found. Specify a demo ID: wp jankx demo reset <demo>');
        }

        $demos = $this->loadManifest();
        $demo  = $demos[$demoId] ?? ['name' => $demoId];
        $yes   = isset($assoc_args['yes']);

        if (!$yes) {
            WP_CLI::confirm(sprintf(
                'Remove demo "%s" content? This cannot be undone.',
                $demo['name']
            ));
        }

        // Remove posts marked with the demo meta key
        $this->deleteDemoPosts($demoId);

        // Clear options
        delete_option('jankx_active_demo');
        delete_option('jankx_demo_imported_at');

        WP_CLI::success(sprintf('Demo "%s" data removed.', $demo['name']));
    }

    // ─── Private helpers ─────────────────────────────────────────────────────

    /**
     * Load the demos/manifest.json file.
     *
     * @return array
     */
    protected function loadManifest(): array
    {
        // Allow extensions/child themes to register demos via filter
        $demos = apply_filters('jankx/demo/available', []);

        $manifestPath = get_template_directory() . '/' . self::MANIFEST_FILE;
        if (file_exists($manifestPath)) {
            $data = json_decode(file_get_contents($manifestPath), true);
            if (is_array($data)) {
                $demos = array_merge($demos, $data);
            }
        }

        // Also check child theme
        $childManifest = get_stylesheet_directory() . '/' . self::MANIFEST_FILE;
        if (is_file($childManifest) && realpath($childManifest) !== realpath($manifestPath)) {
            $childData = json_decode(file_get_contents($childManifest), true);
            if (is_array($childData)) {
                $demos = array_merge($demos, $childData);
            }
        }

        return $demos;
    }

    /**
     * Get the filesystem path for a demo package.
     *
     * @param string $demoId
     * @return string
     */
    protected function getDemoPath(string $demoId): string
    {
        // Child theme demo takes priority
        $childPath = get_stylesheet_directory() . '/demo/demos/' . $demoId;
        if (is_dir($childPath)) {
            return $childPath;
        }

        return get_template_directory() . '/demo/demos/' . $demoId;
    }

    /**
     * Import XML file via WordPress Importer.
     *
     * @param string $xmlFile
     * @param bool   $skipImages
     * @return array{success: bool, posts: int, terms: int, users: int, error: string}
     */
    protected function importXml(string $xmlFile, bool $skipImages): array
    {
        // Require WordPress Importer
        if (!class_exists('WP_Import')) {
            $importerPath = ABSPATH . 'wp-admin/includes/import.php';
            if (file_exists($importerPath)) {
                require_once $importerPath;
            }

            // Try to find WordPress Importer plugin
            $importerPlugin = WP_PLUGIN_DIR . '/wordpress-importer/wordpress-importer.php';
            if (!file_exists($importerPlugin)) {
                return [
                    'success' => false,
                    'posts'   => 0,
                    'terms'   => 0,
                    'users'   => 0,
                    'error'   => 'WordPress Importer plugin not found. Install it: wp plugin install wordpress-importer --activate',
                ];
            }

            require_once $importerPlugin;
        }

        try {
            // Use WP-CLI's built-in import via sub-command for reliability
            $cmd = sprintf(
                'wp import %s --authors=create %s 2>&1',
                escapeshellarg($xmlFile),
                $skipImages ? '--skip="image_resize"' : ''
            );

            $output = [];
            $code   = 0;
            exec($cmd, $output, $code);

            // Parse output for counts (heuristic)
            $outputStr = implode("\n", $output);

            return [
                'success' => $code === 0,
                'posts'   => substr_count($outputStr, 'post'),
                'terms'   => substr_count($outputStr, 'term'),
                'users'   => substr_count($outputStr, 'user'),
                'error'   => $code !== 0 ? implode('; ', array_slice($output, -3)) : '',
            ];
        } catch (\Throwable $e) {
            return [
                'success' => false, 'posts' => 0, 'terms' => 0, 'users' => 0,
                'error'   => $e->getMessage(),
            ];
        }
    }

    /**
     * Import widgets from a JSON file.
     *
     * @param string $file
     * @return bool
     */
    protected function importWidgets(string $file): bool
    {
        try {
            $data = json_decode(file_get_contents($file), true);
            if (!is_array($data)) {
                return false;
            }

            foreach ($data as $sidebar => $widgets) {
                if (!is_array($widgets)) {
                    continue;
                }
                // Store widget data in WordPress options
                update_option('sidebars_widgets', array_merge(
                    get_option('sidebars_widgets', []),
                    [$sidebar => array_keys($widgets)]
                ));

                foreach ($widgets as $widgetId => $widgetData) {
                    $parts = explode('-', $widgetId);
                    $number = array_pop($parts);
                    $type   = implode('-', $parts);
                    $option = get_option('widget_' . $type, []);
                    $option[$number] = $widgetData;
                    update_option('widget_' . $type, $option);
                }
            }

            return true;
        } catch (\Throwable $e) {
            return false;
        }
    }

    /**
     * Import customizer settings from a JSON file.
     *
     * @param string $file
     * @return bool
     */
    protected function importCustomizer(string $file): bool
    {
        try {
            $data = json_decode(file_get_contents($file), true);
            if (!is_array($data)) {
                return false;
            }

            $mods = $data['theme_mods'] ?? $data;

            // Apply each setting
            foreach ($mods as $key => $value) {
                set_theme_mod($key, $value);
            }

            return true;
        } catch (\Throwable $e) {
            return false;
        }
    }

    /**
     * Import menu assignments from a JSON file.
     *
     * @param string $file
     * @return bool
     */
    protected function importMenus(string $file): bool
    {
        try {
            $data = json_decode(file_get_contents($file), true);
            if (!is_array($data)) {
                return false;
            }

            $locations = [];
            foreach ($data as $location => $menuName) {
                $menu = wp_get_nav_menu_object($menuName);
                if ($menu) {
                    $locations[$location] = $menu->term_id;
                }
            }

            if (!empty($locations)) {
                set_theme_mod('nav_menu_locations', $locations);
            }

            return true;
        } catch (\Throwable $e) {
            return false;
        }
    }

    /**
     * Apply WordPress site options from a JSON file.
     *
     * @param string $file
     * @return bool
     */
    protected function importOptions(string $file): bool
    {
        try {
            $data = json_decode(file_get_contents($file), true);
            if (!is_array($data)) {
                return false;
            }

            // Safe list of options we allow overwriting
            $allowedOptions = [
                'blogname', 'blogdescription',
                'show_on_front', 'page_on_front', 'page_for_posts',
                'posts_per_page', 'date_format', 'time_format',
            ];

            foreach ($data as $key => $value) {
                if (in_array($key, $allowedOptions, true)) {
                    // Resolve page slugs to IDs
                    if (in_array($key, ['page_on_front', 'page_for_posts'], true) && is_string($value)) {
                        $page = get_page_by_path($value);
                        if ($page) {
                            $value = $page->ID;
                        }
                    }
                    update_option($key, $value);
                }
            }

            return true;
        } catch (\Throwable $e) {
            return false;
        }
    }

    /**
     * Delete posts that were created as part of a demo import.
     *
     * @param string $demoId
     * @return void
     */
    protected function deleteDemoPosts(string $demoId): void
    {
        $posts = get_posts([
            'meta_key'    => '_jankx_demo_id',
            'meta_value'  => $demoId,
            'post_status' => 'any',
            'numberposts' => -1,
            'post_type'   => 'any',
        ]);

        $count = 0;
        foreach ($posts as $post) {
            wp_delete_post($post->ID, true);
            $count++;
        }

        WP_CLI::log(sprintf('  Deleted %d demo post(s).', $count));
    }

    /**
     * Show helpful next steps after a successful import.
     *
     * @param array $demo
     * @return void
     */
    protected function showPostImportTips(array $demo): void
    {
        WP_CLI::log('');
        WP_CLI::log('Next steps:');

        if (!empty($demo['next_steps'])) {
            foreach ($demo['next_steps'] as $tip) {
                WP_CLI::log('  • ' . $tip);
            }
        } else {
            WP_CLI::log('  • Visit your site: ' . home_url('/'));
            WP_CLI::log('  • Customize via Appearance → Customize');
            WP_CLI::log('  • Clear caches: wp jankx cache clear');
        }
    }
}
