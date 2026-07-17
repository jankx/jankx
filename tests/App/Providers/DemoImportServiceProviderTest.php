<?php

namespace Tests\App\Providers;

use App\Providers\DemoImportServiceProvider;
use Jankx\Foundation\Application;
use Tests\Helpers\TestCase;
use Mockery;

class DemoImportServiceProviderTest extends TestCase
{
    protected $provider;
    protected $app;

    protected function setUp(): void
    {
        parent::setUp();
        $this->app = new Application();
        $this->provider = new DemoImportServiceProvider($this->app);

        $GLOBALS['options'] = [];
        $GLOBALS['transients'] = [];
        $GLOBALS['wp_mails'] = [];
        $GLOBALS['wp_remote_posts'] = [];
        $GLOBALS['mock_active_plugins'] = [];
        $GLOBALS['admin_notices'] = [];
        $GLOBALS['wp_json_response'] = null;
        $GLOBALS['wp_die_called'] = null;
    }

    public function testConstructor()
    {
        $this->assertInstanceOf(DemoImportServiceProvider::class, $this->provider);
    }

    public function testShouldLoadFrontendReturnsFalse()
    {
        $this->assertFalse($this->provider->shouldLoadFrontend());
    }

    public function testRegisterStoresApp()
    {
        $app2 = new Application();
        $provider = new DemoImportServiceProvider($app2);
        $provider->register($app2);

        $this->assertNotNull($this->getProtectedProperty($provider, 'app'));
    }

    public function testAjaxInstallBundleWithInvalidNonce()
    {
        $_POST = [
            'bundle' => 'business',
            'step' => 'plugins',
            'nonce' => 'invalid',
        ];
        $GLOBALS['mock_wp_verify_nonce'] = false;

        $this->expectException(\Exception::class);
        $this->provider->ajaxInstallBundle();
    }

    public function testAjaxInstallBundleWithInvalidBundle()
    {
        $_POST = [
            'bundle' => 'non-existent-bundle',
            'step' => 'plugins',
            'nonce' => 'valid_nonce',
        ];
        $GLOBALS['mock_wp_verify_nonce'] = true;

        $this->provider->ajaxInstallBundle();

        $this->assertNotNull($GLOBALS['wp_json_response']);
        $this->assertFalse($GLOBALS['wp_json_response']['success']);
    }

    public function testAjaxInstallBundleOptionsStep()
    {
        $_POST = [
            'bundle' => 'business',
            'step' => 'options',
            'nonce' => 'valid_nonce',
        ];
        $GLOBALS['mock_wp_verify_nonce'] = true;

        $this->provider->ajaxInstallBundle();

        $this->assertNotNull($GLOBALS['wp_json_response']);
    }

    public function testAjaxInstallBundlePagesStep()
    {
        $GLOBALS['mock_pages']['home'] = (object) ['ID' => 1];
        $GLOBALS['mock_pages']['blog'] = (object) ['ID' => 2];
        $GLOBALS['mock_menus']['Main Menu'] = (object) ['term_id' => 10];

        $_POST = [
            'bundle' => 'business',
            'step' => 'pages',
            'nonce' => 'valid_nonce',
        ];
        $GLOBALS['mock_wp_verify_nonce'] = true;

        $this->provider->ajaxInstallBundle();

        $this->assertNotNull($GLOBALS['wp_json_response']);
        $this->assertSame('business', $GLOBALS['options']['jankx_active_bundle'] ?? '');
    }

    public function testAjaxResetBundle()
    {
        $GLOBALS['options']['jankx_active_bundle'] = 'business';
        $GLOBALS['options']['jankx_bundle_installed_at'] = '2024-01-01 00:00:00';

        $_POST = [
            'bundle' => 'business',
            'nonce' => 'valid_nonce',
        ];
        $GLOBALS['mock_wp_verify_nonce'] = true;

        $this->provider->ajaxResetBundle();

        $this->assertNotNull($GLOBALS['wp_json_response']);
        $this->assertTrue($GLOBALS['wp_json_response']['success']);
        $this->assertArrayNotHasKey('jankx_active_bundle', $GLOBALS['options']);
        $this->assertArrayNotHasKey('jankx_bundle_installed_at', $GLOBALS['options']);
    }

    public function testAjaxResetBundleWithEmptyBundle()
    {
        $_POST = [
            'bundle' => '',
            'nonce' => 'valid_nonce',
        ];
        $GLOBALS['mock_wp_verify_nonce'] = true;

        $this->provider->ajaxResetBundle();

        $this->assertNotNull($GLOBALS['wp_json_response']);
        $this->assertFalse($GLOBALS['wp_json_response']['success']);
    }

    public function testGetDemosReturnsArrayFromManifest()
    {
        $demos = $this->callProtectedMethod($this->provider, 'getDemos');
        $this->assertIsArray($demos);
    }

    public function testGetDemosContainsExpectedDemos()
    {
        $demos = $this->callProtectedMethod($this->provider, 'getDemos');
        $this->assertArrayHasKey('gaming-portal', $demos);
        $this->assertArrayHasKey('blog-magazine', $demos);
        $this->assertArrayHasKey('pet-shop', $demos);
    }

    public function testHasAllExpectedMethods()
    {
        $methods = [
            'register', 'boot', 'registerAdminPage', 'enqueueAssets',
            'renderPage', 'ajaxGetDemos', 'ajaxImportDemo', 'ajaxResetDemo',
            'ajaxInstallBundle', 'ajaxResetBundle',
        ];

        foreach ($methods as $method) {
            $this->assertHasMethod(DemoImportServiceProvider::class, $method);
        }
    }
}
