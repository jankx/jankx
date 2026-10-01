<?php
/**
 * CallProfiler
 *
 * Re-runs the benchmark probe in a child PHP process under
 * `xdebug.mode=profile`, then parses the cachegrind output into a per-call
 * profile (call counts + self/inclusive time).
 *
 * `xdebug.mode=trace` is used as a fallback when cachegrind parsing yields
 * nothing, because trace mode emits an explicit function-entry table which is
 * the most direct answer to "how many times is this called".
 */
namespace Jankx\Benchmarks;

final class CallProfiler
{
    public function __construct(
        private string $php,
        private string $script,
        private string $outDir,
    ) {
    }

    /** Build the -d flags used for profiling. */
    private function profileFlags(string $dir, string $prefix): array
    {
        return [
            '-d', 'xdebug.mode=profile',
            '-d', 'xdebug.start_with_request=yes',
            '-d', 'xdebug.output_dir=' . $dir,
            '-d', 'xdebug.use_compression=0',
            '-d', 'xdebug.profiler_output_name=' . $prefix,
        ];
    }

    private function traceFlags(string $dir, string $prefix): array
    {
        return [
            '-d', 'xdebug.mode=trace',
            '-d', 'xdebug.start_with_request=yes',
            '-d', 'xdebug.output_dir=' . $dir,
            '-d', 'xdebug.use_compression=0',
            '-d', 'xdebug.trace_format=0',
            '-d', 'xdebug.collect_params=0',
            '-d', 'xdebug.collect_return=0',
        ];
    }

    /**
     * Run the probe under the cachegrind profiler.
     *
     * @param  array<int, string> $args
     * @return array{stdout:string, stderr:string, code:int}
     */
    /**
     * Run the probe under the given flags.
     *
     * Argument order matters: php [ini flags] <script> [script args].
     * Anything placed before the script path is parsed by the PHP CLI itself,
     * which is why --scenario=... must come last.
     *
     * @param  array<int, string> $flags
     * @param  array<int, string> $args
     * @return array{stdout:string, stderr:string, code:int}
     */
    private function run(array $flags, array $args, string $cwd): array
    {
        $cmd = escapeshellarg($this->php);
        foreach (array_merge($flags, [$this->script], $args) as $a) {
            $cmd .= ' ' . escapeshellarg($a);
        }
        $descriptors = [1 => ['pipe', 'w'], 2 => ['pipe', 'w']];
        $proc = proc_open($cmd, $descriptors, $pipes, $cwd, null, ['bypass_shell' => true]);
        if (!is_resource($proc)) {
            throw new \RuntimeException('Failed to spawn profiler process');
        }
        $stdout = stream_get_contents($pipes[1]);
        $stderr = stream_get_contents($pipes[2]);
        fclose($pipes[1]);
        fclose($pipes[2]);
        $code = proc_close($proc);

        return ['stdout' => (string) $stdout, 'stderr' => (string) $stderr, 'code' => $code];
    }

    /**
     * Produce a call profile of one probe run.
     *
     * @param  array<int, string> $args   extra CLI args for collect.php
     * @return array<string, mixed>
     */
    public function profile(array $args, string $scenario, string $cachegrindDir): array
    {
        if (!is_dir($cachegrindDir) && !@mkdir($cachegrindDir, 0777, true) && !is_dir($cachegrindDir)) {
            throw new \RuntimeException("Cannot create cachegrind dir: {$cachegrindDir}");
        }
        foreach (glob($cachegrindDir . '/*.out', GLOB_NOSORT) ?: [] as $old) {
            @unlink($old);
        }

        $prefix = 'jankx_' . $scenario . '_' . getmypid();
        $res = $this->run($this->profileFlags($cachegrindDir, $prefix), $args, dirname($this->script));

        $files = glob($cachegrindDir . '/cachegrind.out.' . $prefix . '*', GLOB_NOSORT) ?: [];
        if ($files === []) {
            // xdebug sometimes ignores profiler_output_name; fall back to newest file.
            $all = array_values(array_filter(
                glob($cachegrindDir . '/*', GLOB_NOSORT) ?: [],
                static fn($f) => is_file($f)
            ));
            if ($all !== []) {
                usort($all, static fn($a, $b) => filemtime($b) <=> filemtime($a));
                $files = [$all[0]];
            }
        }
        if ($files === []) {
            throw new \RuntimeException(
                "No cachegrind output produced.\nSTDERR: " . $res['stderr'] . "\nSTDOUT: " . substr($res['stdout'], 0, 800)
            );
        }

        $cachegrindFile = $files[0];
        $parser = (new CachegrindParser())->parseFile($cachegrindFile)->aggregate();

        return [
            'cachegrind_file' => $cachegrindFile,
            'cachegrind_bytes'=> (int) filesize($cachegrindFile),
            'probe_json'      => self::extractProbeJson($res['stdout']),
            'probe_stderr'    => $res['stderr'],
            'parser'          => $parser,
        ];
    }

    /**
     * Trace-mode fallback: returns raw call counts per function by counting
     * function-entry lines in the Xdebug trace.
     *
     * @return array{file:string, calls:array<string,int>, total:int}
     */
    public function trace(array $args, string $scenario, string $traceDir): array
    {
        if (!is_dir($traceDir) && !@mkdir($traceDir, 0777, true) && !is_dir($traceDir)) {
            throw new \RuntimeException("Cannot create trace dir: {$traceDir}");
        }
        foreach (glob($traceDir . '/*.xt', GLOB_NOSORT) ?: [] as $old) {
            @unlink($old);
        }
        $res = $this->run($this->traceFlags($traceDir, ''), $args, dirname($this->script));
        $files = glob($traceDir . '/*.xt', GLOB_NOSORT) ?: [];
        if ($files === []) {
            throw new \RuntimeException('No trace output produced. STDERR: ' . $res['stderr']);
        }
        $file = $files[0];

        $counts = [];
        $total = 0;
        $fh = fopen($file, 'rb');
        while (($line = fgets($fh)) !== false) {
            // Entry lines look like:  2  0   0  0.000188  244  Foo::bar()  /path/file.php  0  0
            if (!preg_match('/^\s*\d+\s+\d+\s+[\d.]+\s+\d+\s+(\S+)\(\)\s+(\S+)/', $line, $m)) {
                continue;
            }
            $fn = $m[1];
            if ($fn === '{main}' || str_starts_with($fn, '==')) {
                continue;
            }
            $counts[$fn] = ($counts[$fn] ?? 0) + 1;
            $total++;
        }
        fclose($fh);
        arsort($counts);

        return ['file' => $file, 'calls' => $counts, 'total' => $total];
    }

    /** Pull the probe's JSON payload out of mixed CLI output. */
    public static function extractProbeJson(string $output): ?array
    {
        $start = strpos($output, '===JANKX-BENCHMARK-JSON===');
        $end   = strpos($output, '===END-JANKX-BENCHMARK-JSON===');
        if ($start === false || $end === false || $end <= $start) {
            return null;
        }
        $blob = substr($output, $start + strlen('===JANKX-BENCHMARK-JSON==='), $end - $start - strlen('===JANKX-BENCHMARK-JSON==='));
        $decoded = json_decode(trim($blob), true);
        return is_array($decoded) ? $decoded : null;
    }
}