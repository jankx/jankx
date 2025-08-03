<?php

namespace Tests\Foundation\Bootstrap;

use PHPUnit\Framework\TestCase;
use Jankx\Foundation\Application;
use Jankx\Foundation\Bootstrap\RegisterProviders;
use Jankx\Config\Repository;
use Jankx\Support\Providers\ServiceProvider;

class RegisterProvidersTest extends TestCase
{
    private Application $app;
    private RegisterProviders $registerProviders;

    protected function setUp(): void
    {
        $this->app = new Application();
        $this->registerProviders = new RegisterProviders();
    }

    public function testRegisterProvidersCanBeInstantiated()
    {
        $this->assertInstanceOf(RegisterProviders::class, $this->registerProviders);
    }

    public function testRegisterProvidersImplementsBootstrapInterface()
    {
        $this->assertTrue(method_exists($this->registerProviders, 'bootstrap'));
    }

    public function testRegisterProvidersCanBootstrapApplication()
    {
        $this->expectNotToPerformAssertions();
        $this->registerProviders->bootstrap($this->app);
    }

    public function testRegisterProvidersLoadsAppLevelProviders()
    {
        // Mock config with app-level providers
        $config = new Repository([
            'app' => [
                'providers' => [
                    MockAppProvider::class
                ]
            ]
        ]);

        $this->app->instance('config', $config);

        $this->registerProviders->bootstrap($this->app);

        // Verify that app-level providers are registered
        $this->assertTrue($this->app->isRegistered(MockAppProvider::class));
    }

    public function testRegisterProvidersLoadsKernelSpecificProviders()
    {
        // Mock config with kernel-specific providers
        $config = new Repository([
            'providers' => [
                'http' => [
                    'frontend' => [
                        MockFrontendProvider::class
                    ]
                ]
            ]
        ]);

        $this->app->instance('config', $config);

        // Mock environment to simulate frontend context
        $GLOBALS['mock_is_admin'] = false;

        $this->registerProviders->bootstrap($this->app);

        // Verify that kernel-specific providers are registered
        $this->assertTrue($this->app->isRegistered(MockFrontendProvider::class));

        // Reset mock
        $GLOBALS['mock_is_admin'] = true;
    }

    public function testRegisterProvidersHandlesEmptyConfig()
    {
        $config = new Repository([]);
        $this->app->instance('config', $config);

        $this->expectNotToPerformAssertions();
        $this->registerProviders->bootstrap($this->app);
    }

    public function testRegisterProvidersHandlesInvalidProviderClass()
    {
        $config = new Repository([
            'app' => [
                'providers' => [
                    'NonExistentProvider'
                ]
            ]
        ]);

        $this->app->instance('config', $config);

        $this->expectNotToPerformAssertions();
        $this->registerProviders->bootstrap($this->app);
    }

    public function testRegisterProvidersHandlesMissingKernel()
    {
        $config = new Repository([
            'providers' => [
                'http' => [
                    'frontend' => [
                        'Tests\Foundation\Bootstrap\MockFrontendProvider::class'
                    ]
                ]
            ]
        ]);

        $this->app->instance('config', $config);

        $this->expectNotToPerformAssertions();
        $this->registerProviders->bootstrap($this->app);
    }
}

// Mock provider classes for testing
class MockAppProvider extends ServiceProvider
{
    public function register($app)
    {
        // Mock registration
    }

    public function boot($app)
    {
        // Mock boot
    }
}

class MockFrontendProvider extends ServiceProvider
{
    public function register($app)
    {
        // Mock registration
    }

    public function boot($app)
    {
        // Mock boot
    }
}
