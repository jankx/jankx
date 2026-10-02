<?php
/**
 * SQL duplicate finder: renders a frontend request with SAVEQUERIES and reports
 * every structurally-duplicated query together with the theme/plugin frames
 * that issued it.
 *
 * Recent WordPress logs $wpdb->queries rows as
 *   [0] SQL
 *   [1] elapsed seconds (float)
 *   [2] compressed call chain as a string, e.g. "do_blocks, render_block, ..."
 *   [3] start time
 * so attribution is done by parsing that string rather than a backtrace array.
 *
 * Usage:
 *   php benchmarks/lib/find_duplicate_queries.php
 *   JANKX_DEBUG_ROW=120 php benchmarks/lib/find_duplicate_queries.php
 */

declare(strict_types=1);

if (!defined('SAVEQUERIES')) {
    define('SAVEQUERIES', true);
}

// A browser-like request context must exist before WordPress loads: plugins
// such as Polylang read $_SERVER during plugin load.
$dir = __DIR__;
while ($dir !== dirname($dir)) {
    if (is_file($dir . '/wp-load.php')) {
        break;
    }
    $dir = dirname($dir);
}
if (!is_file($dir . '/wp-load.php')) {
    fwrite(STDERR, "wp-load.php not found above " . __DIR__ . "\n");
    exit(1);
}

$_SERVER['HTTP_HOST']      = 'nibitour.localhost';
$_SERVER['REQUEST_URI']    = (string) (getenv('BENCH_URI') ?: '/');
$_SERVER['REQUEST_METHOD'] = 'GET';
$_SERVER['SERVER_NAME']    = 'nibitour.localhost';
$_SERVER['SERVER_PORT']    = '80';
$_SERVER['SCRIPT_NAME']    = '/index.php';
$_SERVER['PHP_SELF']       = '/index.php';
$_SERVER['REMOTE_ADDR']    = '127.0.0.1';
$_SERVER['HTTPS']          = '';
$_GET    = [];
$_REQUEST = [];

require_once $dir . '/wp-load.php';

if (function_exists('wp')) {
    wp();
}

// wp-blog-header.php normally defines this before handing over to the template
// loader; without it template-loader.php returns immediately and the page is
// never rendered, which silently yields a tiny query count.
if (!defined('WP_USE_THEMES')) {
    define('WP_USE_THEMES', true);
}

ob_start();
require_once ABSPATH . 'wp-includes/template-loader.php';
$html = (string) ob_get_clean();

global $wpdb;
$logged = $wpdb->queries ?? [];

printf("rendered %s bytes, %d queries\n", number_format(strlen($html)), count($logged));

$debugRow = getenv('JANKX_DEBUG_ROW');
if ($debugRow !== false && $debugRow !== '') {
    var_export($logged[(int) $debugRow] ?? null);
    echo "\n";
    exit(0);
}

/**
 * Collapse literals so structurally identical queries group together.
 * Mirrors what benchmarks/collect.php reports, so the two agree.
 */
function normaliseSql(string $sql): string
{
    $sql = preg_replace('/\s+/', ' ', $sql) ?? $sql;
    $sql = preg_replace('/\'[^\']*\'/', '?', $sql) ?? $sql;
    // Collapse IN (?, ?, ?) and (= ?) into a single placeholder.
    $sql = preg_replace('/\((?:\s*\?(?:\s*,\s*\?)*\s*)\)/', '(?)', $sql) ?? $sql;
    $sql = preg_replace('/\b\d+\b/', 'N', $sql) ?? $sql;
    return trim($sql);
}

/** Frames belonging to theme code, most specific first. */
function themeFrames(string $chain): array
{
    $out = [];
    foreach (array_map('trim', explode(',', $chain)) as $frame) {
        if (preg_match('/Jankx|^App\\\\|\bApp\\\\Services/i', $frame)) {
            $out[] = $frame;
        }
        if (count($out) >= 3) {
            break;
        }
    }
    return $out;
}

$groups = [];
foreach ($logged as $row) {
    $sql    = (string) ($row[0] ?? '');
    $ms     = (float) ($row[1] ?? 0.0) * 1000.0;
    $chain  = (string) ($row[2] ?? '');
    $frames = themeFrames($chain);
    $label  = $frames[0] ?? '(core only)';

    $key = normaliseSql($sql);
    if (!isset($groups[$key])) {
        $groups[$key] = [
            'count'   => 0,
            'ms'      => 0.0,
            'sample'  => $sql,
            'distinct'=> [],
            'callers' => [],
        ];
    }
    $groups[$key]['count']++;
    $groups[$key]['ms'] += $ms;
    $groups[$key]['distinct'][$sql] = true;
    $groups[$key]['callers'][$label] = ($groups[$key]['callers'][$label] ?? 0) + 1;
}

/*
 * Only groups where the SAME literal query ran more than once are genuinely
 * wasted. Groups that merely share a shape (same statement, different IDs) are
 * normal batched access and are reported separately, otherwise the numbers look
 * far worse than they are.
 */
$exact = [];
$shapeOnly = [];
foreach ($groups as $g) {
    if ($g['count'] <= 1) {
        continue;
    }
    $distinct = count($g['distinct']);
    if ($distinct === 1) {
        $exact[] = $g;
    } else {
        $shapeOnly[] = $g;
    }
}

$rank = static function (array $a, array $b): int {
    $redundantA = $a['ms'] * (($a['count'] - 1) / $a['count']);
    $redundantB = $b['ms'] * (($b['count'] - 1) / $b['count']);
    return [$redundantB, $b['count']] <=> [$redundantA, $a['count']];
};

usort($exact, $rank);
usort($shapeOnly, $rank);

$print = static function (array $rows, string $heading): void {
    printf("\n%s\n%s\n", $heading, str_repeat('-', strlen($heading)));
    if (!$rows) {
        echo "  (none)\n\n";
        return;
    }
    foreach ($rows as $g) {
        printf(
            "%dx  %.2f ms total  %.2f ms redundant  %s\n",
            $g['count'],
            $g['ms'],
            $g['ms'] * (($g['count'] - 1) / $g['count']),
            substr(preg_replace('/\s+/', ' ', $g['sample']) ?? $g['sample'], 0, 130)
        );
        arsort($g['callers']);
        foreach (array_slice($g['callers'], 0, 3, true) as $caller => $n) {
            printf("        %3dx  %s\n", $n, $caller);
        }
    }
    echo "\n";
};

$exactRedundant   = array_sum(array_map(static fn($g) => $g['count'] - 1, $exact));
$exactRedundantMs = array_sum(array_map(
    static fn($g) => $g['ms'] * (($g['count'] - 1) / $g['count']),
    $exact
));

printf(
    "total queries: %d\n  exactly-repeated groups: %d covering %d redundant queries (%.2f ms)\n  same-shape-different-params groups: %d covering %d queries\n",
    count($logged),
    count($exact),
    $exactRedundant,
    $exactRedundantMs,
    count($shapeOnly),
    array_sum(array_map(static fn($g) => $g['count'], $shapeOnly))
);

$print($exact, 'EXACTLY REPEATED QUERIES  (genuine waste)');

// Shape-only groups are not redundant by themselves, but a shape executed many
// times with many distinct literals is where volume costs hide (N+1 loops,
// per-item tax lookups). Show the heaviest ones.
usort($shapeOnly, static function (array $a, array $b): int {
    $redA = $a['ms'] * (($a['count'] - 1) / $a['count']);
    $redB = $b['ms'] * (($b['count'] - 1) / $b['count']);
    return [$redB, $b['count']] <=> [$redA, $a['count']];
});
$print(array_slice($shapeOnly, 0, 10), 'HEAVIEST SAME-SHAPE GROUPS  (volume cost, not literal repeats)');