<?php

namespace Tests\Foundation\Cli\Kernels;

use PHPUnit\Framework\TestCase;
use Jankx\Foundation\Cli\Kernels\WpCliKernel;
use Jankx\Foundation\Application;

class WpCliKernelTest extends TestCase
{
    private Application $app;
    private WpCliKernel $kernel;

    protected function setUp(): void
    {
        $this->app = new Application();
        $this->kernel = new WpCliKernel($this->app);
    }

    public function testWpCliKernelCanBeInstantiated()
    {
        $this->assertInstanceOf(WpCliKernel::class, $this->kernel);
    }

    public function testWpCliKernelCanHandle()
    {
        $this->expectNotToPerformAssertions();
        $this->kernel->handle([]);
    }
}