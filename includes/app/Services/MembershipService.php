<?php

namespace App\Services;

use Jankx\Foundation\Application;
use Jankx\Services\AbstractService;
use Optilarity\Sdk\OptilaritySdk;
use Optilarity\Sdk\Exceptions\ApiException;

/**
 * Jankx Membership Service
 *
 * Thin wrapper around OptilaritySdk::membership().
 * Responsible only for persisting OAuth2 tokens/plan to WordPress options.
 */
class MembershipService extends AbstractService
{
    protected OptilaritySdk $sdk;

    protected string $clientId     = 'jankx_client';
    protected string $clientSecret = 'jankx_secret';

    protected string $tokenOptionName = 'jankx_membership_token';
    protected string $planOptionName  = 'jankx_membership_plan';

    public function __construct(Application $app, OptilaritySdk $sdk)
    {
        parent::__construct($app);
        $this->sdk  = $sdk;
        $this->name = 'membership';

        if (defined('OPTILARITY_CLIENT_ID')) {
            $this->clientId = OPTILARITY_CLIENT_ID;
        }
        if (defined('OPTILARITY_CLIENT_SECRET')) {
            $this->clientSecret = OPTILARITY_CLIENT_SECRET;
        }
    }

    protected function boot(): void {}

    // ─────────────────────────────────────────────────────────────
    // OAuth2 flow
    // ─────────────────────────────────────────────────────────────

    /**
     * Build the authorization URL to redirect the user to Optilarity.
     */
    public function getAuthorizeUrl(string $redirectUri): string
    {
        return $this->sdk->membership()->authorizeUrl(
            $this->clientId,
            $redirectUri,
            ['membership:read']
        );
    }

    /**
     * Exchange an authorization code for an access token, then fetch the plan.
     */
    public function exchangeToken(string $code, string $redirectUri): array
    {
        try {
            $response = $this->sdk->membership()->exchangeCode(
                $this->clientId,
                $this->clientSecret,
                $code,
                $redirectUri
            );
        } catch (ApiException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }

        if (!empty($response['access_token'])) {
            update_option($this->tokenOptionName, $response['access_token']);
            return $this->checkMembership();
        }

        return ['success' => false, 'message' => __('Token exchange failed.', 'jankx')];
    }

    /**
     * Fetch the current membership plan and persist it locally.
     */
    public function checkMembership(): array
    {
        $token = get_option($this->tokenOptionName);
        if (!$token) {
            return ['success' => false, 'message' => __('No access token found.', 'jankx')];
        }

        try {
            $response = $this->sdk->membership()->plan($token);
        } catch (ApiException $e) {
            return ['success' => false, 'message' => $e->getMessage()];
        }

        if (!empty($response['success']) && isset($response['plan'])) {
            update_option($this->planOptionName, $response['plan']);
        }

        return $response;
    }

    // ─────────────────────────────────────────────────────────────
    // Status helpers
    // ─────────────────────────────────────────────────────────────

    public function getPlan(): ?array
    {
        return get_option($this->planOptionName) ?: null;
    }

    public function getPlanSlug(): string
    {
        return $this->getPlan()['slug'] ?? 'free';
    }

    public function hasActiveMembership(): bool
    {
        $plan = $this->getPlan();
        return $plan && ($plan['status'] ?? '') === 'active';
    }

    public function isActivated(): bool
    {
        return $this->hasActiveMembership();
    }

    /**
     * Revoke token remotely, then clear local options.
     */
    public function disconnect(): bool
    {
        $token = get_option($this->tokenOptionName);
        if ($token) {
            try {
                $this->sdk->membership()->revoke($this->clientId, $this->clientSecret, $token);
            } catch (ApiException) {
                // Best-effort remote revoke; always clear locally.
            }
        }

        delete_option($this->tokenOptionName);
        delete_option($this->planOptionName);

        return true;
    }
}
