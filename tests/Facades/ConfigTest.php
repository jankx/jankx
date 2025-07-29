<?php

namespace Tests\Facades;

use PHPUnit\Framework\TestCase;
use Jankx\Facades\Config;
use Jankx\Config\Repository;
use Illuminate\Container\Container;
use Mockery;

/**
 * Config Facade Test
 *
 * @package Tests\Facades
 * @since 2.0.0
 */
class ConfigTest extends TestCase
{
    /**
     * @var Container
     */
    protected $container;

    /**
     * @var Repository
     */
    protected $repository;

    protected function setUp(): void
    {
        parent::setUp();

        $this->container = new Container();
        $this->repository = Mockery::mock(Repository::class);

        // Bind mock repository to container
        $this->container->singleton('config', function() {
            return $this->repository;
        });

        // Set container in facade
        Config::setContainer($this->container);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /**
     * Test getting configuration value
     */
    public function testGet(): void
    {
        $this->repository->shouldReceive('get')
            ->with('theme.name', 'default')
            ->once()
            ->andReturn('Test Theme');

        $result = Config::get('theme.name', 'default');

        $this->assertEquals('Test Theme', $result);
    }

    /**
     * Test setting configuration value
     */
    public function testSet(): void
    {
        $this->repository->shouldReceive('set')
            ->with('theme.name', 'New Theme')
            ->once();

        Config::set('theme.name', 'New Theme');

        $this->assertTrue(true); // Should not throw exception
    }

    /**
     * Test checking if configuration key exists
     */
    public function testHas(): void
    {
        $this->repository->shouldReceive('has')
            ->with('theme.name')
            ->once()
            ->andReturn(true);

        $result = Config::has('theme.name');

        $this->assertTrue($result);
    }

    /**
     * Test getting all configuration
     */
    public function testAll(): void
    {
        $config = ['theme' => ['name' => 'Test Theme']];

        $this->repository->shouldReceive('all')
            ->once()
            ->andReturn($config);

        $result = Config::all();

        $this->assertEquals($config, $result);
    }

    /**
     * Test getting configuration section
     */
    public function testSection(): void
    {
        $section = ['name' => 'Test Theme', 'version' => '1.0.0'];

        $this->repository->shouldReceive('getSection')
            ->with('theme')
            ->once()
            ->andReturn($section);

        $result = Config::section('theme');

        $this->assertEquals($section, $result);
    }

    /**
     * Test merging additional configuration
     */
    public function testMerge(): void
    {
        $additionalConfig = ['theme' => ['new_setting' => 'value']];

        $this->repository->shouldReceive('merge')
            ->with($additionalConfig)
            ->once();

        Config::merge($additionalConfig);

        $this->assertTrue(true); // Should not throw exception
    }

    /**
     * Test reloading configurations
     */
    public function testReload(): void
    {
        $this->repository->shouldReceive('reload')
            ->once();

        Config::reload();

        $this->assertTrue(true); // Should not throw exception
    }

    /**
     * Test checking if using child theme
     */
    public function testIsChildTheme(): void
    {
        $this->repository->shouldReceive('isChildTheme')
            ->once()
            ->andReturn(true);

        $result = Config::isChildTheme();

        $this->assertTrue($result);
    }

    /**
     * Test getting configuration differences
     */
    public function testGetDifferences(): void
    {
        $differences = [
            'theme.name' => [
                'parent' => 'Parent Theme',
                'child' => 'Child Theme',
                'merged' => 'Child Theme'
            ]
        ];

        $this->repository->shouldReceive('getConfigDifference')
            ->once()
            ->andReturn($differences);

        $result = Config::getDifferences();

        $this->assertEquals($differences, $result);
    }

    /**
     * Test clearing cache
     */
    public function testClearCache(): void
    {
        $this->repository->shouldReceive('clearCache')
            ->with('specific-file.php')
            ->once();

        Config::clearCache('specific-file.php');

        $this->assertTrue(true); // Should not throw exception
    }

    /**
     * Test clearing all cache
     */
    public function testClearAllCache(): void
    {
        $this->repository->shouldReceive('clearCache')
            ->with(null)
            ->once();

        Config::clearCache();

        $this->assertTrue(true); // Should not throw exception
    }

    /**
     * Test getting cache statistics
     */
    public function testGetCacheStats(): void
    {
        $stats = [
            'total_files' => 5,
            'cached_files' => 3,
            'cache_keys' => ['key1', 'key2'],
            'checksums' => ['file1' => 12345]
        ];

        $this->repository->shouldReceive('getCacheStats')
            ->once()
            ->andReturn($stats);

        $result = Config::getCacheStats();

        $this->assertEquals($stats, $result);
    }

    /**
     * Test checking if file has changed
     */
    public function testHasFileChanged(): void
    {
        $this->repository->shouldReceive('hasFileChanged')
            ->with('config.php')
            ->once()
            ->andReturn(true);

        $result = Config::hasFileChanged('config.php');

        $this->assertTrue($result);
    }

    /**
     * Test facade accessor
     */
    public function testGetFacadeAccessor(): void
    {
        $reflection = new \ReflectionClass(Config::class);
        $method = $reflection->getMethod('getFacadeAccessor');
        $method->setAccessible(true);

        $accessor = $method->invoke(null);

        $this->assertEquals('config', $accessor);
    }

    /**
     * Test getting facade root
     */
    public function testGetFacadeRoot(): void
    {
        $root = Config::getFacadeRoot();

        $this->assertInstanceOf(Repository::class, $root);
    }

    /**
     * Test facade with multiple calls
     */
    public function testMultipleFacadeCalls(): void
    {
        $this->repository->shouldReceive('get')
            ->with('theme.name', null)
            ->times(3)
            ->andReturn('Test Theme');

        $result1 = Config::get('theme.name');
        $result2 = Config::get('theme.name');
        $result3 = Config::get('theme.name');

        $this->assertEquals('Test Theme', $result1);
        $this->assertEquals('Test Theme', $result2);
        $this->assertEquals('Test Theme', $result3);
    }

    /**
     * Test facade with different methods
     */
    public function testDifferentFacadeMethods(): void
    {
        $this->repository->shouldReceive('get')
            ->with('theme.name', null)
            ->once()
            ->andReturn('Test Theme');

        $this->repository->shouldReceive('set')
            ->with('theme.version', '1.0.0')
            ->once();

        $this->repository->shouldReceive('has')
            ->with('theme.name')
            ->once()
            ->andReturn(true);

        $name = Config::get('theme.name');
        Config::set('theme.version', '1.0.0');
        $hasName = Config::has('theme.name');

        $this->assertEquals('Test Theme', $name);
        $this->assertTrue($hasName);
    }

    /**
     * Test facade error handling
     */
    public function testFacadeErrorHandling(): void
    {
        $this->repository->shouldReceive('get')
            ->with('nonexistent.key', 'default')
            ->once()
            ->andReturn('default');

        $result = Config::get('nonexistent.key', 'default');

        $this->assertEquals('default', $result);
    }

    /**
     * Test facade with complex configuration
     */
    public function testComplexConfiguration(): void
    {
        $complexConfig = [
            'theme' => [
                'colors' => [
                    'primary' => '#007cba',
                    'secondary' => '#6c757d'
                ],
                'layout' => [
                    'container_width' => '1200px',
                    'sidebar_position' => 'right'
                ]
            ]
        ];

        $this->repository->shouldReceive('all')
            ->once()
            ->andReturn($complexConfig);

        $config = Config::all();

        $this->assertEquals($complexConfig, $config);
        $this->assertArrayHasKey('theme', $config);
        $this->assertArrayHasKey('colors', $config['theme']);
        $this->assertArrayHasKey('layout', $config['theme']);
    }

    /**
     * Test facade performance
     */
    public function testFacadePerformance(): void
    {
        $startTime = microtime(true);

        $this->repository->shouldReceive('get')
            ->times(100)
            ->andReturn('value');

        for ($i = 0; $i < 100; $i++) {
            Config::get("key.{$i}");
        }

        $endTime = microtime(true);
        $executionTime = $endTime - $startTime;

        // Should complete within reasonable time (less than 1 second)
        $this->assertLessThan(1.0, $executionTime);
    }

    /**
     * Test facade memory usage
     */
    public function testFacadeMemoryUsage(): void
    {
        $initialMemory = memory_get_usage();

        $this->repository->shouldReceive('get')
            ->times(50)
            ->andReturn('value');

        for ($i = 0; $i < 50; $i++) {
            Config::get("key.{$i}");
        }

        $finalMemory = memory_get_usage();
        $memoryIncrease = $finalMemory - $initialMemory;

        // Memory increase should be reasonable (less than 1MB)
        $this->assertLessThan(1024 * 1024, $memoryIncrease);
    }
}