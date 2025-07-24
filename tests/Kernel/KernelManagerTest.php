<?php

namespace Tests\Kernel;

use PHPUnit\Framework\TestCase;
use Jankx\Kernel\KernelManager;
use Jankx\Kernel\KernelFactory;
use Illuminate\Container\Container;
use Mockery;

/**
 * Test class for KernelManager
 */
class KernelManagerTest extends TestCase
{
    protected $container;
    protected $kernelManager;

    protected function setUp(): void
    {
        parent::setUp();
        $this->container = new Container();
        $this->kernelManager = new KernelManager($this->container);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function testKernelManagerConstructor()
    {
        $this->assertInstanceOf(KernelManager::class, $this->kernelManager);
        $this->assertInstanceOf(KernelFactory::class, $this->kernelManager->getKernelFactory());
    }

    public function testRegisterKernel()
    {
        $this->kernelManager->registerKernel('test', 'TestKernel');
        $this->assertTrue($this->kernelManager->hasKernel('test'));
    }

    public function testGetKernel()
    {
        $this->kernelManager->registerKernel('test', 'TestKernel');
        $kernel = $this->kernelManager->getKernel('test');
        $this->assertEquals('TestKernel', $kernel);
    }

    public function testGetKernelReturnsNullForNonExistent()
    {
        $kernel = $this->kernelManager->getKernel('non-existent');
        $this->assertNull($kernel);
    }

    public function testHasKernel()
    {
        $this->assertFalse($this->kernelManager->hasKernel('non-existent'));

        $this->kernelManager->registerKernel('test', 'TestKernel');
        $this->assertTrue($this->kernelManager->hasKernel('test'));
    }

    public function testRemoveKernel()
    {
        $this->kernelManager->registerKernel('test', 'TestKernel');
        $this->assertTrue($this->kernelManager->hasKernel('test'));

        $this->kernelManager->removeKernel('test');
        $this->assertFalse($this->kernelManager->hasKernel('test'));
    }

    public function testGetAllKernels()
    {
        $this->kernelManager->registerKernel('test1', 'TestKernel1');
        $this->kernelManager->registerKernel('test2', 'TestKernel2');

        $kernels = $this->kernelManager->getAllKernels();
        $this->assertArrayHasKey('test1', $kernels);
        $this->assertArrayHasKey('test2', $kernels);
    }

    public function testGetBootedKernels()
    {
        $bootedKernels = $this->kernelManager->getBootedKernels();
        $this->assertIsArray($bootedKernels);
    }

    public function testIsKernelBooted()
    {
        $this->assertFalse($this->kernelManager->isKernelBooted('test'));
    }

    public function testGetKernelInfo()
    {
        $this->kernelManager->registerKernel('test', 'TestKernel');
        $info = $this->kernelManager->getKernelInfo('test');

        $this->assertIsArray($info);
        $this->assertArrayHasKey('class', $info);
        $this->assertEquals('TestKernel', $info['class']);
    }

    public function testGetAllKernelInfo()
    {
        $this->kernelManager->registerKernel('test1', 'TestKernel1');
        $this->kernelManager->registerKernel('test2', 'TestKernel2');

        $allInfo = $this->kernelManager->getAllKernelInfo();
        $this->assertIsArray($allInfo);
        $this->assertArrayHasKey('test1', $allInfo);
        $this->assertArrayHasKey('test2', $allInfo);
    }

    public function testGetContextStrategies()
    {
        $strategies = $this->kernelManager->getContextStrategies();
        $this->assertIsArray($strategies);
        $this->assertNotEmpty($strategies);
    }

    public function testGetKernelFactory()
    {
        $factory = $this->kernelManager->getKernelFactory();
        $this->assertInstanceOf(KernelFactory::class, $factory);
    }
}