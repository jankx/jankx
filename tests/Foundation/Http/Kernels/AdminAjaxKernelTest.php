<?php

namespace Tests\Foundation\Http\Kernels;

use PHPUnit\Framework\TestCase;
use Jankx\Foundation\Http\Kernels\AdminAjaxKernel;
use Jankx\Http\Request;
use Jankx\Foundation\Application;

class AdminAjaxKernelTest extends TestCase
{
    private Application $app;
    private Request $request;

    protected function setUp(): void
    {
        $this->app = new Application();
        $this->request = new Request();
    }

    public function testAdminAjaxKernelCanBeInstantiated()
    {
        $kernel = new AdminAjaxKernel($this->app);
        $this->assertInstanceOf(AdminAjaxKernel::class, $kernel);
    }

    public function testAdminAjaxKernelCanHandleRequest()
    {
        $kernel = new AdminAjaxKernel($this->app);

        // Should not throw any exception
        $this->expectNotToPerformAssertions();
        $kernel->handle($this->request);
    }

    public function testAdminAjaxKernelCanRegisterHooks()
    {
        $kernel = new AdminAjaxKernel($this->app);

        // Should not throw any exception
        $this->expectNotToPerformAssertions();
        $kernel->registerHooks();
    }

    public function testAdminAjaxKernelCanInitialize()
    {
        $kernel = new AdminAjaxKernel($this->app);

        // Should not throw any exception
        $this->expectNotToPerformAssertions();
        $kernel->init($this->request);
    }

    public function testAdminAjaxKernelCanGetApplication()
    {
        $kernel = new AdminAjaxKernel($this->app);
        $this->assertSame($this->app, $kernel->getApplication());
    }
}