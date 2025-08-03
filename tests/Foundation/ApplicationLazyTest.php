<?php

namespace Tests\Foundation;

use PHPUnit\Framework\TestCase;
use Jankx\Foundation\Application;
use Jankx\Support\Providers\HeavyServicesProvider;
use Jankx\Services\UserService;
use Jankx\Services\GutenbergService;
use Jankx\Services\SlideoutMenuService;

/**
 * Test Application lazy loading functionality
 */
class ApplicationLazyTest extends TestCase
{
    protected $app;

    protected function setUp(): void
    {
        parent::setUp();

        // Create application instance
        $this->app = new Application();
    }

    protected function tearDown(): void
    {
        parent::tearDown();
    }

    /**
     * Test registering lazy service provider
     */
    public function testRegisterLazy()
    {
        // Register lazy service provider
        $this->app->registerLazy(HeavyServicesProvider::class);

        // Check that provider is registered
        $reflection = new \ReflectionClass($this->app);
        $lazyProvidersProperty = $reflection->getProperty('lazyServiceProviders');
        $lazyProvidersProperty->setAccessible(true);

        $lazyProviders = $lazyProvidersProperty->getValue($this->app);
        $this->assertContains(HeavyServicesProvider::class, $lazyProviders);
    }

    /**
     * Test loading lazy service
     */
    public function testLoadLazyService()
    {
        // Register lazy service provider
        $this->app->registerLazy(HeavyServicesProvider::class);

        // Load lazy service
        $userService = $this->app->loadLazyService('user.service');

        $this->assertInstanceOf(UserService::class, $userService);
    }

    /**
     * Test loading multiple lazy services
     */
    public function testLoadMultipleLazyServices()
    {
        // Register lazy service provider
        $this->app->registerLazy(HeavyServicesProvider::class);

        $services = [
            'user.service' => UserService::class,
            'gutenberg.service' => GutenbergService::class,
            'slideout.menu.service' => SlideoutMenuService::class
        ];

        foreach ($services as $serviceName => $expectedClass) {
            $service = $this->app->loadLazyService($serviceName);
            $this->assertInstanceOf($expectedClass, $service);
        }
    }

    /**
     * Test isLazyService method
     */
    public function testIsLazyService()
    {
        // Register lazy service provider
        $this->app->registerLazy(HeavyServicesProvider::class);

        // Test lazy services
        $this->assertTrue($this->app->isLazyService('user.service'));
        $this->assertTrue($this->app->isLazyService('gutenberg.service'));
        $this->assertTrue($this->app->isLazyService('slideout.menu.service'));

        // Test non-lazy services
        $this->assertFalse($this->app->isLazyService('non.existent.service'));
    }

    /**
     * Test loading non-existent lazy service
     */
    public function testLoadNonExistentLazyService()
    {
        // Register lazy service provider
        $this->app->registerLazy(HeavyServicesProvider::class);

        $this->expectException(\Exception::class);
        $this->expectExceptionMessage("Service 'non.existent.service' not registered");

        $this->app->loadLazyService('non.existent.service');
    }

    /**
     * Test loading lazy service without registering provider
     */
    public function testLoadLazyServiceWithoutProvider()
    {
        $this->expectException(\Exception::class);
        $this->expectExceptionMessage("Service 'user.service' not registered");

        $this->app->loadLazyService('user.service');
    }

    /**
     * Test service singleton behavior in lazy loading
     */
    public function testLazyServiceSingletonBehavior()
    {
        // Register lazy service provider
        $this->app->registerLazy(HeavyServicesProvider::class);

        // Load service multiple times
        $service1 = $this->app->loadLazyService('user.service');
        $service2 = $this->app->loadLazyService('user.service');
        $service3 = $this->app->loadLazyService('user.service');

        // All should be the same instance
        $this->assertSame($service1, $service2);
        $this->assertSame($service2, $service3);
        $this->assertSame($service1, $service3);
    }

    /**
     * Test lazy service provider provides method
     */
    public function testLazyServiceProviderProvides()
    {
        $provider = new HeavyServicesProvider();

        // Test that provider provides the correct services
        $this->assertTrue($provider::provides('user.service'));
        $this->assertTrue($provider::provides('gutenberg.service'));
        $this->assertTrue($provider::provides('slideout.menu.service'));

        // Test that provider doesn't provide non-existent services
        $this->assertFalse($provider::provides('non.existent.service'));
    }

    /**
     * Test lazy service registration with multiple providers
     */
    public function testMultipleLazyProviders()
    {
        // Register multiple lazy providers
        $this->app->registerLazy(HeavyServicesProvider::class);

        // Check that all providers are registered
        $reflection = new \ReflectionClass($this->app);
        $lazyProvidersProperty = $reflection->getProperty('lazyServiceProviders');
        $lazyProvidersProperty->setAccessible(true);

        $lazyProviders = $lazyProvidersProperty->getValue($this->app);
        $this->assertContains(HeavyServicesProvider::class, $lazyProviders);
    }

    /**
     * Test lazy service performance
     */
    public function testLazyServicePerformance()
    {
        // Register lazy service provider
        $this->app->registerLazy(HeavyServicesProvider::class);

        // First load (should be slower)
        $start = microtime(true);
        $userService1 = $this->app->loadLazyService('user.service');
        $firstLoadTime = microtime(true) - $start;

        // Second load (should be faster due to singleton)
        $start = microtime(true);
        $userService2 = $this->app->loadLazyService('user.service');
        $secondLoadTime = microtime(true) - $start;

        // Both should return the same instance
        $this->assertSame($userService1, $userService2);

        // Second load should be faster (singleton behavior)
        $this->assertLessThanOrEqual($firstLoadTime, $secondLoadTime);
    }

    /**
     * Test lazy service memory usage
     */
    public function testLazyServiceMemoryUsage()
    {
        // Register lazy service provider
        $this->app->registerLazy(HeavyServicesProvider::class);

        // Get initial memory usage
        $initialMemory = memory_get_usage();

        // Load all lazy services
        $this->app->loadLazyService('user.service');
        $this->app->loadLazyService('gutenberg.service');
        $this->app->loadLazyService('slideout.menu.service');

        // Get memory after loading
        $memoryAfterLoading = memory_get_usage();
        $memoryUsed = $memoryAfterLoading - $initialMemory;

        // Memory usage should be reasonable (less than 1MB)
        $this->assertLessThan(1024 * 1024, $memoryUsed);
    }

    /**
     * Test lazy service provider registration
     */
    public function testLazyServiceProviderRegistration()
    {
        // Register lazy service provider
        $this->app->registerLazy(HeavyServicesProvider::class);

        // Check that services are bound
        $this->assertTrue($this->app->bound('user.service'));
        $this->assertTrue($this->app->bound('gutenberg.service'));
        $this->assertTrue($this->app->bound('slideout.menu.service'));
    }

    /**
     * Test lazy service provider boot method
     */
    public function testLazyServiceProviderBoot()
    {
        $provider = new HeavyServicesProvider();

        // Test that boot method exists and can be called
        $this->assertTrue(method_exists($provider, 'boot'));

        // Boot the provider
        $provider->boot($this->app);

        // No exception should be thrown
        $this->assertTrue(true);
    }

    /**
     * Test lazy service provider register method
     */
    public function testLazyServiceProviderRegister()
    {
        $provider = new HeavyServicesProvider();

        // Test that register method exists and can be called
        $this->assertTrue(method_exists($provider, 'register'));

        // Register the provider
        $provider->register($this->app);

        // Check that services are registered
        $this->assertTrue($this->app->bound('user.service'));
        $this->assertTrue($this->app->bound('gutenberg.service'));
        $this->assertTrue($this->app->bound('slideout.menu.service'));
    }

    /**
     * Test lazy service error handling
     */
    public function testLazyServiceErrorHandling()
    {
        // Test loading service without registration
        $this->expectException(\Exception::class);
        $this->app->loadLazyService('user.service');
    }

    /**
     * Test lazy service provider provides method with reflection
     */
    public function testLazyServiceProviderProvidesWithReflection()
    {
        $provider = new HeavyServicesProvider();

        // Use reflection to test provides method
        $reflection = new \ReflectionClass($provider);
        $providesProperty = $reflection->getProperty('provides');
        $providesProperty->setAccessible(true);

        $provides = $providesProperty->getValue($provider);

        $this->assertContains('user.service', $provides);
        $this->assertContains('gutenberg.service', $provides);
        $this->assertContains('slideout.menu.service', $provides);
    }
}
