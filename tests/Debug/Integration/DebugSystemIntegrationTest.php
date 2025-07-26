<?php

namespace Tests\Debug\Integration;

use PHPUnit\Framework\TestCase;
use Jankx\Debug\DebugIntegration;
use Jankx\Debug\Helpers\DebugHelper;
use Jankx\Debug\Facades\Debug;

/**
 * Debug System Integration Test
 *
 * @package Tests\Debug\Integration
 * @since 2.0.1
 */
class DebugSystemIntegrationTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Enable debug for testing
        if (!defined('JANKX_DEBUG')) {
            define('JANKX_DEBUG', true);
        }
    }

    public function testDebugSystemInitialization()
    {
        // Test that debug system can be initialized without errors
        $this->expectNotToPerformAssertions();

        DebugIntegration::init();
    }

    public function testDebugSystemCompleteFlow()
    {
        // Initialize debug system
        DebugIntegration::init();

        // Get debug info
        $debugInfo = DebugHelper::getDebugInfo();

        $this->assertIsArray($debugInfo);

        if (!empty($debugInfo)) {
            // Check required keys
            $requiredKeys = [
                'response_time',
                'memory_usage',
                'memory_limit',
                'query_count',
                'cache_info',
                'gutenberg_blocks',
                'plugin_debug'
            ];

            foreach ($requiredKeys as $key) {
                $this->assertArrayHasKey($key, $debugInfo);
            }

            // Check data types
            $this->assertIsFloat($debugInfo['response_time']);
            $this->assertIsInt($debugInfo['memory_usage']);
            $this->assertIsInt($debugInfo['memory_limit']);
            $this->assertIsInt($debugInfo['query_count']);
            $this->assertIsArray($debugInfo['cache_info']);
            $this->assertIsArray($debugInfo['gutenberg_blocks']);
            $this->assertIsArray($debugInfo['plugin_debug']);
        }
    }

    public function testDebugSystemWithPluginIntegration()
    {
        // Initialize debug system
        DebugIntegration::init();

        // Add plugin debug info
        DebugHelper::addPluginInfo('Test Plugin', 'Version 1.0.0');
        DebugHelper::addPluginInfo('Another Plugin', 'Active');

        // Get debug info
        $debugInfo = DebugHelper::getDebugInfo();

        if (!empty($debugInfo) && !empty($debugInfo['plugin_debug'])) {
            $pluginDebug = $debugInfo['plugin_debug'];

            $this->assertArrayHasKey('Test Plugin', $pluginDebug);
            $this->assertArrayHasKey('Another Plugin', $pluginDebug);
            $this->assertEquals('Version 1.0.0', $pluginDebug['Test Plugin']);
            $this->assertEquals('Active', $pluginDebug['Another Plugin']);
        }
    }

    public function testDebugSystemPerformance()
    {
        $startTime = microtime(true);

        // Initialize debug system
        DebugIntegration::init();

        // Get debug info multiple times
        for ($i = 0; $i < 10; $i++) {
            $debugInfo = DebugHelper::getDebugInfo();
            $this->assertIsArray($debugInfo);
        }

        $endTime = microtime(true);
        $executionTime = $endTime - $startTime;

        // Should complete quickly (less than 1 second)
        $this->assertLessThan(1.0, $executionTime);
    }

    public function testDebugSystemMemoryUsage()
    {
        $memoryBefore = memory_get_usage(true);

        // Initialize debug system
        DebugIntegration::init();

        // Get debug info
        $debugInfo = DebugHelper::getDebugInfo();

        $memoryAfter = memory_get_usage(true);
        $memoryUsed = $memoryAfter - $memoryBefore;

        // Should not use excessive memory
        $this->assertLessThan(10 * 1024 * 1024, $memoryUsed); // Less than 10MB

        $this->assertIsArray($debugInfo);
    }

    public function testDebugSystemConsistency()
    {
        // Initialize debug system
        DebugIntegration::init();

        // Get debug info multiple times
        $debugInfo1 = DebugHelper::getDebugInfo();
        $debugInfo2 = DebugHelper::getDebugInfo();

        // Structure should be consistent
        $this->assertEquals(array_keys($debugInfo1), array_keys($debugInfo2));

        // Data types should be consistent
        foreach ($debugInfo1 as $key => $value) {
            $this->assertEquals(gettype($value), gettype($debugInfo2[$key]));
        }
    }

    public function testDebugSystemWithDisabledDebug()
    {
        // Temporarily disable debug
        $originalValue = defined('JANKX_DEBUG') ? JANKX_DEBUG : false;
        define('JANKX_DEBUG', false);

        // Initialize debug system
        DebugIntegration::init();

        // Get debug info
        $debugInfo = DebugHelper::getDebugInfo();

        $this->assertIsArray($debugInfo);
        $this->assertEmpty($debugInfo);

        // Restore original value
        define('JANKX_DEBUG', $originalValue);
    }

    public function testDebugSystemFacadeMethods()
    {
        // Test facade methods exist and are callable
        $this->assertTrue(method_exists(Debug::class, 'init'));
        $this->assertTrue(method_exists(Debug::class, 'addPluginInfo'));
        $this->assertTrue(method_exists(Debug::class, 'getInfo'));
        $this->assertTrue(method_exists(Debug::class, 'getQueryCount'));
    }

    public function testDebugSystemHelperMethods()
    {
        // Test helper methods exist and are callable
        $this->assertTrue(method_exists(DebugHelper::class, 'isEnabled'));
        $this->assertTrue(method_exists(DebugHelper::class, 'getDebugInfo'));
        $this->assertTrue(method_exists(DebugHelper::class, 'getQueryCount'));
        $this->assertTrue(method_exists(DebugHelper::class, 'addPluginInfo'));
        $this->assertTrue(method_exists(DebugHelper::class, 'formatBytes'));
        $this->assertTrue(method_exists(DebugHelper::class, 'log'));
    }

    public function testDebugSystemIntegrationMethods()
    {
        // Test integration methods exist and are callable
        $this->assertTrue(method_exists(DebugIntegration::class, 'init'));
        $this->assertTrue(method_exists(DebugIntegration::class, 'addThemeDebugInfo'));
        $this->assertTrue(method_exists(DebugIntegration::class, 'addPerformanceInfo'));
        $this->assertTrue(method_exists(DebugIntegration::class, 'getDebugPanel'));
        $this->assertTrue(method_exists(DebugIntegration::class, 'displayDebugPanel'));
    }

    public function testDebugSystemErrorHandling()
    {
        // Test that debug system handles errors gracefully
        $this->expectNotToPerformAssertions();

        // Initialize debug system
        DebugIntegration::init();

        // Add invalid plugin info (should not throw errors)
        DebugHelper::addPluginInfo('', '');
        DebugHelper::addPluginInfo(null, null);

        // Get debug info (should not throw errors)
        $debugInfo = DebugHelper::getDebugInfo();
        $this->assertIsArray($debugInfo);
    }

    public function testDebugSystemWithLargeData()
    {
        // Initialize debug system
        DebugIntegration::init();

        // Add many plugin debug info entries
        for ($i = 0; $i < 100; $i++) {
            DebugHelper::addPluginInfo("Plugin $i", "Info $i");
        }

        // Get debug info
        $debugInfo = DebugHelper::getDebugInfo();

        $this->assertIsArray($debugInfo);

        if (!empty($debugInfo) && !empty($debugInfo['plugin_debug'])) {
            $this->assertGreaterThanOrEqual(100, count($debugInfo['plugin_debug']));
        }
    }

    public function testDebugSystemWithSpecialCharacters()
    {
        // Initialize debug system
        DebugIntegration::init();

        // Add plugin info with special characters
        DebugHelper::addPluginInfo('Plugin <v1.0>', 'Info with <>&"\' characters');
        DebugHelper::addPluginInfo('Plugin with unicode: 测试插件', 'Info with unicode: 测试信息');

        // Get debug info
        $debugInfo = DebugHelper::getDebugInfo();

        $this->assertIsArray($debugInfo);

        if (!empty($debugInfo) && !empty($debugInfo['plugin_debug'])) {
            $pluginDebug = $debugInfo['plugin_debug'];

            $this->assertArrayHasKey('Plugin <v1.0>', $pluginDebug);
            $this->assertArrayHasKey('Plugin with unicode: 测试插件', $pluginDebug);
            $this->assertEquals('Info with <>&"\' characters', $pluginDebug['Plugin <v1.0>']);
            $this->assertEquals('Info with unicode: 测试信息', $pluginDebug['Plugin with unicode: 测试插件']);
        }
    }

    public function testDebugSystemLogging()
    {
        // Initialize debug system
        DebugIntegration::init();

        // Test logging functionality
        $this->expectNotToPerformAssertions();

        DebugHelper::log('Test message', ['context' => 'test']);
        DebugHelper::log('Another message', ['data' => [1, 2, 3]]);
    }

    public function testDebugSystemFormatting()
    {
        // Test formatting functions
        $this->assertEquals('1.00 KB', DebugHelper::formatBytes(1024));
        $this->assertEquals('1.00 MB', DebugHelper::formatBytes(1024 * 1024));
        $this->assertEquals('1.00 GB', DebugHelper::formatBytes(1024 * 1024 * 1024));

        $this->assertEquals(50.0, DebugHelper::calculateMemoryUsagePercentage(50, 100));
        $this->assertEquals(0.0, DebugHelper::calculateMemoryUsagePercentage(0, 100));
    }

    public function testDebugSystemMemoryFunctions()
    {
        // Test memory functions
        $memoryUsage = DebugHelper::getCurrentMemoryUsage();
        $memoryLimit = DebugHelper::getMemoryLimit();

        $this->assertIsInt($memoryUsage);
        $this->assertIsInt($memoryLimit);
        $this->assertGreaterThan(0, $memoryUsage);
        $this->assertGreaterThanOrEqual(-1, $memoryLimit);
    }

    public function testDebugSystemResponseTime()
    {
        // Test response time function
        $startTime = microtime(true);
        usleep(1000); // Sleep for 1ms
        $responseTime = DebugHelper::getResponseTime($startTime);

        $this->assertIsFloat($responseTime);
        $this->assertGreaterThan(0, $responseTime);
    }
}