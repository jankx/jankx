<?php

namespace Tests\Kernel;

use PHPUnit\Framework\TestCase;
use Jankx\Kernel\Kernel;
use Jankx\Jankx;
use Mockery;

/**
 * Test class for abstract Kernel class
 */
class KernelTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function testKernelConstructor()
    {
        $mockKernel = $this->getMockForAbstractClass(Kernel::class);

        $this->assertInstanceOf(\Illuminate\Container\Container::class, $mockKernel->getContainer());
        $this->assertEquals('abstract', $mockKernel->getKernelType());
        $this->assertFalse($mockKernel->isBooted());
    }

    public function testKernelWithCustomContainer()
    {
        $container = new \Illuminate\Container\Container();
        $mockKernel = $this->getMockForAbstractClass(Kernel::class, [$container]);

        $this->assertSame($container, $mockKernel->getContainer());
    }

    public function testGetType()
    {
        $mockKernel = $this->getMockForAbstractClass(Kernel::class);
        $this->assertEquals('abstract', $mockKernel->getType());
    }

    public function testGetHooks()
    {
        $mockKernel = $this->getMockForAbstractClass(Kernel::class);
        $this->assertIsArray($mockKernel->getHooks());
    }

    public function testGetFilters()
    {
        $mockKernel = $this->getMockForAbstractClass(Kernel::class);
        $this->assertIsArray($mockKernel->getFilters());
    }

    public function testGetBootstrappers()
    {
        $mockKernel = $this->getMockForAbstractClass(Kernel::class);
        $this->assertIsArray($mockKernel->getBootstrappers());
    }

    public function testAddBootstrapper()
    {
        $mockKernel = $this->getMockForAbstractClass(Kernel::class);
        $mockKernel->addBootstrapper('TestBootstrapper');

        $this->assertTrue($mockKernel->hasBootstrapper('TestBootstrapper'));
    }

    public function testRemoveBootstrapper()
    {
        $mockKernel = $this->getMockForAbstractClass(Kernel::class);
        $mockKernel->addBootstrapper('TestBootstrapper');
        $mockKernel->removeBootstrapper('TestBootstrapper');

        $this->assertFalse($mockKernel->hasBootstrapper('TestBootstrapper'));
    }

    public function testHasBootstrapper()
    {
        $mockKernel = $this->getMockForAbstractClass(Kernel::class);

        $this->assertFalse($mockKernel->hasBootstrapper('NonExistentBootstrapper'));

        $mockKernel->addBootstrapper('TestBootstrapper');
        $this->assertTrue($mockKernel->hasBootstrapper('TestBootstrapper'));
    }

    public function testIsBooted()
    {
        $mockKernel = $this->getMockForAbstractClass(Kernel::class);
        $this->assertFalse($mockKernel->isBooted());
    }
}