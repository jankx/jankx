<?php

namespace Tests\App\Services;

use App\Services\ProLicenseService;
use Tests\Helpers\TestCase;

class ProLicenseServiceTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        $GLOBALS['options'] = [];
        $GLOBALS['transients'] = [];
    }

    public function testConstructor()
    {
        $service = new ProLicenseService();
        $this->assertInstanceOf(ProLicenseService::class, $service);
    }

    public function testHasRequiredConstants()
    {
        $this->assertNotEmpty(ProLicenseService::OPTION_KEY);
        $this->assertNotEmpty(ProLicenseService::API_URL);
    }

    public function testIsActivatedReturnsFalseByDefault()
    {
        $service = new ProLicenseService();
        $this->assertFalse($service->isActivated());
    }

    public function testGetLicenseDataReturnsEmptyArrayByDefault()
    {
        $service = new ProLicenseService();
        $this->assertSame([], $service->getLicenseData());
    }

    public function testGetLicenseKeyReturnsEmptyStringByDefault()
    {
        $service = new ProLicenseService();
        $this->assertSame('', $service->getLicenseKey());
    }

    public function testGetEmailReturnsEmptyStringByDefault()
    {
        $service = new ProLicenseService();
        $this->assertSame('', $service->getEmail());
    }

    public function testGetPlanReturnsFreeByDefault()
    {
        $service = new ProLicenseService();
        $this->assertSame('free', $service->getPlan());
    }

    public function testActivateStoresLicenseData()
    {
        $service = new ProLicenseService();

        $result = $service->activate('PRO-KEY-1234', 'user@example.com');

        $this->assertTrue($result['success']);
        $this->assertTrue($service->isActivated());
        $this->assertSame('PRO-KEY-1234', $service->getLicenseKey());
        $this->assertSame('user@example.com', $service->getEmail());
        $this->assertSame('pro', $service->getPlan());
    }

    public function testActivatePersistsToOption()
    {
        $service = new ProLicenseService();
        $service->activate('KEY-PERSIST', 'persist@test.com');

        $this->assertArrayHasKey(ProLicenseService::OPTION_KEY, $GLOBALS['options']);
        $stored = $GLOBALS['options'][ProLicenseService::OPTION_KEY];
        $this->assertSame('KEY-PERSIST', $stored['key']);
        $this->assertSame('persist@test.com', $stored['email']);
    }

    public function testActivateSetsTransient()
    {
        $service = new ProLicenseService();
        $service->activate('KEY-T', 't@t.com');

        $this->assertArrayHasKey(ProLicenseService::CACHE_KEY, $GLOBALS['transients']);
    }

    public function testDeactivateRemovesLicenseData()
    {
        $service = new ProLicenseService();
        $service->activate('PRO-KEY-1234', 'user@example.com');
        $this->assertTrue($service->isActivated());

        $result = $service->deactivate();

        $this->assertTrue($result);
        $this->assertFalse($service->isActivated());
        $this->assertSame('', $service->getLicenseKey());
        $this->assertSame('', $service->getEmail());
    }

    public function testDeactivateClearsOption()
    {
        $service = new ProLicenseService();
        $service->activate('K', 'e@e.com');

        $this->assertArrayHasKey(ProLicenseService::OPTION_KEY, $GLOBALS['options']);

        $service->deactivate();
        $this->assertArrayNotHasKey(ProLicenseService::OPTION_KEY, $GLOBALS['options']);
    }

    public function testDeactivateClearsTransient()
    {
        $service = new ProLicenseService();
        $service->activate('K', 'e@e.com');
        $service->deactivate();

        $this->assertArrayNotHasKey(ProLicenseService::CACHE_KEY, $GLOBALS['transients']);
    }

    public function testGetLicenseDataReturnsStoredData()
    {
        $service = new ProLicenseService();
        $service->activate('KEY-1', 'a@b.com');

        $data = $service->getLicenseData();
        $this->assertSame('KEY-1', $data['key']);
        $this->assertSame('a@b.com', $data['email']);
        $this->assertSame('pro', $data['plan']);
        $this->assertSame('active', $data['status']);
        $this->assertArrayHasKey('domain', $data);
        $this->assertArrayHasKey('activated_at', $data);
    }

    public function testActivateWithExtraData()
    {
        $service = new ProLicenseService();

        $service->activate('KEY', 'e@e.com', [
            'plan' => 'membership',
            'expires_at' => '2025-12-31 23:59:59',
            'license_id' => 'LIC-ABC-123',
        ]);

        $data = $service->getLicenseData();
        $this->assertSame('membership', $data['plan']);
        $this->assertSame('2025-12-31 23:59:59', $data['expires_at']);
        $this->assertSame('LIC-ABC-123', $data['license_id']);
    }

    public function testIsExpiredReturnsFalseWhenNoExpiry()
    {
        $service = new ProLicenseService();
        $service->activate('KEY-X', 'x@y.com');
        $this->assertFalse($service->isExpired());
    }

    public function testIsExpiredReturnsTrueWhenExpired()
    {
        $service = new ProLicenseService();
        $service->activate('KEY-X', 'x@y.com', [
            'expires_at' => '2020-01-01 00:00:00',
        ]);
        $this->assertTrue($service->isExpired());
    }

    public function testIsExpiredReturnsFalseWhenNotActivated()
    {
        $service = new ProLicenseService();
        $this->assertFalse($service->isExpired());
    }

    public function testGetExpiresAtReturnsNullWhenNotSet()
    {
        $service = new ProLicenseService();
        $this->assertNull($service->getExpiresAt());
    }

    public function testGetExpiresAtReturnsValue()
    {
        $service = new ProLicenseService();
        $service->activate('K', 'e@e.com', ['expires_at' => '2025-06-01']);
        $this->assertSame('2025-06-01', $service->getExpiresAt());
    }

    public function testLoadsFromSavedOption()
    {
        $GLOBALS['options'][ProLicenseService::OPTION_KEY] = [
            'key' => 'SAVED-KEY',
            'email' => 'saved@test.com',
            'domain' => 'example.com',
            'activated_at' => '2024-01-01 00:00:00',
            'status' => 'active',
            'plan' => 'pro-1',
            'expires_at' => null,
            'license_id' => '',
        ];

        $service = new ProLicenseService();
        $this->assertTrue($service->isActivated());
        $this->assertSame('SAVED-KEY', $service->getLicenseKey());
        $this->assertSame('saved@test.com', $service->getEmail());
        $this->assertSame('pro-1', $service->getPlan());
    }

    public function testIsActivatedReturnsFalseWithIncompleteData()
    {
        $GLOBALS['options'][ProLicenseService::OPTION_KEY] = [
            'key' => '',
            'email' => 'test@test.com',
            'status' => 'active',
        ];

        $service = new ProLicenseService();
        $this->assertFalse($service->isActivated());
    }

    public function testIsActivatedReturnsFalseWithInactiveStatus()
    {
        $GLOBALS['options'][ProLicenseService::OPTION_KEY] = [
            'key' => 'SOME-KEY',
            'email' => 'test@test.com',
            'status' => 'expired',
        ];

        $service = new ProLicenseService();
        $this->assertFalse($service->isActivated());
    }

    public function testDeactivateDoesNotCrashWhenNotActivated()
    {
        $service = new ProLicenseService();
        $result = $service->deactivate();
        $this->assertTrue($result);
    }

    public function testHasAllExpectedMethods()
    {
        $methods = [
            'activate', 'verify', 'deactivate',
            'isActivated', 'getLicenseData',
            'getLicenseKey', 'getEmail', 'getPlan',
            'getExpiresAt', 'isExpired',
        ];

        foreach ($methods as $method) {
            $this->assertHasMethod(ProLicenseService::class, $method);
        }
    }
}
