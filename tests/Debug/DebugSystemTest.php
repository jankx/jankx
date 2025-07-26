<?php

namespace Tests\Debug;

use PHPUnit\Framework\TestCase;
use Jankx\Debug\DebugBootstrap;
use Jankx\Debug\Helpers\DebugHelper;
use Jankx\Debug\Facades\Debug;

/**
 * Debug System Test
 *
 * @package Tests\Debug
 * @since 2.0.1
 */
class DebugSystemTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Enable debug for testing
        if (!defined('JANKX_DEBUG')) {
            define('JANKX_DEBUG', true);
        }
    }

    public function testDebugHelperIsEnabled()
    {
        $this->assertTrue(DebugHelper::isEnabled());
    }

    public function testDebugHelperFormatBytes()
    {
        $this->assertEquals('1.00 KB', DebugHelper::formatBytes(1024));
        $this->assertEquals('1.00 MB', DebugHelper::formatBytes(1024 * 1024));
        $this->assertEquals('1.00 GB', DebugHelper::formatBytes(1024 * 1024 * 1024));
    }

    public function testDebugHelperCalculateMemoryUsagePercentage()
    {
        $this->assertEquals(50.0, DebugHelper::calculateMemoryUsagePercentage(50, 100));
        $this->assertEquals(0.0, DebugHelper::calculateMemoryUsagePercentage(0, 100));
        $this->assertEquals(0.0, DebugHelper::calculateMemoryUsagePercentage(50, -1));
    }

    public function testDebugHelperGetCurrentMemoryUsage()
    {
        $memoryUsage = DebugHelper::getCurrentMemoryUsage();
        $this->assertIsInt($memoryUsage);
        $this->assertGreaterThan(0, $memoryUsage);
    }

    public function testDebugHelperGetMemoryLimit()
    {
        $memoryLimit = DebugHelper::getMemoryLimit();
        $this->assertIsInt($memoryLimit);
    }

    public function testDebugHelperGetResponseTime()
    {
        $startTime = microtime(true);
        usleep(1000); // Sleep for 1ms
        $responseTime = DebugHelper::getResponseTime($startTime);

        $this->assertIsFloat($responseTime);
        $this->assertGreaterThan(0, $responseTime);
    }

    public function testDebugSystemInitialization()
    {
        // Test that debug system can be initialized without errors
        $this->expectNotToPerformAssertions();

        DebugBootstrap::init();
    }

    public function testDebugFacadeMethods()
    {
        // Test facade methods exist and are callable
        $this->assertTrue(method_exists(Debug::class, 'init'));
        $this->assertTrue(method_exists(Debug::class, 'addPluginInfo'));
        $this->assertTrue(method_exists(Debug::class, 'getInfo'));
        $this->assertTrue(method_exists(Debug::class, 'getQueryCount'));
    }

    public function testDebugHelperLogMethod()
    {
        // Test that log method doesn't throw errors
        $this->expectNotToPerformAssertions();

        DebugHelper::log('Test message', ['context' => 'test']);
    }

    public function testDebugHelperAddPluginInfo()
    {
        // Test that addPluginInfo method doesn't throw errors
        $this->expectNotToPerformAssertions();

        DebugHelper::addPluginInfo('Test Plugin', 'Test Info');
    }

    public function testDebugInfoStructure()
    {
        $debugInfo = DebugHelper::getDebugInfo();

        // Test that debug info has expected structure
        $this->assertIsArray($debugInfo);

        // Check for expected keys (if debug is enabled)
        if (DebugHelper::isEnabled()) {
            $this->assertArrayHasKey('response_time', $debugInfo);
            $this->assertArrayHasKey('memory_usage', $debugInfo);
            $this->assertArrayHasKey('memory_limit', $debugInfo);
            $this->assertArrayHasKey('query_count', $debugInfo);
            $this->assertArrayHasKey('cache_info', $debugInfo);
            $this->assertArrayHasKey('gutenberg_blocks', $debugInfo);
            $this->assertArrayHasKey('plugin_debug', $debugInfo);
        }
    }

    public function testQueryCountIsInteger()
    {
        $queryCount = DebugHelper::getQueryCount();
        $this->assertIsInt($queryCount);
        $this->assertGreaterThanOrEqual(0, $queryCount);
    }

    protected function tearDown(): void
    {
        parent::tearDown();
    }
}