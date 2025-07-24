<?php

namespace Tests\Context;

use PHPUnit\Framework\TestCase;
use Jankx\Context\ContextualServiceRegistry;
use Illuminate\Container\Container;
use Mockery;

/**
 * Test class for ContextualServiceRegistry
 */
class ContextualServiceRegistryTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        // Clear registry before each test
        $this->clearRegistry();
    }

    protected function tearDown(): void
    {
        Mockery::close();
        $this->clearRegistry();
        parent::tearDown();
    }

    protected function clearRegistry()
    {
        $reflection = new \ReflectionClass(ContextualServiceRegistry::class);

        $registryProperty = $reflection->getProperty('registry');
        $registryProperty->setAccessible(true);
        $registryProperty->setValue(null, []);

        $deferredProperty = $reflection->getProperty('deferred');
        $deferredProperty->setAccessible(true);
        $deferredProperty->setValue(null, []);

        $loadedProperty = $reflection->getProperty('loaded');
        $loadedProperty->setAccessible(true);
        $loadedProperty->setValue(null, []);
    }

    public function testRegisterService()
    {
        ContextualServiceRegistry::register('admin', 'TestService', ['priority' => 5]);

        $services = ContextualServiceRegistry::getServicesForContext('admin');
        $this->assertCount(1, $services);
        $this->assertEquals('TestService', $services[0]['class']);
        $this->assertEquals(5, $services[0]['priority']);
    }

    public function testRegisterMultipleServices()
    {
        $services = ['Service1', 'Service2', 'Service3'];
        ContextualServiceRegistry::registerMultiple('frontend', $services, ['priority' => 10]);

        $registeredServices = ContextualServiceRegistry::getServicesForContext('frontend');
        $this->assertCount(3, $registeredServices);

        foreach ($registeredServices as $service) {
            $this->assertEquals(10, $service['priority']);
        }
    }

    public function testDeferService()
    {
        $factory = function() {
            return new \stdClass();
        };

        ContextualServiceRegistry::defer('api', $factory, ['priority' => 15]);

        $deferredServices = ContextualServiceRegistry::getDeferredServicesForContext('api');
        $this->assertCount(1, $deferredServices);
        $this->assertEquals(15, $deferredServices[0]['priority']);
    }

    public function testLoadForContext()
    {
        $container = new Container();

        ContextualServiceRegistry::register('admin', 'TestService', ['deferred' => false]);
        ContextualServiceRegistry::loadForContext($container, 'admin');

        $this->assertTrue(ContextualServiceRegistry::isContextLoaded('admin'));
    }

    public function testLoadForContextDoesNotReload()
    {
        $container = new Container();

        ContextualServiceRegistry::register('admin', 'TestService');
        ContextualServiceRegistry::loadForContext($container, 'admin');
        ContextualServiceRegistry::loadForContext($container, 'admin'); // Second call should not reload

        $this->assertTrue(ContextualServiceRegistry::isContextLoaded('admin'));
    }

    public function testGetServicesForContext()
    {
        ContextualServiceRegistry::register('frontend', 'Service1');
        ContextualServiceRegistry::register('frontend', 'Service2');

        $services = ContextualServiceRegistry::getServicesForContext('frontend');
        $this->assertCount(2, $services);
        $this->assertEquals('Service1', $services[0]['class']);
        $this->assertEquals('Service2', $services[1]['class']);
    }

    public function testGetDeferredServicesForContext()
    {
        $factory = function() {
            return new \stdClass();
        };

        ContextualServiceRegistry::defer('api', $factory);

        $deferredServices = ContextualServiceRegistry::getDeferredServicesForContext('api');
        $this->assertCount(1, $deferredServices);
        $this->assertIsCallable($deferredServices[0]['factory']);
    }

    public function testIsContextLoaded()
    {
        $this->assertFalse(ContextualServiceRegistry::isContextLoaded('admin'));

        $container = new Container();
        ContextualServiceRegistry::loadForContext($container, 'admin');

        $this->assertTrue(ContextualServiceRegistry::isContextLoaded('admin'));
    }

    public function testGetLoadedContexts()
    {
        $container = new Container();

        ContextualServiceRegistry::loadForContext($container, 'admin');
        ContextualServiceRegistry::loadForContext($container, 'frontend');

        $loadedContexts = ContextualServiceRegistry::getLoadedContexts();
        $this->assertContains('admin', $loadedContexts);
        $this->assertContains('frontend', $loadedContexts);
    }

    public function testClearLoadedContexts()
    {
        $container = new Container();
        ContextualServiceRegistry::loadForContext($container, 'admin');

        $this->assertTrue(ContextualServiceRegistry::isContextLoaded('admin'));

        ContextualServiceRegistry::clearLoadedContexts();

        $this->assertFalse(ContextualServiceRegistry::isContextLoaded('admin'));
    }

    public function testGetStats()
    {
        ContextualServiceRegistry::register('admin', 'Service1');
        ContextualServiceRegistry::register('frontend', 'Service2');

        $stats = ContextualServiceRegistry::getStats();

        $this->assertIsArray($stats);
        $this->assertArrayHasKey('total_contexts', $stats);
        $this->assertArrayHasKey('total_services', $stats);
        $this->assertArrayHasKey('total_deferred', $stats);
    }

    public function testConstantsAreDefined()
    {
        $this->assertEquals('shared', ContextualServiceRegistry::SHARED);
        $this->assertEquals('admin', ContextualServiceRegistry::ADMIN);
        $this->assertEquals('frontend', ContextualServiceRegistry::FRONTEND);
        $this->assertEquals('api', ContextualServiceRegistry::API);
        $this->assertEquals('cli', ContextualServiceRegistry::CLI);
        $this->assertEquals('gutenberg', ContextualServiceRegistry::GUTENBERG);
        $this->assertEquals('woocommerce', ContextualServiceRegistry::WOOCOMMERCE);
    }
}