<?php

namespace Tests\Foundation\Bootstrap;

use PHPUnit\Framework\TestCase;
use Jankx\Foundation\Bootstrap\BootProviders;
use Jankx\Foundation\Application;

class BootProvidersTest extends TestCase
{
    private Application $app;

    protected function setUp(): void
    {
        $this->app = new Application();
    }

    public function testBootProvidersCanBeInstantiated()
    {
        $bootstrap = new BootProviders();
        $this->assertInstanceOf(BootProviders::class, $bootstrap);
    }

    public function testBootProvidersCanBootstrap()
    {
        $bootstrap = new BootProviders();

        // Should not throw any exception
        $this->expectNotToPerformAssertions();
        $bootstrap->bootstrap($this->app);
    }

    public function testBootProvidersCanBootRegisteredProviders()
    {
        $provider = new class ($this->app) extends \Jankx\Support\Providers\ServiceProvider {
            public $booted = false;

            public function register($app)
            {
            }

            public function boot($app)
            {
                $this->booted = true;
            }
        };

        $this->app->register($provider);

        $bootstrap = new BootProviders();
        $bootstrap->bootstrap($this->app);

        $this->assertTrue($provider->booted);
    }

    public function testBootProvidersCanBootMultipleProviders()
    {
        $provider1 = new class ($this->app) extends \Jankx\Support\Providers\ServiceProvider {
            public $booted = false;

            public function register($app)
            {
            }

            public function boot($app)
            {
                $this->booted = true;
            }
        };

        $provider2 = new class ($this->app) extends \Jankx\Support\Providers\ServiceProvider {
            public $booted = false;

            public function register($app)
            {
            }

            public function boot($app)
            {
                $this->booted = true;
            }
        };

        $this->app->register($provider1);
        $this->app->register($provider2);

        $bootstrap = new BootProviders();
        $bootstrap->bootstrap($this->app);

        $this->assertTrue($provider1->booted);
        $this->assertTrue($provider2->booted);
    }

    public function testBootProvidersCanHandleNoProviders()
    {
        $bootstrap = new BootProviders();

        // Should not throw any exception when no providers are registered
        $this->expectNotToPerformAssertions();
        $bootstrap->bootstrap($this->app);
    }

    public function testBootProvidersCanHandleProviderExceptions()
    {
        $provider = new class ($this->app) extends \Jankx\Support\Providers\ServiceProvider {
            public function register($app)
            {
            }

            public function boot($app)
            {
                throw new \Exception('Test exception');
            }
        };

        $this->app->register($provider);

        $bootstrap = new BootProviders();

        // Should handle exceptions gracefully
        $this->expectException(\Exception::class);
        $bootstrap->bootstrap($this->app);
    }
}
