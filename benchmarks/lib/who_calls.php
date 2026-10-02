<?php
/**
 * Who calls the expensive functions? Uses the full edge table so we can see the
 * real caller of a hotspot instead of trusting cachegrind's file attribution
 * (which is caller-context and drifts when xdebug reuses name ids).
 *
 * Usage: php benchmarks/lib/who_calls.php <cachegrind-file>
 */

declare(strict_types=1);

require_once __DIR__ . '/CachegrindParser.php';

use Jankx\Benchmarks\CachegrindParser;

$file = $argv[1] ?? (__DIR__ . '/../.work/cachegrind_home/' . (glob(__DIR__ . '/../.work/cachegrind_home/*') ?: [''])[0]);
if (!is_file($file)) {
    exit("no cachegrind file: $file\n");
}

$targets = [
    'WP_Scripts->get_highest_fetchpriority_with_dependents',
    'WP_Dependencies->query',
    'WP_Dependencies->recurse_deps',
    'WP_HTML_Tag_Processor->parse_next_attribute',
    'WP_HTML_Tag_Processor->parse_next_tag',
    'WP_Theme_JSON::sanitize',
    'WP_Theme_JSON->merge',
    'get_option',
    'wp_cache_get',
    'WP_Object_Cache->get',
    'wpdb->query',
    'wpdb->get_results',
    'WP_Query->query',
    'WP_Term_Query->query',
    'get_term',
    'apply_filters',
    'file_exists',
];

$parser = (new CachegrindParser())->parseFile($file)->aggregate();
echo 'profile: ' . basename($file) . PHP_EOL;

$edges  = $parser->allEdges();
$agg    = [];
$incl   = [];
foreach ($edges as $e) {
    $callee = (string) $e['callee'];
    if (!in_array($callee, $targets, true)) {
        continue;
    }
    $agg[$callee][(string) $e['caller']]    = ($agg[$callee][(string) $e['caller']] ?? 0) + (int) $e['calls'];
    $incl[$callee][(string) $e['caller']]   = ($incl[$callee][(string) $e['caller']] ?? 0.0)
        + (float) $e['incl_time'] * $parser->timeUnitNs();
}

foreach ($targets as $t) {
    printf("\n### %s\n", $t);
    if (empty($agg[$t])) {
        echo "  (no recorded edges)\n";
        continue;
    }
    arsort($agg[$t]);
    $i = 0;
    foreach ($agg[$t] as $caller => $n) {
        if ($i++ >= 8) {
            break;
        }
        printf(
            "  %9d calls  incl=%9.2f ms  <- %s\n",
            $n,
            ($incl[$t][$caller] ?? 0.0) / 1e6,
            $caller
        );
    }
}