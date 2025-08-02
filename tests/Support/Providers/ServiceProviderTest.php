<?php

namespace Tests\Support\Providers;

use PHPUnit\Framework\TestCase;
use Jankx\Support\Providers\ServiceProvider;
use Jankx\Foundation\Application;

class ServiceProviderTest extends TestCase
{
    private Application $app;

    protected function setUp(): void
    {
        $this->app = new Application();
    }

    public function testServiceProviderCanBeInstantiated()
    {
        $provider = new class($this->app) extends ServiceProvider {
            public function register($app) {}
            public function boot($app) {}
        };

        $this->assertInstanceOf(ServiceProvider::class, $provider);
    }

    public function testServiceProviderCanGetApplication()
    {
        $provider = new class($this->app) extends ServiceProvider {
            public function register($app) {}
            public function boot($app) {}
        };

        $this->assertSame($this->app, $provider->getApplication());
    }

    public function testServiceProviderCanRegisterServices()
    {
        $provider = new class($this->app) extends ServiceProvider {
            public $registered = false;

            public function register($app)
            {
                $this->registered = true;
            }

            public function boot($app) {}
        };

        $provider->register($this->app);
        $this->assertTrue($provider->registered);
    }

    public function testServiceProviderCanBootServices()
    {
        $provider = new class($this->app) extends ServiceProvider {
            public $booted = false;

            public function register($app) {}

            public function boot($app)
            {
                $this->booted = true;
            }
        };

        $provider->boot($this->app);
        $this->assertTrue($provider->booted);
    }

    public function testServiceProviderCanRegisterAndBoot()
    {
        $provider = new class($this->app) extends ServiceProvider {
            public $registered = false;
            public $booted = false;

            public function register($app)
            {
                $this->registered = true;
            }

            public function boot($app)
            {
                $this->booted = true;
            }
        };

        $provider->register($this->app);
        $provider->boot($this->app);

        $this->assertTrue($provider->registered);
        $this->assertTrue($provider->booted);
    }
}