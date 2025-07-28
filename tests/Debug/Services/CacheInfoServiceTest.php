<?php

namespace Tests\Debug\Services;

use PHPUnit\Framework\TestCase;
use Jankx\Debug\Services\CacheInfoService;

/**
 * Cache Info Service Test
 *
 * @package Tests\Debug\Services
 * @since 2.0.0
 */
class CacheInfoServiceTest extends TestCase
{
    private CacheInfoService $cacheInfoService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->cacheInfoService = new CacheInfoService();
    }

    public function testCaptureInfo()
    {
        $this->cacheInfoService->captureInfo();

        $cacheInfo = $this->cacheInfoService->getCacheInfo();
        $this->assertIsArray($cacheInfo);
        $this->assertNotEmpty($cacheInfo);
    }

    public function testGetCacheInfo()
    {
        $this->cacheInfoService->captureInfo();

        $cacheInfo = $this->cacheInfoService->getCacheInfo();

        $this->assertIsArray($cacheInfo);
        $this->assertArrayHasKey('object_cache', $cacheInfo);
        $this->assertArrayHasKey('transients', $cacheInfo);
        $this->assertArrayHasKey('plugins', $cacheInfo);
        $this->assertArrayHasKey('summary', $cacheInfo);
    }

    public function testGetTransientsInfo()
    {
        $transientsInfo = $this->cacheInfoService->getTransientsInfo();

        $this->assertIsArray($transientsInfo);
        $this->assertArrayHasKey('count', $transientsInfo);
        $this->assertArrayHasKey('size', $transientsInfo);
        $this->assertArrayHasKey('items', $transientsInfo);

        $this->assertIsInt($transientsInfo['count']);
        $this->assertIsInt($transientsInfo['size']);
        $this->assertIsArray($transientsInfo['items']);
    }

    public function testGetObjectCacheInfo()
    {
        $objectCacheInfo = $this->cacheInfoService->getObjectCacheInfo();

        $this->assertIsArray($objectCacheInfo);
        $this->assertArrayHasKey('enabled', $objectCacheInfo);
        $this->assertArrayHasKey('type', $objectCacheInfo);
        $this->assertArrayHasKey('stats', $objectCacheInfo);

        $this->assertIsBool($objectCacheInfo['enabled']);
        $this->assertIsString($objectCacheInfo['type']);
        $this->assertIsArray($objectCacheInfo['stats']);
    }

    public function testGetPluginCacheInfo()
    {
        $pluginCacheInfo = $this->cacheInfoService->getPluginCacheInfo();

        $this->assertIsArray($pluginCacheInfo);

        // Should be an array of plugin cache information
        foreach ($pluginCacheInfo as $pluginName => $pluginInfo) {
            $this->assertIsString($pluginName);
            $this->assertIsArray($pluginInfo);
        }
    }

    public function testObjectCacheTypeDetection()
    {
        $this->cacheInfoService->captureInfo();
        $objectCacheInfo = $this->cacheInfoService->getObjectCacheInfo();

        $type = $objectCacheInfo['type'];
        $this->assertIsString($type);

        // Should be one of the expected types
        $expectedTypes = ['WordPress Default', 'Memcached', 'Redis', 'External Object Cache'];
        $this->assertContains($type, $expectedTypes);
    }

    public function testObjectCacheStats()
    {
        $this->cacheInfoService->captureInfo();
        $objectCacheInfo = $this->cacheInfoService->getObjectCacheInfo();
        $stats = $objectCacheInfo['stats'];

        $this->assertIsArray($stats);

        if (!empty($stats)) {
            $this->assertArrayHasKey('hits', $stats);
            $this->assertArrayHasKey('misses', $stats);
            $this->assertArrayHasKey('hit_rate', $stats);
            $this->assertArrayHasKey('memory_usage', $stats);
            $this->assertArrayHasKey('memory_limit', $stats);

            $this->assertIsInt($stats['hits']);
            $this->assertIsInt($stats['misses']);
            $this->assertIsFloat($stats['hit_rate']);
            $this->assertIsInt($stats['memory_usage']);
            $this->assertIsInt($stats['memory_limit']);
        }
    }

    public function testHitRateCalculation()
    {
        // Test with zero hits and misses
        $stats = ['hits' => 0, 'misses' => 0];
        $hitRate = $this->invokeMethod($this->cacheInfoService, 'calculateHitRate', [$stats]);
        $this->assertEquals(0.0, $hitRate);

        // Test with some hits and misses
        $stats = ['hits' => 80, 'misses' => 20];
        $hitRate = $this->invokeMethod($this->cacheInfoService, 'calculateHitRate', [$stats]);
        $this->assertEquals(80.0, $hitRate);

        // Test with only hits
        $stats = ['hits' => 100, 'misses' => 0];
        $hitRate = $this->invokeMethod($this->cacheInfoService, 'calculateHitRate', [$stats]);
        $this->assertEquals(100.0, $hitRate);

        // Test with only misses
        $stats = ['hits' => 0, 'misses' => 100];
        $hitRate = $this->invokeMethod($this->cacheInfoService, 'calculateHitRate', [$stats]);
        $this->assertEquals(0.0, $hitRate);
    }

    public function testPluginCacheDetection()
    {
        $this->cacheInfoService->captureInfo();
        $pluginCacheInfo = $this->cacheInfoService->getPluginCacheInfo();

        // Should detect common caching plugins if they exist
        $commonPlugins = [
            'W3 Total Cache',
            'WP Super Cache',
            'WP Rocket',
            'LiteSpeed Cache',
            'Autoptimize'
        ];

        $this->assertIsArray($pluginCacheInfo);

        foreach ($commonPlugins as $pluginName) {
            if (isset($pluginCacheInfo[$pluginName])) {
                $pluginInfo = $pluginCacheInfo[$pluginName];
                $this->assertIsArray($pluginInfo);
                $this->assertArrayHasKey('status', $pluginInfo);
                $this->assertArrayHasKey('details', $pluginInfo);
            }
        }
    }

    public function testCacheInfoStructure()
    {
        $this->cacheInfoService->captureInfo();
        $cacheInfo = $this->cacheInfoService->getCacheInfo();

        // Test summary structure
        $summary = $cacheInfo['summary'];
        $this->assertIsArray($summary);
        $this->assertArrayHasKey('object_cache_enabled', $summary);
        $this->assertArrayHasKey('transient_count', $summary);
        $this->assertArrayHasKey('transient_size', $summary);
        $this->assertArrayHasKey('plugin_count', $summary);

        $this->assertIsBool($summary['object_cache_enabled']);
        $this->assertIsInt($summary['transient_count']);
        $this->assertIsInt($summary['transient_size']);
        $this->assertIsInt($summary['plugin_count']);
    }

    public function testTransientsInfoAccuracy()
    {
        $transientsInfo = $this->cacheInfoService->getTransientsInfo();

        $count = $transientsInfo['count'];
        $size = $transientsInfo['size'];
        $items = $transientsInfo['items'];

        $this->assertIsInt($count);
        $this->assertIsInt($size);
        $this->assertIsArray($items);

        // Count should match number of items
        $this->assertEquals($count, count($items));

        // Size should be sum of item sizes
        $calculatedSize = 0;
        foreach ($items as $item) {
            $this->assertArrayHasKey('name', $item);
            $this->assertArrayHasKey('size', $item);
            $this->assertIsString($item['name']);
            $this->assertIsInt($item['size']);
            $calculatedSize += $item['size'];
        }

        $this->assertEquals($size, $calculatedSize);
    }

    public function testMultipleCaptureInfoCalls()
    {
        // First capture
        $this->cacheInfoService->captureInfo();
        $cacheInfo1 = $this->cacheInfoService->getCacheInfo();

        // Second capture
        $this->cacheInfoService->captureInfo();
        $cacheInfo2 = $this->cacheInfoService->getCacheInfo();

        // Both should have the same structure
        $this->assertEquals(array_keys($cacheInfo1), array_keys($cacheInfo2));
    }

    public function testCacheInfoPerformance()
    {
        $startTime = microtime(true);

        $this->cacheInfoService->captureInfo();
        $cacheInfo = $this->cacheInfoService->getCacheInfo();

        $endTime = microtime(true);
        $executionTime = $endTime - $startTime;

        // Should complete quickly (less than 1 second)
        $this->assertLessThan(1.0, $executionTime);
        $this->assertIsArray($cacheInfo);
    }

    /**
     * Helper method to invoke private methods for testing
     */
    private function invokeMethod($object, $methodName, array $parameters = [])
    {
        $reflection = new \ReflectionClass(get_class($object));
        $method = $reflection->getMethod($methodName);
        $method->setAccessible(true);
        return $method->invokeArgs($object, $parameters);
    }
}