<?php

namespace App\Providers;

use Jankx\Support\Providers\ServiceProvider;
use App\Services\OptilarityClient;
use App\Services\MembershipService;
use App\Services\LicenseService;
use App\Services\TemplateService;
use Jankx\Foundation\Application;

class OptilarityServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        $app->singleton(OptilarityClient::class, function ($app) {
            return new OptilarityClient($app);
        });

        $app->singleton(MembershipService::class, function ($app) {
            return new MembershipService($app, $app->make(OptilarityClient::class));
        });

        $app->singleton(LicenseService::class, function ($app) {
            return new LicenseService($app, $app->make(OptilarityClient::class));
        });

        $app->singleton(TemplateService::class, function ($app) {
            return new TemplateService(
                $app,
                $app->make(OptilarityClient::class),
                $app->make(MembershipService::class),
                $app->make(LicenseService::class)
            );
        });

        // Register shortcuts if needed
        $app->alias(MembershipService::class, 'membership');
        $app->alias(LicenseService::class, 'license');
        $app->alias(TemplateService::class, 'template');
    }

    public function boot(Application $app)
    {
        // Add daily cron for heartbeat ping
        if (!wp_next_scheduled('jankx_license_heartbeat')) {
            wp_schedule_event(time(), 'daily', 'jankx_license_heartbeat');
        }

        add_action('jankx_license_heartbeat', [$this, 'handleHeartbeat']);

        // Handle OAuth Callback from Optilarity
        add_action('admin_init', [$this, 'handleOAuthCallback']);
    }

    public function handleHeartbeat()
    {
        $licenseService = $this->app->make(LicenseService::class);
        $licenseService->ping();
    }

    public function handleOAuthCallback()
    {
        if (isset($_GET['code']) && isset($_GET['state']) && $_GET['state'] === 'jankx_auth') {
            $code = sanitize_text_field($_GET['code']);
            $membershipService = $this->app->make(MembershipService::class);
            $redirectUri = admin_url('index.php?page=jankx-membership&status=oauth-return');
            $membershipService->exchangeToken($code, $redirectUri);

            wp_redirect(admin_url('admin.php?page=jankx-membership&membership=success'));
            exit;
        }
    }
}
