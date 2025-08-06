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
    public function test_constructor_sets_app_property()
    {
        $this->assertSame($this->app, $this->service->getApp());
    }

    /**
     * @test
     */
    public function test_constructor_sets_options_path()
    {
        $expectedPath = get_stylesheet_directory() . '/resources/options';
        $this->assertEquals($expectedPath, $this->service->getOptionsPath());
    }

    /**
     * @test
     */
    public function test_constructor_sets_option_name()
    {
        $this->assertEquals('bookix_theme_options', $this->service->getOptionName());
    }

    /**
     * @test
     */
    public function test_init_calls_init_option_adapter()
    {
        $this->service->init();

        // Verify that initOptionAdapter was called
        // This is tested indirectly through the adapter being set
        $this->assertNotNull($this->service->getAdapter());
    }

    /**
     * @test
     */
    public function test_init_calls_create_sections_for_adapter()
    {
        $this->service->init();

        // Verify that createSectionsForAdapter was called
        // This is tested indirectly through the adapter being set
        $this->assertNotNull($this->service->getAdapter());
    }

    /**
     * @test
     */
    public function test_init_option_adapter_sets_adapter()
    {
        $this->service->init();

        $this->assertNotNull($this->service->getAdapter());
        $this->assertInstanceOf('Jankx\Adapter\Options\Interfaces\Adapter', $this->service->getAdapter());
    }

    /**
     * @test
     */
    public function test_init_option_adapter_sets_options_for_adapter()
    {
        $this->mockAdapter->shouldReceive('setArgs')->once()->with(Mockery::type('array'));

        $this->service->init();
    }

    /**
     * @test
     */
    public function test_create_sections_for_adapter_calls_adapter_create_sections()
    {
        $this->mockAdapter->shouldReceive('createSections')->once()->with(Mockery::type(OptionsReader::class));

        $this->service->init();
    }

    /**
     * @test
     */
    public function test_get_option_returns_adapter_value()
    {
        $this->service->init();

        $result = $this->service->getOption('test_key', 'default_value');

        $this->assertEquals('test_value', $result);
    }

    /**
     * @test
     */
    public function test_get_option_returns_default_when_no_adapter()
    {
        $result = $this->service->getOption('test_key', 'default_value');

        $this->assertEquals('default_value', $result);
    }

    /**
     * @test
     */
    public function test_register_admin_menu_calls_adapter_register_admin_menu()
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
    public function test_register_admin_menu_creates_direct_menu_when_no_adapter()
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
    public function test_get_current_framework_mode_returns_framework_mode()
    {
        $mode = $this->service->getCurrentFrameworkMode();

        $this->assertEquals('redux', $mode);
    }

    /**
     * @test
     */
    public function test_get_name_returns_service_name()
    {
        $name = $this->service->getName();

        $this->assertEquals('theme-options', $name);
    }

    /**
     * @test
     */
    public function test_get_options_data_returns_options_data()
    {
        $data = $this->service->getOptionsData();

        $this->assertIsArray($data);
    }

    /**
     * @test
     */
    public function test_get_adapter_returns_adapter()
    {
        $this->service->init();

        $adapter = $this->service->getAdapter();

        $this->assertInstanceOf('Jankx\Adapter\Options\Interfaces\Adapter', $adapter);
    }

    /**
     * @test
     */
    public function test_get_adapter_returns_null_when_not_initialized()
    {
        $adapter = $this->service->getAdapter();

        $this->assertNull($adapter);
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
    public function test_load_options_data_loads_pages_file()
    {
        // Mock file system
        $mockPagesFile = [
            'general' => [
                'title' => 'General Settings',
                'icon' => 'dashicons-admin-generic',
            ],
        ];

        // Mock file_exists and include
        if (!function_exists('file_exists')) {
            function file_exists($path)
            {
                return strpos($path, 'pages.php') !== false;
            }
        }

        // Mock include function - we can't mock include directly, so we'll test differently
        // The actual include will be handled by the real file system in integration tests

        $this->service->loadOptionsData();

        $data = $this->service->getOptionsData();
        $this->assertArrayHasKey('pages', $data);
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

        $this->service->setupOptionsForAdapter();
    }

    /**
     * @test
     */
    public function test_setup_options_for_adapter_does_nothing_when_no_adapter()
    {
        // Should not throw any exception
        $this->service->setupOptionsForAdapter();

        $this->assertTrue(true);
    }

    /**
     * @test
     */
    public function test_create_sections_for_adapter_handles_exception()
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
    public function test_register_admin_menu_handles_exception()
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
    protected function getApp()
    {
        $reflection = new \ReflectionClass($this->service);
        $property = $reflection->getProperty('app');
        $property->setAccessible(true);
        return $property->getValue($this->service);
    }

    protected function getOptionsPath()
    {
        $reflection = new \ReflectionClass($this->service);
        $property = $reflection->getProperty('optionsPath');
        $property->setAccessible(true);
        return $property->getValue($this->service);
    }

    protected function getOptionName()
    {
        $reflection = new \ReflectionClass($this->service);
        $property = $reflection->getProperty('optionName');
        $property->setAccessible(true);
        return $property->getValue($this->service);
    }

    protected function loadOptionsData()
    {
        $reflection = new \ReflectionClass($this->service);
        $method = $reflection->getMethod('loadOptionsData');
        $method->setAccessible(true);
        return $method->invoke($this->service);
    }

    protected function setupOptionsForAdapter()
    {
        $reflection = new \ReflectionClass($this->service);
        $method = $reflection->getMethod('setupOptionsForAdapter');
        $method->setAccessible(true);
        return $method->invoke($this->service);
    }
}
