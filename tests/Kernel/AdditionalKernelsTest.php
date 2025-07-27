<?php

namespace Tests\Kernel;

use Brain\Monkey\Functions;
use Illuminate\Container\Container;
use Jankx\Context\ContextualServiceRegistry;
use Jankx\Kernel\CronKernel;
use Jankx\Kernel\APIKernel;
use Jankx\Kernel\AdminKernel;
use Jankx\Kernel\FrontendKernel;
use Tests\TestCase;

/**
 * Additional Kernels Test
 *
 * @package Tests\Kernel
 * @since 2.0.0
 */
class AdditionalKernelsTest extends TestCase
{
    protected Container $container;

    protected function setUp(): void
    {
        parent::setUp();
        $this->container = new Container();
    }

    // CronKernel Tests
    public function testCronKernelConstructor()
    {
        $kernel = new CronKernel($this->container);

        // Use reflection to access protected property
        $reflection = new \ReflectionClass($kernel);
        $property = $reflection->getProperty('container');
        $property->setAccessible(true);

        $container = $property->getValue($kernel);
        $this->assertSame($this->container, $container);
    }

    public function testCronKernelBoot()
    {
        $kernel = new CronKernel($this->container);

        $mockServices = [
            'Jankx\Providers\FrontendServiceProvider'
        ];

        Functions\when('ContextualServiceRegistry::getServices')
            ->justReturn($mockServices);

        Functions\when('class_exists')->justReturn(true);

        $kernel->boot();

        $this->assertTrue($kernel->isBooted());
        Functions\expect('ContextualServiceRegistry::getServices')
            ->toBeCalledWith(ContextualServiceRegistry::FRONTEND);
    }

    public function testCronKernelIsBootedBeforeBoot()
    {
        $kernel = new CronKernel($this->container);
        $this->assertFalse($kernel->isBooted());
    }

    public function testCronKernelIsBootedAfterBoot()
    {
        $kernel = new CronKernel($this->container);

        Functions\when('ContextualServiceRegistry::getServices')
            ->justReturn([]);

        $kernel->boot();
        $this->assertTrue($kernel->isBooted());
    }

    // APIKernel Tests
    public function testAPIKernelConstructor()
    {
        $kernel = new APIKernel($this->container);

        // Use reflection to access protected property
        $reflection = new \ReflectionClass($kernel);
        $property = $reflection->getProperty('container');
        $property->setAccessible(true);

        $container = $property->getValue($kernel);
        $this->assertSame($this->container, $container);
    }

    public function testAPIKernelBoot()
    {
        $kernel = new APIKernel($this->container);

        $mockServices = [
            'Jankx\Providers\FrontendServiceProvider'
        ];

        Functions\when('ContextualServiceRegistry::getServices')
            ->justReturn($mockServices);

        Functions\when('class_exists')->justReturn(true);

        $kernel->boot();

        $this->assertTrue($kernel->isBooted());
        Functions\expect('ContextualServiceRegistry::getServices')
            ->toBeCalledWith(ContextualServiceRegistry::FRONTEND);
    }

    public function testAPIKernelIsBootedBeforeBoot()
    {
        $kernel = new APIKernel($this->container);
        $this->assertFalse($kernel->isBooted());
    }

    public function testAPIKernelIsBootedAfterBoot()
    {
        $kernel = new APIKernel($this->container);

        Functions\when('ContextualServiceRegistry::getServices')
            ->justReturn([]);

        $kernel->boot();
        $this->assertTrue($kernel->isBooted());
    }

    // AdminKernel Tests
    public function testAdminKernelConstructor()
    {
        $kernel = new AdminKernel($this->container);

        // Use reflection to access protected property
        $reflection = new \ReflectionClass($kernel);
        $property = $reflection->getProperty('container');
        $property->setAccessible(true);

        $container = $property->getValue($kernel);
        $this->assertSame($this->container, $container);
    }

    public function testAdminKernelBoot()
    {
        $kernel = new AdminKernel($this->container);

        $mockServices = [
            'Jankx\Providers\AdminServiceProvider'
        ];

        Functions\when('ContextualServiceRegistry::getServices')
            ->justReturn($mockServices);

        Functions\when('class_exists')->justReturn(true);

        $kernel->boot();

        $this->assertTrue($kernel->isBooted());
        Functions\expect('ContextualServiceRegistry::getServices')
            ->toBeCalledWith(ContextualServiceRegistry::ADMIN);
    }

    public function testAdminKernelIsBootedBeforeBoot()
    {
        $kernel = new AdminKernel($this->container);
        $this->assertFalse($kernel->isBooted());
    }

    public function testAdminKernelIsBootedAfterBoot()
    {
        $kernel = new AdminKernel($this->container);

        Functions\when('ContextualServiceRegistry::getServices')
            ->justReturn([]);

        $kernel->boot();
        $this->assertTrue($kernel->isBooted());
    }

    // FrontendKernel Tests
    public function testFrontendKernelConstructor()
    {
        $kernel = new FrontendKernel($this->container);

        // Use reflection to access protected property
        $reflection = new \ReflectionClass($kernel);
        $property = $reflection->getProperty('container');
        $property->setAccessible(true);

        $container = $property->getValue($kernel);
        $this->assertSame($this->container, $container);
    }

    public function testFrontendKernelBoot()
    {
        $kernel = new FrontendKernel($this->container);

        $mockServices = [
            'Jankx\Providers\FrontendServiceProvider',
            'Jankx\Providers\FrontendHelperProvider'
        ];

        Functions\when('ContextualServiceRegistry::getServices')
            ->justReturn($mockServices);

        Functions\when('class_exists')->justReturn(true);

        $kernel->boot();

        $this->assertTrue($kernel->isBooted());
        Functions\expect('ContextualServiceRegistry::getServices')
            ->toBeCalledWith(ContextualServiceRegistry::FRONTEND);
    }

    public function testFrontendKernelIsBootedBeforeBoot()
    {
        $kernel = new FrontendKernel($this->container);
        $this->assertFalse($kernel->isBooted());
    }

    public function testFrontendKernelIsBootedAfterBoot()
    {
        $kernel = new FrontendKernel($this->container);

        Functions\when('ContextualServiceRegistry::getServices')
            ->justReturn([]);

        $kernel->boot();
        $this->assertTrue($kernel->isBooted());
    }

    public function testFrontendKernelHandlesWooCommerce()
    {
        $kernel = new FrontendKernel($this->container);

        Functions\when('ContextualServiceRegistry::getServices')
            ->justReturn([]);

        Functions\when('class_exists')
            ->justReturn(true) // WooCommerce exists
            ->justReturn(true); // Other classes

        $kernel->boot();

        $this->assertTrue($kernel->isBooted());
        Functions\expect('class_exists')->toBeCalledWith('WooCommerce');
    }

    public function testFrontendKernelHandlesNoWooCommerce()
    {
        $kernel = new FrontendKernel($this->container);

        Functions\when('ContextualServiceRegistry::getServices')
            ->justReturn([]);

        Functions\when('class_exists')
            ->justReturn(false) // WooCommerce doesn't exist
            ->justReturn(true); // Other classes

        $kernel->boot();

        $this->assertTrue($kernel->isBooted());
        Functions\expect('class_exists')->toBeCalledWith('WooCommerce');
    }

    // Error Handling Tests
    public function testAllKernelsHandleEmptyServicesList()
    {
        $kernels = [
            new CronKernel($this->container),
            new APIKernel($this->container),
            new AdminKernel($this->container),
            new FrontendKernel($this->container)
        ];

        Functions\when('ContextualServiceRegistry::getServices')
            ->justReturn([]);

        foreach ($kernels as $kernel) {
            $kernel->boot();
            $this->assertTrue($kernel->isBooted());
        }
    }

    public function testAllKernelsHandleNullServicesList()
    {
        $kernels = [
            new CronKernel($this->container),
            new APIKernel($this->container),
            new AdminKernel($this->container),
            new FrontendKernel($this->container)
        ];

        Functions\when('ContextualServiceRegistry::getServices')
            ->justReturn(null);

        foreach ($kernels as $kernel) {
            $kernel->boot();
            $this->assertTrue($kernel->isBooted());
        }
    }

    public function testAllKernelsHandleNonExistentServiceProviders()
    {
        $kernels = [
            new CronKernel($this->container),
            new APIKernel($this->container),
            new AdminKernel($this->container),
            new FrontendKernel($this->container)
        ];

        $mockServices = [
            'Jankx\Providers\FrontendServiceProvider',
            'NonExistentProvider'
        ];

        Functions\when('ContextualServiceRegistry::getServices')
            ->justReturn($mockServices);

        Functions\when('class_exists')
            ->justReturn(true)
            ->justReturn(false);

        foreach ($kernels as $kernel) {
            $kernel->boot();
            $this->assertTrue($kernel->isBooted());
        }
    }
}