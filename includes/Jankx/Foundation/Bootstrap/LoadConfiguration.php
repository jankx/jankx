<?php

namespace Jankx\Foundation\Bootstrap;

use Jankx\Foundation\Application;
use Jankx\Config\Repository;
use Jankx\Helper\Environment;

class LoadConfiguration
{
    /**
     * Bootstrap the given application.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function bootstrap(Application $app)
    {
        if (Environment::isDebugLog()) {
            error_log('[JANKX DEBUG] Loading configuration...');
        }

        $config = $app->make('config');

        // Load configuration from theme files
        $this->loadThemeConfiguration($app, $config);

        // Load configuration from database
        $this->loadDatabaseConfiguration($config);

        if (Environment::isDebugLog()) {
            error_log('[JANKX DEBUG] Configuration loaded successfully');
        }
    }

    /**
     * Load configuration from theme files.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @param  \Jankx\Config\Repository  $config
     * @return void
     */
    protected function loadThemeConfiguration(Application $app, Repository $config)
    {
        $configPath = $app->configPath();

        if (Environment::isDebugLog()) {
            error_log(sprintf('[JANKX DEBUG] Loading theme config from: %s', $configPath));
        }

        if (file_exists($configPath . '/app.php')) {
            if (Environment::isDebugLog()) {
                error_log('[JANKX DEBUG] Loading app.php configuration');
            }
            $appConfig = require $configPath . '/app.php';
            $config->set('app', $appConfig);
        }

        if (file_exists($configPath . '/providers.php')) {
            if (Environment::isDebugLog()) {
                error_log('[JANKX DEBUG] Loading providers.php configuration');
            }
            $providersConfig = require $configPath . '/providers.php';
            $config->set('providers', $providersConfig);
        }
    }

        /**
     * Load configuration from database.
     *
     * @param  \Jankx\Config\Repository  $config
     * @return void
     */
    protected function loadDatabaseConfiguration(Repository $config)
    {
        if (Environment::isDebugLog()) {
            error_log('[JANKX DEBUG] Loading database configuration...');
        }

        // Load WordPress options that are relevant to Jankx
        $jankxOptions = get_option('jankx_config', []);

        if (!empty($jankxOptions)) {
            if (Environment::isDebugLog()) {
                error_log(sprintf('[JANKX DEBUG] Loaded %d database options', count($jankxOptions)));
            }
            $config->set('database', $jankxOptions);
        } elseif (Environment::isDebugLog()) {
            error_log('[JANKX DEBUG] No database configuration found');
        }
    }
}
