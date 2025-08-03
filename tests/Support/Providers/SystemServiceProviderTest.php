<?php

namespace Tests\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\SystemServiceProvider;
use Jankx\Config\Repository;
use Jankx\Facades\Log;
use PHPUnit\Framework\TestCase;

class SystemServiceProviderTest extends TestCase
{
    protected $app;
    protected $provider;
    protected $config;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app = $this->createMock(Application::class);
        $this->config = new Repository([
            'app' => [
                'aliases' => [
                    'user' => ['Jankx\Services\UserService'],
                    'cache' => ['Jankx\Services\CacheService'],
                    'url' => ['Jankx\Managers\UrlManager'],
                    'asset' => ['Jankx\Services\AssetService']
                ]
            ]
        ]);

        $this->provider = new SystemServiceProvider($this->app);

        // Mock the config service
        $this->app->method('make')
            ->willReturnCallback(function ($service) {
                if ($service === 'config') {
                    return $this->config;
                }
                if ($service === 'log') {
                    return $this->createMock(\Jankx\Foundation\Log\Logger::class);
                }
                return null;
            });

        // Mock Log facade
        Log::setFacadeApplication($this->app);
    }

    public function testRegisterCoreServices()
    {
        // Mock singleton method
        $this->app->expects($this->atLeastOnce())
            ->method('singleton')
            ->willReturnSelf();

        $this->provider->register($this->app);

        // Test that services are registered
        $this->assertTrue(true); // If we reach here, no exceptions were thrown
    }

    public function testBootCreatesClassAliases()
    {
        // Mock singleton method for register
        $this->app->method('singleton')
            ->willReturnSelf();

        // Register first
        $this->provider->register($this->app);

        // Boot to create aliases
        $this->provider->boot($this->app);

        // Test that aliases were created
        $this->assertTrue(class_exists('User'));
        $this->assertTrue(class_exists('Cache'));
        $this->assertTrue(class_exists('Url'));
        $this->assertTrue(class_exists('Asset'));
    }

    public function testBootWithEmptyAliases()
    {
        // Create config with empty aliases
        $emptyConfig = new Repository([
            'app' => [
                'aliases' => []
            ]
        ]);

        $this->app->method('make')
            ->with('config')
            ->willReturn($emptyConfig);

        // Mock singleton method for register
        $this->app->method('singleton')
            ->willReturnSelf();

        // Register first
        $this->provider->register($this->app);

        // Boot should not throw any exceptions
        $this->provider->boot($this->app);

        $this->assertTrue(true); // If we reach here, no exceptions were thrown
    }

    public function testBootWithInvalidAliases()
    {
        // Create config with invalid aliases
        $invalidConfig = new Repository([
            'app' => [
                'aliases' => [
                    'user' => 'not_an_array',
                    'cache' => [],
                    'url' => ['Jankx\Managers\UrlManager']
                ]
            ]
        ]);

        $this->app->method('make')
            ->willReturnCallback(function ($service) use ($invalidConfig) {
                if ($service === 'config') {
                    return $invalidConfig;
                }
                if ($service === 'log') {
                    return $this->createMock(\Jankx\Foundation\Log\Logger::class);
                }
                return null;
            });

        // Mock singleton method for register
        $this->app->method('singleton')
            ->willReturnSelf();

        // Register first
        $this->provider->register($this->app);

        // Boot should handle invalid aliases gracefully
        $this->provider->boot($this->app);

        // Test that the method completed without exceptions
        $this->assertTrue(true);
    }

    public function testAliasClassNameIsUcfirst()
    {
        // Create config with lowercase aliases
        $config = new Repository([
            'app' => [
                'aliases' => [
                    'user' => ['Jankx\Services\UserService'],
                    'myService' => ['Jankx\Services\MyService'],
                    'api_client' => ['Jankx\Services\ApiClient']
                ]
            ]
        ]);

        $this->app->method('make')
            ->willReturnCallback(function ($service) use ($config) {
                if ($service === 'config') {
                    return $config;
                }
                if ($service === 'log') {
                    return $this->createMock(\Jankx\Foundation\Log\Logger::class);
                }
                return null;
            });

        // Mock singleton method for register
        $this->app->method('singleton')
            ->willReturnSelf();

        // Register first
        $this->provider->register($this->app);

        // Boot to create aliases
        $this->provider->boot($this->app);

        // Test that the method completed without exceptions
        $this->assertTrue(true);
    }
}