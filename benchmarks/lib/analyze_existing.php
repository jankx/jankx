<?php
/**
 * Ad-hoc cachegrind analysis over already-collected profiles.
 *
 * bench.php's "calls" command re-runs the collector (needs xdebug + a live
 * server). This script reuses the same parser on the existing
 * benchmarks/.work/cachegrind_* files so hot paths can be reviewed offline.
 *
 * Usage: php benchmarks/lib/analyze_existing.php [cachegrind-file ...]
 *        (no args = first file of every .work/cachegrind_* directory)
 */

declare(strict_types=1);

require_once __DIR__ . '/CachegrindParser.php';

use Jankx\Benchmarks\CachegrindParser;

const RESET  = "\033[0m";
const BOLD   = "\033[1m";
const DIMCOL = "\033[2m";
const CYAN   = "\033[36m";

function section(string $s): void
{
    echo PHP_EOL . BOLD . CYAN . $s . RESET . PHP_EOL;
}

$files = $argv;
array_shift($files);

if (!$files) {
    foreach (glob(__DIR__ . '/../.work/cachegrind_*') ?: [] as $dir) {
        $candidates = glob($dir . '/*') ?: [];
        if ($candidates) {
            $files[] = $candidates[0];
        }
    }
}

foreach ($files as $file) {
    if (!is_file($file)) {
        echo "skip (not a file): $file" . PHP_EOL;
        continue;
    }

    printf(
        "\n===== %s (%.1f MB) =====\n",
        basename($file),
        filesize($file) / 1048576
    );

    $t0    = microtime(true);
    $parser = (new CachegrindParser())->parseFile($file)->aggregate();
    $unit  = $parser->timeUnitNs();

    printf(
        "functions=%d  call events=%s  cpu=%.3f s  cost unit=%s ns  (parsed in %ss)\n",
        $parser->functionCount(),
        number_format($parser->totalCalls()),
        $parser->totalTimeNs() / 1e9,
        $unit,
        round(microtime(true) - $t0, 1)
    );

    section('TOP 30 SELF TIME');
    $rank = 0;
    foreach ($parser->topBySelfTime(30) as $name => $f) {
        printf(
            "%2d  %9.2f ms  incl=%9.2f ms  calls=%-8d %s %s[%s]%s\n",
            ++$rank,
            $f['self_time_ns'] / 1e6,
            $f['incl_time_ns'] / 1e6,
            (int) $f['calls_as_callee'],
            $name,
            DIMCOL,
            basename((string) $f['file']),
            RESET
        );
    }

    section('TOP 40 CALL COUNT (amplification)');
    $rank = 0;
    foreach ($parser->topByCallCount(40) as $name => $f) {
        if ((int) $f['calls_as_callee'] === 0) {
            continue;
        }
        printf(
            "%2d  %9d calls  incl=%9.2f ms  %s %s[%s]%s\n",
            ++$rank,
            (int) $f['calls_as_callee'],
            $f['incl_time'] * $unit / 1e6,
            $name,
            DIMCOL,
            basename((string) $f['file']),
            RESET
        );
    }

    /*
     * Query-adjacent functions. Call counts here are what actually turn into
     * SQL round-trips (or cache misses) on the frontend, so this is the section
     * that maps back to "remove unnecessary queries".
     */
    section('DB / QUERY / CACHE RELATED (ranked by self time)');
    $pattern = '/(wpdb|WP_Query|WP_Term_Query|WP_Comment_Query|WP_User_Query'
        . '|WP_Meta_Query|WP_Tax_Query|WP_Post_Terms|WP_Site_Query|WP_Network_Query'
        . '|get_posts|get_terms|get_post_meta|get_metadata|get_option|get_comment_meta'
        . '|update_option|wp_cache_|cache_get|_cache|query_posts|tax_query'
        . '|get_term|get_post_types|get_taxonomies|get_post_stati)/i';

    $rows = [];
    foreach ($parser->allFunctions() as $name => $f) {
        if (!preg_match($pattern, (string) $name)) {
            continue;
        }
        $rows[] = [
            'name'  => $name,
            'calls' => (int) ($f['calls_as_callee'] ?? 0),
            'self'  => (float) ($f['self_time'] ?? 0) * $unit,
            'incl'  => (float) ($f['incl_time'] ?? 0) * $unit,
            'file'  => (string) ($f['file'] ?? ''),
        ];
    }
    usort($rows, static fn($a, $b) => $b['self'] <=> $a['self']);
    $rank = 0;
    foreach (array_slice($rows, 0, 40) as $r) {
        printf(
            "%2d  self=%9.2f ms  incl=%9.2f ms  calls=%-8d %s %s[%s]%s\n",
            ++$rank,
            $r['self'] / 1e6,
            $r['incl'] / 1e6,
            $r['calls'],
            $r['name'],
            DIMCOL,
            basename($r['file']),
            RESET
        );
    }

    printf("\nDB-related functions matched: %d\n", count($rows));
}