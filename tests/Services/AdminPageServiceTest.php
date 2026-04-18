<?php

namespace Tests\Services;

use PHPUnit\Framework\TestCase;
use Jankx\Services\AdminPageService;
use Jankx\Foundation\Application;

class AdminPageServiceTest extends TestCase
{
    protected $app;
    protected $adminPageService;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Setup Application Mock
        $this->app = $this->createMock(Application::class);
        
        // We only mock what's necessary for __construct
        // AdminPageService registers actions in construct
        // If we are in unit test, add_action might be mocked or we can use Brain\Monkey
        
        // Ensure WordPress functions are mocked if not already
        if (!function_exists('add_action')) {
            require_once __DIR__ . '/../bootstrap-mocks.php';
        }
        
        $this->adminPageService = new AdminPageService($this->app);
    }

    public function testRenderExtensionsPageCorrectlyUsesIdAndVersion()
    {
        // Mock $_GET to avoid undefined index
        $_GET['extension_status'] = 'required';
        $_GET['page'] = 'jankx-extensions';

        // Mock ExtensionManager
        $extensionManager = $this->createMock(\Jankx\Extensions\ExtensionManager::class);
        
        // Setup ExtensionManager expectations
        $extensionManager->method('get_extensions')->willReturn([]);
        $extensionManager->method('get_missing_required_extensions')->willReturn(['hello-extension']);
        $extensionManager->method('get_recommended_extensions')->willReturn([]);
        $extensionManager->method('get_required_extensions')->willReturn([
            'hello-extension' => '*'
        ]);
        
        $extensionManager->method('get_extension_by_id')->willReturn(null);
        $extensionManager->method('get_hub_extension_info')->willReturn([
            'name' => 'Hello World',
            'version' => '1.0.0',
            'description' => 'A test extension',
            'author' => 'Test Author'
        ]);

        // Mock ThemeExtensionManager
        $themeExtManager = $this->createMock(\Jankx\Contracts\Extension\ExtensionManagerInterface::class);
        $themeExtManager->method('getDisabledManifests')->willReturn([]);

        // App bindings
        $this->app->method('make')->willReturnCallback(function($abstract) use ($extensionManager, $themeExtManager) {
            if ($abstract === 'extension.manager') {
                return $extensionManager;
            }
            if ($abstract === 'theme_extension.manager') {
                return $themeExtManager;
            }
            return null;
        });

        // Mock wp_create_nonce
        if (!function_exists('wp_create_nonce')) {
            eval('function wp_create_nonce($action) { return "test_nonce"; }');
        }
        if (!function_exists('admin_url')) {
            eval('function admin_url($path) { return "http://test.local/wp-admin/" . $path; }');
        }
        if (!function_exists('add_query_arg')) {
            eval('function add_query_arg($key, $val) { return "?$key=$val"; }');
        }
        if (!function_exists('wp_kses_post')) {
            eval('function wp_kses_post($html) { return $html; }');
        }

        // Capture output
        ob_start();
        $this->adminPageService->renderExtensionsPage(['id' => 'jankx-extensions']);
        $output = ob_get_clean();

        // The bug was that the ID was '*', which caused the strong tag to have '*'
        // With our fix, it should use 'hello-extension' as ID and output 'Hello World' (from hub API)
        $this->assertStringContainsString('Hello World', $output);
        $this->assertStringNotContainsString('<strong>*</strong>', $output, 'It should not output * as extension name');
        $this->assertStringContainsString('hello-extension', $output, 'It should include data-slug="hello-extension"');
    }
}
