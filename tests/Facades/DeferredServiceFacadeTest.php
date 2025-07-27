<?php

namespace Tests\Facades;

use PHPUnit\Framework\TestCase;
use Jankx\Facades\DeferredService;
use Brain\Monkey\Functions;

class DeferredServiceFacadeTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Brain\Monkey\setUp();
    }

    protected function tearDown(): void
    {
        Brain\Monkey\tearDown();
        parent::tearDown();
    }

    public function testDefer()
    {
        $serviceName = 'test.service';
        $context = 'admin';

        Functions\expect('Jankx\Context\ContextualServiceRegistry::defer')
            ->once()
            ->with($serviceName, $context);

        DeferredService::defer($serviceName, $context);

        $this->assertTrue(true);
    }

    public function testResolve()
    {
        $serviceName = 'test.service';
        $expectedResult = 'test-result';

        Functions\expect('Jankx\Context\ContextualServiceRegistry::resolve')
            ->once()
            ->with($serviceName)
            ->andReturn($expectedResult);

        $result = DeferredService::resolve($serviceName);

        $this->assertEquals($expectedResult, $result);
    }

    public function testIsDeferred()
    {
        $serviceName = 'test.service';

        Functions\expect('Jankx\Context\ContextualServiceRegistry::isDeferred')
            ->once()
            ->with($serviceName)
            ->andReturn(true);

        $result = DeferredService::isDeferred($serviceName);

        $this->assertTrue($result);
    }

    public function testIsDeferredWithNonDeferredService()
    {
        $serviceName = 'test.service';

        Functions\expect('Jankx\Context\ContextualServiceRegistry::isDeferred')
            ->once()
            ->with($serviceName)
            ->andReturn(false);

        $result = DeferredService::isDeferred($serviceName);

        $this->assertFalse($result);
    }

    public function testGetDeferredServices()
    {
        $expectedServices = [
            'admin.service' => 'admin',
            'frontend.service' => 'frontend',
        ];

        Functions\expect('Jankx\Context\ContextualServiceRegistry::getDeferredServices')
            ->once()
            ->andReturn($expectedServices);

        $result = DeferredService::getDeferredServices();

        $this->assertEquals($expectedServices, $result);
    }

    public function testGetDeferredServicesForContext()
    {
        $context = 'admin';
        $expectedServices = ['admin.service', 'admin.menu.service'];

        Functions\expect('Jankx\Context\ContextualServiceRegistry::getDeferredServicesForContext')
            ->once()
            ->with($context)
            ->andReturn($expectedServices);

        $result = DeferredService::getDeferredServicesForContext($context);

        $this->assertEquals($expectedServices, $result);
    }

    public function testClearDeferredServices()
    {
        Functions\expect('Jankx\Context\ContextualServiceRegistry::clearDeferredServices')
            ->once();

        DeferredService::clear();

        $this->assertTrue(true);
    }

    public function testClearDeferredServicesForContext()
    {
        $context = 'admin';

        Functions\expect('Jankx\Context\ContextualServiceRegistry::clearDeferredServicesForContext')
            ->once()
            ->with($context);

        DeferredService::clearForContext($context);

        $this->assertTrue(true);
    }

    public function testRegisterDeferredService()
    {
        $serviceName = 'test.service';
        $serviceClass = 'TestService';
        $context = 'admin';

        Functions\expect('Jankx\Context\ContextualServiceRegistry::registerDeferredService')
            ->once()
            ->with($serviceName, $serviceClass, $context);

        DeferredService::register($serviceName, $serviceClass, $context);

        $this->assertTrue(true);
    }

    public function testUnregisterDeferredService()
    {
        $serviceName = 'test.service';

        Functions\expect('Jankx\Context\ContextualServiceRegistry::unregisterDeferredService')
            ->once()
            ->with($serviceName);

        DeferredService::unregister($serviceName);

        $this->assertTrue(true);
    }

    public function testGetServiceClass()
    {
        $serviceName = 'test.service';
        $expectedClass = 'TestService';

        Functions\expect('Jankx\Context\ContextualServiceRegistry::getServiceClass')
            ->once()
            ->with($serviceName)
            ->andReturn($expectedClass);

        $result = DeferredService::getServiceClass($serviceName);

        $this->assertEquals($expectedClass, $result);
    }

    public function testGetServiceClassWithNonExistentService()
    {
        $serviceName = 'non-existent.service';

        Functions\expect('Jankx\Context\ContextualServiceRegistry::getServiceClass')
            ->once()
            ->with($serviceName)
            ->andReturn(null);

        $result = DeferredService::getServiceClass($serviceName);

        $this->assertNull($result);
    }

    public function testHasDeferredService()
    {
        $serviceName = 'test.service';

        Functions\expect('Jankx\Context\ContextualServiceRegistry::hasDeferredService')
            ->once()
            ->with($serviceName)
            ->andReturn(true);

        $result = DeferredService::has($serviceName);

        $this->assertTrue($result);
    }

    public function testHasDeferredServiceWithNonExistentService()
    {
        $serviceName = 'non-existent.service';

        Functions\expect('Jankx\Context\ContextualServiceRegistry::hasDeferredService')
            ->once()
            ->with($serviceName)
            ->andReturn(false);

        $result = DeferredService::has($serviceName);

        $this->assertFalse($result);
    }

    public function testGetContextForService()
    {
        $serviceName = 'test.service';
        $expectedContext = 'admin';

        Functions\expect('Jankx\Context\ContextualServiceRegistry::getContextForService')
            ->once()
            ->with($serviceName)
            ->andReturn($expectedContext);

        $result = DeferredService::getContextForService($serviceName);

        $this->assertEquals($expectedContext, $result);
    }

    public function testGetContextForServiceWithNonExistentService()
    {
        $serviceName = 'non-existent.service';

        Functions\expect('Jankx\Context\ContextualServiceRegistry::getContextForService')
            ->once()
            ->with($serviceName)
            ->andReturn(null);

        $result = DeferredService::getContextForService($serviceName);

        $this->assertNull($result);
    }

    public function testResolveAllForContext()
    {
        $context = 'admin';
        $expectedResults = [
            'admin.service' => 'admin-service-instance',
            'admin.menu.service' => 'admin-menu-instance',
        ];

        Functions\expect('Jankx\Context\ContextualServiceRegistry::resolveAllForContext')
            ->once()
            ->with($context)
            ->andReturn($expectedResults);

        $result = DeferredService::resolveAllForContext($context);

        $this->assertEquals($expectedResults, $result);
    }

    public function testGetDeferredServiceCount()
    {
        $expectedCount = 5;

        Functions\expect('Jankx\Context\ContextualServiceRegistry::getDeferredServiceCount')
            ->once()
            ->andReturn($expectedCount);

        $result = DeferredService::count();

        $this->assertEquals($expectedCount, $result);
    }

    public function testGetDeferredServiceCountForContext()
    {
        $context = 'admin';
        $expectedCount = 3;

        Functions\expect('Jankx\Context\ContextualServiceRegistry::getDeferredServiceCountForContext')
            ->once()
            ->with($context)
            ->andReturn($expectedCount);

        $result = DeferredService::countForContext($context);

        $this->assertEquals($expectedCount, $result);
    }
}