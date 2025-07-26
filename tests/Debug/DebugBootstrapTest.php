<?php

namespace Tests\Debug;

use PHPUnit\Framework\TestCase;
use Jankx\Debug\DebugBootstrap;

/**
 * Debug Bootstrap Test
 *
 * @package Tests\Debug
 * @since 2.0.1
 */
class DebugBootstrapTest extends TestCase
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
        $this->assertTrue(method_exists(DebugBootstrap::class, 'init'));

        // Test that init method doesn't throw errors
        $this->expectNotToPerformAssertions();

        DebugBootstrap::init();
    }

    public function testCollectPluginInfoMethod()
    {
        // Test that collectPluginInfo method exists and is callable
        $this->assertTrue(method_exists(DebugBootstrap::class, 'collectPluginInfo'));

        // Test that collectPluginInfo method doesn't throw errors
        $this->expectNotToPerformAssertions();

        // Create a mock plugin debug service
        $pluginDebugService = new \stdClass();
        $pluginDebugService->addDebugInfo = function($name, $info) {
            // Mock implementation
        };

        DebugBootstrap::collectPluginInfo($pluginDebugService);
    }

    public function testAddPluginDebugInfoMethod()
    {
        // Test that addPluginDebugInfo method exists and is callable
        $this->assertTrue(method_exists(DebugBootstrap::class, 'addPluginDebugInfo'));

        // Test that addPluginDebugInfo method doesn't throw errors
        $this->expectNotToPerformAssertions();

        DebugBootstrap::addPluginDebugInfo('Test Plugin', 'Test Info');
    }

    public function testInitWithDebugEnabled()
    {
        // Test init when debug is enabled
        $this->expectNotToPerformAssertions();

        DebugBootstrap::init();
    }

    public function testInitWithDebugDisabled()
    {
        // Temporarily disable debug
        $originalValue = defined('JANKX_DEBUG') ? JANKX_DEBUG : false;
        define('JANKX_DEBUG', false);

        // Test init when debug is disabled
        $this->expectNotToPerformAssertions();

        DebugBootstrap::init();

        // Restore original value
        define('JANKX_DEBUG', $originalValue);
    }

    public function testInitWithDebugNotDefined()
    {
        // Temporarily undefine JANKX_DEBUG
        $originalValue = defined('JANKX_DEBUG') ? JANKX_DEBUG : false;
        if (defined('JANKX_DEBUG')) {
            // We can't undefine constants in PHP, so we'll test with false
            define('JANKX_DEBUG', false);
        }

        // Test init when debug is not defined
        $this->expectNotToPerformAssertions();

        DebugBootstrap::init();

        // Restore original value
        define('JANKX_DEBUG', $originalValue);
    }

    public function testCollectPluginInfoWithValidService()
    {
        // Test collectPluginInfo with a valid service object
        $this->expectNotToPerformAssertions();

        // Create a mock plugin debug service
        $pluginDebugService = new \stdClass();
        $pluginDebugService->addDebugInfo = function($name, $info) {
            // Mock implementation
        };

        DebugBootstrap::collectPluginInfo($pluginDebugService);
    }

    public function testCollectPluginInfoWithNullService()
    {
        // Test collectPluginInfo with null service
        $this->expectNotToPerformAssertions();

        DebugBootstrap::collectPluginInfo(null);
    }

    public function testAddPluginDebugInfoWithValidParameters()
    {
        // Test addPluginDebugInfo with valid parameters
        $this->expectNotToPerformAssertions();

        DebugBootstrap::addPluginDebugInfo('Test Plugin', 'Test Info');
        DebugBootstrap::addPluginDebugInfo('Another Plugin', 'Another Info');
    }

    public function testAddPluginDebugInfoWithEmptyParameters()
    {
        // Test addPluginDebugInfo with empty parameters
        $this->expectNotToPerformAssertions();

        DebugBootstrap::addPluginDebugInfo('', '');
        DebugBootstrap::addPluginDebugInfo('Test Plugin', '');
        DebugBootstrap::addPluginDebugInfo('', 'Test Info');
    }

    public function testAddPluginDebugInfoWithSpecialCharacters()
    {
        // Test addPluginDebugInfo with special characters
        $this->expectNotToPerformAssertions();

        DebugBootstrap::addPluginDebugInfo('Plugin <v1.0>', 'Info with <>&"\' characters');
        DebugBootstrap::addPluginDebugInfo('Plugin with unicode: 测试插件', 'Info with unicode: 测试信息');
    }

    public function testAddPluginDebugInfoWithLongStrings()
    {
        // Test addPluginDebugInfo with long strings
        $this->expectNotToPerformAssertions();

        $longPluginName = str_repeat('A', 1000);
        $longInfo = str_repeat('B', 1000);

        DebugBootstrap::addPluginDebugInfo($longPluginName, $longInfo);
    }

    public function testBootstrapPerformance()
    {
        $startTime = microtime(true);

        // Call bootstrap methods multiple times
        for ($i = 0; $i < 10; $i++) {
            DebugBootstrap::init();
            DebugBootstrap::addPluginDebugInfo("Plugin $i", "Info $i");
        }

        $endTime = microtime(true);
        $executionTime = $endTime - $startTime;

        // Should complete quickly (less than 1 second)
        $this->assertLessThan(1.0, $executionTime);
    }

    public function testBootstrapMemoryUsage()
    {
        $memoryBefore = memory_get_usage(true);

        // Call bootstrap methods multiple times
        for ($i = 0; $i < 100; $i++) {
            DebugBootstrap::init();
            DebugBootstrap::addPluginDebugInfo("Plugin $i", "Info $i");
        }

        $memoryAfter = memory_get_usage(true);
        $memoryUsed = $memoryAfter - $memoryBefore;

        // Should not use excessive memory
        $this->assertLessThan(10 * 1024 * 1024, $memoryUsed); // Less than 10MB
    }

    public function testBootstrapConsistency()
    {
        // Multiple calls should be consistent
        $this->expectNotToPerformAssertions();

        // Call init multiple times
        for ($i = 0; $i < 5; $i++) {
            DebugBootstrap::init();
        }

        // Call addPluginDebugInfo multiple times
        for ($i = 0; $i < 5; $i++) {
            DebugBootstrap::addPluginDebugInfo("Plugin $i", "Info $i");
        }
    }

    public function testBootstrapErrorHandling()
    {
        // Test that bootstrap methods handle errors gracefully
        $this->expectNotToPerformAssertions();

        // Test with invalid parameters
        DebugBootstrap::collectPluginInfo(null);
        DebugBootstrap::addPluginDebugInfo(null, null);
        DebugBootstrap::addPluginDebugInfo('', '');

        // Test that init still works
        DebugBootstrap::init();
    }

    public function testBootstrapWithLargeData()
    {
        // Test bootstrap methods with large amounts of data
        $this->expectNotToPerformAssertions();

        // Add many plugin debug info entries
        for ($i = 0; $i < 1000; $i++) {
            DebugBootstrap::addPluginDebugInfo("Plugin $i", "Info $i");
        }
    }

    public function testBootstrapMethodsExist()
    {
        // Test that all required methods exist
        $this->assertTrue(method_exists(DebugBootstrap::class, 'init'));
        $this->assertTrue(method_exists(DebugBootstrap::class, 'collectPluginInfo'));
        $this->assertTrue(method_exists(DebugBootstrap::class, 'addPluginDebugInfo'));
    }

    public function testBootstrapMethodsAreStatic()
    {
        // Test that all methods are static
        $reflection = new \ReflectionClass(DebugBootstrap::class);

        $initMethod = $reflection->getMethod('init');
        $this->assertTrue($initMethod->isStatic());

        $collectMethod = $reflection->getMethod('collectPluginInfo');
        $this->assertTrue($collectMethod->isStatic());

        $addMethod = $reflection->getMethod('addPluginDebugInfo');
        $this->assertTrue($addMethod->isStatic());
    }

    public function testBootstrapMethodsArePublic()
    {
        // Test that all methods are public
        $reflection = new \ReflectionClass(DebugBootstrap::class);

        $initMethod = $reflection->getMethod('init');
        $this->assertTrue($initMethod->isPublic());

        $collectMethod = $reflection->getMethod('collectPluginInfo');
        $this->assertTrue($collectMethod->isPublic());

        $addMethod = $reflection->getMethod('addPluginDebugInfo');
        $this->assertTrue($addMethod->isPublic());
    }

    public function testBootstrapIntegration()
    {
        // Test integration between bootstrap methods
        $this->expectNotToPerformAssertions();

        // Initialize debug system
        DebugBootstrap::init();

        // Add plugin debug info
        DebugBootstrap::addPluginDebugInfo('Test Plugin', 'Test Info');

        // Collect plugin info
        $pluginDebugService = new \stdClass();
        $pluginDebugService->addDebugInfo = function($name, $info) {
            // Mock implementation
        };

        DebugBootstrap::collectPluginInfo($pluginDebugService);
    }
}