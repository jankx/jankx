<?php

namespace Tests\Services;

use Tests\Helpers\TestCase;
use Jankx\Services\AdminPageService;
use Jankx\Foundation\Application;
use Jankx\Extensions\ThemeExtensionManager;

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
        if (!function_exists('wp_parse_args')) {
            require_once __DIR__ . '/../bootstrap-mocks.php';
        }
        
        $this->adminPageService = new AdminPageService($this->app);
    }

    protected function mockFreeLicense()
    {
        $license = $this->getMockBuilder(\stdClass::class)->addMethods(['isActivated', 'getLicenseData'])->getMock();
        $license->method('isActivated')->willReturn(false);
        $this->app->method('bound')->with('license')->willReturn(true);
        $this->app->method('make')->with('license')->willReturn($license);
    }

    protected function mockProLicense()
    {
        $license = $this->getMockBuilder(\stdClass::class)->addMethods(['isActivated', 'getLicenseData'])->getMock();
        $license->method('isActivated')->willReturn(true);
        $license->method('getLicenseData')->willReturn([
            'key' => 'PRO-KEY',
            'email' => 'pro@example.com',
        ]);
        $this->app->method('bound')->with('license')->willReturn(true);
        $this->app->method('make')->with('license')->willReturn($license);
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
        $themeExtManager = $this->createMock(ThemeExtensionManager::class);
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

    public function testRenderSupportPageShowsProUpsellForFreeUsers()
    {
        $this->mockFreeLicense();

        ob_start();
        $this->adminPageService->renderSupportPage(['id' => 'jankx-support']);
        $output = ob_get_clean();

        $this->assertStringContainsString('PRO Feature', $output);
        $this->assertStringContainsString('Activate PRO License', $output);
        $this->assertStringContainsString('page=jankx-license', $output);
    }

    public function testRenderSupportPageShowsFormForProUsers()
    {
        $this->mockProLicense();

        ob_start();
        $this->adminPageService->renderSupportPage(['id' => 'jankx-support']);
        $output = ob_get_clean();

        $this->assertStringContainsString('Submit a Ticket', $output);
        $this->assertStringContainsString('ticket_subject', $output);
        $this->assertStringContainsString('ticket_message', $output);
        $this->assertStringContainsString('include_system_info', $output);
        $this->assertStringNotContainsString('PRO Feature', $output);
    }

    public function testRenderSupportPageShowsNoTicketsMessage()
    {
        $this->mockProLicense();

        ob_start();
        $this->adminPageService->renderSupportPage(['id' => 'jankx-support']);
        $output = ob_get_clean();

        $this->assertStringContainsString('No tickets submitted yet', $output);
    }

    public function testRenderSponsorPageContainsLinks()
    {
        ob_start();
        $this->adminPageService->renderSponsorPage(['id' => 'jankx-sponsor']);
        $output = ob_get_clean();

        $this->assertStringContainsString('GitHub Sponsors', $output);
        $this->assertStringContainsString('Buy Me a Coffee', $output);
        $this->assertStringContainsString('Supporter', $output);
        $this->assertStringContainsString('Gold', $output);
        $this->assertStringContainsString('Platinum', $output);
    }

    public function testRenderMembershipPageShowsUpsellForFreeUsers()
    {
        $this->mockFreeLicense();

        ob_start();
        $this->adminPageService->renderMembershipPage(['id' => 'jankx-membership']);
        $output = ob_get_clean();

        $this->assertStringContainsString('JANKX Membership', $output);
        $this->assertStringContainsString('Activate PRO License', $output);
    }

    public function testRenderMembershipPageShowsBundlesForProUsers()
    {
        $this->mockProLicense();

        ob_start();
        $this->adminPageService->renderMembershipPage(['id' => 'jankx-membership']);
        $output = ob_get_clean();

        $this->assertStringContainsString('PRO Membership Active', $output);
    }

    public function testRenderPageHeaderShowsEditionBadge()
    {
        // Setup mock that handles both license and url services
        $licenseMock = $this->getMockBuilder(\stdClass::class)->addMethods(['isActivated', 'getLicenseData'])->getMock();
        $licenseMock->method('isActivated')->willReturn(false);

        $this->app->method('bound')->with('license')->willReturn(true);
        $this->app->method('make')->willReturnCallback(function($abstract) use ($licenseMock) {
            if ($abstract === 'license') return $licenseMock;
            if ($abstract === 'jankx.version') return '2.0.0';
            if ($abstract === 'jankx.urls') return ['base' => 'http://example.com/wp-content/themes/jankx'];
            return null;
        });

        ob_start();
        $this->callProtectedMethod($this->adminPageService, 'renderPageHeader', ['id' => 'jankx-license', 'title' => 'License']);
        $output = ob_get_clean();

        $this->assertStringContainsString('FREE', $output);
        $this->assertStringContainsString('edition-badge-free', $output);
        $this->assertStringContainsString('You are using JANKX FREE', $output);
    }

    public function testRenderPageFooterShowsLicensedState()
    {
        $licenseMock = $this->getMockBuilder(\stdClass::class)->addMethods(['isActivated', 'getLicenseData'])->getMock();
        $licenseMock->method('isActivated')->willReturn(true);

        $this->app->method('bound')->with('license')->willReturn(true);
        $this->app->method('make')->willReturnCallback(function($abstract) use ($licenseMock) {
            if ($abstract === 'license') return $licenseMock;
            return null;
        });

        ob_start();
        $this->callProtectedMethod($this->adminPageService, 'renderPageFooter', ['id' => 'jankx-license']);
        $output = ob_get_clean();

        $this->assertStringContainsString('Licensed', $output);
    }

    public function testRenderPageFooterShowsUnlicensedForFree()
    {
        $licenseMock = $this->getMockBuilder(\stdClass::class)->addMethods(['isActivated', 'getLicenseData'])->getMock();
        $licenseMock->method('isActivated')->willReturn(false);

        $this->app->method('bound')->with('license')->willReturn(true);
        $this->app->method('make')->willReturnCallback(function($abstract) use ($licenseMock) {
            if ($abstract === 'license') return $licenseMock;
            return null;
        });

        ob_start();
        $this->callProtectedMethod($this->adminPageService, 'renderPageFooter', ['id' => 'jankx-license']);
        $output = ob_get_clean();

        $this->assertStringContainsString('Unlicensed', $output);
    }

    public function testRenderLicensePageHasActivationForm()
    {
        $this->mockFreeLicense();

        ob_start();
        $this->adminPageService->renderLicensePage(['id' => 'jankx-license', 'title' => 'License']);
        $output = ob_get_clean();

        $this->assertStringContainsString('Activate JANKX PRO', $output);
        $this->assertStringContainsString('license_key', $output);
    }

    public function testRenderLicensePageShowsDeactivateForPro()
    {
        $this->mockProLicense();

        ob_start();
        $this->adminPageService->renderLicensePage(['id' => 'jankx-license', 'title' => 'License']);
        $output = ob_get_clean();

        $this->assertStringContainsString('Deactivate', $output);
        $this->assertStringContainsString('Pro Enabled', $output);
    }

    public function testMarketplacePageContainsExtensionsHub()
    {
        $mockMarketplace = $this->getMockBuilder(\stdClass::class)->addMethods(['getAvailableExtensions', 'getLocale'])->getMock();
        $mockMarketplace->method('getAvailableExtensions')->willReturn(['data' => [], 'pagination' => []]);
        $mockMarketplace->method('getLocale')->willReturn('en');

        $this->app->method('make')->willReturnCallback(function($abstract) use ($mockMarketplace) {
            if ($abstract === 'extension.marketplace') {
                return $mockMarketplace;
            }
            if ($abstract === 'license') {
                $l = $this->getMockBuilder(\stdClass::class)->addMethods(['isActivated', 'getLicenseData'])->getMock();
                $l->method('isActivated')->willReturn(false);
                $l->method('getLicenseData')->willReturn(['key' => '', 'email' => '']);
                return $l;
            }
            return null;
        });
        $this->app->method('bound')->with('license')->willReturn(false);

        ob_start();
        $this->adminPageService->renderMarketplacePage(['id' => 'jankx-marketplace']);
        $output = ob_get_clean();

        $this->assertStringContainsString('Extension Library', $output);
    }

    public function testHasAllNewRenderMethods()
    {
        $methods = [
            'renderSupportPage', 'renderSponsorPage', 'renderMembershipPage',
            'renderLicensePage', 'renderMarketplacePage',
        ];

        foreach ($methods as $method) {
            $this->assertTrue(method_exists($this->adminPageService, $method), "Method {$method} should exist");
        }
    }
}
