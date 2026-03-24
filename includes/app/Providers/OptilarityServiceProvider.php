<?php

namespace App\Providers;

use Jankx\Support\Providers\ServiceProvider;
use Jankx\Foundation\Application;
use Optilarity\Sdk\OptilaritySdk;
use App\Services\MembershipService;
use App\Services\LicenseService;
use App\Services\TemplateService;

class OptilarityServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        // ── Register the SDK singleton ────────────────────────────────────────
        $app->singleton(OptilaritySdk::class, function () {
            $baseUrl = defined('OPTILARITY_API_URL')
                ? OPTILARITY_API_URL
                : 'https://api.optilarity.top';

            return OptilaritySdk::make($baseUrl);
        });

        // ── Register Jankx app services (all depend on the SDK) ───────────────
        $app->singleton(LicenseService::class, function ($app) {
            return new LicenseService($app, $app->make(OptilaritySdk::class));
        });

        $app->singleton(MembershipService::class, function ($app) {
            return new MembershipService($app, $app->make(OptilaritySdk::class));
        });

        $app->singleton(TemplateService::class, function ($app) {
            return new TemplateService($app, $app->make(OptilaritySdk::class));
        });

        // ── Short-name aliases ─────────────────────────────────────────────────
        $app->alias(LicenseService::class,    'license');
        $app->alias(MembershipService::class, 'membership');
        $app->alias(TemplateService::class,   'template');
        $app->alias(OptilaritySdk::class,     'optilarity.sdk');
    }

    public function boot(Application $app)
    {
        // Daily heartbeat ping
        if (!wp_next_scheduled('jankx_license_heartbeat')) {
            wp_schedule_event(time(), 'daily', 'jankx_license_heartbeat');
        }
        add_action('jankx_license_heartbeat', [$this, 'handleHeartbeat']);

        // OAuth2 callback handler
        add_action('admin_init', [$this, 'handleOAuthCallback']);
    }

    public function handleHeartbeat(): void
    {
        $this->app->make(LicenseService::class)->ping();
    }

    public function handleOAuthCallback(): void
    {
        if (
            isset($_GET['code'], $_GET['state']) &&
            $_GET['state'] === 'jankx_auth'
        ) {
            $code        = sanitize_text_field($_GET['code']);
            $redirectUri = admin_url('index.php?state=jankx_auth');

            $this->app->make(MembershipService::class)->exchangeToken($code, $redirectUri);

            wp_redirect(admin_url('admin.php?page=jankx-membership&membership=success'));
            exit;
        }
    }
}
