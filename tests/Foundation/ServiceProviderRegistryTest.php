<?php

namespace Tests\Foundation;

use PHPUnit\Framework\TestCase;
use Jankx\Foundation\Application;
use Jankx\Foundation\ServiceProviderRegistry;
use Jankx\Support\Providers\ServiceProvider;

class ServiceProviderRegistryTest extends TestCase
{
    private Application $app;
    private ServiceProviderRegistry $registry;

    protected function setUp(): void
    {
        $this->app = new Application();
        $this->registry = new ServiceProviderRegistry($this->app);
    }

    public function testRegistryCanRegisterProvider()
    {
        $provider = new class ($this->app) extends ServiceProvider {
            public $registered = false;
            public function register(Application $app) {
                $this->registered = true;
            }
        };

        $this->registry->register($provider);
        $this->assertCount(1, $this->registry->getProviders());
        $this->assertTrue($provider->registered);
    }

    public function testRegistryDoesNotRegisterIfShouldLoadReturnsFalse()
    {
        $provider = new class ($this->app) extends ServiceProvider {
            public $registered = false;
            public function register(Application $app) {
                $this->registered = true;
            }
            public function shouldLoad(): bool {
                return false;
            }
        };

        $result = $this->registry->register($provider);
        $this->assertNull($result);
        $this->assertCount(0, $this->registry->getProviders());
        $this->assertFalse($provider->registered);
    }

    public function testRegistryCanBootAllProviders()
    {
        $provider = new class ($this->app) extends ServiceProvider {
            public $booted = false;
            public function boot(Application $app) {
                $this->booted = true;
            }
        };

        $this->registry->register($provider);
        $this->registry->bootAll();

        $this->assertTrue($provider->booted);
    }

    public function testRegistryCanForgetProviderOnBootIfShouldLoadReturnsFalse()
    {
        $provider = new class ($this->app) extends ServiceProvider {
            public $booted = false;
            public $shouldLoadResult = true;
            public function boot(Application $app) {
                $this->booted = true;
            }
            public function shouldLoad(): bool {
                return $this->shouldLoadResult;
            }
        };

        $this->registry->register($provider);
        $this->assertCount(1, $this->registry->getProviders());

        // Simulate context change or some condition change
        $provider->shouldLoadResult = false;

        $this->registry->bootAll();

        $this->assertFalse($provider->booted);
        $this->assertCount(0, $this->registry->getProviders());
    }

    public function testRegistryReturnsExistingProviderIfAlreadyRegistered()
    {
        $providerClass = get_class(new class ($this->app) extends ServiceProvider {
            public function register(Application $app) {}
        });

        $provider1 = $this->registry->register($providerClass);
        $provider2 = $this->registry->register($providerClass);

        $this->assertSame($provider1, $provider2);
        $this->assertCount(1, $this->registry->getProviders());
    }
}
