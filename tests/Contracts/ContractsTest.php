<?php

namespace Tests\Contracts;

use PHPUnit\Framework\TestCase;
use Jankx\Contracts\KernelInterface;
use Jankx\Contracts\BootstrapperInterface;
use Jankx\Contracts\ContextInterface;
use Jankx\Contracts\ServiceRegistryInterface;
use Illuminate\Container\Container;
use Mockery;

/**
 * Test class for Contracts
 */
class ContractsTest extends TestCase
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

    public function testKernelInterface()
    {
        $mockKernel = Mockery::mock(KernelInterface::class);

        $mockKernel->shouldReceive('boot')->once();
        $mockKernel->shouldReceive('isBooted')->andReturn(true);
        $mockKernel->shouldReceive('getType')->andReturn('test');
        $mockKernel->shouldReceive('getContainer')->andReturn(new Container());
        $mockKernel->shouldReceive('getServices')->andReturn([]);
        $mockKernel->shouldReceive('getHooks')->andReturn([]);
        $mockKernel->shouldReceive('getFilters')->andReturn([]);
        $mockKernel->shouldReceive('getBootstrappers')->andReturn([]);
        $mockKernel->shouldReceive('addBootstrapper')->with('TestBootstrapper')->once();
        $mockKernel->shouldReceive('removeBootstrapper')->with('TestBootstrapper')->once();
        $mockKernel->shouldReceive('hasBootstrapper')->with('TestBootstrapper')->andReturn(true);

        $mockKernel->boot();
        $this->assertTrue($mockKernel->isBooted());
        $this->assertEquals('test', $mockKernel->getType());
        $this->assertInstanceOf(Container::class, $mockKernel->getContainer());
        $this->assertIsArray($mockKernel->getServices());
        $this->assertIsArray($mockKernel->getHooks());
        $this->assertIsArray($mockKernel->getFilters());
        $this->assertIsArray($mockKernel->getBootstrappers());
        $mockKernel->addBootstrapper('TestBootstrapper');
        $mockKernel->removeBootstrapper('TestBootstrapper');
        $this->assertTrue($mockKernel->hasBootstrapper('TestBootstrapper'));
    }

    public function testBootstrapperInterface()
    {
        $mockBootstrapper = Mockery::mock(BootstrapperInterface::class);

        $mockBootstrapper->shouldReceive('getName')->andReturn('TestBootstrapper');
        $mockBootstrapper->shouldReceive('getPriority')->andReturn(10);
        $mockBootstrapper->shouldReceive('getDependencies')->andReturn([]);
        $mockBootstrapper->shouldReceive('shouldRun')->andReturn(true);
        $mockBootstrapper->shouldReceive('bootstrap')->with(Mockery::type(Container::class))->once();

        $this->assertEquals('TestBootstrapper', $mockBootstrapper->getName());
        $this->assertEquals(10, $mockBootstrapper->getPriority());
        $this->assertIsArray($mockBootstrapper->getDependencies());
        $this->assertTrue($mockBootstrapper->shouldRun());

        $container = new Container();
        $mockBootstrapper->bootstrap($container);
    }

    public function testContextInterface()
    {
        $mockContext = Mockery::mock(ContextInterface::class);

        $mockContext->shouldReceive('getCurrentContext')->andReturn('frontend');
        $mockContext->shouldReceive('isContext')->with('admin')->andReturn(false);
        $mockContext->shouldReceive('isContext')->with('frontend')->andReturn(true);

        $this->assertEquals('frontend', $mockContext->getCurrentContext());
        $this->assertFalse($mockContext->isContext('admin'));
        $this->assertTrue($mockContext->isContext('frontend'));
    }

    public function testServiceRegistryInterface()
    {
        $mockRegistry = Mockery::mock(ServiceRegistryInterface::class);

        $mockRegistry->shouldReceive('register')->with('test', 'TestService', [])->once();
        $mockRegistry->shouldReceive('resolve')->with('test')->andReturn(new \stdClass());
        $mockRegistry->shouldReceive('has')->with('test')->andReturn(true);
        $mockRegistry->shouldReceive('getServices')->andReturn(['test' => 'TestService']);
        $mockRegistry->shouldReceive('clear')->once();

        $mockRegistry->register('test', 'TestService');
        $this->assertInstanceOf(\stdClass::class, $mockRegistry->resolve('test'));
        $this->assertTrue($mockRegistry->has('test'));
        $this->assertIsArray($mockRegistry->getServices());
        $mockRegistry->clear();
    }

    public function testInterfaceImplementations()
    {
        // Test that interfaces can be implemented
        $kernelImplementation = new class implements KernelInterface {
            public function boot(): void {}
            public function isBooted(): bool { return false; }
            public function getType(): string { return 'test'; }
            public function getContainer(): Container { return new Container(); }
            public function getServices(): array { return []; }
            public function getHooks(): array { return []; }
            public function getFilters(): array { return []; }
            public function getBootstrappers(): array { return []; }
            public function addBootstrapper(string $bootstrapper): void {}
            public function removeBootstrapper(string $bootstrapper): void {}
            public function hasBootstrapper(string $bootstrapper): bool { return false; }
            public function getKernelType(): string { return 'test'; }
            public function __construct(Container $container = null) {}
        };

        $this->assertInstanceOf(KernelInterface::class, $kernelImplementation);

        $bootstrapperImplementation = new class implements BootstrapperInterface {
            public function getName(): string { return 'Test'; }
            public function getPriority(): int { return 10; }
            public function getDependencies(): array { return []; }
            public function shouldRun(): bool { return true; }
            public function bootstrap(Container $container): void {}
        };

        $this->assertInstanceOf(BootstrapperInterface::class, $bootstrapperImplementation);
    }
}