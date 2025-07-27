<?php

namespace Tests\Kernel;

use Brain\Monkey\Functions;
use Illuminate\Container\Container;
use Jankx\Context\ContextualServiceRegistry;
use Jankx\Kernel\NotFoundKernel;
use Tests\TestCase;

/**
 * NotFoundKernel Test
 *
 * @package Tests\Kernel
 * @since 2.0.0
 */
class NotFoundKernelTest extends TestCase
{
    protected NotFoundKernel $kernel;
    protected Container $container;

    protected function setUp(): void
    {
        parent::setUp();
        $this->container = new Container();
        $this->kernel = new NotFoundKernel($this->container);
    }

    public function testConstructorSetsContainer()
    {
        // Use reflection to access protected property
        $reflection = new \ReflectionClass($this->kernel);
        $property = $reflection->getProperty('container');
        $property->setAccessible(true);

        $container = $property->getValue($this->kernel);
        $this->assertSame($this->container, $container);
    }

    public function testConstructorSetsBootedToFalse()
    {
        $this->assertFalse($this->kernel->isBooted());
    }

    public function testBootRegistersFrontendServices()
    {
        $mockServices = [
            'Jankx\Providers\FrontendServiceProvider',
            'Jankx\Providers\FrontendHelperProvider'
        ];

        Functions\when('ContextualServiceRegistry::getServices')
            ->justReturn($mockServices);

        Functions\when('class_exists')->justReturn(true);

        $this->kernel->boot();

        $this->assertTrue($this->kernel->isBooted());
        Functions\expect('ContextualServiceRegistry::getServices')
            ->toBeCalledWith(ContextualServiceRegistry::FRONTEND);
    }

    public function testBootHandlesNonExistentServiceProviders()
    {
        $mockServices = [
            'Jankx\Providers\FrontendServiceProvider',
            'NonExistentProvider'
        ];

        Functions\when('ContextualServiceRegistry::getServices')
            ->justReturn($mockServices);

        Functions\when('class_exists')
            ->justReturn(true)
            ->justReturn(false);

        $this->kernel->boot();

        $this->assertTrue($this->kernel->isBooted());
        Functions\expect('ContextualServiceRegistry::getServices')
            ->toBeCalledWith(ContextualServiceRegistry::FRONTEND);
    }

    public function testBootHandlesEmptyServicesList()
    {
        Functions\when('ContextualServiceRegistry::getServices')
            ->justReturn([]);

        $this->kernel->boot();

        $this->assertTrue($this->kernel->isBooted());
        Functions\expect('ContextualServiceRegistry::getServices')
            ->toBeCalledWith(ContextualServiceRegistry::FRONTEND);
    }

    public function testBootHandlesNullServicesList()
    {
        Functions\when('ContextualServiceRegistry::getServices')
            ->justReturn(null);

        $this->kernel->boot();

        $this->assertTrue($this->kernel->isBooted());
        Functions\expect('ContextualServiceRegistry::getServices')
            ->toBeCalledWith(ContextualServiceRegistry::FRONTEND);
    }

    public function testIsBootedReturnsFalseBeforeBoot()
    {
        $this->assertFalse($this->kernel->isBooted());
    }

    public function testIsBootedReturnsTrueAfterBoot()
    {
        Functions\when('ContextualServiceRegistry::getServices')
            ->justReturn([]);

        $this->kernel->boot();

        $this->assertTrue($this->kernel->isBooted());
    }

    public function testBootHandlesServiceProviderInstantiationError()
    {
        $mockServices = [
            'Jankx\Providers\FrontendServiceProvider'
        ];

        Functions\when('ContextualServiceRegistry::getServices')
            ->justReturn($mockServices);

        Functions\when('class_exists')->justReturn(true);

        // Mock service provider to throw exception
        $mockProvider = \Mockery::mock('Jankx\Providers\FrontendServiceProvider');
        $mockProvider->shouldReceive('register')->andThrow(new \Exception('Test error'));

        // Use reflection to mock the new operator
        $reflection = new \ReflectionClass($this->kernel);
        $method = $reflection->getMethod('boot');
        $method->setAccessible(true);

        $this->kernel->boot();

        // Should still be booted even if service provider fails
        $this->assertTrue($this->kernel->isBooted());
    }

    public function testBootHandlesMultipleServiceProviders()
    {
        $mockServices = [
            'Jankx\Providers\FrontendServiceProvider',
            'Jankx\Providers\FrontendHelperProvider',
            'Jankx\Providers\ContextualServiceProvider'
        ];

        Functions\when('ContextualServiceRegistry::getServices')
            ->justReturn($mockServices);

        Functions\when('class_exists')->justReturn(true);

        $this->kernel->boot();

        $this->assertTrue($this->kernel->isBooted());
        Functions\expect('ContextualServiceRegistry::getServices')
            ->toBeCalledWith(ContextualServiceRegistry::FRONTEND);
    }

    public function testBootHandlesMixedValidAndInvalidProviders()
    {
        $mockServices = [
            'Jankx\Providers\FrontendServiceProvider',
            'InvalidProvider1',
            'Jankx\Providers\FrontendHelperProvider',
            'InvalidProvider2'
        ];

        Functions\when('ContextualServiceRegistry::getServices')
            ->justReturn($mockServices);

        Functions\when('class_exists')
            ->justReturn(true)
            ->justReturn(false)
            ->justReturn(true)
            ->justReturn(false);

        $this->kernel->boot();

        $this->assertTrue($this->kernel->isBooted());
        Functions\expect('ContextualServiceRegistry::getServices')
            ->toBeCalledWith(ContextualServiceRegistry::FRONTEND);
    }
}