<?php

namespace App\Services;

use Jankx\Foundation\Application;
use Jankx\Services\AbstractService;
use Optilarity\Sdk\OptilaritySdk;
use Optilarity\Sdk\Exceptions\ApiException;

/**
 * Jankx Template Service
 *
 * Provides access to the Optilarity Cloud template library.
 */
class TemplateService extends AbstractService
{
    protected OptilaritySdk $sdk;

    public function __construct(Application $app, OptilaritySdk $sdk)
    {
        parent::__construct($app);
        $this->sdk  = $sdk;
        $this->name = 'template';
    }

    protected function boot(): void {}

    /**
     * Search or list templates from the catalog.
     */
    public function searchTemplates(array $query = []): array
    {
        $category = $query['category'] ?? '';
        $page     = (int)($query['page'] ?? 1);

        try {
            return $this->sdk->templates()->list($category, $page);
        } catch (ApiException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }
    }

    /**
     * Get secure asset links for a specific template.
     * Uses Membership token primarily, Falls back to License Key.
     */
    public function getTemplateAssets(string $templateId): array
    {
        $token   = get_option('jankx_membership_token');
        $license = get_option('jankx_license');

        try {
            if ($token) {
                // Primary: Download via Membership
                return $this->sdk->templates()->download($token, $templateId);
            }

            if (!empty($license['key'])) {
                // Secondary: Download via License Key (if supported by SDK/API)
                // Note: The SDK download() expects a token. For License Key fallback, 
                // we'll use the raw client with a custom header.
                return $this->sdk->client()->get("api/templates/{$templateId}/assets", [
                    'X-License-Key' => $license['key']
                ]);
            }
        } catch (ApiException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }

        return [
            'success' => false,
            'message' => __('No active membership or license found.', 'jankx'),
        ];
    }
}
