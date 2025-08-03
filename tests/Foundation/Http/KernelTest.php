<?php

namespace Tests\Foundation\Http;

use PHPUnit\Framework\TestCase;
use Jankx\Foundation\Http\Kernel;
use Jankx\Http\Request;
use Jankx\Foundation\Application;

class KernelTest extends TestCase
{
    private Application $app;
    private Request $request;

    protected function setUp(): void
    {
        $this->app = new Application();
        $this->request = new Request();
    }

    public function testKernelCanBeInstantiated()
    {
        $kernel = new class ($this->app) extends Kernel {
            public function handle($request)
            {
            }
            public function registerHooks()
            {
            }
        };

        $this->assertInstanceOf(Kernel::class, $kernel);
    }

    public function testKernelCanBootstrap()
    {
        $kernel = new class ($this->app) extends Kernel {
            public $bootstrapped = false;

            public function handle($request)
            {
            }
            public function registerHooks()
            {
            }

            public function bootstrap()
            {
                $this->bootstrapped = true;
                parent::bootstrap();
            }
        };

        $kernel->bootstrap();
        $this->assertTrue($kernel->bootstrapped);
    }

    public function testKernelCanInitialize()
    {
        $kernel = new class ($this->app) extends Kernel {
            public $handled = false;
            public $hooksRegistered = false;

            public function handle($request)
            {
                $this->handled = true;
            }

            public function registerHooks()
            {
                $this->hooksRegistered = true;
            }
        };

        $kernel->init($this->request);

        $this->assertTrue($kernel->handled);
        $this->assertTrue($kernel->hooksRegistered);
    }

    public function testKernelCanGetApplication()
    {
        $kernel = new class ($this->app) extends Kernel {
            public function handle($request)
            {
            }
            public function registerHooks()
            {
            }
        };

        $this->assertSame($this->app, $kernel->getApplication());
    }
}
