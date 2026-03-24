<?php

namespace App\Services;

use Jankx\Foundation\Application;
use Jankx\Services\AbstractService;

class TemplateService extends AbstractService
{
    protected $client;
    protected $membership;
    protected $license;

    public function __construct(Application $app, OptilarityClient $client, MembershipService $membership, LicenseService $license)
    {
        parent::__construct($app);
        $this->client = $client;
        $this->membership = $membership;
        $this->license = $license;
        $this->name = 'template';
    }

    protected function boot(): void
    {
        // Initialization if needed
    }

    public function searchTemplates($query = [])
    {
        return $this->client->get('/api/templates/search?' . http_build_query($query));
    }

    public function getTemplateAssets($templateId)
    {
        $headers = [];
        
        // Priority 1: Membership Bearer Token
        $token = get_option('jankx_membership_token');
        if ($token) {
            $headers['Authorization'] = 'Bearer ' . $token;
        } else {
            // Priority 2: License Key
            $license = get_option('jankx_license');
            if ($license && isset($license['key'])) {
                $headers['X-License-Key'] = $license['key'];
            }
        }

        if (empty($headers)) {
            return [
                'success' => false,
                'message' => __('No active membership or license found.', 'jankx'),
            ];
        }

        return $this->client->get("/api/templates/{$templateId}/assets", $headers);
    }
}
