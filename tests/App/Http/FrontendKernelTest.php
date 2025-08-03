<?php

namespace Tests\App\Http;

use PHPUnit\Framework\TestCase;
use App\Http\FrontendKernel;
use Jankx\Http\Request;
use Jankx\Foundation\Application;

class FrontendKernelTest extends TestCase
{
    private Application $app;
    private Request $request;

    protected function setUp(): void
    {
        $this->app = new Application();
        $this->request = new Request();
    }

    public function testFrontendKernelCanBeInstantiated()
    {
        $kernel = new FrontendKernel($this->app);
        $this->assertInstanceOf(FrontendKernel::class, $kernel);
    }

    public function testFrontendKernelCanHandleRequest()
    {
        $kernel = new FrontendKernel($this->app);

        // Should not throw any exception
        $this->expectNotToPerformAssertions();
        $kernel->handle($this->request);
    }

    public function testFrontendKernelCanRegisterHooks()
    {
        $kernel = new FrontendKernel($this->app);

        // Should not throw any exception
        $this->expectNotToPerformAssertions();
        $kernel->registerHooks();
    }

    public function testFrontendKernelCanInitialize()
    {
        $kernel = new FrontendKernel($this->app);

        // Should not throw any exception
        $this->expectNotToPerformAssertions();
        $kernel->init($this->request);
    }

    public function testFrontendKernelCanGetApplication()
    {
        $kernel = new FrontendKernel($this->app);
        $this->assertSame($this->app, $kernel->getApplication());
    }
}