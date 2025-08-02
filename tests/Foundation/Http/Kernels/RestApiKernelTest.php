<?php

namespace Tests\Foundation\Http\Kernels;

use PHPUnit\Framework\TestCase;
use Jankx\Foundation\Http\Kernels\RestApiKernel;
use Jankx\Http\Request;
use Jankx\Foundation\Application;

class RestApiKernelTest extends TestCase
{
    private Application $app;
    private Request $request;

    protected function setUp(): void
    {
        $this->app = new Application();
        $this->request = new Request();
    }

    public function testRestApiKernelCanBeInstantiated()
    {
        $kernel = new RestApiKernel($this->app);
        $this->assertInstanceOf(RestApiKernel::class, $kernel);
    }

    public function testRestApiKernelCanHandleRequest()
    {
        $kernel = new RestApiKernel($this->app);

        // Should not throw any exception
        $this->expectNotToPerformAssertions();
        $kernel->handle($this->request);
    }

    public function testRestApiKernelCanRegisterHooks()
    {
        $kernel = new RestApiKernel($this->app);

        // Should not throw any exception
        $this->expectNotToPerformAssertions();
        $kernel->registerHooks();
    }

    public function testRestApiKernelCanInitialize()
    {
        $kernel = new RestApiKernel($this->app);

        // Should not throw any exception
        $this->expectNotToPerformAssertions();
        $kernel->init($this->request);
    }

    public function testRestApiKernelCanGetApplication()
    {
        $kernel = new RestApiKernel($this->app);
        $this->assertSame($this->app, $kernel->getApplication());
    }
}