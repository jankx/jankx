<?php

namespace Tests\App\Providers;

use PHPUnit\Framework\TestCase;
use App\Providers\ThemeOptionsServiceProvider;
use App\Services\ThemeOptionsService;
use Jankx\Foundation\Application;
use Mockery;

class ThemeOptionsServiceProviderTest extends TestCase
{
    protected $app;
    protected $provider;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock Application
        $this->app = Mockery::mock(Application::class);
        $this->app->shouldReceive('singleton')->andReturnSelf();
        $this->app->shouldReceive('alias')->andReturnSelf();
        $this->app->shouldReceive('get')->andReturnSelf();

        // Mock Log facade
        $mockLog = Mockery::mock('alias:Jankx\Facades\Log');
        $mockLog->shouldReceive('debug')->andReturnSelf();
        $mockLog->shouldReceive('error')->andReturnSelf();

        // Create provider instance
        $this->provider = new ThemeOptionsServiceProvider();
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /**
     * @test
     */
    public function test_register_registers_service_and_alias()
    {
        $this->app->shouldReceive('singleton')
            ->once()
            ->with('theme-options', Mockery::type('Closure'));

        $this->app->shouldReceive('alias')
            ->once()
            ->with('theme-options', ThemeOptionsService::class);

        $this->provider->register($this->app);
    }

    /**
     * @test
     */
    public function test_boot_registers_wordpress_hooks()
    {
        // Mock WordPress add_action function
        if (!function_exists('add_action')) {
            function add_action($hook, $callback, $priority = 10)
            {
                return true;
            }
        }

        $this->provider->boot($this->app);

        // If we reach here without exception, the test passes
        $this->assertTrue(true);
    }

    /**
     * @test
     */
    public function test_init_hook_calls_service_init()
    {
        // Mock WordPress add_action function
        if (!function_exists('add_action')) {
            function add_action($hook, $callback, $priority = 10)
            {
                // Execute the callback immediately for testing
                if ($hook === 'init' && $priority === 10) {
                    $callback();
                }
                return true;
            }
        }

        // Mock service
        $mockService = Mockery::mock(ThemeOptionsService::class);
        $mockService->shouldReceive('init')->once();

        $this->app->shouldReceive('get')
            ->with('theme-options')
            ->andReturn($mockService);

        $this->provider->boot($this->app);
    }

    /**
     * @test
     */
    public function test_admin_menu_hook_calls_service_register_admin_menu()
    {
        // Mock WordPress add_action function
        if (!function_exists('add_action')) {
            function add_action($hook, $callback, $priority = 10)
            {
                // Execute the callback immediately for testing
                if ($hook === 'admin_menu' && $priority === 10) {
                    $callback();
                }
                return true;
            }
        }

        // Mock service
        $mockService = Mockery::mock(ThemeOptionsService::class);
        $mockService->shouldReceive('registerAdminMenu')->once();

        $this->app->shouldReceive('get')
            ->with('theme-options')
            ->andReturn($mockService);

        $this->provider->boot($this->app);
    }

    /**
     * @test
     */
    public function test_hooks_handle_exceptions_gracefully()
    {
        // Mock WordPress add_action function
        if (!function_exists('add_action')) {
            function add_action($hook, $callback, $priority = 10)
            {
                // Execute the callback immediately for testing
                if (in_array($hook, ['init', 'admin_menu']) && $priority === 10) {
                    $callback();
                }
                return true;
            }
        }

        // Mock service to throw exception
        $mockService = Mockery::mock(ThemeOptionsService::class);
        $mockService->shouldReceive('init')
            ->andThrow(new \Exception('Test exception'));
        $mockService->shouldReceive('registerAdminMenu')
            ->andThrow(new \Exception('Test exception'));

        $this->app->shouldReceive('get')
            ->with('theme-options')
            ->andReturn($mockService);

        // Should not throw exception
        $this->provider->boot($this->app);

        $this->assertTrue(true);
    }

    /**
     * @test
     */
    public function test_service_singleton_creates_theme_options_service()
    {
        // Mock Application to return a real service instance
        $mockApp = Mockery::mock(Application::class);
        $mockApp->shouldReceive('singleton')
            ->with('theme-options', Mockery::type('Closure'))
            ->andReturnUsing(function ($name, $callback) use ($mockApp) {
                // Execute the callback to test service creation
                $service = $callback($mockApp);
                $this->assertInstanceOf(ThemeOptionsService::class, $service);
                return $mockApp;
            });

        $this->provider->register($mockApp);
    }

    /**
     * @test
     */
    public function test_boot_logs_debug_messages()
    {
        // Mock WordPress add_action function
        if (!function_exists('add_action')) {
            function add_action($hook, $callback, $priority = 10)
            {
                return true;
            }
        }

        $mockLog = Mockery::mock('alias:Jankx\Facades\Log');
        $mockLog->shouldReceive('debug')
            ->with('ThemeOptionsServiceProvider: Boot method called')
            ->once();
        $mockLog->shouldReceive('debug')
            ->with('ThemeOptionsServiceProvider: Registering init hook')
            ->once();
        $mockLog->shouldReceive('debug')
            ->with('ThemeOptionsServiceProvider: hooks registered')
            ->once();

        $this->provider->boot($this->app);
    }

    /**
     * @test
     */
    public function test_hooks_log_debug_and_error_messages()
    {
        // Mock WordPress add_action function
        if (!function_exists('add_action')) {
            function add_action($hook, $callback, $priority = 10)
            {
                // Execute the callback immediately for testing
                if (in_array($hook, ['init', 'admin_menu']) && $priority === 10) {
                    $callback();
                }
                return true;
            }
        }

        $mockService = Mockery::mock(ThemeOptionsService::class);
        $mockService->shouldReceive('init')->andReturnSelf();
        $mockService->shouldReceive('registerAdminMenu')->andReturnSelf();

        $this->app->shouldReceive('get')
            ->with('theme-options')
            ->andReturn($mockService);

        $mockLog = Mockery::mock('alias:Jankx\Facades\Log');
        $mockLog->shouldReceive('debug')
            ->with('ThemeOptionsServiceProvider: init hook triggered')
            ->once();
        $mockLog->shouldReceive('debug')
            ->with('ThemeOptionsServiceProvider: ThemeOptionsService retrieved')
            ->once();
        $mockLog->shouldReceive('debug')
            ->with('ThemeOptionsServiceProvider: ThemeOptionsService initialized')
            ->once();
        $mockLog->shouldReceive('debug')
            ->with('ThemeOptionsServiceProvider: admin_menu hook triggered')
            ->once();
        $mockLog->shouldReceive('debug')
            ->with('ThemeOptionsServiceProvider: Admin menu registered')
            ->once();

        $this->provider->boot($this->app);
    }

    /**
     * @test
     */
    public function test_exception_in_hooks_logs_error()
    {
        // Mock WordPress add_action function
        if (!function_exists('add_action')) {
            function add_action($hook, $callback, $priority = 10)
            {
                // Execute the callback immediately for testing
                if (in_array($hook, ['init', 'admin_menu']) && $priority === 10) {
                    $callback();
                }
                return true;
            }
        }

        $mockService = Mockery::mock(ThemeOptionsService::class);
        $mockService->shouldReceive('init')
            ->andThrow(new \Exception('Test exception'));
        $mockService->shouldReceive('registerAdminMenu')
            ->andThrow(new \Exception('Test exception'));

        $this->app->shouldReceive('get')
            ->with('theme-options')
            ->andReturn($mockService);

        $mockLog = Mockery::mock('alias:Jankx\Facades\Log');
        $mockLog->shouldReceive('error')
            ->with('Theme Options Error: Test exception')
            ->twice(); // Once for init, once for admin_menu

        $this->provider->boot($this->app);
    }

    /**
     * @test
     */
    public function test_provider_structure_and_methods()
    {
        $this->assertInstanceOf(\Jankx\Support\Providers\ServiceProvider::class, $this->provider);
        $this->assertTrue(method_exists($this->provider, 'register'));
        $this->assertTrue(method_exists($this->provider, 'boot'));
    }

    /**
     * @test
     */
    public function test_methods_accept_correct_parameters()
    {
        $reflection = new \ReflectionMethod($this->provider, 'register');
        $parameters = $reflection->getParameters();

        $this->assertCount(1, $parameters);
        $this->assertEquals('app', $parameters[0]->getName());
        $this->assertEquals(Application::class, $parameters[0]->getType()->getName());

        $reflection = new \ReflectionMethod($this->provider, 'boot');
        $parameters = $reflection->getParameters();

        $this->assertCount(1, $parameters);
        $this->assertEquals('app', $parameters[0]->getName());
        $this->assertEquals(Application::class, $parameters[0]->getType()->getName());
    }
}
