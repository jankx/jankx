<?php

namespace Jankx\Foundation\Cli\Commands;

use WP_CLI;
use WP_CLI_Command;

/**
 * Jankx Testing and Diagnostic Commands
 *
 * Benchmark and analyze server I/O performance (sequential read/write and small file IOPS)
 * to diagnose storage bottlenecks, CloudLinux throttling, and filesystem latency.
 *
 * ## EXAMPLES
 *
 *     wp jankx test io
 *     wp jankx test io --size=50 --files=500
 *     wp jankx test io --path=/tmp
 *     wp jankx test io --format=json
 *
 * @package Jankx\Foundation\Cli\Commands
 * @since 2.1.0
 */
class TestCommand extends WP_CLI_Command
{
    /**
     * Benchmark disk I/O performance (sequential write/read and random small file IOPS).
     *
     * ## OPTIONS
     *
     * [--size=<mb>]
     * : Size of test file for sequential write/read in megabytes (MB). Default: 20
     *
     * [--files=<count>]
     * : Number of small files to create for IOPS test. Default: 200
     *
     * [--file-size=<kb>]
     * : Size of each small file in kilobytes (KB). Default: 4
     *
     * [--dir=<path>]
     * : Directory to perform the test. Default: WordPress uploads folder
     *
     * [--target=<path>]
     * : Alias for --dir.
     *
     * [--skip-seq]
     * : Skip the sequential read/write test.
     *
     * [--skip-iops]
     * : Skip the small file IOPS test.
     *
     * [--format=<format>]
     * : Output format (table, json). Default: table
     *
     * ## EXAMPLES
     *
     *     wp jankx test io
     *     wp jankx test io --size=50 --files=300
     *     wp jankx test io --dir=/tmp
     *     wp jankx test io --format=json
     *
     * @when after_wp_load
     */
    public function io($args, $assoc_args)
    {
        $sizeMb       = max(1, (int) ($assoc_args['size'] ?? 20));
        $fileCount    = max(10, (int) ($assoc_args['files'] ?? 200));
        $fileSizeKb   = max(1, (int) ($assoc_args['file-size'] ?? 4));
        $skipSeq      = isset($assoc_args['skip-seq']);
        $skipIops     = isset($assoc_args['skip-iops']);
        $format       = strtolower($assoc_args['format'] ?? 'table');

        // Determine target path (use --dir or --target to avoid conflict with global WP-CLI --path)
        $customDir = $assoc_args['dir'] ?? ($assoc_args['target'] ?? null);
        if (!empty($customDir)) {
            $targetPath = rtrim($customDir, DIRECTORY_SEPARATOR);
        } else {
            $uploadDir  = wp_upload_dir();
            $targetPath = $uploadDir['basedir'] ?? (defined('WP_CONTENT_DIR') ? WP_CONTENT_DIR . '/uploads' : sys_get_temp_dir());
        }

        if (!is_dir($targetPath)) {
            if (!wp_mkdir_p($targetPath)) {
                WP_CLI::error(sprintf('Target test path does not exist and cannot be created: %s', $targetPath));
                return;
            }
        }

        if (!is_writable($targetPath)) {
            WP_CLI::error(sprintf('Target test path is not writable: %s', $targetPath));
            return;
        }

        $freeBytes = @disk_free_space($targetPath);
        $freeSpaceFormatted = $freeBytes !== false ? size_format($freeBytes) : 'Unknown';

        // Create a unique temporary directory for test isolation
        $testDir = $targetPath . DIRECTORY_SEPARATOR . '.jankx_io_bench_' . uniqid('', true);
        if (!wp_mkdir_p($testDir)) {
            WP_CLI::error(sprintf('Failed to create isolated test directory: %s', $testDir));
            return;
        }

        $results = [
            'target_path'    => $targetPath,
            'free_disk_space'=> $freeSpaceFormatted,
            'php_memory'     => ini_get('memory_limit'),
            'metrics'        => [],
            'verdict'        => 'HEALTHY',
            'warnings'       => [],
        ];

        if ($format === 'table') {
            WP_CLI::log('');
            WP_CLI::log('╔════════════════════════════════════════════════════════════╗');
            WP_CLI::log('║            Jankx Framework — Disk I/O Benchmark            ║');
            WP_CLI::log('╚════════════════════════════════════════════════════════════╝');
            WP_CLI::log(sprintf('▸ Target Path : %s', $targetPath));
            WP_CLI::log(sprintf('▸ Free Disk   : %s', $freeSpaceFormatted));
            WP_CLI::log(sprintf('▸ Memory Limit: %s', ini_get('memory_limit')));
            WP_CLI::log('');
        }

        try {
            // ── 1. Sequential Write & Read ──────────────────────────────────
            if (!$skipSeq) {
                if ($format === 'table') {
                    WP_CLI::log(sprintf('Running sequential write/read test (%d MB)...', $sizeMb));
                }

                $seqFilePath = $testDir . DIRECTORY_SEPARATOR . 'seq_bench.dat';

                // --- Sequential Write ---
                $chunkSize = 1024 * 1024; // 1 MB buffer
                $buffer    = str_repeat('X', $chunkSize);

                $startTime = microtime(true);
                $fh = fopen($seqFilePath, 'wb');
                if (!$fh) {
                    throw new \RuntimeException(sprintf('Failed to open file for writing: %s', $seqFilePath));
                }

                for ($i = 0; $i < $sizeMb; $i++) {
                    fwrite($fh, $buffer);
                }
                fflush($fh);
                if (function_exists('fsync')) {
                    @fsync($fh);
                }
                fclose($fh);

                $writeDuration = max(0.0001, microtime(true) - $startTime);
                $writeSpeedMb  = round($sizeMb / $writeDuration, 2);

                $results['metrics']['seq_write'] = [
                    'label'      => 'Sequential Write',
                    'data'       => sprintf('%d MB', $sizeMb),
                    'time_sec'   => round($writeDuration, 4),
                    'speed'      => sprintf('%.2f MB/s', $writeSpeedMb),
                    'raw_rate'   => $writeSpeedMb,
                    'unit'       => 'MB/s',
                    'assessment' => $this->assessSpeed($writeSpeedMb, 15, 60, 150),
                ];

                // --- Sequential Read ---
                clearstatcache(true, $seqFilePath);
                $startTime = microtime(true);
                $fh = fopen($seqFilePath, 'rb');
                if (!$fh) {
                    throw new \RuntimeException(sprintf('Failed to open file for reading: %s', $seqFilePath));
                }

                while (!feof($fh)) {
                    fread($fh, $chunkSize);
                }
                fclose($fh);

                $readDuration = max(0.0001, microtime(true) - $startTime);
                $readSpeedMb  = round($sizeMb / $readDuration, 2);

                $results['metrics']['seq_read'] = [
                    'label'      => 'Sequential Read',
                    'data'       => sprintf('%d MB', $sizeMb),
                    'time_sec'   => round($readDuration, 4),
                    'speed'      => sprintf('%.2f MB/s', $readSpeedMb),
                    'raw_rate'   => $readSpeedMb,
                    'unit'       => 'MB/s',
                    'assessment' => $this->assessSpeed($readSpeedMb, 25, 80, 250),
                ];

                if (file_exists($seqFilePath)) {
                    unlink($seqFilePath);
                }
            }

            // ── 2. Random Small Files IOPS Benchmark ─────────────────────────
            // Simulates Git unpack (loose objects), file caches, uploads, transients
            if (!$skipIops) {
                if ($format === 'table') {
                    WP_CLI::log(sprintf('Running small file IOPS test (%d files × %d KB)...', $fileCount, $fileSizeKb));
                }

                $smallPayload = str_repeat('A', $fileSizeKb * 1024);
                $totalMb      = round(($fileCount * $fileSizeKb) / 1024, 2);

                // --- Write IOPS ---
                $startTime = microtime(true);
                for ($i = 0; $i < $fileCount; $i++) {
                    $filePath = $testDir . DIRECTORY_SEPARATOR . "iops_{$i}.tmp";
                    file_put_contents($filePath, $smallPayload);
                }
                $iopsWriteTime = max(0.0001, microtime(true) - $startTime);
                $writeIops     = (int) round($fileCount / $iopsWriteTime);

                $results['metrics']['iops_write'] = [
                    'label'      => sprintf('Small File Write (IOPS)'),
                    'data'       => sprintf('%d files (~%.1f MB)', $fileCount, $totalMb),
                    'time_sec'   => round($iopsWriteTime, 4),
                    'speed'      => sprintf('%d ops/s', $writeIops),
                    'raw_rate'   => $writeIops,
                    'unit'       => 'ops/s',
                    'assessment' => $this->assessIops($writeIops, 60, 200, 800),
                ];

                // --- Read IOPS ---
                clearstatcache();
                $startTime = microtime(true);
                for ($i = 0; $i < $fileCount; $i++) {
                    $filePath = $testDir . DIRECTORY_SEPARATOR . "iops_{$i}.tmp";
                    file_get_contents($filePath);
                }
                $iopsReadTime = max(0.0001, microtime(true) - $startTime);
                $readIops     = (int) round($fileCount / $iopsReadTime);

                $results['metrics']['iops_read'] = [
                    'label'      => sprintf('Small File Read (IOPS)'),
                    'data'       => sprintf('%d files', $fileCount),
                    'time_sec'   => round($iopsReadTime, 4),
                    'speed'      => sprintf('%d ops/s', $readIops),
                    'raw_rate'   => $readIops,
                    'unit'       => 'ops/s',
                    'assessment' => $this->assessIops($readIops, 120, 400, 1500),
                ];

                // --- Delete IOPS ---
                $startTime = microtime(true);
                for ($i = 0; $i < $fileCount; $i++) {
                    $filePath = $testDir . DIRECTORY_SEPARATOR . "iops_{$i}.tmp";
                    if (file_exists($filePath)) {
                        unlink($filePath);
                    }
                }
                $iopsDeleteTime = max(0.0001, microtime(true) - $startTime);
                $deleteIops     = (int) round($fileCount / $iopsDeleteTime);

                $results['metrics']['iops_delete'] = [
                    'label'      => sprintf('Small File Delete (IOPS)'),
                    'data'       => sprintf('%d files', $fileCount),
                    'time_sec'   => round($iopsDeleteTime, 4),
                    'speed'      => sprintf('%d ops/s', $deleteIops),
                    'raw_rate'   => $deleteIops,
                    'unit'       => 'ops/s',
                    'assessment' => $this->assessIops($deleteIops, 150, 500, 2000),
                ];
            }
        } catch (\Throwable $e) {
            WP_CLI::error(sprintf('Error during I/O benchmark: %s', $e->getMessage()), false);
        } finally {
            // Clean up temporary benchmark directory
            $this->cleanDirectory($testDir);
            @rmdir($testDir);
        }

        // ── 3. Diagnostic Analysis & Output ──────────────────────────────────
        $hasBottleneck = false;
        $hasWarning    = false;

        foreach ($results['metrics'] as $key => $m) {
            if ($m['assessment']['level'] === 'critical') {
                $hasBottleneck = true;
                $results['warnings'][] = sprintf('%s is severely throttled or degraded (%s).', $m['label'], $m['speed']);
            } elseif ($m['assessment']['level'] === 'warning') {
                $hasWarning = true;
                $results['warnings'][] = sprintf('%s is below standard SSD performance (%s).', $m['label'], $m['speed']);
            }
        }

        if ($hasBottleneck) {
            $results['verdict'] = 'CRITICAL_BOTTLENECK';
        } elseif ($hasWarning) {
            $results['verdict'] = 'MODERATE';
        } else {
            $results['verdict'] = 'EXCELLENT';
        }

        if ($format === 'json') {
            WP_CLI::log(json_encode($results, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));
            return;
        }

        // Format Table Output
        WP_CLI::log('');
        $tableItems = [];
        foreach ($results['metrics'] as $m) {
            $tableItems[] = [
                'Benchmark'  => $m['label'],
                'Size/Count' => $m['data'],
                'Duration'   => sprintf('%.3f s', $m['time_sec']),
                'Speed/IOPS' => $m['speed'],
                'Status'     => $m['assessment']['badge'] . ' ' . $m['assessment']['label'],
            ];
        }

        \WP_CLI\Utils\format_items('table', $tableItems, ['Benchmark', 'Size/Count', 'Duration', 'Speed/IOPS', 'Status']);
        WP_CLI::log('');

        // Summary Verdict & Diagnostics
        if ($results['verdict'] === 'CRITICAL_BOTTLENECK') {
            WP_CLI::warning('I/O BOTTLENECK DETECTED: Disk I/O or IOPS is severely throttled!');
            WP_CLI::log('Probable causes:');
            WP_CLI::log('  • CloudLinux / cPanel I/O limit or IOPS throttling (LVE limit reached)');
            WP_CLI::log('  • Network-attached storage (NFS / slow cloud disk volume)');
            WP_CLI::log('  • High server I/O wait (%wa in `top`) due to neighboring noisy tenants');
            WP_CLI::log('');
            WP_CLI::log('Recommendations to mitigate:');
            WP_CLI::log('  1. Git operations: Avoid loose objects unpack:');
            WP_CLI::log('       git config --global transfer.unpackLimit 1');
            WP_CLI::log('       git config --global fetch.unpackLimit 1');
            WP_CLI::log('       git config --global pack.threads 1');
            WP_CLI::log('  2. WordPress Cache: Avoid file-based caching; use Redis or Memcached object cache.');
            WP_CLI::log('  3. Server: Contact hosting support to raise IOPS / I/O Usage limit.');
        } elseif ($results['verdict'] === 'MODERATE') {
            WP_CLI::log('I/O Performance: MODERATE. Standard operations will work, but large builds/unpacks may experience delays.');
        } else {
            WP_CLI::success('I/O Performance: HEALTHY & FAST. Storage throughput and IOPS meet high-performance requirements.');
        }
        WP_CLI::log('');
    }

    /**
     * Categorize throughput speed in MB/s.
     *
     * @param float $speed
     * @param float $minCrit
     * @param float $minWarn
     * @param float $good
     * @return array
     */
    protected function assessSpeed(float $speed, float $minCrit, float $minWarn, float $good): array
    {
        if ($speed < $minCrit) {
            return ['level' => 'critical', 'badge' => '✗', 'label' => 'Very Slow'];
        }
        if ($speed < $minWarn) {
            return ['level' => 'warning',  'badge' => '!', 'label' => 'Slow'];
        }
        if ($speed < $good) {
            return ['level' => 'moderate', 'badge' => '✓', 'label' => 'Good'];
        }
        return ['level' => 'good', 'badge' => '✓', 'label' => 'Fast'];
    }

    /**
     * Categorize IOPS performance.
     *
     * @param int $iops
     * @param int $minCrit
     * @param int $minWarn
     * @param int $good
     * @return array
     */
    protected function assessIops(int $iops, int $minCrit, int $minWarn, int $good): array
    {
        if ($iops < $minCrit) {
            return ['level' => 'critical', 'badge' => '✗', 'label' => 'Severe Throttle'];
        }
        if ($iops < $minWarn) {
            return ['level' => 'warning',  'badge' => '!', 'label' => 'Low IOPS'];
        }
        if ($iops < $good) {
            return ['level' => 'moderate', 'badge' => '✓', 'label' => 'Moderate'];
        }
        return ['level' => 'good', 'badge' => '✓', 'label' => 'Excellent'];
    }

    /**
     * Recursively delete all files in a directory.
     *
     * @param string $dir
     * @return void
     */
    protected function cleanDirectory(string $dir): void
    {
        if (!is_dir($dir)) {
            return;
        }

        $items = @scandir($dir);
        if (!$items) {
            return;
        }

        foreach ($items as $item) {
            if ($item === '.' || $item === '..') {
                continue;
            }
            $path = $dir . DIRECTORY_SEPARATOR . $item;
            if (is_dir($path)) {
                $this->cleanDirectory($path);
                @rmdir($path);
            } else {
                @unlink($path);
            }
        }
    }
}
