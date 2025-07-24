<?php

namespace Tests\Facades;

use PHPUnit\Framework\TestCase;
use Jankx\Facades\Facade;
use Jankx\Jankx;
use Illuminate\Container\Container;
use Mockery;

/**
 * Test class for Facade
 */
class FacadeTest extends TestCase
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

    public function testSetContainer()
    {
        $container = new Container();
        Facade::setContainer($container);

        $this->assertSame($container, Facade::getContainer());
    }

    public function testGetContainerReturnsJankxInstanceWhenNotSet()
    {
        // Reset container
        $reflection = new \ReflectionClass(Facade::class);
        $containerProperty = $reflection->getProperty('container');
        $containerProperty->setAccessible(true);
        $containerProperty->setValue(null, null);

        $container = Facade::getContainer();
        $this->assertInstanceOf(Container::class, $container);
    }

    public function testGetFacadeAccessorThrowsException()
    {
        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('Facade does not implement getFacadeAccessor method.');

        Facade::getFacadeAccessor();
    }

    public function testResolveFacadeInstanceWithObject()
    {
        $object = new \stdClass();
        $result = Facade::resolveFacadeInstance($object);
        $this->assertSame($object, $result);
    }

    public function testResolveFacadeInstanceWithString()
    {
        $container = new Container();
        $container->singleton('test.service', function() {
            return new \stdClass();
        });

        Facade::setContainer($container);

        $result = Facade::resolveFacadeInstance('test.service');
        $this->assertInstanceOf(\stdClass::class, $result);
    }

    public function testCallStaticThrowsExceptionWhenNoInstance()
    {
        // Reset container
        $reflection = new \ReflectionClass(Facade::class);
        $containerProperty = $reflection->getProperty('container');
        $containerProperty->setAccessible(true);
        $containerProperty->setValue(null, null);

        $this->expectException(\RuntimeException::class);
        $this->expectExceptionMessage('A facade instance has not been set.');

        // Create a mock facade that doesn't implement getFacadeAccessor properly
        $mockFacade = $this->getMockForAbstractClass(Facade::class);
        $mockFacade::__callStatic('testMethod', []);
    }
}