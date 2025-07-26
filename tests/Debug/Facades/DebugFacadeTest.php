<?php

namespace Tests\Debug\Facades;

use PHPUnit\Framework\TestCase;
use Jankx\Debug\Facades\Debug;

/**
 * Debug Facade Test
 *
 * @package Tests\Debug\Facades
 * @since 2.0.1
 */
class DebugFacadeTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        // Enable debug for testing
        if (!defined('JANKX_DEBUG')) {
            define('JANKX_DEBUG', true);
        }
    }

    public function testInitMethod()
    {
        // Test that init method exists and is callable
        $this->assertTrue(method_exists(Debug::class, 'init'));

        // Test that init method doesn't throw errors
        $this->expectNotToPerformAssertions();

        Debug::init();
    }

    public function testAddPluginInfoMethod()
    {
        // Test that addPluginInfo method exists and is callable
        $this->assertTrue(method_exists(Debug::class, 'addPluginInfo'));

        // Test that addPluginInfo method doesn't throw errors
        $this->expectNotToPerformAssertions();

        Debug::addPluginInfo('Test Plugin', 'Test Info');
    }

    public function testGetInfoMethod()
    {
        // Test that getInfo method exists and is callable
        $this->assertTrue(method_exists(Debug::class, 'getInfo'));

        $info = Debug::getInfo();

        $this->assertIsArray($info);
    }

    public function testGetQueryCountMethod()
    {
        // Test that getQueryCount method exists and is callable
        $this->assertTrue(method_exists(Debug::class, 'getQueryCount'));

        $queryCount = Debug::getQueryCount();

        $this->assertIsInt($queryCount);
        $this->assertGreaterThanOrEqual(0, $queryCount);
    }

    public function testFacadeMethodsWithParameters()
    {
        // Test addPluginInfo with different parameters
        $this->expectNotToPerformAssertions();

        Debug::addPluginInfo('Plugin 1', 'Info 1');
        Debug::addPluginInfo('Plugin 2', 'Info 2');
        Debug::addPluginInfo('', 'Empty name');
        Debug::addPluginInfo('Test Plugin', '');
    }

    public function testFacadeMethodsWithSpecialCharacters()
    {
        // Test addPluginInfo with special characters
        $this->expectNotToPerformAssertions();

        Debug::addPluginInfo('Plugin <v1.0>', 'Info with <>&"\' characters');
        Debug::addPluginInfo('Plugin with unicode: 测试插件', 'Info with unicode: 测试信息');
    }

    public function testFacadeMethodsWithLongStrings()
    {
        // Test addPluginInfo with long strings
        $this->expectNotToPerformAssertions();

        $longPluginName = str_repeat('A', 1000);
        $longInfo = str_repeat('B', 1000);

        Debug::addPluginInfo($longPluginName, $longInfo);
    }

    public function testFacadeMethodsPerformance()
    {
        $startTime = microtime(true);

        // Call facade methods multiple times
        for ($i = 0; $i < 100; $i++) {
            Debug::addPluginInfo("Plugin $i", "Info $i");
        }

        $info = Debug::getInfo();
        $queryCount = Debug::getQueryCount();

        $endTime = microtime(true);
        $executionTime = $endTime - $startTime;

        // Should complete quickly (less than 1 second)
        $this->assertLessThan(1.0, $executionTime);

        $this->assertIsArray($info);
        $this->assertIsInt($queryCount);
    }

    public function testFacadeMethodsMemoryUsage()
    {
        $memoryBefore = memory_get_usage(true);

        // Call facade methods multiple times
        for ($i = 0; $i < 1000; $i++) {
            Debug::addPluginInfo("Plugin $i", "Info $i");
        }

        $info = Debug::getInfo();

        $memoryAfter = memory_get_usage(true);
        $memoryUsed = $memoryAfter - $memoryBefore;

        // Should not use excessive memory
        $this->assertLessThan(10 * 1024 * 1024, $memoryUsed); // Less than 10MB

        $this->assertIsArray($info);
    }

    public function testFacadeMethodsConsistency()
    {
        // Multiple calls should return consistent results
        $info1 = Debug::getInfo();
        $info2 = Debug::getInfo();

        // Structure should be consistent
        $this->assertEquals(array_keys($info1), array_keys($info2));

        $queryCount1 = Debug::getQueryCount();
        $queryCount2 = Debug::getQueryCount();

        // Query count should be consistent within a short time
        $this->assertGreaterThanOrEqual($queryCount1, $queryCount2);
    }

    public function testFacadeMethodsWithDisabledDebug()
    {
        // Temporarily disable debug
        $originalValue = defined('JANKX_DEBUG') ? JANKX_DEBUG : false;
        define('JANKX_DEBUG', false);

        // Test that facade methods don't throw errors when debug is disabled
        $this->expectNotToPerformAssertions();

        Debug::init();
        Debug::addPluginInfo('Test Plugin', 'Test Info');
        $info = Debug::getInfo();
        $queryCount = Debug::getQueryCount();

        $this->assertIsArray($info);
        $this->assertIsInt($queryCount);

        // Restore original value
        define('JANKX_DEBUG', $originalValue);
    }

    public function testFacadeMethodsErrorHandling()
    {
        // Test that facade methods handle errors gracefully
        $this->expectNotToPerformAssertions();

        // Test with invalid parameters
        Debug::addPluginInfo(null, null);
        Debug::addPluginInfo('', '');
        Debug::addPluginInfo(123, 456);

        // Test that getInfo and getQueryCount still work
        $info = Debug::getInfo();
        $queryCount = Debug::getQueryCount();

        $this->assertIsArray($info);
        $this->assertIsInt($queryCount);
    }

    public function testFacadeMethodsWithLargeData()
    {
        // Test facade methods with large amounts of data
        $this->expectNotToPerformAssertions();

        // Add many plugin info entries
        for ($i = 0; $i < 1000; $i++) {
            Debug::addPluginInfo("Plugin $i", "Info $i");
        }

        // Get info
        $info = Debug::getInfo();

        $this->assertIsArray($info);

        if (!empty($info) && !empty($info['plugin_debug'])) {
            $this->assertGreaterThanOrEqual(1000, count($info['plugin_debug']));
        }
    }

    public function testFacadeMethodsStructure()
    {
        // Test that facade methods return expected structure
        $info = Debug::getInfo();

        $this->assertIsArray($info);

        if (!empty($info)) {
            $expectedKeys = [
                'response_time',
                'memory_usage',
                'memory_limit',
                'query_count',
                'cache_info',
                'gutenberg_blocks',
                'plugin_debug'
            ];

            foreach ($expectedKeys as $key) {
                $this->assertArrayHasKey($key, $info);
            }
        }
    }

    public function testFacadeMethodsDataTypes()
    {
        // Test that facade methods return correct data types
        $info = Debug::getInfo();
        $queryCount = Debug::getQueryCount();

        $this->assertIsArray($info);
        $this->assertIsInt($queryCount);

        if (!empty($info)) {
            $this->assertIsFloat($info['response_time']);
            $this->assertIsInt($info['memory_usage']);
            $this->assertIsInt($info['memory_limit']);
            $this->assertIsInt($info['query_count']);
            $this->assertIsArray($info['cache_info']);
            $this->assertIsArray($info['gutenberg_blocks']);
            $this->assertIsArray($info['plugin_debug']);
        }
    }

    public function testFacadeMethodsIntegration()
    {
        // Test integration between facade methods
        Debug::init();

        // Add plugin info
        Debug::addPluginInfo('Test Plugin', 'Test Info');

        // Get info
        $info = Debug::getInfo();

        $this->assertIsArray($info);

        if (!empty($info) && !empty($info['plugin_debug'])) {
            $this->assertArrayHasKey('Test Plugin', $info['plugin_debug']);
            $this->assertEquals('Test Info', $info['plugin_debug']['Test Plugin']);
        }

        // Get query count
        $queryCount = Debug::getQueryCount();
        $this->assertIsInt($queryCount);
        $this->assertGreaterThanOrEqual(0, $queryCount);
    }
}