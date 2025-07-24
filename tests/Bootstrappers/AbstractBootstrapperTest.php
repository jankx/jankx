<?php

namespace Tests\Bootstrappers;

use PHPUnit\Framework\TestCase;
use Jankx\Bootstrappers\AbstractBootstrapper;
use Illuminate\Container\Container;
use Mockery;

/**
 * Test class for AbstractBootstrapper
 */
class AbstractBootstrapperTest extends TestCase
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

    public function testGetPriority()
    {
        $mockBootstrapper = $this->getMockForAbstractClass(AbstractBootstrapper::class);
        $this->assertEquals(10, $mockBootstrapper->getPriority());
    }

    public function testGetDependencies()
    {
        $mockBootstrapper = $this->getMockForAbstractClass(AbstractBootstrapper::class);
        $dependencies = $mockBootstrapper->getDependencies();
        $this->assertIsArray($dependencies);
    }

    public function testAbstractMethodsExist()
    {
        $mockBootstrapper = $this->getMockForAbstractClass(AbstractBootstrapper::class);

        // Test that abstract methods can be called (they should be implemented by mock)
        $this->assertIsString($mockBootstrapper->getName());
        $this->assertIsBool($mockBootstrapper->shouldRun());

        $container = new Container();
        $mockBootstrapper->bootstrap($container);
        // If no exception is thrown, the method exists
        $this->assertTrue(true);
    }

    public function testBootstrapperImplementsInterface()
    {
        $mockBootstrapper = $this->getMockForAbstractClass(AbstractBootstrapper::class);
        $this->assertInstanceOf(\Jankx\Contracts\BootstrapperInterface::class, $mockBootstrapper);
    }
}