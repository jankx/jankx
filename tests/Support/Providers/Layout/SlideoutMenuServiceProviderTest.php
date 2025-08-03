<?php

namespace Tests\Support\Providers\Layout;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\Layout\SlideoutMenuServiceProvider;
use Jankx\Facades\Log;
use PHPUnit\Framework\TestCase;

class SlideoutMenuServiceProviderTest extends TestCase
{
    protected $app;
    protected $provider;

    protected function setUp(): void
    {
        parent::setUp();

        $this->app = $this->createMock(Application::class);
        $this->provider = new SlideoutMenuServiceProvider($this->app);

        // Mock services
        $this->app->method('make')
            ->willReturnCallback(function ($service) {
                if ($service === 'log') {
                    return $this->createMock(\Jankx\Foundation\Log\Logger::class);
                }
                if ($service === 'config') {
                    $config = $this->createMock(\Jankx\Config\Repository::class);
                    $config->method('get')
                        ->willReturn([]);
                    return $config;
                }
                return null;
            });

        // Mock Log facade
        Log::setFacadeApplication($this->app);
    }

    public function testRegisterHooks()
    {
        // Mock singleton method
        $this->app->method('singleton')
            ->willReturnSelf();

        $this->provider->register($this->app);

        // Test that no exceptions were thrown
        $this->assertTrue(true);
    }

    public function testBoot()
    {
        // Mock singleton method for register
        $this->app->method('singleton')
            ->willReturnSelf();

        // Register first
        $this->provider->register($this->app);

        // Boot should not throw any exceptions
        $this->provider->boot($this->app);

        $this->assertTrue(true);
    }

    public function testGetConfig()
    {
        // Use reflection to access protected method
        $reflection = new \ReflectionClass($this->provider);
        $method = $reflection->getMethod('getConfig');
        $method->setAccessible(true);

        $config = $method->invoke($this->provider);

        $this->assertIsArray($config);
        $this->assertArrayHasKey('enabled', $config);
        $this->assertArrayHasKey('breakpoint', $config);
        $this->assertArrayHasKey('position', $config);
    }

    public function testGetMenuDimensions()
    {
        // Use reflection to access protected method
        $reflection = new \ReflectionClass($this->provider);
        $method = $reflection->getMethod('getMenuDimensions');
        $method->setAccessible(true);

        // Test left position
        $dimensions = $method->invoke($this->provider, 'left', '280px', '100vh');
        $this->assertEquals('0', $dimensions['top']);
        $this->assertEquals('0', $dimensions['left']);
        $this->assertEquals('280px', $dimensions['width']);
        $this->assertEquals('100vh', $dimensions['height']);

        // Test right position
        $dimensions = $method->invoke($this->provider, 'right', '280px', '100vh');
        $this->assertEquals('0', $dimensions['top']);
        $this->assertEquals('auto', $dimensions['left']);
        $this->assertEquals('0', $dimensions['right']);
        $this->assertEquals('280px', $dimensions['width']);
        $this->assertEquals('100vh', $dimensions['height']);

        // Test top position
        $dimensions = $method->invoke($this->provider, 'top', '280px', '300px');
        $this->assertEquals('0', $dimensions['top']);
        $this->assertEquals('0', $dimensions['left']);
        $this->assertEquals('100vw', $dimensions['width']);
        $this->assertEquals('300px', $dimensions['height']);

        // Test bottom position
        $dimensions = $method->invoke($this->provider, 'bottom', '280px', '300px');
        $this->assertEquals('auto', $dimensions['top']);
        $this->assertEquals('0', $dimensions['bottom']);
        $this->assertEquals('0', $dimensions['left']);
        $this->assertEquals('100vw', $dimensions['width']);
        $this->assertEquals('300px', $dimensions['height']);
    }

    public function testAddBodyClasses()
    {
        $classes = ['existing-class'];
        $result = $this->provider->addBodyClasses($classes);

        $this->assertContains('has-slideout-menu', $result);
        $this->assertContains('slideout-left', $result);
        $this->assertContains('slideout-tablet', $result);
        $this->assertContains('existing-class', $result);
    }

    public function testRenderDefaultMenu()
    {
        // Mock WordPress functions
        if (!function_exists('home_url')) {
            eval('function home_url() { return "http://example.com"; }');
        }

        if (!function_exists('get_pages')) {
            eval('function get_pages($args) {
                return [
                    (object)["ID" => 1, "post_title" => "Page 1"],
                    (object)["ID" => 2, "post_title" => "Page 2"]
                ];
            }');
        }

        if (!function_exists('get_permalink')) {
            eval('function get_permalink($id) { return "http://example.com/page-" . $id; }');
        }

        if (!function_exists('__')) {
            eval('function __($text, $domain) { return $text; }');
        }

        if (!function_exists('esc_html__')) {
            eval('function esc_html__($text, $domain) { return $text; }');
        }

        // Capture output
        ob_start();
        $this->provider->renderDefaultMenu();
        $output = ob_get_clean();

        $this->assertStringContainsString('<nav class="slideout-navigation">', $output);
        $this->assertStringContainsString('<ul class="slideout-menu-items">', $output);
        $this->assertStringContainsString('Home', $output);
        $this->assertStringContainsString('Page 1', $output);
        $this->assertStringContainsString('Page 2', $output);
    }

    public function testShouldEnableForDevice()
    {
        // Use reflection to access protected method
        $reflection = new \ReflectionClass($this->provider);
        $method = $reflection->getMethod('shouldEnableForDevice');
        $method->setAccessible(true);

        // Mock wp_is_mobile
        if (!function_exists('wp_is_mobile')) {
            eval('function wp_is_mobile() { return true; }');
        }

        $result = $method->invoke($this->provider);
        $this->assertIsBool($result);
    }

    public function testAddCustomCSS()
    {
        // Mock config to return custom CSS
        $config = $this->createMock(\Jankx\Config\Repository::class);
        $config->method('get')
            ->willReturn([
                'enabled' => true,
                'custom_css' => '.custom-style { color: red; }'
            ]);

        $this->app->method('make')
            ->willReturnCallback(function ($service) use ($config) {
                if ($service === 'log') {
                    return $this->createMock(\Jankx\Foundation\Log\Logger::class);
                }
                if ($service === 'config') {
                    return $config;
                }
                return null;
            });

        // Mock getConfig method to return our test config
        $provider = $this->getMockBuilder(SlideoutMenuServiceProvider::class)
            ->setConstructorArgs([$this->app])
            ->onlyMethods(['getConfig'])
            ->getMock();

        $provider->method('getConfig')
            ->willReturn([
                'enabled' => true,
                'custom_css' => '.custom-style { color: red; }'
            ]);

        // Capture output
        ob_start();
        $provider->addCustomCSS();
        $output = ob_get_clean();

        $this->assertStringContainsString('<style id="jankx-slideout-custom-css">', $output);
        $this->assertStringContainsString('.custom-style { color: red; }', $output);
    }

    public function testAddCustomJS()
    {
        // Mock config to return custom JS
        $config = $this->createMock(\Jankx\Config\Repository::class);
        $config->method('get')
            ->willReturn([
                'enabled' => true,
                'custom_js' => 'console.log("custom js");'
            ]);

        $this->app->method('make')
            ->willReturnCallback(function ($service) use ($config) {
                if ($service === 'log') {
                    return $this->createMock(\Jankx\Foundation\Log\Logger::class);
                }
                if ($service === 'config') {
                    return $config;
                }
                return null;
            });

        // Mock getConfig method to return our test config
        $provider = $this->getMockBuilder(SlideoutMenuServiceProvider::class)
            ->setConstructorArgs([$this->app])
            ->onlyMethods(['getConfig'])
            ->getMock();

        $provider->method('getConfig')
            ->willReturn([
                'enabled' => true,
                'custom_js' => 'console.log("custom js");'
            ]);

        // Capture output
        ob_start();
        $provider->addCustomJS();
        $output = ob_get_clean();

        $this->assertStringContainsString('<script id="jankx-slideout-custom-js">', $output);
        $this->assertStringContainsString('console.log(&quot;custom js&quot;);', $output);
    }
}
