<?php

namespace Tests\Support;

use PHPUnit\Framework\TestCase;
use Jankx\Support\LazyLoader;
use Jankx\Foundation\Application;
use Jankx\Support\Providers\HeavyServicesProvider;
use Jankx\Services\UserService;
use Jankx\Services\GutenbergService;
use Jankx\Services\SlideoutMenuService;

/**
 * Test LazyLoader functionality
 */
class LazyLoaderTest extends TestCase
{
    protected $app;
    protected $lazyLoader;

    protected function setUp(): void
    {
        parent::setUp();

        // Create application instance
        $this->app = new Application();

        // Register lazy service provider
        $this->app->registerLazy(HeavyServicesProvider::class);

        // Set up LazyLoader
        LazyLoader::setApp($this->app);

        // Clear cache before each test
        LazyLoader::clearCache();
    }

    protected function tearDown(): void
    {
        // Clear cache after each test
        LazyLoader::clearCache();
        parent::tearDown();
    }

    /**
     * Test setting application
     */
    public function testSetApp()
    {
        $this->assertInstanceOf(Application::class, $this->app);

        // Test that app is set in LazyLoader
        $reflection = new \ReflectionClass(LazyLoader::class);
        $appProperty = $reflection->getProperty('app');
        $appProperty->setAccessible(true);

        $this->assertSame($this->app, $appProperty->getValue());
    }

    /**
     * Test loading lazy service
     */
    public function testLoadLazyService()
    {
        // Test loading user service
        $userService = LazyLoader::service('user.service');

        $this->assertInstanceOf(UserService::class, $userService);
        $this->assertTrue(LazyLoader::isLazy('user.service'));
    }

    /**
     * Test loading multiple lazy services
     */
    public function testLoadMultipleLazyServices()
    {
        $services = [
            'user.service' => UserService::class,
            'gutenberg.service' => GutenbergService::class,
            'slideout.menu.service' => SlideoutMenuService::class
        ];

        foreach ($services as $serviceName => $expectedClass) {
            $service = LazyLoader::service($serviceName);
            $this->assertInstanceOf($expectedClass, $service);
            $this->assertTrue(LazyLoader::isLazy($serviceName));
        }
    }

    /**
     * Test service caching
     */
    public function testServiceCaching()
    {
        // First load
        $userService1 = LazyLoader::service('user.service');

        // Second load (should be cached)
        $userService2 = LazyLoader::service('user.service');

        // Should be the same instance
        $this->assertSame($userService1, $userService2);

        // Check cached services
        $cachedServices = LazyLoader::getCachedServices();
        $this->assertContains('user.service', $cachedServices);
    }

    /**
     * Test cache clearing
     */
    public function testClearCache()
    {
        // Load service to cache it
        LazyLoader::service('user.service');

        // Check that it's cached
        $cachedServices = LazyLoader::getCachedServices();
        $this->assertContains('user.service', $cachedServices);

        // Clear cache
        LazyLoader::clearCache();

        // Check that cache is empty
        $cachedServices = LazyLoader::getCachedServices();
        $this->assertEmpty($cachedServices);
    }

    /**
     * Test isLazy method
     */
    public function testIsLazy()
    {
        // Test lazy services
        $this->assertTrue(LazyLoader::isLazy('user.service'));
        $this->assertTrue(LazyLoader::isLazy('gutenberg.service'));
        $this->assertTrue(LazyLoader::isLazy('slideout.menu.service'));

        // Test non-lazy services
        $this->assertFalse(LazyLoader::isLazy('non.existent.service'));
    }

    /**
     * Test performance monitoring
     */
    public function testPerformanceMonitoring()
    {
        // Mock         $this->expectOutputRegex('/Service "user.service" loaded in \d+\.\d+ ms/');

        // Enable debug logging for testing
        if (method_exists('Jankx\Helper\Environment', 'isDebugLog')) {
            // Mock Environment::isDebugLog to return true
            $this->mockEnvironmentDebugLog();
        }

        LazyLoader::monitor('user.service');
    }

    /**
     * Test loading non-existent service
     */
    public function testLoadNonExistentService()
    {
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage("Service 'non.existent.service' not found");

        LazyLoader::service('non.existent.service');
    }

    /**
     * Test loading service without setting app
     */
    public function testLoadServiceWithoutApp()
    {
        // Clear app from LazyLoader
        $reflection = new \ReflectionClass(LazyLoader::class);
        $appProperty = $reflection->getProperty('app');
        $appProperty->setAccessible(true);
        $appProperty->setValue(null);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage("Application not set or service 'user.service' not found");

        LazyLoader::service('user.service');
    }

    /**
     * Test getCachedServices method
     */
    public function testGetCachedServices()
    {
        // Initially no cached services
        $cachedServices = LazyLoader::getCachedServices();
        $this->assertEmpty($cachedServices);

        // Load a service
        LazyLoader::service('user.service');

        // Check that service is now cached
        $cachedServices = LazyLoader::getCachedServices();
        $this->assertContains('user.service', $cachedServices);
        $this->assertCount(1, $cachedServices);

        // Load another service
        LazyLoader::service('gutenberg.service');

        // Check that both services are cached
        $cachedServices = LazyLoader::getCachedServices();
        $this->assertContains('user.service', $cachedServices);
        $this->assertContains('gutenberg.service', $cachedServices);
        $this->assertCount(2, $cachedServices);
    }

    /**
     * Test service loading performance
     */
    public function testServiceLoadingPerformance()
    {
        // First load (should be slower)
        $start = microtime(true);
        $userService1 = LazyLoader::service('user.service');
        $firstLoadTime = microtime(true) - $start;

        // Second load (should be faster due to caching)
        $start = microtime(true);
        $userService2 = LazyLoader::service('user.service');
        $secondLoadTime = microtime(true) - $start;

        // Second load should be faster
        $this->assertLessThan($firstLoadTime, $secondLoadTime);

        // Both should return the same instance
        $this->assertSame($userService1, $userService2);
    }

    /**
     * Test lazy service registration
     */
    public function testLazyServiceRegistration()
    {
        // Check that services are registered as lazy
        $this->assertTrue($this->app->isLazyService('user.service'));
        $this->assertTrue($this->app->isLazyService('gutenberg.service'));
        $this->assertTrue($this->app->isLazyService('slideout.menu.service'));

        // Check that non-lazy services are not lazy
        $this->assertFalse($this->app->isLazyService('non.existent.service'));
    }

    /**
     * Test service singleton behavior
     */
    public function testServiceSingletonBehavior()
    {
        // Load service multiple times
        $service1 = LazyLoader::service('user.service');
        $service2 = LazyLoader::service('user.service');
        $service3 = LazyLoader::service('user.service');

        // All should be the same instance
        $this->assertSame($service1, $service2);
        $this->assertSame($service2, $service3);
        $this->assertSame($service1, $service3);
    }

    /**
     * Test memory usage optimization
     */
    public function testMemoryUsageOptimization()
    {
        // Get initial memory usage
        $initialMemory = memory_get_usage();

        // Load all lazy services
        LazyLoader::service('user.service');
        LazyLoader::service('gutenberg.service');
        LazyLoader::service('slideout.menu.service');

        // Get memory after loading
        $memoryAfterLoading = memory_get_usage();
        $memoryUsed = $memoryAfterLoading - $initialMemory;

        // Memory usage should be reasonable (less than 1MB)
        $this->assertLessThan(1024 * 1024, $memoryUsed);

        // Clear cache and check memory
        LazyLoader::clearCache();
        $memoryAfterClear = memory_get_usage();

        // Memory should be reduced after clearing cache
        $this->assertLessThanOrEqual($memoryAfterLoading, $memoryAfterClear);
    }

    /**
     * Mock Environment::isDebugLog to return true for testing
     */
    private function mockEnvironmentDebugLog()
    {
        // This is a simple mock for testing purposes
        // In a real environment, you might use a proper mocking framework
        if (!function_exists('Jankx\Helper\Environment::isDebugLog')) {
            // Create a simple mock
            class_alias('Tests\Support\MockEnvironment', 'Jankx\Helper\Environment');
        }
    }
}

/**
 * Mock Environment class for testing
 */
class MockEnvironment
{
    public static function isDebugLog()
    {
        return true;
    }
}
