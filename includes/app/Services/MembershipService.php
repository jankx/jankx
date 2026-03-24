<?php

namespace App\Services;

use Jankx\Foundation\Application;
use Jankx\Services\AbstractService;

class MembershipService extends AbstractService
{
    protected $client;
    protected $clientId = 'jankx_client';
    protected $clientSecret = 'jankx_secret';
    protected $tokenOptionName = 'jankx_membership_token';
    protected $planOptionName = 'jankx_membership_plan';

    public function __construct(Application $app, OptilarityClient $client)
    {
        parent::__construct($app);
        $this->client = $client;
        $this->name = 'membership';

        if (defined('OPTILARITY_CLIENT_ID')) {
            $this->clientId = OPTILARITY_CLIENT_ID;
        }
        if (defined('OPTILARITY_CLIENT_SECRET')) {
            $this->clientSecret = OPTILARITY_CLIENT_SECRET;
        }
    }

    protected function boot(): void
    {
        // Initial boot logic if needed
    }

    public function getAuthorizeUrl($redirectUri)
    {
        $params = [
            'client_id' => $this->clientId,
            'redirect_uri' => $redirectUri,
            'response_type' => 'code',
            'scope' => 'membership',
        ];

        return $this->client->getBaseUrl() . '/oauth/authorize?' . http_build_query($params);
    }

    public function exchangeToken($code, $redirectUri)
    {
        $response = $this->client->post('/oauth/token', [
            'grant_type' => 'authorization_code',
            'client_id' => $this->clientId,
            'client_secret' => $this->clientSecret,
            'code' => $code,
            'redirect_uri' => $redirectUri,
        ]);

        if ($response['success'] && isset($response['access_token'])) {
            update_option($this->tokenOptionName, $response['access_token']);
            return $this->checkMembership();
        }

        return $response;
    }

    public function checkMembership()
    {
        $token = get_option($this->tokenOptionName);
        if (!$token) {
            return ['success' => false, 'message' => __('No access token found.', 'jankx')];
        }

        $response = $this->client->get('/api/me/membership', [
            'Authorization' => 'Bearer ' . $token,
        ]);

        if ($response['success']) {
            update_option($this->planOptionName, $response['plan']);
        }

        return $response;
    }

    public function getPlan()
    {
        return get_option($this->planOptionName);
    }

    public function hasActiveMembership()
    {
        $plan = $this->getPlan();
        if (!$plan) {
            return false;
        }

        return isset($plan['status']) && $plan['status'] === 'active';
    }

    public function isActivated()
    {
        return $this->hasActiveMembership();
    }

    public function disconnect()
    {
        delete_option($this->tokenOptionName);
        delete_option($this->planOptionName);
        return true;
    }

    public function getPlanSlug()
    {
        $plan = $this->getPlan();
        return $plan['slug'] ?? 'free';
    }
}
