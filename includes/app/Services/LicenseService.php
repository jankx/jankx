<?php

namespace App\Services;

use Jankx\Foundation\Application;
use Jankx\Services\AbstractService;
use Optilarity\Sdk\OptilaritySdk;
use Optilarity\Sdk\Exceptions\ApiException;

/**
 * Jankx License Service
 *
 * Thin wrapper around OptilaritySdk::license().
 * Responsible only for persisting results to WordPress options.
 */
class LicenseService extends AbstractService
{
    protected OptilaritySdk $sdk;

    protected string $licenseOptionName       = 'jankx_license';
    protected string $licenseStatusOptionName  = 'jankx_license_status';

    public function __construct(Application $app, OptilaritySdk $sdk)
    {
        parent::__construct($app);
        $this->sdk  = $sdk;
        $this->name = 'license';
    }

    protected function boot(): void {}

    // ─────────────────────────────────────────────────────────────
    // Public API
    // ─────────────────────────────────────────────────────────────

    /**
     * Activate a license key and persist the result.
     */
    public function verify(string $licenseKey, string $email): array
    {
        try {
            $response = $this->sdk->license()->activate($licenseKey, $email);
        } catch (ApiException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }

        if (!empty($response['success'])) {
            update_option($this->licenseOptionName, [
                'key'   => $licenseKey,
                'email' => $email,
            ]);
            update_option($this->licenseStatusOptionName, $response);
        }

        return $response;
    }

    /**
     * Ping the API to confirm the stored license is still valid.
     */
    public function ping(): array
    {
        $license = get_option($this->licenseOptionName);
        if (empty($license['key'])) {
            return ['success' => false, 'message' => __('No license found.', 'jankx')];
        }

        try {
            return $this->sdk->license()->ping($license['key']);
        } catch (ApiException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Check for an available theme update.
     */
    public function getLatestVersion(): array
    {
        $license = get_option($this->licenseOptionName, []);
        $version = wp_get_theme()->get('Version');

        try {
            return $this->sdk->license()->checkUpdates($license['key'] ?? '', $version);
        } catch (ApiException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Remove all activation data (local deactivation).
     */
    public function deactivate(): bool
    {
        $license = get_option($this->licenseOptionName);

        if (!empty($license['key'])) {
            try {
                $this->sdk->license()->deactivate($license['key']);
            } catch (ApiException) {
                // Best-effort remote deactivation; always clear local data.
            }
        }

        delete_option($this->licenseOptionName);
        delete_option($this->licenseStatusOptionName);

        return true;
    }

    // ─────────────────────────────────────────────────────────────
    // Status helpers
    // ─────────────────────────────────────────────────────────────

    public function isLicensed(): bool
    {
        $status = get_option($this->licenseStatusOptionName);
        return (bool)($status['success'] ?? false);
    }

    public function isActivated(): bool
    {
        return $this->isLicensed();
    }

    public function canUpdate(): bool
    {
        $status = get_option($this->licenseStatusOptionName);
        return (bool)($status['can_update'] ?? false);
    }

    public function getLicenseData(): array
    {
        $status  = (array)(get_option($this->licenseStatusOptionName) ?: []);
        $license = (array)(get_option($this->licenseOptionName) ?: []);
        return array_merge($status, $license);
    }

    public function getLicensedProducts(): array
    {
        $status = get_option($this->licenseStatusOptionName);
        return $status['licensed_products'] ?? [];
    }
}
