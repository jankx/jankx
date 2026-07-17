<?php

namespace Jankx\Foundation\Bootstrap;

use Jankx\Foundation\Application;
use Jankx\Facades\Log;

class RegisterProviders
{
    /**
     * Bootstrap the given application.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function bootstrap(Application $app)
    {
        $config = $app->make('config');

        // Get all providers from app config
        $providers = array_merge(
            $app->getBuiltInProviders(),
            $config->get('app.providers', [])
        );

        // Load providers by context
        if ($app->has('kernel')) {
            $kernel = $app->make('kernel');
            $context = $kernel->getContext();
            $kernelProviders = $config->get("providers.{$context}", []);
            if (!empty($kernelProviders)) {
                $providers = array_merge($providers, $kernelProviders);
            }
        } else {
            // Fallback for tests or when kernel is not yet registered
            if (is_admin()) {
                $providers = array_merge($providers, $config->get('providers.http.admin', []));
            } else {
                $providers = array_merge($providers, $config->get('providers.http.frontend', []));
            }
        }

        $providers = apply_filters('jankx.foundation.providers', $providers);
        $providers = array_unique($providers);

        // Trigger event to allow other plugins to add providers
        do_action('jankx.foundation.providers.before_register', $app, $providers);

        // Register all providers
        foreach ($providers as $provider) {
            if (is_string($provider) && class_exists($provider)) {
                $app->register($provider);
            }
        }
    }
}
