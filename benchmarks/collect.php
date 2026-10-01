<?php
/**
 * Jankx benchmark probe (WordPress side).
 *
 * Boots the real WordPress stack and emits a JSON document describing what the
 * request actually cost: database queries, duplicate queries, hook count,
 * registered blocks, autoloaded options, compiled PHP footprint and peak
 * memory. Run it standalone, or let CallProfiler re-run it under
 * `xdebug.mode=profile` to obtain a per-call profile of the same work.
 *
 * Usage:
 *   php benchmarks/collect.php --scenario=boot
 *   php benchmarks/collect.php --scenario=home --iterations=3
 */

declare(strict_types=1);

namespace Jankx\Benchmarks;

// SAVEQUERIES must be defined before wpdb initialises.
if (!defined('SAVEQUERIES')) {
    define('SAVEQUERIES', true);
}
if (!defined('WP_USE_THEMES')) {
    define('WP_USE_THEMES', true);
}

final class Probe
{
    public static float $t0 = 0.0;
    /** @var array<string, float> */
    public static array $stages = [];

    public static function mark(string $label): void
    {
        self::$stages[$label] = (microtime(true) - self::$t0) * 1000.0;
    }

    /**
     * Aggregate the raw $wpdb->queries log.
     *
     * @param  array<int, array> $queries
     * @return array<string, mixed>
     */
    public static function analyseQueries(array $queries): array
    {
        $total = count($queries);
        $time  = 0.0;
        $byTable = [];
        $normalised = [];

        foreach ($queries as $q) {
            $sql = (string) ($q[0] ?? '');
            // wpdb records SAVEQUERIES timers in SECONDS (wpdb::timer_float uses
            // microtime(true)), so normalise to milliseconds here.
            $t   = (float) ($q[1] ?? 0) * 1000.0;
            $time += $t;

            if (preg_match('/\b(?:FROM|JOIN|INTO|UPDATE)\s+`?([a-zA-Z0-9_]+)`?/i', $sql, $m)) {
                $tbl = $m[1];
            } elseif (preg_match('/^\s*(SHOW|DESCRIBE|EXPLAIN|CALL)\b/i', $sql)) {
                $tbl = '(control)';
            } else {
                $tbl = '(other)';
            }
            $byTable[$tbl] = ($byTable[$tbl] ?? 0) + 1;

            // Collapse literals so structurally identical queries collapse together.
            $norm = preg_replace('/\'[^\']*\'/', '?', $sql);
            $norm = preg_replace('/\b\d+\b/', 'N', (string) $norm);
            $norm = preg_replace('/\s+/', ' ', trim((string) $norm));
            $normalised[$norm] = ($normalised[$norm] ?? 0) + 1;
        }

        arsort($byTable);
        arsort($normalised);

        $duplicates = [];
        foreach ($normalised as $sql => $count) {
            if ($count > 1) {
                $duplicates[] = ['count' => $count, 'sql' => $sql];
            }
        }

        $slowest = [];
        $sorted = $queries;
        usort($sorted, static fn($a, $b) => ((float) $b[1]) <=> ((float) $a[1]));
        foreach (array_slice($sorted, 0, 10) as $q) {
            $slowest[] = [
                'ms'  => round((float) ($q[1] ?? 0) * 1000.0, 3),
                'sql' => (string) ($q[0] ?? ''),
            ];
        }

        return [
            'total'          => $total,
            'total_ms'       => round($time, 2),
            'by_table'       => $byTable,
            'duplicate_groups' => count($duplicates),
            'duplicate_extra'  => array_sum(array_column($duplicates, 'count')) - count($duplicates),
            'duplicates'     => array_slice($duplicates, 0, 15),
            'slowest'        => $slowest,
        ];
    }

    /** @return array<string, mixed> */
    public static function hookStats(): array
    {
        global $wp_filter, $wp_actions;

        $hooks     = isset($wp_filter) && is_array($wp_filter) ? count($wp_filter) : 0;
        $callbacks = 0;
        $byHook = [];
        if (isset($wp_filter) && is_array($wp_filter)) {
            foreach ($wp_filter as $name => $obj) {
                $n = 0;
                if (isset($obj->callbacks) && is_array($obj->callbacks)) {
                    foreach ($obj->callbacks as $prio => $cbs) {
                        $n += is_array($cbs) ? count($cbs) : 1;
                    }
                }
                $byHook[$name] = $n;
                $callbacks += $n;
            }
        }
        arsort($byHook);

        return [
            'hooks'                  => $hooks,
            'registered_callbacks'   => $callbacks,
            'do_action_total'        => isset($wp_actions) ? (int) $wp_actions : 0,
            'top_hooks'              => array_slice($byHook, 0, 15, true),
        ];
    }

    /** Bytes of autoloaded options - the classic WP TTFB driver. */
    public static function autoloadStats(): array
    {
        global $wpdb;
        $suppress = $wpdb->suppress_errors();
        $rows = $wpdb->get_results("SELECT option_name, LENGTH(option_value) AS bytes
                                    FROM {$wpdb->options}
                                    WHERE autoload IN ('yes','on','auto','auto-on','auto_incr')
                                    ORDER BY bytes DESC", ARRAY_A);
        $wpdb->suppress_errors($suppress);

        $rows = is_array($rows) ? $rows : [];
        $total = array_sum(array_map('intval', array_column($rows, 'bytes')));
        return [
            'count' => count($rows),
            'bytes' => $total,
            'top'   => array_slice(array_map(
                static fn($r) => ['name' => (string) $r['option_name'], 'bytes' => (int) $r['bytes']],
                $rows
            ), 0, 12),
        ];
    }

    /** @return array<string, mixed> */
    public static function includeStats(): array
    {
        $files = get_included_files();
        $bytes = 0;
        $byRoot = [];
        foreach ($files as $f) {
            $size = @filesize($f);
            if ($size === false) {
                continue;
            }
            $bytes += $size;
            foreach ([
                'jankx'      => '/themes/jankx/',
                'nobitour'   => '/themes/nibitour/',
                'extensions' => '/extensions/',
                'vendor'     => '/vendor/',
                'wp-core'    => '/wp-includes/',
            ] as $label => $needle) {
                if (str_contains(str_replace('\\', '/', $f), $needle)) {
                    $byRoot[$label] = ($byRoot[$label] ?? 0) + 1;
                }
            }
        }
        arsort($byRoot);
        return [
            'count'   => count($files),
            'bytes'   => $bytes,
            'by_root' => $byRoot,
        ];
    }

    /** @return array<string, mixed> */
    public static function blockStats(): array
    {
        // WP_Block_Type_Registry is a class, so function_exists() always fails here
        // and silently reported zero registered blocks. class_exists() is the
        // correct check.
        if (!class_exists('WP_Block_Type_Registry')) {
            return ['registered' => 0, 'server_rendered' => 0, 'dynamic' => 0];
        }

        $registry = \WP_Block_Type_Registry::get_instance();
        $all = $registry->get_all_registered();
        $server = 0;
        $dynamic = 0;
        foreach ($all as $type) {
            if (is_string($type->render_callback)) {
                $server++;
            } else {
                $dynamic++;
            }
        }

        return [
            'registered'      => count($all),
            'server_rendered' => $server,
            'dynamic'         => $dynamic,
        ];
    }

    /** @return array<string, mixed> */
    public static function extensionStats(): array
    {
        $dirs = glob(WP_CONTENT_DIR . '/themes/nibitour/extensions/*', GLOB_ONLYDIR) ?: [];
        $out = [];
        foreach ($dirs as $d) {
            $manifest = $d . '/manifest.json';
            $name = basename($d);
            $autoloadBytes = 0;
            $autoloadFiles = 0;
            foreach (glob($d . '/vendor/composer/{ClassLoader,InstalledVersions}.php', GLOB_BRACE) ?: [] as $f) {
                $autoloadBytes += (int) @filesize($f);
                $autoloadFiles++;
            }
            $out[$name] = [
                'manifest'          => is_file($manifest),
                'autoload_bytes'    => $autoloadBytes,
                'autoload_files'    => $autoloadFiles,
            ];
        }
        ksort($out);
        return $out;
    }

    public static function emit(array $payload): void
    {
        // Marker makes the JSON easy to slice out of mixed CLI output.
        echo "\n===JANKX-BENCHMARK-JSON===\n";
        echo json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_PARTIAL_OUTPUT_ON_ERROR);
        echo "\n===END-JANKX-BENCHMARK-JSON===\n";
    }
}

// ---------------------------------------------------------------------------
// Boot
// ---------------------------------------------------------------------------

$opts = getopt('', ['scenario::', 'iterations::', 'no-emit']);
$scenario    = (string) ($opts['scenario'] ?? 'boot');
$iterations  = max(1, (int) ($opts['iterations'] ?? 1));

// A browser-like request context must exist BEFORE WordPress loads: plugins
// such as Polylang read $_SERVER during plugin load, before any hook we could
// hang this off.
$isRenderScenario = in_array($scenario, ['home', 'page'], true);
if ($isRenderScenario) {
    $host = (string) (getenv('BENCH_HOST') ?: 'nibitour.localhost');
    $uri  = (string) (getenv('BENCH_URI') ?: '/');
    $_SERVER['REQUEST_METHOD']    = 'GET';
    $_SERVER['REQUEST_URI']       = $uri;
    $_SERVER['HTTP_HOST']         = $host;
    $_SERVER['SERVER_NAME']       = $host;
    $_SERVER['SERVER_PORT']       = '80';
    $_SERVER['SCRIPT_NAME']       = '/index.php';
    $_SERVER['PHP_SELF']          = '/index.php';
    $_SERVER['REMOTE_ADDR']       = '127.0.0.1';
    $_SERVER['HTTPS']             = '';
    $_GET    = [];
    $_REQUEST = [];
}

$abspathGuess = dirname(__DIR__, 4) . '/';           // themes/jankx -> WP root
$wpLoad = $abspathGuess . 'wp-load.php';
if (!is_file($wpLoad)) {
    fwrite(STDERR, "wp-load.php not found at {$wpLoad}\n");
    exit(1);
}

Probe::$t0 = microtime(true);
require_once $wpLoad;
Probe::mark('wp_loaded');

// Simulate a browser request when asked to render.
if ($isRenderScenario) {
    // Server context was prepared above, before wp-load.
    if (function_exists('wp')) {
        wp();
    }
    Probe::mark('query_parsed');

    if (defined('ABSPATH')) {
        ob_start();
        $loader = ABSPATH . 'wp-blog-header.php';
        // Render the resolved front template the way a real request would.
        require_once ABSPATH . 'wp-includes/template-loader.php';
        $html = ob_get_clean();
        Probe::mark('rendered');
        $htmlBytes = strlen((string) $html);
    } else {
        $htmlBytes = 0;
    }
} else {
    $htmlBytes = 0;
}

global $wpdb;

$queries = ($wpdb && isset($wpdb->queries) && is_array($wpdb->queries)) ? $wpdb->queries : [];

$payload = [
    'scenario'    => $scenario,
    'iterations'  => $iterations,
    'stages_ms'   => Probe::$stages,
    'total_ms'    => round((microtime(true) - Probe::$t0) * 1000.0, 2),
    'html_bytes'  => $htmlBytes,
    'queries'     => Probe::analyseQueries($queries),
    'hooks'       => Probe::hookStats(),
    'autoload'    => Probe::autoloadStats(),
    'includes'    => Probe::includeStats(),
    'blocks'      => Probe::blockStats(),
    'extensions'  => Probe::extensionStats(),
    'memory'      => [
        'peak_bytes'  => memory_get_peak_usage(true),
        'peak_real'   => memory_get_peak_usage(false),
        'current'     => memory_get_usage(true),
    ],
    'sapi'        => PHP_SAPI,
    'xdebug'      => extension_loaded('xdebug') ? phpversion('xdebug') : null,
    'php'         => PHP_VERSION,
];

if (empty($opts['no-emit'])) {
    Probe::emit($payload);
}