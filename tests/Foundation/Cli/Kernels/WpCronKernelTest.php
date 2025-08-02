<?php

namespace Tests\Foundation\Cli\Kernels;

use PHPUnit\Framework\TestCase;
use Jankx\Foundation\Cli\Kernels\WpCronKernel;
use Jankx\Foundation\Application;

class WpCronKernelTest extends TestCase
{
    private Application $app;
    private WpCronKernel $kernel;

    protected function setUp(): void
    {
        $this->app = new Application();
        $this->kernel = new WpCronKernel($this->app);
    }

    public function testWpCronKernelCanBeInstantiated()
    {
        $this->assertInstanceOf(WpCronKernel::class, $this->kernel);
    }

    public function testWpCronKernelCanHandle()
    {
        $this->expectNotToPerformAssertions();
        $this->kernel->handle([]);
    }
}