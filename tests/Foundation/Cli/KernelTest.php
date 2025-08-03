<?php

namespace Tests\Foundation\Cli;

use PHPUnit\Framework\TestCase;
use Jankx\Foundation\Cli\Kernel;
use Jankx\Foundation\Application;

class KernelTest extends TestCase
{
    private Application $app;
    private Kernel $kernel;

    protected function setUp(): void
    {
        $this->app = new Application();
        $this->kernel = new class ($this->app) extends Kernel {
            public function handle($args)
            {
            }
        };
    }

    public function testKernelCanBeInstantiated()
    {
        $this->assertInstanceOf(Kernel::class, $this->kernel);
    }

    public function testKernelCanBootstrap()
    {
        $this->expectNotToPerformAssertions();
        $this->kernel->bootstrap();
    }

    public function testKernelCanHandle()
    {
        $this->expectNotToPerformAssertions();
        $this->kernel->handle([]);
    }

    public function testKernelCanGetApplication()
    {
        $app = $this->kernel->getApplication();
        $this->assertInstanceOf(Application::class, $app);
    }
}
