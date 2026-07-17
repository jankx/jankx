<?php

namespace Tests\App\Services;

use App\Services\MembershipBundleService;
use Tests\Helpers\TestCase;
use Mockery;

class MembershipBundleServiceTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $GLOBALS['options'] = [];
        $GLOBALS['transients'] = [];
    }

    public function testConstructor()
    {
        $service = new MembershipBundleService();
        $this->assertInstanceOf(MembershipBundleService::class, $service);
    }

    public function testGetBundlesReturnsArray()
    {
        $service = new MembershipBundleService();
        $bundles = $service->getBundles();

        $this->assertIsArray($bundles);
    }

    public function testGetBundlesContainsLocalBundles()
    {
        $service = new MembershipBundleService();
        $bundles = $service->getBundles();

        $this->assertArrayHasKey('business', $bundles);
        $this->assertArrayHasKey('blog-magazine', $bundles);
    }

    public function testBundleHasRequiredKeys()
    {
        $service = new MembershipBundleService();
        $bundles = $service->getBundles();

        foreach ($bundles as $id => $bundle) {
            $this->assertArrayHasKey('name', $bundle, "Bundle {$id} missing name");
            $this->assertArrayHasKey('description', $bundle, "Bundle {$id} missing description");
            $this->assertArrayHasKey('required_extensions', $bundle, "Bundle {$id} missing required_extensions");
            $this->assertIsArray($bundle['required_extensions'], "Bundle {$id} required_extensions must be array");
            $this->assertArrayHasKey('demo_package', $bundle, "Bundle {$id} missing demo_package");
        }
    }

    public function testGetActiveBundleReturnsEmptyByDefault()
    {
        $service = new MembershipBundleService();
        $this->assertSame('', $service->getActiveBundle());
    }

    public function testSetActiveBundle()
    {
        $service = new MembershipBundleService();
        $service->setActiveBundle('business');

        $this->assertSame('business', $service->getActiveBundle());
        $this->assertArrayHasKey('jankx_active_bundle', $GLOBALS['options']);
        $this->assertSame('business', $GLOBALS['options']['jankx_active_bundle']);
    }

    public function testSetActiveBundleStoresTimestamp()
    {
        $service = new MembershipBundleService();
        $service->setActiveBundle('shop');

        $this->assertArrayHasKey('jankx_bundle_installed_at', $GLOBALS['options']);
        $this->assertNotEmpty($GLOBALS['options']['jankx_bundle_installed_at']);
    }

    public function testResetBundleClearsActiveBundle()
    {
        $GLOBALS['options']['jankx_active_bundle'] = 'business';
        $GLOBALS['options']['jankx_bundle_installed_at'] = '2024-01-01 00:00:00';
        $GLOBALS['options']['jankx_active_demo'] = 'business';
        $GLOBALS['options']['jankx_demo_imported_at'] = '2024-01-01 00:00:00';

        $service = new MembershipBundleService();
        $service->resetBundle('business');

        $this->assertSame('', $service->getActiveBundle());
    }

    public function testInstallBundleReturnsFalseForInvalidBundle()
    {
        $service = new MembershipBundleService();
        $error = '';

        $result = $service->installBundle('non-existent-bundle', $error);

        $this->assertFalse($result);
        $this->assertNotEmpty($error);
    }

    public function testGetBundlesSupportsFilter()
    {
        $filterCalled = false;
        \add_filter('jankx/membership/bundles', function ($bundles) use (&$filterCalled) {
            $filterCalled = true;
            $bundles['custom'] = [
                'name' => 'Custom',
                'description' => 'Custom bundle',
                'required_extensions' => [],
                'demo_package' => 'custom',
            ];
            return $bundles;
        });

        $service = new MembershipBundleService();
        $bundles = $service->getBundles();

        $this->assertTrue($filterCalled);
        $this->assertArrayHasKey('custom', $bundles);
    }

    public function testHasAllExpectedMethods()
    {
        $methods = [
            'getBundles', 'installBundle', 'setActiveBundle',
            'getActiveBundle', 'resetBundle',
        ];

        foreach ($methods as $method) {
            $this->assertHasMethod(MembershipBundleService::class, $method);
        }
    }
}
