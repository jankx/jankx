<?php

namespace Tests\Debug\Services;

use PHPUnit\Framework\TestCase;
use Jankx\Debug\Services\DebugInfoService;

/**
 * Debug Info Service Test
 *
 * @package Tests\Debug\Services
 * @since 2.0.1
 */
class DebugInfoServiceTest extends TestCase
{
    private DebugInfoService $debugInfoService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->debugInfoService = new DebugInfoService();
    }

    public function testStartTracking()
    {
        $this->debugInfoService->startTracking();

        // Test that tracking is started
        $responseTime = $this->debugInfoService->getResponseTime();
        $this->assertIsFloat($responseTime);
        $this->assertGreaterThanOrEqual(0, $responseTime);
    }

    public function testGetResponseTimeBeforeTracking()
    {
        // Test response time before tracking starts
        $responseTime = $this->debugInfoService->getResponseTime();
        $this->assertEquals(0.0, $responseTime);
    }

    public function testGetResponseTimeAfterTracking()
    {
        $this->debugInfoService->startTracking();
        usleep(1000); // Sleep for 1ms

        $responseTime = $this->debugInfoService->getResponseTime();
        $this->assertIsFloat($responseTime);
        $this->assertGreaterThan(0, $responseTime);
    }

    public function testGetMemoryUsage()
    {
        $memoryUsage = $this->debugInfoService->getMemoryUsage();

        $this->assertIsInt($memoryUsage);
        $this->assertGreaterThan(0, $memoryUsage);
    }

    public function testGetMemoryLimit()
    {
        $memoryLimit = $this->debugInfoService->getMemoryLimit();

        $this->assertIsInt($memoryLimit);
        $this->assertGreaterThanOrEqual(-1, $memoryLimit);
    }

    public function testFormatBytes()
    {
        // Test bytes
        $this->assertEquals('512 B', $this->debugInfoService->formatBytes(512));

        // Test kilobytes
        $this->assertEquals('1.00 KB', $this->debugInfoService->formatBytes(1024));
        $this->assertEquals('1.50 KB', $this->debugInfoService->formatBytes(1536));

        // Test megabytes
        $this->assertEquals('1.00 MB', $this->debugInfoService->formatBytes(1024 * 1024));
        $this->assertEquals('1.50 MB', $this->debugInfoService->formatBytes(1024 * 1024 * 1.5));

        // Test gigabytes
        $this->assertEquals('1.00 GB', $this->debugInfoService->formatBytes(1024 * 1024 * 1024));

        // Test terabytes
        $this->assertEquals('1.00 TB', $this->debugInfoService->formatBytes(1024 * 1024 * 1024 * 1024));
    }

    public function testFormatBytesWithCustomPrecision()
    {
        $this->assertEquals('1.123 KB', $this->debugInfoService->formatBytes(1150, 3));
        $this->assertEquals('1.1 KB', $this->debugInfoService->formatBytes(1126, 1));
    }

    public function testFormatBytesEdgeCases()
    {
        // Test zero bytes
        $this->assertEquals('0 B', $this->debugInfoService->formatBytes(0));

        // Test negative bytes (should still work)
        $this->assertEquals('-1 B', $this->debugInfoService->formatBytes(-1));

        // Test very large numbers
        $this->assertEquals('1024.00 TB', $this->debugInfoService->formatBytes(1024 * 1024 * 1024 * 1024 * 1024));
    }

    public function testMemoryLimitParsing()
    {
        // Mock ini_get to test different memory limit formats
        $this->markTestSkipped('Memory limit parsing test requires mocking ini_get');
    }

    public function testMemoryUsageConsistency()
    {
        $usage1 = $this->debugInfoService->getMemoryUsage();
        $usage2 = $this->debugInfoService->getMemoryUsage();

        // Memory usage should be consistent within a short time
        $this->assertGreaterThanOrEqual($usage1, $usage2);
    }

    public function testResponseTimeAccuracy()
    {
        $this->debugInfoService->startTracking();

        $startTime = microtime(true);
        usleep(10000); // Sleep for 10ms
        $endTime = microtime(true);

        $expectedTime = $endTime - $startTime;
        $actualTime = $this->debugInfoService->getResponseTime();

        // Allow for small timing differences
        $this->assertEquals($expectedTime, $actualTime, '', 0.01);
    }

    public function testMultipleTrackingStarts()
    {
        $this->debugInfoService->startTracking();
        usleep(1000);
        $time1 = $this->debugInfoService->getResponseTime();

        $this->debugInfoService->startTracking();
        usleep(1000);
        $time2 = $this->debugInfoService->getResponseTime();

        // Second start should reset the timer
        $this->assertLessThan($time1, $time2);
    }
}