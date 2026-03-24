<?php

namespace App\Services;

use Jankx\Foundation\Application;
use Jankx\Services\AbstractService;

class LicenseService extends AbstractService
{
    protected $client;
    protected $licenseOptionName = 'jankx_license';
    protected $licenseStatusOptionName = 'jankx_license_status';

    public function __construct(Application $app, OptilarityClient $client)
    {
        parent::__construct($app);
        $this->client = $client;
        $this->name = 'license';
    }

    protected function boot(): void
    {
        // Scheduled ping check can happen here
    }

    public function verify($licenseKey, $email)
    {
        $domain = parse_url(get_site_url(), PHP_URL_HOST);
        $version = wp_get_theme()->get('Version');

        $response = $this->client->post('/api/license/verify', [
            'license_key' => $licenseKey,
            'email' => $email,
            'domain' => $domain,
            'version' => $version,
        ]);

        if ($response['success']) {
            update_option($this->licenseOptionName, [
                'key' => $licenseKey,
                'email' => $email,
            ]);
            update_option($this->licenseStatusOptionName, $response);
        }

        return $response;
    }

    public function ping()
    {
        $license = get_option($this->licenseOptionName);
        if (!$license || !isset($license['key'])) {
            return ['success' => false, 'message' => __('No license found.', 'jankx')];
        }

        $domain = parse_url(get_site_url(), PHP_URL_HOST);
        return $this->client->post('/api/theme/ping', [
            'license_key' => $license['key'],
            'domain' => $domain,
        ]);
    }

    public function getLatestVersion()
    {
        return $this->client->get('/api/theme/latest');
    }

    public function isLicensed()
    {
        $status = get_option($this->licenseStatusOptionName);
        if (!$status) {
            return false;
        }

        return $status['success'] ?? false;
    }

    public function canUpdate()
    {
        $status = get_option($this->licenseStatusOptionName);
        return $status['can_update'] ?? false;
    }

    public function isActivated()
    {
        return $this->isLicensed();
    }

    public function getLicenseData()
    {
        $status = get_option($this->licenseStatusOptionName);
        $license = get_option($this->licenseOptionName);

        if (!$status) {
            return [];
        }

        return array_merge((array)$status, (array)$license);
    }

    public function deactivate()
    {
        delete_option($this->licenseOptionName);
        delete_option($this->licenseStatusOptionName);
        return true;
    }

    public function getLicensedProducts()
    {
        $status = get_option($this->licenseStatusOptionName);
        return $status['licensed_products'] ?? [];
    }
}
