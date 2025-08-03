<?php

namespace Tests\App\Console;

use PHPUnit\Framework\TestCase;
use App\Console\WpCronKernel;
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
