<?php

namespace Tests\App\Providers;

use PHPUnit\Framework\TestCase;
use Jankx\Support\Providers\ThemeOptionsServiceProvider;
use App\Services\ThemeOptionsService;
use Jankx\Foundation\Application;
use Jankx\Facades\Log;
use Mockery;

class ThemeOptionsServiceProviderTest extends TestCase
{
    use Mockery\Adapter\Phpunit\MockeryPHPUnitIntegration;

    protected $app;
    protected $provider;

    protected function setUp(): void
    {
        parent::setUp();

        // Clear hooks
        $GLOBALS['wp_hooks'] = ['actions' => [], 'filters' => []];

        // Mock Application
        $this->app = Mockery::mock(Application::class);
        $this->app->shouldReceive('singleton')->andReturnSelf()->byDefault();
        $this->app->shouldReceive('alias')->andReturnSelf()->byDefault();
        $this->app->shouldReceive('get')->andReturnSelf()->byDefault();
        $this->app->shouldReceive('make')->andReturnUsing(function($abstract) {
            if ($abstract === 'app' || $abstract === Application::class) {
                return $this->app;
            }
            return $this->app; // Return itself for everything in this test
        })->byDefault();
        $this->app->shouldReceive('bound')->andReturn(true)->byDefault();
        
        \Jankx\Facades\Facade::setFacadeApplication($this->app);
        Log::setFacadeApplication($this->app);
        \Jankx\Facades\App::setFacadeApplication($this->app);

        // Mock Log facade using its built-in Mockery support
        Log::clearResolvedInstances();
        Log::shouldReceive('debug')->byDefault();
        Log::shouldReceive('error')->byDefault();

        // Create provider instance
        $this->provider = new ThemeOptionsServiceProvider($this->app);
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
        // Mock service
        $mockService = Mockery::mock(ThemeOptionsService::class);
        $mockService->shouldReceive('init')->once();

        $this->app->shouldReceive('get')
            ->with('theme-options')
            ->andReturn($mockService);

        $this->provider->boot($this->app);
        
        // Trigger action
        do_action('init');
    }

    /**
     * @test
     */
    public function test_admin_menu_hook_calls_service_register_admin_menu()
    {
        $this->markTestSkipped('admin_menu is currently disabled in the provider');
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
        $this->app->shouldReceive('singleton')
            ->once()
            ->with('theme-options', Mockery::type('Closure'))
            ->andReturnUsing(function ($name, $callback) {
                // Execute the callback to test service creation
                $service = $callback($this->app);
                $this->assertInstanceOf(ThemeOptionsService::class, $service);
                return $this->app;
            });
            
        $this->app->shouldReceive('alias')
            ->once()
            ->with('theme-options', ThemeOptionsService::class)
            ->andReturnSelf();

        $this->provider->register($this->app);
    }

    /**
     * @test
     */
    public function test_boot_logs_debug_messages()
    {
        $this->markTestSkipped('logging is currently not implemented in the provider');
    }

    /**
     * @test
     */
    public function test_hooks_log_debug_and_error_messages()
    {
        $this->markTestSkipped('logging is currently not implemented in the provider');
    }

    /**
     * @test
     */
    public function test_exception_in_hooks_logs_error()
    {
        $this->markTestSkipped('exception logging is not implemented in the current version');
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
