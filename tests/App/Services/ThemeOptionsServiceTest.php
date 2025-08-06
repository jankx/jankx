<?php

namespace Tests\App\Services;

use PHPUnit\Framework\TestCase;
use App\Services\ThemeOptionsService;
use Jankx\Foundation\Application;
use Jankx\Adapter\Options\Framework as OptionFramework;
use Jankx\Adapter\Options\OptionsReader;
use Mockery;

class ThemeOptionsServiceTest extends TestCase
{
    protected $app;
    protected $service;
    protected $mockAdapter;

    protected function setUp(): void
    {
        parent::setUp();

        // Mock Application
        $this->app = Mockery::mock(Application::class);
        $this->app->shouldReceive('get')->andReturnSelf();

        // Mock adapter
        $this->mockAdapter = Mockery::mock('Jankx\Adapter\Options\Interfaces\Adapter');
        $this->mockAdapter->shouldReceive('setArgs')->andReturnSelf();
        $this->mockAdapter->shouldReceive('createSections')->andReturnSelf();
        $this->mockAdapter->shouldReceive('register_admin_menu')->andReturnSelf();
        $this->mockAdapter->shouldReceive('getOption')->andReturn('test_value');

        // Mock OptionFramework
        $mockFramework = Mockery::mock('alias:' . OptionFramework::class);
        $mockFramework->shouldReceive('getInstance')->andReturnSelf();
        $mockFramework->shouldReceive('loadFramework')->andReturnSelf();
        $mockFramework->shouldReceive('getActiveFramework')->andReturn($this->mockAdapter);
        $mockFramework->shouldReceive('getCurrentMode')->andReturn('redux');

        // Mock OptionsReader
        $mockOptionsReader = Mockery::mock('alias:' . OptionsReader::class);
        $mockOptionsReader->shouldReceive('getInstance')->andReturnSelf();
        $mockOptionsReader->shouldReceive('setOptionsDirectoryPath')->andReturnSelf();
        $mockOptionsReader->shouldReceive('setChildThemeOverrideEnabled')->andReturnSelf();

        // Mock Config facade
        $mockConfig = Mockery::mock('alias:Jankx\Facades\Config');
        $mockConfig->shouldReceive('get')->with('app.options.framework')->andReturn('redux');

        // Mock Log facade
        $mockLog = Mockery::mock('alias:Jankx\Facades\Log');
        $mockLog->shouldReceive('debug')->andReturnSelf();
        $mockLog->shouldReceive('error')->andReturnSelf();

        // Create service instance
        $this->service = new ThemeOptionsService($this->app);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    /**
     * @test
     */
    public function test_constructor_initializes_service_correctly()
    {
        // Test constructor sets properties correctly
        $this->assertSame($this->app, $this->getProtectedProperty($this->service, 'app'));
        $this->assertEquals('bookix_theme_options', $this->getProtectedProperty($this->service, 'optionName'));
        $this->assertEquals('theme-options', $this->service->getName());
    }

    /**
     * @test
     */
    public function test_init_initializes_adapter_and_sections()
    {
        $this->service->init();

        // Verify adapter is set
        $this->assertNotNull($this->service->getAdapter());
        $this->assertInstanceOf('Jankx\Adapter\Options\Interfaces\Adapter', $this->service->getAdapter());
    }

    /**
     * @test
     */
    public function test_init_sets_options_for_adapter()
    {
        $this->mockAdapter->shouldReceive('setArgs')->once()->with(Mockery::type('array'));

        $this->service->init();
    }

    /**
     * @test
     */
    public function test_create_sections_calls_adapter()
    {
        $this->mockAdapter->shouldReceive('createSections')->once()->with(Mockery::type(OptionsReader::class));

        $this->service->init();
    }

    /**
     * @test
     */
    public function test_get_option_returns_adapter_value_when_initialized()
    {
        $this->service->init();

        $result = $this->service->getOption('test_key', 'default_value');

        $this->assertEquals('test_value', $result);
    }

    /**
     * @test
     */
    public function test_get_option_returns_default_when_not_initialized()
    {
        $result = $this->service->getOption('test_key', 'default_value');

        $this->assertEquals('default_value', $result);
    }

    /**
     * @test
     */
    public function test_register_admin_menu_calls_adapter_when_initialized()
    {
        $this->service->init();

        $this->mockAdapter->shouldReceive('register_admin_menu')
            ->once()
            ->with('Theme Options', 'Bookix Theme Options');

        $this->service->registerAdminMenu();
    }

    /**
     * @test
     */
    public function test_register_admin_menu_creates_direct_menu_when_not_initialized()
    {
        // Mock WordPress function
        if (!function_exists('add_menu_page')) {
            function add_menu_page($page_title, $menu_title, $capability, $menu_slug, $function, $icon_url, $position)
            {
                return true;
            }
        }

        $this->service->registerAdminMenu();

        // If we reach here without exception, the test passes
        $this->assertTrue(true);
    }

    /**
     * @test
     */
    public function test_utility_methods_return_correct_values()
    {
        $this->assertEquals('redux', $this->service->getCurrentFrameworkMode());
        $this->assertIsArray($this->service->getOptionsData());
        $this->assertNull($this->service->getAdapter()); // Not initialized yet
    }

    /**
     * @test
     */
    public function test_render_options_page_outputs_html()
    {
        // Capture output
        ob_start();
        $this->service->renderOptionsPage();
        $output = ob_get_clean();

        $this->assertStringContainsString('<div class="wrap">', $output);
        $this->assertStringContainsString('<h1>Bookix Theme Options</h1>', $output);
        $this->assertStringContainsString('Framework Mode:', $output);
        $this->assertStringContainsString('Adapter:', $output);
        $this->assertStringContainsString('Options Data:', $output);
    }

    /**
     * @test
     */
    public function test_setup_options_for_adapter_sets_correct_args()
    {
        $this->service->init();

        $this->mockAdapter->shouldReceive('setArgs')
            ->once()
            ->with(Mockery::on(function ($args) {
                return $args['opt_name'] === 'bookix_theme_options' &&
                       $args['display_name'] === 'Bookix Theme Options' &&
                       $args['menu_type'] === 'submenu' &&
                       $args['page_parent'] === 'themes.php';
            }));

        $this->callProtectedMethod($this->service, 'setupOptionsForAdapter');
    }

    /**
     * @test
     */
    public function test_setup_options_for_adapter_does_nothing_when_no_adapter()
    {
        // Should not throw any exception
        $this->callProtectedMethod($this->service, 'setupOptionsForAdapter');

        $this->assertTrue(true);
    }

    /**
     * @test
     */
    public function test_exception_handling_in_create_sections()
    {
        // Mock adapter to throw exception
        $mockAdapterWithException = Mockery::mock('Jankx\Adapter\Options\Interfaces\Adapter');
        $mockAdapterWithException->shouldReceive('createSections')
            ->andThrow(new \Exception('Test exception'));

        // Mock OptionFramework to return problematic adapter
        $mockFramework = Mockery::mock('alias:' . OptionFramework::class);
        $mockFramework->shouldReceive('getInstance')->andReturnSelf();
        $mockFramework->shouldReceive('loadFramework')->andReturnSelf();
        $mockFramework->shouldReceive('getActiveFramework')->andReturn($mockAdapterWithException);

        $service = new ThemeOptionsService($this->app);

        // Should not throw exception
        $service->createSectionsForAdapter();

        $this->assertTrue(true);
    }

    /**
     * @test
     */
    public function test_exception_handling_in_register_admin_menu()
    {
        // Mock adapter to throw exception
        $mockAdapterWithException = Mockery::mock('Jankx\Adapter\Options\Interfaces\Adapter');
        $mockAdapterWithException->shouldReceive('register_admin_menu')
            ->andThrow(new \Exception('Test exception'));

        // Mock OptionFramework to return problematic adapter
        $mockFramework = Mockery::mock('alias:' . OptionFramework::class);
        $mockFramework->shouldReceive('getInstance')->andReturnSelf();
        $mockFramework->shouldReceive('loadFramework')->andReturnSelf();
        $mockFramework->shouldReceive('getActiveFramework')->andReturn($mockAdapterWithException);

        $service = new ThemeOptionsService($this->app);

        // Should not throw exception
        $service->registerAdminMenu();

        $this->assertTrue(true);
    }

    /**
     * @test
     */
    public function test_constructor_handles_framework_error()
    {
        // Mock Config to throw exception
        $mockConfig = Mockery::mock('alias:Jankx\Facades\Config');
        $mockConfig->shouldReceive('get')->andThrow(new \Exception('Config error'));

        // Should not throw exception
        $service = new ThemeOptionsService($this->app);

        $this->assertInstanceOf(ThemeOptionsService::class, $service);
    }

    /**
     * Helper method to access protected properties for testing
     */
    protected function getProtectedProperty($object, $property)
    {
        $reflection = new \ReflectionClass($object);
        $propertyReflection = $reflection->getProperty($property);
        $propertyReflection->setAccessible(true);
        return $propertyReflection->getValue($object);
    }

    /**
     * Helper method to call protected methods for testing
     */
    protected function callProtectedMethod($object, $method, ...$args)
    {
        $reflection = new \ReflectionClass($object);
        $methodReflection = $reflection->getMethod($method);
        $methodReflection->setAccessible(true);
        return $methodReflection->invoke($object, ...$args);
    }
}
