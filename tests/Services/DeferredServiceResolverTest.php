<?php

namespace Tests\Services;

use PHPUnit\Framework\TestCase;
use Jankx\Services\DeferredServiceResolver;
use Jankx\Services\DeferredServiceMonitor;
use Jankx\Context\ContextualServiceRegistry;
use Illuminate\Container\Container;
use Mockery;

/**
 * Test class for DeferredServiceResolver
 */
class DeferredServiceResolverTest extends TestCase
{
    protected $container;
    protected $resolver;

    protected function setUp(): void
    {
        parent::setUp();
        $this->container = new Container();
        $this->resolver = new DeferredServiceResolver($this->container);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function testConstructor()
    {
        $this->assertInstanceOf(DeferredServiceResolver::class, $this->resolver);
        $this->assertInstanceOf(DeferredServiceMonitor::class, $this->resolver->getMonitor());
    }

    public function testResolveServiceFromContainer()
    {
        // Mock a service in container
        $mockService = new \stdClass();
        $this->container->singleton('test.service', function() use ($mockService) {
            return $mockService;
        });

        $result = $this->resolver->resolve('test.service');
        $this->assertSame($mockService, $result);
    }

    public function testResolveServiceReturnsCachedInstance()
    {
        // Mock a service in container
        $mockService = new \stdClass();
        $this->container->singleton('test.service', function() use ($mockService) {
            return $mockService;
        });

        $result1 = $this->resolver->resolve('test.service');
        $result2 = $this->resolver->resolve('test.service');

        $this->assertSame($result1, $result2);
    }

    public function testHasService()
    {
        // Mock a service in container
        $this->container->singleton('test.service', function() {
            return new \stdClass();
        });

        $this->assertTrue($this->resolver->has('test.service'));
        $this->assertFalse($this->resolver->has('non.existent.service'));
    }

    public function testGetResolvedServices()
    {
        // Mock services in container
        $this->container->singleton('service1', function() {
            return new \stdClass();
        });
        $this->container->singleton('service2', function() {
            return new \stdClass();
        });

        $this->resolver->resolve('service1');
        $this->resolver->resolve('service2');

        $resolvedServices = $this->resolver->getResolvedServices();
        $this->assertContains('service1', $resolvedServices);
        $this->assertContains('service2', $resolvedServices);
    }

    public function testGetResolutionStats()
    {
        // Mock a service in container
        $this->container->singleton('test.service', function() {
            return new \stdClass();
        });

        $this->resolver->resolve('test.service');
        $stats = $this->resolver->getResolutionStats();

        $this->assertIsArray($stats);
        $this->assertArrayHasKey('resolved_services', $stats);
        $this->assertArrayHasKey('total_resolved', $stats);
        $this->assertArrayHasKey('monitoring_metrics', $stats);
        $this->assertContains('test.service', $stats['resolved_services']);
        $this->assertEquals(1, $stats['total_resolved']);
    }

    public function testClearCache()
    {
        // Mock a service in container
        $this->container->singleton('test.service', function() {
            return new \stdClass();
        });

        $this->resolver->resolve('test.service');
        $this->assertNotEmpty($this->resolver->getResolvedServices());

        $this->resolver->clearCache();
        $this->assertEmpty($this->resolver->getResolvedServices());
    }

    public function testResolveServiceThrowsExceptionForNonExistentService()
    {
        $this->expectException(\Exception::class);
        $this->resolver->resolve('non.existent.service');
    }

    public function testGetMonitor()
    {
        $monitor = $this->resolver->getMonitor();
        $this->assertInstanceOf(DeferredServiceMonitor::class, $monitor);
    }
}