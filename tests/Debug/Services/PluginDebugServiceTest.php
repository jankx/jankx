<?php

namespace Tests\Debug\Services;

use PHPUnit\Framework\TestCase;
use Jankx\Debug\Services\PluginDebugService;

/**
 * Plugin Debug Service Test
 *
 * @package Tests\Debug\Services
 * @since 2.0.0
 */
class PluginDebugServiceTest extends TestCase
{
    private PluginDebugService $pluginDebugService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->pluginDebugService = new PluginDebugService();
    }

    public function testCaptureInfo()
    {
        $this->pluginDebugService->captureInfo();

        $pluginDebugInfo = $this->pluginDebugService->getPluginDebugInfo();
        $this->assertIsArray($pluginDebugInfo);
    }

    public function testGetPluginDebugInfo()
    {
        $pluginDebugInfo = $this->pluginDebugService->getPluginDebugInfo();

        $this->assertIsArray($pluginDebugInfo);
        $this->assertEmpty($pluginDebugInfo); // Should be empty initially
    }

    public function testAddDebugInfo()
    {
        $pluginName = 'Test Plugin';
        $info = 'Plugin is active and working';

        $this->pluginDebugService->addDebugInfo($pluginName, $info);

        $pluginDebugInfo = $this->pluginDebugService->getPluginDebugInfo();

        $this->assertArrayHasKey($pluginName, $pluginDebugInfo);
        $this->assertEquals($info, $pluginDebugInfo[$pluginName]);
    }

    public function testAddMultipleDebugInfo()
    {
        $plugins = [
            'Plugin 1' => 'Info 1',
            'Plugin 2' => 'Info 2',
            'Plugin 3' => 'Info 3'
        ];

        foreach ($plugins as $pluginName => $info) {
            $this->pluginDebugService->addDebugInfo($pluginName, $info);
        }

        $pluginDebugInfo = $this->pluginDebugService->getPluginDebugInfo();

        $this->assertCount(count($plugins), $pluginDebugInfo);

        foreach ($plugins as $pluginName => $info) {
            $this->assertArrayHasKey($pluginName, $pluginDebugInfo);
            $this->assertEquals($info, $pluginDebugInfo[$pluginName]);
        }
    }

    public function testAddDebugInfoWithEmptyValues()
    {
        // Test with empty plugin name
        $this->pluginDebugService->addDebugInfo('', 'Some info');

        // Test with empty info
        $this->pluginDebugService->addDebugInfo('Test Plugin', '');

        $pluginDebugInfo = $this->pluginDebugService->getPluginDebugInfo();

        $this->assertArrayHasKey('', $pluginDebugInfo);
        $this->assertArrayHasKey('Test Plugin', $pluginDebugInfo);
        $this->assertEquals('Some info', $pluginDebugInfo['']);
        $this->assertEquals('', $pluginDebugInfo['Test Plugin']);
    }

    public function testAddDebugInfoWithSpecialCharacters()
    {
        $pluginName = 'Test Plugin (v1.0.0)';
        $info = 'Plugin info with special chars: <>&"\'';

        $this->pluginDebugService->addDebugInfo($pluginName, $info);

        $pluginDebugInfo = $this->pluginDebugService->getPluginDebugInfo();

        $this->assertArrayHasKey($pluginName, $pluginDebugInfo);
        $this->assertEquals($info, $pluginDebugInfo[$pluginName]);
    }

    public function testAddDebugInfoWithLongValues()
    {
        $longPluginName = str_repeat('A', 1000);
        $longInfo = str_repeat('B', 1000);

        $this->pluginDebugService->addDebugInfo($longPluginName, $longInfo);

        $pluginDebugInfo = $this->pluginDebugService->getPluginDebugInfo();

        $this->assertArrayHasKey($longPluginName, $pluginDebugInfo);
        $this->assertEquals($longInfo, $pluginDebugInfo[$longPluginName]);
    }

    public function testAddDebugInfoOverwrite()
    {
        $pluginName = 'Test Plugin';
        $info1 = 'Original info';
        $info2 = 'Updated info';

        // Add initial info
        $this->pluginDebugService->addDebugInfo($pluginName, $info1);

        // Overwrite with new info
        $this->pluginDebugService->addDebugInfo($pluginName, $info2);

        $pluginDebugInfo = $this->pluginDebugService->getPluginDebugInfo();

        $this->assertArrayHasKey($pluginName, $pluginDebugInfo);
        $this->assertEquals($info2, $pluginDebugInfo[$pluginName]);
        $this->assertNotEquals($info1, $pluginDebugInfo[$pluginName]);
    }

    public function testGetPluginDebugInfoAfterCapture()
    {
        $this->pluginDebugService->captureInfo();

        $pluginDebugInfo = $this->pluginDebugService->getPluginDebugInfo();

        $this->assertIsArray($pluginDebugInfo);
    }

    public function testMultipleCaptureInfoCalls()
    {
        // First capture
        $this->pluginDebugService->captureInfo();
        $pluginDebugInfo1 = $this->pluginDebugService->getPluginDebugInfo();

        // Add some debug info
        $this->pluginDebugService->addDebugInfo('Test Plugin', 'Test Info');

        // Second capture
        $this->pluginDebugService->captureInfo();
        $pluginDebugInfo2 = $this->pluginDebugService->getPluginDebugInfo();

        // Both should be arrays
        $this->assertIsArray($pluginDebugInfo1);
        $this->assertIsArray($pluginDebugInfo2);
    }

    public function testPluginDebugInfoPerformance()
    {
        $startTime = microtime(true);

        // Add many plugins quickly
        for ($i = 0; $i < 100; $i++) {
            $this->pluginDebugService->addDebugInfo("Plugin $i", "Info $i");
        }

        $pluginDebugInfo = $this->pluginDebugService->getPluginDebugInfo();

        $endTime = microtime(true);
        $executionTime = $endTime - $startTime;

        // Should complete quickly (less than 1 second)
        $this->assertLessThan(1.0, $executionTime);
        $this->assertIsArray($pluginDebugInfo);
        $this->assertCount(100, $pluginDebugInfo);
    }

    public function testPluginDebugInfoMemoryUsage()
    {
        $memoryBefore = memory_get_usage(true);

        // Add many plugins
        for ($i = 0; $i < 1000; $i++) {
            $this->pluginDebugService->addDebugInfo("Plugin $i", "Info $i");
        }

        $pluginDebugInfo = $this->pluginDebugService->getPluginDebugInfo();

        $memoryAfter = memory_get_usage(true);
        $memoryUsed = $memoryAfter - $memoryBefore;

        // Should not use excessive memory
        $this->assertLessThan(10 * 1024 * 1024, $memoryUsed); // Less than 10MB

        $this->assertIsArray($pluginDebugInfo);
        $this->assertCount(1000, $pluginDebugInfo);
    }

    public function testPluginDebugInfoConsistency()
    {
        // Add some debug info
        $this->pluginDebugService->addDebugInfo('Plugin 1', 'Info 1');
        $this->pluginDebugService->addDebugInfo('Plugin 2', 'Info 2');

        $pluginDebugInfo1 = $this->pluginDebugService->getPluginDebugInfo();
        $pluginDebugInfo2 = $this->pluginDebugService->getPluginDebugInfo();

        // Multiple calls should return the same data
        $this->assertEquals($pluginDebugInfo1, $pluginDebugInfo2);
    }

    public function testPluginDebugInfoStructure()
    {
        $this->pluginDebugService->addDebugInfo('Test Plugin', 'Test Info');

        $pluginDebugInfo = $this->pluginDebugService->getPluginDebugInfo();

        // Should be an associative array
        $this->assertIsArray($pluginDebugInfo);
        $this->assertNotEmpty($pluginDebugInfo);

        foreach ($pluginDebugInfo as $pluginName => $info) {
            $this->assertIsString($pluginName);
            $this->assertIsString($info);
        }
    }

    public function testPluginDebugInfoWithNumericKeys()
    {
        $this->pluginDebugService->addDebugInfo('123', 'Numeric plugin name');
        $this->pluginDebugService->addDebugInfo('Plugin 456', 'Info with number');

        $pluginDebugInfo = $this->pluginDebugService->getPluginDebugInfo();

        $this->assertArrayHasKey('123', $pluginDebugInfo);
        $this->assertArrayHasKey('Plugin 456', $pluginDebugInfo);
        $this->assertEquals('Numeric plugin name', $pluginDebugInfo['123']);
        $this->assertEquals('Info with number', $pluginDebugInfo['Plugin 456']);
    }

    public function testPluginDebugInfoWithUnicode()
    {
        $pluginName = 'Plugin with unicode: 测试插件';
        $info = 'Info with unicode: 测试信息';

        $this->pluginDebugService->addDebugInfo($pluginName, $info);

        $pluginDebugInfo = $this->pluginDebugService->getPluginDebugInfo();

        $this->assertArrayHasKey($pluginName, $pluginDebugInfo);
        $this->assertEquals($info, $pluginDebugInfo[$pluginName]);
    }

    public function testPluginDebugInfoWithNewlines()
    {
        $pluginName = "Plugin\nwith\nnewlines";
        $info = "Info\nwith\nnewlines";

        $this->pluginDebugService->addDebugInfo($pluginName, $info);

        $pluginDebugInfo = $this->pluginDebugService->getPluginDebugInfo();

        $this->assertArrayHasKey($pluginName, $pluginDebugInfo);
        $this->assertEquals($info, $pluginDebugInfo[$pluginName]);
    }
}