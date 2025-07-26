<?php

namespace Tests\Debug\Helpers;

use PHPUnit\Framework\TestCase;
use Jankx\Debug\Helpers\DebugHelper;

/**
 * Debug Helper Test
 *
 * @package Tests\Debug\Helpers
 * @since 2.0.1
 */
class DebugHelperTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Enable debug for testing
        if (!defined('JANKX_DEBUG')) {
            define('JANKX_DEBUG', true);
        }
    }

    public function testIsEnabled()
    {
        $this->assertTrue(DebugHelper::isEnabled());
    }

    public function testIsEnabledWhenDisabled()
    {
        // Temporarily disable debug
        $originalValue = defined('JANKX_DEBUG') ? JANKX_DEBUG : false;
        define('JANKX_DEBUG', false);

        $this->assertFalse(DebugHelper::isEnabled());

        // Restore original value
        define('JANKX_DEBUG', $originalValue);
    }

    public function testGetDebugInfo()
    {
        $debugInfo = DebugHelper::getDebugInfo();

        $this->assertIsArray($debugInfo);

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

    public function testGetQueryCount()
    {
        $queryCount = DebugHelper::getQueryCount();

        $this->assertIsInt($queryCount);
        $this->assertGreaterThanOrEqual(0, $queryCount);
    }

    public function testAddPluginInfo()
    {
        $pluginName = 'Test Plugin';
        $info = 'Plugin is active';

        DebugHelper::addPluginInfo($pluginName, $info);

        // Test that the plugin info was added
        $debugInfo = DebugHelper::getDebugInfo();

        if (DebugHelper::isEnabled() && !empty($debugInfo['plugin_debug'])) {
            $this->assertArrayHasKey($pluginName, $debugInfo['plugin_debug']);
            $this->assertEquals($info, $debugInfo['plugin_debug'][$pluginName]);
        }
    }

    public function testFormatBytes()
    {
        // Test bytes
        $this->assertEquals('512 B', DebugHelper::formatBytes(512));

        // Test kilobytes
        $this->assertEquals('1.00 KB', DebugHelper::formatBytes(1024));
        $this->assertEquals('1.50 KB', DebugHelper::formatBytes(1536));

        // Test megabytes
        $this->assertEquals('1.00 MB', DebugHelper::formatBytes(1024 * 1024));
        $this->assertEquals('1.50 MB', DebugHelper::formatBytes(1024 * 1024 * 1.5));

        // Test gigabytes
        $this->assertEquals('1.00 GB', DebugHelper::formatBytes(1024 * 1024 * 1024));

        // Test terabytes
        $this->assertEquals('1.00 TB', DebugHelper::formatBytes(1024 * 1024 * 1024 * 1024));
    }

    public function testFormatBytesWithCustomPrecision()
    {
        $this->assertEquals('1.123 KB', DebugHelper::formatBytes(1150, 3));
        $this->assertEquals('1.1 KB', DebugHelper::formatBytes(1126, 1));
    }

    public function testFormatBytesEdgeCases()
    {
        // Test zero bytes
        $this->assertEquals('0 B', DebugHelper::formatBytes(0));

        // Test negative bytes (should still work)
        $this->assertEquals('-1 B', DebugHelper::formatBytes(-1));

        // Test very large numbers
        $this->assertEquals('1024.00 TB', DebugHelper::formatBytes(1024 * 1024 * 1024 * 1024 * 1024));
    }

    public function testCalculateMemoryUsagePercentage()
    {
        $this->assertEquals(50.0, DebugHelper::calculateMemoryUsagePercentage(50, 100));
        $this->assertEquals(0.0, DebugHelper::calculateMemoryUsagePercentage(0, 100));
        $this->assertEquals(0.0, DebugHelper::calculateMemoryUsagePercentage(50, -1));
        $this->assertEquals(0.0, DebugHelper::calculateMemoryUsagePercentage(50, 0));
    }

    public function testGetCurrentMemoryUsage()
    {
        $memoryUsage = DebugHelper::getCurrentMemoryUsage();

        $this->assertIsInt($memoryUsage);
        $this->assertGreaterThan(0, $memoryUsage);
    }

    public function testGetMemoryLimit()
    {
        $memoryLimit = DebugHelper::getMemoryLimit();

        $this->assertIsInt($memoryLimit);
        $this->assertGreaterThanOrEqual(-1, $memoryLimit);
    }

    public function testGetResponseTime()
    {
        $startTime = microtime(true);
        usleep(1000); // Sleep for 1ms
        $responseTime = DebugHelper::getResponseTime($startTime);

        $this->assertIsFloat($responseTime);
        $this->assertGreaterThan(0, $responseTime);
    }

    public function testLog()
    {
        $message = 'Test debug message';
        $context = ['test' => 'value'];

        // Test that log method doesn't throw errors
        $this->expectNotToPerformAssertions();

        DebugHelper::log($message, $context);
    }

    public function testLogWhenDisabled()
    {
        // Temporarily disable debug
        $originalValue = defined('JANKX_DEBUG') ? JANKX_DEBUG : false;
        define('JANKX_DEBUG', false);

        $message = 'Test debug message';
        $context = ['test' => 'value'];

        // Test that log method doesn't throw errors when disabled
        $this->expectNotToPerformAssertions();

        DebugHelper::log($message, $context);

        // Restore original value
        define('JANKX_DEBUG', $originalValue);
    }

    public function testGetDebugInfoWhenDisabled()
    {
        // Temporarily disable debug
        $originalValue = defined('JANKX_DEBUG') ? JANKX_DEBUG : false;
        define('JANKX_DEBUG', false);

        $debugInfo = DebugHelper::getDebugInfo();

        $this->assertIsArray($debugInfo);
        $this->assertEmpty($debugInfo);

        // Restore original value
        define('JANKX_DEBUG', $originalValue);
    }

    public function testGetQueryCountWhenDisabled()
    {
        // Temporarily disable debug
        $originalValue = defined('JANKX_DEBUG') ? JANKX_DEBUG : false;
        define('JANKX_DEBUG', false);

        $queryCount = DebugHelper::getQueryCount();

        $this->assertEquals(0, $queryCount);

        // Restore original value
        define('JANKX_DEBUG', $originalValue);
    }

    public function testAddPluginInfoWhenDisabled()
    {
        // Temporarily disable debug
        $originalValue = defined('JANKX_DEBUG') ? JANKX_DEBUG : false;
        define('JANKX_DEBUG', false);

        // Test that addPluginInfo method doesn't throw errors when disabled
        $this->expectNotToPerformAssertions();

        DebugHelper::addPluginInfo('Test Plugin', 'Test Info');

        // Restore original value
        define('JANKX_DEBUG', $originalValue);
    }

    public function testMemoryUsageConsistency()
    {
        $usage1 = DebugHelper::getCurrentMemoryUsage();
        $usage2 = DebugHelper::getCurrentMemoryUsage();

        // Memory usage should be consistent within a short time
        $this->assertGreaterThanOrEqual($usage1, $usage2);
    }

    public function testResponseTimeAccuracy()
    {
        $startTime = microtime(true);
        usleep(10000); // Sleep for 10ms
        $endTime = microtime(true);

        $expectedTime = $endTime - $startTime;
        $actualTime = DebugHelper::getResponseTime($startTime);

        // Allow for small timing differences
        $this->assertEquals($expectedTime, $actualTime, '', 0.01);
    }

    public function testDebugHelperPerformance()
    {
        $startTime = microtime(true);

        // Call multiple helper methods
        for ($i = 0; $i < 100; $i++) {
            DebugHelper::getCurrentMemoryUsage();
            DebugHelper::getMemoryLimit();
            DebugHelper::formatBytes($i * 1024);
        }

        $endTime = microtime(true);
        $executionTime = $endTime - $startTime;

        // Should complete quickly (less than 1 second)
        $this->assertLessThan(1.0, $executionTime);
    }

    public function testDebugHelperMemoryUsage()
    {
        $memoryBefore = memory_get_usage(true);

        // Call multiple helper methods
        for ($i = 0; $i < 1000; $i++) {
            DebugHelper::getCurrentMemoryUsage();
            DebugHelper::formatBytes($i * 1024);
        }

        $memoryAfter = memory_get_usage(true);
        $memoryUsed = $memoryAfter - $memoryBefore;

        // Should not use excessive memory
        $this->assertLessThan(5 * 1024 * 1024, $memoryUsed); // Less than 5MB
    }

    public function testDebugHelperConsistency()
    {
        // Multiple calls should return consistent results
        $memoryUsage1 = DebugHelper::getCurrentMemoryUsage();
        $memoryUsage2 = DebugHelper::getCurrentMemoryUsage();

        // Should be consistent within a short time
        $this->assertGreaterThanOrEqual($memoryUsage1, $memoryUsage2);

        $memoryLimit1 = DebugHelper::getMemoryLimit();
        $memoryLimit2 = DebugHelper::getMemoryLimit();

        // Should be exactly the same
        $this->assertEquals($memoryLimit1, $memoryLimit2);
    }
}