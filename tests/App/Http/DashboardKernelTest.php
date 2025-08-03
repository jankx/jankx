<?php

namespace Tests\App\Http;

use PHPUnit\Framework\TestCase;
use App\Http\DashboardKernel;
use Jankx\Http\Request;
use Jankx\Foundation\Application;

class DashboardKernelTest extends TestCase
{
    private Application $app;
    private Request $request;

    protected function setUp(): void
    {
        $this->app = new Application();
        $this->request = new Request();
    }

    public function testDashboardKernelCanBeInstantiated()
    {
        $kernel = new DashboardKernel($this->app);
        $this->assertInstanceOf(DashboardKernel::class, $kernel);
    }

    public function testDashboardKernelCanHandleRequest()
    {
        $kernel = new DashboardKernel($this->app);

        // Should not throw any exception
        $this->expectNotToPerformAssertions();
        $kernel->handle($this->request);
    }

    public function testDashboardKernelCanRegisterHooks()
    {
        $kernel = new DashboardKernel($this->app);

        // Should not throw any exception
        $this->expectNotToPerformAssertions();
        $kernel->registerHooks();
    }

    public function testDashboardKernelCanInitialize()
    {
        $kernel = new DashboardKernel($this->app);

        // Should not throw any exception
        $this->expectNotToPerformAssertions();
        $kernel->init($this->request);
    }

    public function testDashboardKernelCanGetApplication()
    {
        $kernel = new DashboardKernel($this->app);
        $this->assertSame($this->app, $kernel->getApplication());
    }
}