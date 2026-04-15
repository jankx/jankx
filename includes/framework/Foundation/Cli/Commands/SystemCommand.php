<?php

namespace Jankx\Foundation\Cli\Commands;

use WP_CLI;
use WP_CLI_Command;
use Jankx\Foundation\Application;

/**
 * Jankx System Management Commands
 *
 * Handles system-level operations for the Jankx Framework including
 * environment diagnostics, maintenance mode, and system health checks.
 *
 * ## EXAMPLES
 *
 *     wp jankx system status
 *     wp jankx system health
 *     wp jankx system maintenance --enable
 *     wp jankx system optimize
 *
 * @package Jankx\Foundation\Cli\Commands
 * @since 2.1.0
 */
class SystemCommand extends WP_CLI_Command
{
    /**
     * Display full system status for Jankx framework.
     *
     * ## EXAMPLES
     *
     *     wp jankx system status
     *
     * @when after_wp_load
     */
    public function status()
    {
        WP_CLI::log('');
        WP_CLI::log('╔══════════════════════════════════════════╗');
        WP_CLI::log('║         Jankx Framework — System Status   ║');
        WP_CLI::log('╚══════════════════════════════════════════╝');
        WP_CLI::log('');

        // Theme info
        $theme = wp_get_theme();
        WP_CLI::log('▸ Theme');
        WP_CLI::log(sprintf('  Name      : %s', $theme->get('Name')));
        WP_CLI::log(sprintf('  Version   : %s', $theme->get('Version')));
        WP_CLI::log(sprintf('  TextDomain: %s', $theme->get('TextDomain')));
        WP_CLI::log(sprintf('  Template  : %s', get_template_directory()));
        WP_CLI::log(sprintf('  Stylesheet: %s', get_stylesheet_directory()));
        WP_CLI::log('');

        // PHP & WordPress environment
        WP_CLI::log('▸ Environment');
        WP_CLI::log(sprintf('  PHP        : %s', PHP_VERSION));
        WP_CLI::log(sprintf('  WordPress  : %s', get_bloginfo('version')));
        WP_CLI::log(sprintf('  WP_DEBUG   : %s', defined('WP_DEBUG') && WP_DEBUG ? 'true' : 'false'));
        WP_CLI::log(sprintf('  Memory     : %s / %s', size_format(memory_get_usage(true)), ini_get('memory_limit')));
        WP_CLI::log('');

        // Framework components status
        $this->showComponentsStatus();

        // Registered extensions
        $this->showExtensionsStatus();
    }

    /**
     * Run a comprehensive health check on the Jankx framework.
     *
     * ## OPTIONS
     *
     * [--format=<format>]
     * : Output format (table, json, yaml). Default: table
     *
     * ## EXAMPLES
     *
     *     wp jankx system health
     *     wp jankx system health --format=json
     *
     * @when after_wp_load
     */
    public function health($args, $assoc_args)
    {
        $format = $assoc_args['format'] ?? 'table';

        WP_CLI::log('Running Jankx health checks...');
        WP_CLI::log('');

        $checks = $this->runHealthChecks();

        if ($format === 'json') {
            WP_CLI::log(json_encode($checks, JSON_PRETTY_PRINT));
            return;
        }

        // Table format
        $pass = 0;
        $fail = 0;
        $warn = 0;

        $items = [];
        foreach ($checks as $check) {
            $icon = $check['status'] === 'pass' ? '✓' : ($check['status'] === 'warn' ? '!' : '✗');
            $items[] = [
                'Status'  => $icon . ' ' . strtoupper($check['status']),
                'Check'   => $check['label'],
                'Detail'  => $check['detail'],
            ];
            if ($check['status'] === 'pass') {
                $pass++;
            } elseif ($check['status'] === 'warn') {
                $warn++;
            } else {
                $fail++;
            }
        }

        WP_CLI\Utils\format_items('table', $items, ['Status', 'Check', 'Detail']);
        WP_CLI::log('');
        WP_CLI::log(sprintf('Result: %d passed, %d warnings, %d failed', $pass, $warn, $fail));

        if ($fail > 0) {
            WP_CLI::warning('Some health checks failed. Review details above.');
        } elseif ($warn > 0) {
            WP_CLI::log('Health check completed with warnings.');
        } else {
            WP_CLI::success('All health checks passed!');
        }
    }

    /**
     * Enable or disable maintenance mode.
     *
     * ## OPTIONS
     *
     * [--enable]
     * : Enable maintenance mode
     *
     * [--disable]
     * : Disable maintenance mode
     *
     * ## EXAMPLES
     *
     *     wp jankx system maintenance --enable
     *     wp jankx system maintenance --disable
     *
     * @when after_wp_load
     */
    public function maintenance($args, $assoc_args)
    {
        $enable  = isset($assoc_args['enable']);
        $disable = isset($assoc_args['disable']);

        if (!$enable && !$disable) {
            $current = get_option('jankx_maintenance_mode', false);
            WP_CLI::log('Maintenance mode: ' . ($current ? 'ENABLED' : 'DISABLED'));
            return;
        }

        if ($enable && $disable) {
            WP_CLI::error('Cannot use --enable and --disable at the same time.');
        }

        if ($enable) {
            update_option('jankx_maintenance_mode', true);
            update_option('jankx_maintenance_started_at', current_time('mysql'));
            WP_CLI::success('Maintenance mode ENABLED.');
        } else {
            delete_option('jankx_maintenance_mode');
            delete_option('jankx_maintenance_started_at');
            WP_CLI::success('Maintenance mode DISABLED.');
        }
    }

    /**
     * Run performance optimizations (flush rewrite rules, transients, etc.).
     *
     * ## EXAMPLES
     *
     *     wp jankx system optimize
     *
     * @when after_wp_load
     */
    public function optimize()
    {
        WP_CLI::log('Running Jankx system optimizations...');

        // Flush rewrite rules
        flush_rewrite_rules(true);
        WP_CLI::log('  ✓ Rewrite rules flushed');

        // Delete expired transients
        $deleted = $this->deleteExpiredTransients();
        WP_CLI::log(sprintf('  ✓ Deleted %d expired transient(s)', $deleted));

        // Clear object cache
        wp_cache_flush();
        WP_CLI::log('  ✓ Object cache flushed');

        // Clear Jankx-specific caches
        $jankxGroups = ['jankx_config', 'jankx_blocks', 'jankx_widgets', 'jankx_users', 'jankx_font_icons'];
        foreach ($jankxGroups as $group) {
            wp_cache_flush_group($group);
        }
        WP_CLI::log('  ✓ Jankx caches cleared');

        WP_CLI::success('System optimized successfully!');
    }

    /**
     * Display all registered Jankx extensions.
     *
     * ## EXAMPLES
     *
     *     wp jankx system extensions
     *
     * @when after_wp_load
     */
    public function extensions()
    {
        $this->showExtensionsStatus();
    }

    /**
     * Display registered service providers.
     *
     * ## EXAMPLES
     *
     *     wp jankx system providers
     *
     * @when after_wp_load
     */
    public function providers()
    {
        try {
            $app       = Application::getInstance();
            $providers = $app->getLoadedProviders();

            if (empty($providers)) {
                WP_CLI::warning('No providers registered or provider list unavailable.');
                return;
            }

            $items = [];
            foreach ($providers as $class => $booted) {
                $short = class_basename($class);
                $items[] = [
                    'Provider' => $short,
                    'Class'    => $class,
                    'Booted'   => $booted ? 'Yes' : 'No',
                ];
            }

            WP_CLI\Utils\format_items('table', $items, ['Provider', 'Class', 'Booted']);
        } catch (\Exception $e) {
            WP_CLI::warning('Could not retrieve providers: ' . $e->getMessage());
        }
    }

    // ─── Private helpers ─────────────────────────────────────────────────────

    /**
     * Display key framework component availability.
     */
    protected function showComponentsStatus()
    {
        $components = [
            'Application'      => 'Jankx\Foundation\Application',
            'Config'           => 'Jankx\Config\Repository',
            'Cache Service'    => 'Jankx\Services\CacheService',
            'Layout Manager'   => 'Jankx\Layouts\LayoutManager',
            'Template Engine'  => 'Jankx\Support\TemplateEngine\TemplateEngine',
        ];

        WP_CLI::log('▸ Framework Components');
        foreach ($components as $name => $class) {
            $status = class_exists($class) ? '✓ Available' : '✗ Missing';
            WP_CLI::log(sprintf('  %-20s: %s', $name, $status));
        }
        WP_CLI::log('');
    }

    /**
     * Display registered extensions.
     */
    protected function showExtensionsStatus()
    {
        $extsDir = get_template_directory() . '/extensions';
        WP_CLI::log('▸ Extensions');

        if (!is_dir($extsDir)) {
            WP_CLI::log('  No extensions directory found.');
            WP_CLI::log('');
            return;
        }

        $dirs = glob($extsDir . '/*', GLOB_ONLYDIR);
        if (empty($dirs)) {
            WP_CLI::log('  No extensions installed.');
        } else {
            foreach ($dirs as $dir) {
                $name     = basename($dir);
                $manifest = $dir . '/extension.json';
                $version  = 'n/a';
                if (file_exists($manifest)) {
                    $data    = json_decode(file_get_contents($manifest), true);
                    $version = $data['version'] ?? 'n/a';
                }
                WP_CLI::log(sprintf('  %-30s v%s', $name, $version));
            }
        }
        WP_CLI::log('');
    }

    /**
     * Run all health checks and return results.
     *
     * @return array
     */
    protected function runHealthChecks(): array
    {
        $checks = [];

        // PHP version
        $checks[] = [
            'label'  => 'PHP Version >= 7.4',
            'status' => version_compare(PHP_VERSION, '7.4', '>=') ? 'pass' : 'fail',
            'detail' => PHP_VERSION,
        ];

        // WordPress version
        $wpVersion  = get_bloginfo('version');
        $checks[] = [
            'label'  => 'WordPress Version >= 6.0',
            'status' => version_compare($wpVersion, '6.0', '>=') ? 'pass' : 'warn',
            'detail' => $wpVersion,
        ];

        // WP-CLI
        $checks[] = [
            'label'  => 'WP-CLI Available',
            'status' => defined('WP_CLI') ? 'pass' : 'fail',
            'detail' => defined('WP_CLI') ? 'Yes' : 'No',
        ];

        // Theme directory writable
        $templateDir = get_template_directory();
        $checks[] = [
            'label'  => 'Theme directory writable',
            'status' => is_writable($templateDir) ? 'pass' : 'warn',
            'detail' => $templateDir,
        ];

        // Jankx Application bootstrapped
        try {
            $app     = Application::getInstance();
            $booted  = $app->isBooted();
            $checks[] = [
                'label'  => 'Jankx Application booted',
                'status' => $booted ? 'pass' : 'warn',
                'detail' => $booted ? 'Yes' : 'No',
            ];
        } catch (\Exception $e) {
            $checks[] = [
                'label'  => 'Jankx Application booted',
                'status' => 'fail',
                'detail' => $e->getMessage(),
            ];
        }

        // Memory usage
        $limit   = $this->parseMemoryLimit(ini_get('memory_limit'));
        $usage   = memory_get_usage(true);
        $percent = $limit > 0 ? round(($usage / $limit) * 100, 1) : 0;
        $checks[] = [
            'label'  => 'Memory usage < 80%',
            'status' => $percent < 80 ? 'pass' : 'warn',
            'detail' => sprintf('%s / %s (%s%%)', size_format($usage), size_format($limit), $percent),
        ];

        return $checks;
    }

    /**
     * Delete expired transients from the database.
     *
     * @return int Number of deleted transients
     */
    protected function deleteExpiredTransients(): int
    {
        global $wpdb;

        $now     = time();
        $deleted = $wpdb->query(
            $wpdb->prepare(
                "DELETE a, b FROM {$wpdb->options} a
                 LEFT JOIN {$wpdb->options} b ON b.option_name = REPLACE(a.option_name, '_timeout_', '_')
                 WHERE a.option_name LIKE %s
                 AND a.option_value < %d",
                $wpdb->esc_like('_transient_timeout_') . '%',
                $now
            )
        );

        return (int) $deleted;
    }

    /**
     * Parse a PHP memory limit string to bytes.
     *
     * @param string $limit
     * @return int
     */
    protected function parseMemoryLimit(string $limit): int
    {
        $limit = trim($limit);
        $last  = strtolower($limit[strlen($limit) - 1]);
        $value = (int) $limit;

        switch ($last) {
            case 'g':
                $value *= 1024;
                // fall through
            case 'm':
                $value *= 1024;
                // fall through
            case 'k':
                $value *= 1024;
        }

        return $value;
    }
}
