<?php

namespace Tests\Support\Providers;

use PHPUnit\Framework\TestCase;
use Jankx\Support\Providers\AppServiceProvider;
use Jankx\Foundation\Application;

class AppServiceProviderTest extends TestCase
{
    private Application $app;
    private AppServiceProvider $provider;

    protected function setUp(): void
    {
        $this->app = new Application();
        $this->provider = new AppServiceProvider($this->app);
    }

    public function testAppServiceProviderCanBeInstantiated()
    {
        $this->assertInstanceOf(AppServiceProvider::class, $this->provider);
    }

    public function testAppServiceProviderCanRegister()
    {
        $this->expectNotToPerformAssertions();
        $this->provider->register($this->app);
    }

    public function testAppServiceProviderCanBoot()
    {
        $this->expectNotToPerformAssertions();
        $this->provider->boot($this->app);
    }
}