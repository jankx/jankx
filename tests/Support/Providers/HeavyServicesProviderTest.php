<?php

namespace Tests\Support\Providers;

use PHPUnit\Framework\TestCase;
use Jankx\Foundation\Application;
use Jankx\Support\Providers\HeavyServicesProvider;
use Jankx\Services\UserService;
use Jankx\Services\GutenbergService;
use Jankx\Services\SlideoutMenuService;

/**
 * Test HeavyServicesProvider functionality
 */
class HeavyServicesProviderTest extends TestCase
{
    protected $app;
    protected $provider;

    protected function setUp(): void
    {
        parent::setUp();

        // Create application instance
        $this->app = new Application();

        // Create provider instance
        $this->provider = new HeavyServicesProvider();
    }

    protected function tearDown(): void
    {
        parent::tearDown();
    }

    /**
     * Test provider provides method
     */
    public function testProvides()
    {
        // Test that provider provides the correct services
        $this->assertTrue(HeavyServicesProvider::provides('user.service'));
        $this->assertTrue(HeavyServicesProvider::provides('gutenberg.service'));
        $this->assertTrue(HeavyServicesProvider::provides('slideout.menu.service'));

        // Test that provider doesn't provide non-existent services
        $this->assertFalse(HeavyServicesProvider::provides('non.existent.service'));
    }

    /**
     * Test provider register method
     */
    public function testRegister()
    {
        // Register the provider
        $this->provider->register($this->app);

        // Check that services are bound
        $this->assertTrue($this->app->bound('user.service'));
        $this->assertTrue($this->app->bound('gutenberg.service'));
        $this->assertTrue($this->app->bound('slideout.menu.service'));
    }

    /**
     * Test provider boot method
     */
    public function testBoot()
    {
        // Test that boot method exists and can be called
        $this->assertTrue(method_exists($this->provider, 'boot'));

        // Boot the provider
        $this->provider->boot($this->app);

        // No exception should be thrown
        $this->assertTrue(true);
    }

    /**
     * Test service instantiation
     */
    public function testServiceInstantiation()
    {
        // Register the provider
        $this->provider->register($this->app);

        // Test service instantiation
        $userService = $this->app->make('user.service');
        $this->assertInstanceOf(UserService::class, $userService);

        $gutenbergService = $this->app->make('gutenberg.service');
        $this->assertInstanceOf(GutenbergService::class, $gutenbergService);

        $slideoutService = $this->app->make('slideout.menu.service');
        $this->assertInstanceOf(SlideoutMenuService::class, $slideoutService);
    }

    /**
     * Test service singleton behavior
     */
    public function testServiceSingletonBehavior()
    {
        // Register the provider
        $this->provider->register($this->app);

        // Load services multiple times
        $userService1 = $this->app->make('user.service');
        $userService2 = $this->app->make('user.service');

        $gutenbergService1 = $this->app->make('gutenberg.service');
        $gutenbergService2 = $this->app->make('gutenberg.service');

        $slideoutService1 = $this->app->make('slideout.menu.service');
        $slideoutService2 = $this->app->make('slideout.menu.service');

        // All should be the same instances
        $this->assertSame($userService1, $userService2);
        $this->assertSame($gutenbergService1, $gutenbergService2);
        $this->assertSame($slideoutService1, $slideoutService2);
    }

    /**
     * Test provider provides property
     */
    public function testProvidesProperty()
    {
        // Use reflection to test provides property
        $reflection = new \ReflectionClass($this->provider);
        $providesProperty = $reflection->getProperty('provides');
        $providesProperty->setAccessible(true);

        $provides = $providesProperty->getValue($this->provider);

        $this->assertContains('user.service', $provides);
        $this->assertContains('gutenberg.service', $provides);
        $this->assertContains('slideout.menu.service', $provides);
        $this->assertCount(3, $provides);
    }

    /**
     * Test service dependencies
     */
    public function testServiceDependencies()
    {
        // Register the provider
        $this->provider->register($this->app);

        // Test that services receive application instance
        $userService = $this->app->make('user.service');
        $reflection = new \ReflectionClass($userService);
        $appProperty = $reflection->getProperty('app');
        $appProperty->setAccessible(true);

        $this->assertSame($this->app, $appProperty->getValue($userService));
    }

    /**
     * Test provider inheritance
     */
    public function testProviderInheritance()
    {
        // Test that provider extends ServiceProvider
        $this->assertInstanceOf(\Jankx\Support\Providers\ServiceProvider::class, $this->provider);
    }

    /**
     * Test provider methods existence
     */
    public function testProviderMethodsExistence()
    {
        // Test that required methods exist
        $this->assertTrue(method_exists($this->provider, 'register'));
        $this->assertTrue(method_exists($this->provider, 'boot'));
        $this->assertTrue(method_exists($this->provider, 'provides'));
    }

    /**
     * Test service registration with closures
     */
    public function testServiceRegistrationWithClosures()
    {
        // Register the provider
        $this->provider->register($this->app);

        // Test that services are registered as singletons with closures
        $this->assertTrue($this->app->bound('user.service'));
        $this->assertTrue($this->app->bound('gutenberg.service'));
        $this->assertTrue($this->app->bound('slideout.menu.service'));
    }

    /**
     * Test provider provides method with different inputs
     */
    public function testProvidesMethodWithDifferentInputs()
    {
        // Test with correct service names
        $this->assertTrue(HeavyServicesProvider::provides('user.service'));
        $this->assertTrue(HeavyServicesProvider::provides('gutenberg.service'));
        $this->assertTrue(HeavyServicesProvider::provides('slideout.menu.service'));

        // Test with incorrect service names
        $this->assertFalse(HeavyServicesProvider::provides(''));
        $this->assertFalse(HeavyServicesProvider::provides(null));
        $this->assertFalse(HeavyServicesProvider::provides('user'));
        $this->assertFalse(HeavyServicesProvider::provides('service'));
        $this->assertFalse(HeavyServicesProvider::provides('user.service.extra'));
    }

    /**
     * Test provider performance
     */
    public function testProviderPerformance()
    {
        // Measure registration time
        $start = microtime(true);
        $this->provider->register($this->app);
        $registrationTime = microtime(true) - $start;

        // Registration should be fast (less than 100ms)
        $this->assertLessThan(0.1, $registrationTime);

        // Measure service instantiation time
        $start = microtime(true);
        $this->app->make('user.service');
        $instantiationTime = microtime(true) - $start;

        // Instantiation should be fast (less than 50ms)
        $this->assertLessThan(0.05, $instantiationTime);
    }

    /**
     * Test provider memory usage
     */
    public function testProviderMemoryUsage()
    {
        // Get initial memory usage
        $initialMemory = memory_get_usage();

        // Register provider and create services
        $this->provider->register($this->app);
        $this->app->make('user.service');
        $this->app->make('gutenberg.service');
        $this->app->make('slideout.menu.service');

        // Get memory after operations
        $memoryAfterOperations = memory_get_usage();
        $memoryUsed = $memoryAfterOperations - $initialMemory;

        // Memory usage should be reasonable (less than 1MB)
        $this->assertLessThan(1024 * 1024, $memoryUsed);
    }

    /**
     * Test provider error handling
     */
    public function testProviderErrorHandling()
    {
        // Test that provider can handle null app
        $this->expectException(\TypeError::class);
        $this->provider->register(null);
    }

    /**
     * Test provider provides method performance
     */
    public function testProvidesMethodPerformance()
    {
        // Measure provides method performance
        $start = microtime(true);

        for ($i = 0; $i < 1000; $i++) {
            HeavyServicesProvider::provides('user.service');
            HeavyServicesProvider::provides('gutenberg.service');
            HeavyServicesProvider::provides('slideout.menu.service');
            HeavyServicesProvider::provides('non.existent.service');
        }

        $time = microtime(true) - $start;

        // Should be very fast (less than 10ms for 1000 calls)
        $this->assertLessThan(0.01, $time);
    }

    /**
     * Test provider with multiple app instances
     */
    public function testProviderWithMultipleAppInstances()
    {
        // Create multiple app instances
        $app1 = new Application();
        $app2 = new Application();

        // Register provider with both apps
        $this->provider->register($app1);
        $this->provider->register($app2);

        // Test that services are registered in both apps
        $this->assertTrue($app1->bound('user.service'));
        $this->assertTrue($app2->bound('user.service'));

        // Test that services are different instances
        $service1 = $app1->make('user.service');
        $service2 = $app2->make('user.service');

        $this->assertNotSame($service1, $service2);
    }
}
