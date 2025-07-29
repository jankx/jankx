<?php

namespace Tests\Providers;

use PHPUnit\Framework\TestCase;
use Jankx\Config\ConfigServiceProvider;
use Jankx\Config\Repository;
use Jankx\Config\Contracts\ConfigRepositoryInterface;
use Illuminate\Container\Container;
use Mockery;

/**
 * Config Service Provider Test
 *
 * @package Tests\Providers
 * @since 2.0.0
 */
class ConfigServiceProviderTest extends TestCase
{
    /**
     * @var ConfigServiceProvider
     */
    protected $provider;

    /**
     * @var Container
     */
    protected $container;

    protected function setUp(): void
    {
        parent::setUp();

        $this->container = new Container();
        $this->provider = new ConfigServiceProvider($this->container);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /**
     * Test service provider registration
     */
    public function testRegister(): void
    {
        $this->provider->register();

        // Test that config is bound
        $this->assertTrue($this->container->bound('config'));

        // Test that Repository is bound
        $this->assertTrue($this->container->bound(Repository::class));

        // Test that Interface is bound
        $this->assertTrue($this->container->bound(ConfigRepositoryInterface::class));

        // Test that all resolve to the same instance
        $config1 = $this->container->make('config');
        $config2 = $this->container->make(Repository::class);
        $config3 = $this->container->make(ConfigRepositoryInterface::class);

        $this->assertSame($config1, $config2);
        $this->assertSame($config1, $config3);
    }

    /**
     * Test service provider boot
     */
    public function testBoot(): void
    {
        $this->provider->register();
        $this->provider->boot();

        // Boot should not throw any exceptions
        $this->assertTrue(true);
    }

    /**
     * Test singleton binding
     */
    public function testSingletonBinding(): void
    {
        $this->provider->register();

        $instance1 = $this->container->make('config');
        $instance2 = $this->container->make('config');

        $this->assertSame($instance1, $instance2);
        $this->assertInstanceOf(Repository::class, $instance1);
        $this->assertInstanceOf(ConfigRepositoryInterface::class, $instance1);
    }

    /**
     * Test Repository class binding
     */
    public function testRepositoryClassBinding(): void
    {
        $this->provider->register();

        $repository = $this->container->make(Repository::class);

        $this->assertInstanceOf(Repository::class, $repository);
        $this->assertInstanceOf(ConfigRepositoryInterface::class, $repository);
    }

    /**
     * Test Interface binding
     */
    public function testInterfaceBinding(): void
    {
        $this->provider->register();

        $repository = $this->container->make(ConfigRepositoryInterface::class);

        $this->assertInstanceOf(ConfigRepositoryInterface::class, $repository);
        $this->assertInstanceOf(Repository::class, $repository);
    }

    /**
     * Test multiple registrations
     */
    public function testMultipleRegistrations(): void
    {
        $this->provider->register();
        $this->provider->register(); // Should not cause issues

        $config = $this->container->make('config');

        $this->assertInstanceOf(Repository::class, $config);
        $this->assertInstanceOf(ConfigRepositoryInterface::class, $config);
    }

    /**
     * Test service provider with existing bindings
     */
    public function testWithExistingBindings(): void
    {
        // Pre-bind something to 'config'
        $this->container->singleton('config', function() {
            return 'existing-binding';
        });

        $this->provider->register();

        // Should override existing binding
        $config = $this->container->make('config');

        $this->assertInstanceOf(Repository::class, $config);
        $this->assertInstanceOf(ConfigRepositoryInterface::class, $config);
        $this->assertNotEquals('existing-binding', $config);
    }

    /**
     * Test service provider performance
     */
    public function testPerformance(): void
    {
        $startTime = microtime(true);

        $this->provider->register();
        $this->provider->boot();

        $endTime = microtime(true);
        $executionTime = $endTime - $startTime;

        // Should complete within reasonable time (less than 1 second)
        $this->assertLessThan(1.0, $executionTime);
    }

    /**
     * Test memory usage
     */
    public function testMemoryUsage(): void
    {
        $initialMemory = memory_get_usage();

        $this->provider->register();
        $this->provider->boot();

        $finalMemory = memory_get_usage();
        $memoryIncrease = $finalMemory - $initialMemory;

        // Memory increase should be reasonable (less than 5MB)
        $this->assertLessThan(5 * 1024 * 1024, $memoryIncrease);
    }

    /**
     * Test service provider with different containers
     */
    public function testWithDifferentContainers(): void
    {
        $container1 = new Container();
        $container2 = new Container();

        $provider1 = new ConfigServiceProvider($container1);
        $provider2 = new ConfigServiceProvider($container2);

        $provider1->register();
        $provider2->register();

        $config1 = $container1->make('config');
        $config2 = $container2->make('config');

        $this->assertInstanceOf(Repository::class, $config1);
        $this->assertInstanceOf(Repository::class, $config2);
        $this->assertInstanceOf(ConfigRepositoryInterface::class, $config1);
        $this->assertInstanceOf(ConfigRepositoryInterface::class, $config2);
        $this->assertNotSame($config1, $config2);
    }

    /**
     * Test service provider error handling
     */
    public function testErrorHandling(): void
    {
        // Test with invalid container
        $invalidContainer = null;

        try {
            $provider = new ConfigServiceProvider($invalidContainer);
            $provider->register();
            $this->fail('Should throw exception with invalid container');
        } catch (\Throwable $e) {
            $this->assertTrue(true); // Exception expected
        }
    }

    /**
     * Test service provider reflection
     */
    public function testServiceProviderReflection(): void
    {
        $reflection = new \ReflectionClass($this->provider);

        $this->assertEquals('Jankx\Config\ConfigServiceProvider', $reflection->getName());
        $this->assertTrue($reflection->hasMethod('register'));
        $this->assertTrue($reflection->hasMethod('boot'));
    }

    /**
     * Test service provider inheritance
     */
    public function testServiceProviderInheritance(): void
    {
        $this->assertInstanceOf(\Jankx\Providers\ServiceProvider::class, $this->provider);
    }

    /**
     * Test service provider methods accessibility
     */
    public function testServiceProviderMethodsAccessibility(): void
    {
        $reflection = new \ReflectionClass($this->provider);

        $registerMethod = $reflection->getMethod('register');
        $bootMethod = $reflection->getMethod('boot');

        $this->assertTrue($registerMethod->isPublic());
        $this->assertTrue($bootMethod->isPublic());
    }

    /**
     * Test service provider with mock container
     */
    public function testWithMockContainer(): void
    {
        $mockContainer = Mockery::mock(Container::class);
        $mockContainer->shouldReceive('singleton')
            ->with('config', Mockery::any())
            ->once();
        $mockContainer->shouldReceive('singleton')
            ->with(Repository::class, Mockery::any())
            ->once();
        $mockContainer->shouldReceive('singleton')
            ->with(ConfigRepositoryInterface::class, Mockery::any())
            ->once();

        $provider = new ConfigServiceProvider($mockContainer);
        $provider->register();

        $this->assertTrue(true); // Should not throw exception
    }

    /**
     * Test service provider with complex container
     */
    public function testWithComplexContainer(): void
    {
        // Add some existing bindings
        $this->container->singleton('existing-service', function() {
            return 'existing-value';
        });

        $this->provider->register();

        // Test that existing bindings are preserved
        $existingService = $this->container->make('existing-service');
        $this->assertEquals('existing-value', $existingService);

        // Test that new bindings work
        $config = $this->container->make('config');
        $this->assertInstanceOf(Repository::class, $config);
        $this->assertInstanceOf(ConfigRepositoryInterface::class, $config);
    }

    /**
     * Test service provider lifecycle
     */
    public function testServiceProviderLifecycle(): void
    {
        // Test registration
        $this->provider->register();
        $this->assertTrue($this->container->bound('config'));
        $this->assertTrue($this->container->bound(Repository::class));
        $this->assertTrue($this->container->bound(ConfigRepositoryInterface::class));

        // Test boot
        $this->provider->boot();
        $this->assertTrue($this->container->bound('config'));

        // Test resolution
        $config = $this->container->make('config');
        $this->assertInstanceOf(Repository::class, $config);
        $this->assertInstanceOf(ConfigRepositoryInterface::class, $config);
    }

    /**
     * Test service provider with multiple instances
     */
    public function testMultipleInstances(): void
    {
        $provider1 = new ConfigServiceProvider($this->container);
        $provider2 = new ConfigServiceProvider($this->container);

        $provider1->register();
        $provider2->register();

        $config = $this->container->make('config');
        $this->assertInstanceOf(Repository::class, $config);
        $this->assertInstanceOf(ConfigRepositoryInterface::class, $config);
    }

    /**
     * Test service provider with container methods
     */
    public function testContainerMethods(): void
    {
        $this->provider->register();

        // Test bound method
        $this->assertTrue($this->container->bound('config'));
        $this->assertTrue($this->container->bound(Repository::class));
        $this->assertTrue($this->container->bound(ConfigRepositoryInterface::class));

        // Test has method
        $this->assertTrue($this->container->has('config'));
        $this->assertTrue($this->container->has(Repository::class));
        $this->assertTrue($this->container->has(ConfigRepositoryInterface::class));

        // Test make method
        $config = $this->container->make('config');
        $this->assertInstanceOf(Repository::class, $config);
        $this->assertInstanceOf(ConfigRepositoryInterface::class, $config);
    }
}