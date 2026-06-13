<?php

namespace App\Services;

class ProLicenseService
{
    const OPTION_KEY = 'jankx_pro_license';
    const CACHE_KEY = 'jankx_pro_license_check';
    const API_URL = 'https://jankx.com/api/license/verify';

    protected $data = null;

    public function __construct()
    {
        $this->data = \get_option(self::OPTION_KEY, []);
    }

    public function verify(string $licenseKey, string $email): array
    {
        $domain = \parse_url(\get_site_url(), \PHP_URL_HOST);

        $response = \wp_remote_post(self::API_URL, [
            'timeout' => 15,
            'body' => [
                'license_key' => $licenseKey,
                'email' => $email,
                'domain' => $domain,
                'site_url' => \get_site_url(),
            ],
        ]);

        if (\is_wp_error($response)) {
            return [
                'success' => false,
                'message' => \__('Could not connect to license server. Please try again later.', 'jankx'),
            ];
        }

        $status = \wp_remote_retrieve_response_code($response);
        $body = \json_decode(\wp_remote_retrieve_body($response), true);

        if ($status === 200 && !empty($body['success'])) {
            $data = [
                'key' => $licenseKey,
                'email' => $email,
                'domain' => $domain,
                'activated_at' => \current_time('mysql'),
                'status' => 'active',
                'plan' => $body['plan'] ?? 'pro-1',
                'expires_at' => $body['expires_at'] ?? null,
                'license_id' => $body['license_id'] ?? '',
            ];

            \update_option(self::OPTION_KEY, $data);
            \set_transient(self::CACHE_KEY, $data, 6 * HOUR_IN_SECONDS);
            $this->data = $data;

            return [
                'success' => true,
                'message' => \__('License activated successfully!', 'jankx'),
                'data' => $data,
            ];
        }

        $message = $body['message'] ?? \__('License key is invalid or expired.', 'jankx');

        return [
            'success' => false,
            'message' => $message,
        ];
    }

    public function deactivate(): bool
    {
        $key = $this->getLicenseKey();
        $email = $this->getEmail();

        if ($key) {
            \wp_remote_post(self::API_URL . '/deactivate', [
                'timeout' => 10,
                'body' => [
                    'license_key' => $key,
                    'email' => $email,
                    'domain' => \parse_url(\get_site_url(), \PHP_URL_HOST),
                ],
            ]);
        }

        \delete_option(self::OPTION_KEY);
        \delete_transient(self::CACHE_KEY);
        $this->data = [];

        return true;
    }

    public function isActivated(): bool
    {
        if (empty($this->data)) {
            return false;
        }

        return !empty($this->data['key']) && isset($this->data['status']) && $this->data['status'] === 'active';
    }

    public function getLicenseData(): array
    {
        return $this->data ?: [];
    }

    public function getLicenseKey(): string
    {
        return $this->data['key'] ?? '';
    }

    public function getEmail(): string
    {
        return $this->data['email'] ?? '';
    }

    public function getPlan(): string
    {
        return $this->data['plan'] ?? 'free';
    }

    public function getExpiresAt(): ?string
    {
        return $this->data['expires_at'] ?? null;
    }

    public function isExpired(): bool
    {
        if (!$this->isActivated() || !$this->getExpiresAt()) {
            return false;
        }
        return \strtotime($this->getExpiresAt()) < \time();
    }
}
