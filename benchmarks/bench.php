<?php
/**
 * Jankx benchmark CLI.
 *
 * Commands
 *   probe   [--scenario=boot|home]           WordPress-side metrics (no profiler)
 *   calls   [--scenario=boot|home] [--top=N] Per-call profile via xdebug cachegrind
 *   trace   [--scenario=boot] [--top=N]      Function-entry counts via xdebug trace
 *   http    [--runs=N] [--url=...]           End-to-end HTTP timing + cache headers
 *   report  [--scenario=...]                 All of the above into benchmarks/report/
 *
 * Requires xdebug installed. Kept OFF by default in php.ini so the live site is
 * unaffected; the CLI enables it per-invocation.
 */

declare(strict_types=1);

namespace Jankx\Benchmarks;

require_once __DIR__ . '/lib/CachegrindParser.php';
require_once __DIR__ . '/lib/CallProfiler.php';

const BEGIN = "\033[1m";
const DIM   = "\033[2m";
const RED   = "\033[31m";
const GREEN = "\033[32m";
const YEL   = "\033[33m";
const CYAN  = "\033[36m";
const OFF   = "\033[0m";

function out(string $s = ''): void { echo $s . PHP_EOL; }
function head(string $s): void    { echo PHP_EOL . BEGIN . CYAN . $s . OFF . PHP_EOL; }
function kv(string $k, $v, string $note = ''): void {
    echo '  ' . str_pad($k, 34) . $v . ($note !== '' ? DIM . '   ' . $note . OFF : '') . PHP_EOL;
}
function bar(float $frac, float $max, int $width = 28): string {
    if ($max <= 0) return '';
    $n = (int) round(($frac / $max) * $width);
    $n = max(0, min($width, $n));
    return str_repeat('#', $n);
}
function humanBytes(int $b): string {
    if ($b >= 1048576) return round($b / 1048576, 2) . ' MB';
    if ($b >= 1024)    return round($b / 1024, 1) . ' KB';
    return $b . ' B';
}
/** Shorten "Namespace\Very\Long\Class::method" for table alignment. */
function shorten(string $fn, int $max = 46): string {
    $fn = str_replace('\\', '\\', $fn);
    if (strlen($fn) <= $max) {
        return $fn;
    }
    // Drop the namespace but keep the class, and trim the class from the left.
    $short = preg_replace('/^.*\\\\/', '', $fn) ?: $fn;
    if (strlen($short) > $max) {
        $short = substr($short, -$max);
    }
    return $short;
}

function findPhp(): string {
    if (PHP_OS_FAMILY === 'Windows') {
        foreach (glob('C:/laragon/bin/php/php-*/php.exe') ?: [] as $c) return $c;
        foreach (glob('C:/xampp/php/php.exe') ?: [] as $c) return $c;
    }
    return PHP_BINARY;
}

/**
 * getopt() stops at the first non-option token, so `bench.php calls --top=10`
 * would silently ignore every flag. Parse $argv ourselves instead.
 *
 * @param  array<int, string> $argv
 * @return array{command:string, opts:array<string,string>}
 */
function parseArgv(array $argv): array
{
    $command = 'probe';
    $opts = [];
    foreach (array_slice($argv, 1) as $arg) {
        if (strncmp($arg, '--', 2) === 0) {
            $body = substr($arg, 2);
            $eq = strpos($body, '=');
            if ($eq === false) {
                $opts[$body] = '1';
            } else {
                $opts[substr($body, 0, $eq)] = substr($body, $eq + 1);
            }
        } elseif ($arg[0] !== '-') {
            // A positional token is the command. Note that a negated
            // strncmp() would be wrong here: it matched every option token.
            $command = $arg;
        }
    }
    return ['command' => $command, 'opts' => $opts];
}

$parsed = parseArgv($argv);
$command = $parsed['command'];
$opts    = $parsed['opts'];
$scenario = (string) ($opts['scenario'] ?? 'boot');
$top = (int) ($opts['top'] ?? 25);

$collectScript = __DIR__ . '/collect.php';
$php          = findPhp();
$themeDir     = dirname(__DIR__);
$workDir      = $themeDir . '/benchmarks/.work';
$reportDir    = $themeDir . '/benchmarks/report';

if (!is_dir($workDir)) @mkdir($workDir, 0777, true);

$profiler = new CallProfiler($php, $collectScript, $workDir);

/* ------------------------------------------------------------------ probe */
function printProbe(array $d, bool $withQueries = true): void
{
    head('REQUEST STAGES');
    foreach ($d['stages_ms'] as $label => $ms) {
        kv($label, round($ms, 1) . ' ms');
    }
    kv('TOTAL PHP TIME', round($d['total_ms'], 1) . ' ms');
    if (($d['html_bytes'] ?? 0) > 0) {
        kv('HTML OUTPUT', humanBytes((int) $d['html_bytes']));
    }

    if ($withQueries) {
        head('DATABASE');
        $q = $d['queries'];
        kv('queries total', (string) $q['total'], $q['total_ms'] . ' ms of SQL time');
        kv('duplicate groups', (string) $q['duplicate_groups'], $q['duplicate_extra'] . ' redundant calls');
        $max = max($q['by_table'] ?: [1]);
        foreach (array_slice($q['by_table'], 0, 8, true) as $t => $n) {
            kv('  ' . $t, (string) $n, bar((float) $n, (float) $max));
        }
        if (!empty($q['duplicates'])) {
            head('DUPLICATE QUERIES (same shape, run N times)');
            foreach ($q['duplicates'] as $d2) {
                kv('x' . $d2['count'], $d2['sql']);
            }
        }
    }

    head('HOOKS');
    kv('distinct hooks', (string) $d['hooks']['hooks']);
    kv('registered callbacks', (string) $d['hooks']['registered_callbacks']);

    head('OPTIONS / INCLUDES');
    kv('autoloaded options', (string) $d['autoload']['count'], humanBytes((int) $d['autoload']['bytes']));
    kv('included PHP files', (string) $d['includes']['count'], humanBytes((int) $d['includes']['bytes']));
    $maxI = max($d['includes']['by_root'] ?: [1]);
    foreach ($d['includes']['by_root'] as $r => $n) {
        kv('  ' . $r, (string) $n, bar((float) $n, (float) $maxI));
    }

    head('BLOCKS / MEMORY');
    kv('block types registered', (string) $d['blocks']['registered'], $d['blocks']['server_rendered'] . ' server-rendered');
    kv('peak memory', humanBytes((int) $d['memory']['peak_bytes']));
}

switch ($command) {
    case 'probe': {
        $res = $profiler->profile(['--scenario=' . $scenario], $scenario, $workDir . '/cachegrind_probe');
        $d = $res['probe_json'] ?? [];
        if (!$d) {
            out(RED . 'probe produced no JSON' . OFF);
            out($res['probe_stderr']);
            exit(1);
        }
        printProbe($d);
        break;
    }

    /* ---------------------------------------------------------------- calls */
    case 'calls': {
        $cachegrindDir = $workDir . '/cachegrind_' . $scenario;
        $res = $profiler->profile(['--scenario=' . $scenario], $scenario, $cachegrindDir);
        $parser = $res['parser'];
        $d = $res['probe_json'] ?? [];

        head('CALL PROFILE  (' . $scenario . ')');
        kv('cachegrind', basename((string) $res['cachegrind_file']), humanBytes((int) $res['cachegrind_bytes']));
        kv('functions profiled', (string) $parser->functionCount());
        kv('total call events', number_format($parser->totalCalls()));
        kv('profiled CPU time', round($parser->totalTimeNs() / 1e9, 4) . ' s');
        kv('cost unit', $parser->timeUnitNs() . ' ns');
        if ($d) {
            kv('WP wall time', round((float) $d['total_ms'], 1) . ' ms');
            kv('DB queries', (string) $d['queries']['total'], $d['queries']['duplicate_extra'] . ' redundant');
        }

        // *_time_ns comes from the parser, which derives the unit from the
        // cachegrind "events:" header (Xdebug uses 10ns ticks, not microseconds).
        $bySelf = $parser->topBySelfTime($top);
        head('TOP ' . count($bySelf) . ' BY SELF TIME (where the CPU is spent)');
        $max = max(array_map(static fn($x) => $x['self_time'], $bySelf) ?: [1]);
        foreach ($bySelf as $f) {
            printf("  %s%s%s %9.3f ms  calls=%-6s %s%s%s\n",
                DIM, bar((float) $f['self_time'], (float) $max), OFF,
                $f['self_time_ns'] / 1e6,
                number_format((int) $f['calls_as_callee']),
                $f['name'], DIM, '  ' . basename($f['file']) . OFF
            );
        }

        $topCalls = $parser->topByCallCount($top);
        head('TOP ' . count($topCalls) . ' BY CALL COUNT (call amplification)');
        $maxC = max(array_map(static fn($x) => $x['calls_as_callee'], $topCalls) ?: [1]);
        foreach ($topCalls as $f) {
            if ((int) $f['calls_as_callee'] === 0) continue;
            printf("  %s%s%s %9s calls  incl=%8.3f ms  %s%s%s\n",
                DIM, bar((float) $f['calls_as_callee'], (float) $maxC), OFF,
                number_format((int) $f['calls_as_callee']),
                ($f['incl_time'] * $parser->timeUnitNs()) / 1e6,
                $f['name'], DIM, '  ' . basename($f['file']) . OFF
            );
        }

        $edges = $parser->topEdges((int) ($top * 2));
        head('HOTTEST CALL EDGES (caller -> callee)');
        foreach ($edges as $e) {
            if ($e['calls'] < 3) continue;
            printf("  %-46s -> %-46s x%-7d incl=%8.3f ms\n",
                shorten($e['caller']), shorten($e['callee']),
                $e['calls'], $e['incl_time_ns'] / 1e6);
        }

        if ($d) {
            printProbe($d);
        }
        break;
    }

    /* ---------------------------------------------------------------- trace */
    case 'trace': {
        $t = $profiler->trace(['--scenario=' . $scenario], $scenario, $workDir . '/trace_' . $scenario);
        head('FUNCTION ENTRY COUNTS  (' . $scenario . ', xdebug trace)');
        kv('trace file', basename($t['file']), humanBytes((int) filesize($t['file'])));
        kv('total entries', number_format($t['total']));
        out();
        $max = max($t['calls'] ?: [1]);
        $i = 0;
        foreach ($t['calls'] as $fn => $n) {
            if ($i++ >= $top) break;
            printf("  %s%s%s %9s  %s\n", DIM, bar((float) $n, (float) $max), OFF, number_format($n), $fn);
        }
        break;
    }

    /* ----------------------------------------------------------------- http */
    case 'http': {
        $runs = (int) ($opts['runs'] ?? 5);
        $url  = (string) ($opts['url'] ?? 'http://nibitour.localhost/');
        head("HTTP $runs runs  $url");
        $times = [];
        $last = null;
        for ($i = 1; $i <= $runs; $i++) {
            $sw = microtime(true);
            $ctx = stream_context_create(['http' => ['timeout' => 120, 'ignore_errors' => true]]);
            $body = @file_get_contents($url, false, $ctx);
            $ms = (microtime(true) - $sw) * 1000.0;
            $size = is_string($body) ? strlen($body) : 0;
            $status = 0;
            foreach ($http_response_header ?? [] as $h) {
                if (preg_match('#^HTTP/\S+\s+(\d{3})#', $h, $m)) { $status = (int) $m[1]; break; }
            }
            $times[] = $ms;
            out(sprintf('  run %-2d  %6d ms  HTTP %d  %s', $i, round($ms), $status, humanBytes($size)));
            $last = $body;
        }
        sort($times);
        $median = $times[(int) floor(count($times) / 2)];
        kv('min', round(min($times)) . ' ms');
        kv('MEDIAN', round($median) . ' ms', BEGIN . YEL . '<- the number to beat' . OFF);
        kv('max', round(max($times)) . ' ms');

        if (is_string($last)) {
            head('CACHE / COMPRESSION HEADERS');
            $found = false;
            foreach ($http_response_header ?? [] as $h) {
                if (preg_match('#^(cache-control|expires|x-litespeed-cache|x-litespeed-cf|x-cache|vary|etag|content-encoding|last-modified|age|server|x-powered-by|content-type)#i', $h)) {
                    out('  ' . $h);
                    $found = true;
                }
            }
            if (!$found) out('  ' . DIM . '(none)' . OFF);
            if (!preg_match('#content-encoding#i', implode("\n", $http_response_header ?? []))) {
                out('  ' . YEL . '! no Content-Encoding: HTML is being sent uncompressed' . OFF);
            }
        }
        break;
    }

    /* --------------------------------------------------------------- report */
    case 'report': {
        if (!is_dir($reportDir)) @mkdir($reportDir, 0777, true);
        $stamp = date('Ymd-His');

        $cachegrindDir = $workDir . '/cachegrind_' . $scenario;
        $res = $profiler->profile(['--scenario=' . $scenario], $scenario, $cachegrindDir);
        $parser = $res['parser'];
        $d = $res['probe_json'] ?? [];

        $payload = [
            'generated_at' => date('c'),
            'scenario'     => $scenario,
            'php'          => PHP_VERSION,
            'xdebug'       => extension_loaded('xdebug') ? phpversion('xdebug') : null,
            'probe'        => $d,
            'profile'      => [
                'functions'  => $parser->functionCount(),
                'calls'      => $parser->totalCalls(),
                'cpu_ns'     => $parser->totalTimeNs(),
                'cost_unit_ns' => $parser->timeUnitNs(),
                'top_self'   => array_values($parser->topBySelfTime(40)),
                'top_calls'  => array_values($parser->topByCallCount(40)),
                'top_edges'  => array_values($parser->topEdges(60)),
            ],
        ];
        $file = $reportDir . "/profile-$scenario-$stamp.json";
        file_put_contents($file, json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
        out(GREEN . 'report written: ' . $file . OFF);
        out(DIM . 'functions=' . $parser->functionCount()
            . ' calls=' . number_format($parser->totalCalls()) . OFF);
        break;
    }

    default:
        out(BEGIN . 'jankx benchmark' . OFF);
        out('commands: probe | calls | trace | http | report');
        out('options : --scenario=boot|home  --top=N  --runs=N  --url=...');
        exit(1);
}