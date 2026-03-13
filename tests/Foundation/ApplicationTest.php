<?php

namespace Tests\Foundation;

use PHPUnit\Framework\TestCase;
use Jankx\Foundation\Application;
use Jankx\Config\Repository;
use Jankx\Foundation\Log\Logger;

class ApplicationTest extends TestCase
{
    private Application $app;

    protected function setUp(): void
    {
        $this->app = new Application();
    }

    public function testApplicationCanBeInstantiated()
    {
        $this->assertInstanceOf(Application::class, $this->app);
    }

    public function testApplicationCanResolveConfig()
    {
        $config = $this->app->make('config');
        $this->assertInstanceOf(Repository::class, $config);
    }

    public function testApplicationCanResolveLogger()
    {
        $logger = $this->app->make('log');
        $this->assertInstanceOf(Logger::class, $logger);
    }

    public function testApplicationCanRegisterServiceProviders()
    {
        $provider = new class ($this->app) extends \Jankx\Support\Providers\ServiceProvider {
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

        $this->app->register($provider);
        $this->assertTrue($this->app->isRegistered(get_class($provider)));
    }

    public function testApplicationCanBootServiceProviders()
    {
        $provider = new class ($this->app) extends \Jankx\Support\Providers\ServiceProvider {
            public $booted = false;

            public function boot($app)
            {
                $this->booted = true;
            }

            public function shouldLoad(): bool
            {
                return true;
            }
        };

        $this->app->register($provider);
        $this->app->bootProviders();

        $this->assertTrue($provider->isBooted());
    }

    public function testApplicationCanBootServicesAndForgetUnusedOnes()
    {
        $service = new class ($this->app) extends \Jankx\Services\AbstractService {
            public $booted = false;
            public function shouldLoad(): bool {
                return false;
            }
            protected function boot(): void {
                $this->booted = true;
            }
        };

        $this->app->instance(get_class($service), $service);
        $this->app->bootServices();

        $this->assertFalse($service->isInitialized());
        $this->assertFalse($this->app->bound(get_class($service)));
    }

    public function testApplicationCanResolveAliases()
    {
        $app = $this->app->make('app');
        $this->assertInstanceOf(Application::class, $app);
    }

    public function testApplicationCanGetServiceProviders()
    {
        $provider = new class ($this->app) extends \Jankx\Support\Providers\ServiceProvider {
            public function register($app)
            {
            }
            public function boot($app)
            {
            }
        };

        $this->app->register($provider);
        $providers = $this->app->getServiceProviders();

        $this->assertContains($provider, $providers);
    }

    public function testApplicationCanCheckIfProviderIsRegistered()
    {
        $provider = new class ($this->app) extends \Jankx\Support\Providers\ServiceProvider {
            public function register($app)
            {
            }
            public function boot($app)
            {
            }
        };

            $this->assertFalse($this->app->isRegistered(get_class($provider)));

            $this->app->register($provider);
            $this->assertTrue($this->app->isRegistered(get_class($provider)));
    }

    public function testApplicationCanGetVersion()
    {
        $version = $this->app->version();
        $this->assertIsString($version);
    }

    public function testApplicationCanGetBootstrapPath()
    {
        $path = $this->app->bootstrapPath();
        $this->assertIsString($path);
    }

    public function testApplicationCanCheckIfBooted()
    {
        $this->expectNotToPerformAssertions();
        $this->app->booted(function () {
        });
    }

    public function testApplicationCanCallBootedCallbacks()
    {
        $this->expectNotToPerformAssertions();
        $this->app->callBootedCallbacks();
    }

    public function testApplicationCanCallBootingCallbacks()
    {
        $this->expectNotToPerformAssertions();
        $this->app->callBootingCallbacks();
    }

    public function testApplicationCanBoot()
    {
        $this->expectNotToPerformAssertions();
        $this->app->boot();
    }
}
