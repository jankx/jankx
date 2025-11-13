<?php

namespace Jankx\Features\ContentTemplates;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;
use Jankx\Features\ContentTemplates\Services\ContentTemplateService;

class ContentTemplateServiceProvider extends ServiceProvider
{
    public function register(Application $app)
    {
        $app->singleton(ContentTemplateService::class, function ($app) {
            return new ContentTemplateService();
        });
    }

    public function boot(Application $app)
    {
        $contentTemplateService = $app->make(ContentTemplateService::class);

        // Initialize the service
        $contentTemplateService->init();

        // Make service available globally
        add_action('init', function () use ($contentTemplateService) {
            $GLOBALS['jankx_content_template_service'] = $contentTemplateService;
        });
    }
}

