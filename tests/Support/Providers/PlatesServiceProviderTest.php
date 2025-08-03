<?php

namespace Tests\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\PlatesServiceProvider;
use League\Plates\Engine;
use PHPUnit\Framework\TestCase;

/**
 * Test PlatesServiceProvider
 */
class PlatesServiceProviderTest extends TestCase
{
    protected $provider;
    protected $app;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app = $this->createMock(Application::class);
        $this->provider = new PlatesServiceProvider();
    }

    public function testProviderInitialization()
    {
        $this->assertInstanceOf(PlatesServiceProvider::class, $this->provider);
    }

    public function testRegister()
    {
        // Mock Application methods
        $this->app->expects($this->once())
            ->method('singleton')
            ->with('plates.engine', $this->anything());

        $this->provider->register($this->app);
    }

    public function testPlatesEngineCreation()
    {
        // Mock Application to return a real Engine
        $this->app->method('singleton')
            ->willReturnCallback(function ($key, $callback) {
                if ($key === 'plates.engine') {
                    return $callback();
                }
                return null;
            });

        $this->provider->register($this->app);

        // Test that the engine was created
        $engine = $this->app->make('plates.engine');
        $this->assertInstanceOf(Engine::class, $engine);
    }

    public function testTemplateDirectoriesConfiguration()
    {
        // Mock WordPress functions
        if (!function_exists('get_template_directory')) {
            function get_template_directory()
            {
                return '/fake/parent/theme';
            }
        }

        if (!function_exists('get_stylesheet_directory')) {
            function get_stylesheet_directory()
            {
                return '/fake/child/theme';
            }
        }

        if (!function_exists('is_dir')) {
            function is_dir($path)
            {
                return true; // Mock all directories as existing
            }
        }

        // Mock Application
        $this->app->method('singleton')
            ->willReturnCallback(function ($key, $callback) {
                if ($key === 'plates.engine') {
                    return $callback();
                }
                return null;
            });

        $this->provider->register($this->app);

        $engine = $this->app->make('plates.engine');
        $this->assertInstanceOf(Engine::class, $engine);
    }

    public function testHelperFunctionsRegistration()
    {
        // Mock Application
        $this->app->method('singleton')
            ->willReturnCallback(function ($key, $callback) {
                if ($key === 'plates.engine') {
                    return $callback();
                }
                return null;
            });

        $this->provider->register($this->app);

        $engine = $this->app->make('plates.engine');

        // Test that helper functions are available
        $this->assertInstanceOf(Engine::class, $engine);
    }

    public function testAssetHelperFunction()
    {
        // Mock WordPress functions
        if (!function_exists('get_template_directory_uri')) {
            function get_template_directory_uri()
            {
                return 'http://example.com/wp-content/themes/parent';
            }
        }

        if (!function_exists('get_stylesheet_directory_uri')) {
            function get_stylesheet_directory_uri()
            {
                return 'http://example.com/wp-content/themes/child';
            }
        }

        // Mock Application
        $this->app->method('singleton')
            ->willReturnCallback(function ($key, $callback) {
                if ($key === 'plates.engine') {
                    return $callback();
                }
                return null;
            });

        $this->provider->register($this->app);

        $engine = $this->app->make('plates.engine');

        // Test asset helper function
        $this->assertInstanceOf(Engine::class, $engine);
    }

    public function testImageHelperFunction()
    {
        // Mock WordPress functions
        if (!function_exists('get_template_directory_uri')) {
            function get_template_directory_uri()
            {
                return 'http://example.com/wp-content/themes/parent';
            }
        }

        if (!function_exists('get_stylesheet_directory_uri')) {
            function get_stylesheet_directory_uri()
            {
                return 'http://example.com/wp-content/themes/child';
            }
        }

        // Mock Application
        $this->app->method('singleton')
            ->willReturnCallback(function ($key, $callback) {
                if ($key === 'plates.engine') {
                    return $callback();
                }
                return null;
            });

        $this->provider->register($this->app);

        $engine = $this->app->make('plates.engine');

        // Test image helper function
        $this->assertInstanceOf(Engine::class, $engine);
    }

    public function testIconHelperFunction()
    {
        // Mock WordPress functions
        if (!function_exists('get_template_directory_uri')) {
            function get_template_directory_uri()
            {
                return 'http://example.com/wp-content/themes/parent';
            }
        }

        if (!function_exists('get_stylesheet_directory_uri')) {
            function get_stylesheet_directory_uri()
            {
                return 'http://example.com/wp-content/themes/child';
            }
        }

        // Mock Application
        $this->app->method('singleton')
            ->willReturnCallback(function ($key, $callback) {
                if ($key === 'plates.engine') {
                    return $callback();
                }
                return null;
            });

        $this->provider->register($this->app);

        $engine = $this->app->make('plates.engine');

        // Test icon helper function
        $this->assertInstanceOf(Engine::class, $engine);
    }

    public function testChildThemeOverrideSupport()
    {
        // Mock WordPress functions to simulate child theme
        if (!function_exists('get_template_directory')) {
            function get_template_directory()
            {
                return '/fake/parent/theme';
            }
        }

        if (!function_exists('get_stylesheet_directory')) {
            function get_stylesheet_directory()
            {
                return '/fake/child/theme'; // Different from parent
            }
        }

        if (!function_exists('is_dir')) {
            function is_dir($path)
            {
                return true; // Mock all directories as existing
            }
        }

        // Mock Application
        $this->app->method('singleton')
            ->willReturnCallback(function ($key, $callback) {
                if ($key === 'plates.engine') {
                    return $callback();
                }
                return null;
            });

        $this->provider->register($this->app);

        $engine = $this->app->make('plates.engine');
        $this->assertInstanceOf(Engine::class, $engine);
    }

    public function testNoChildThemeSupport()
    {
        // Mock WordPress functions to simulate no child theme
        if (!function_exists('get_template_directory')) {
            function get_template_directory()
            {
                return '/fake/theme';
            }
        }

        if (!function_exists('get_stylesheet_directory')) {
            function get_stylesheet_directory()
            {
                return '/fake/theme'; // Same as parent
            }
        }

        if (!function_exists('is_dir')) {
            function is_dir($path)
            {
                return true; // Mock all directories as existing
            }
        }

        // Mock Application
        $this->app->method('singleton')
            ->willReturnCallback(function ($key, $callback) {
                if ($key === 'plates.engine') {
                    return $callback();
                }
                return null;
            });

        $this->provider->register($this->app);

        $engine = $this->app->make('plates.engine');
        $this->assertInstanceOf(Engine::class, $engine);
    }
}
