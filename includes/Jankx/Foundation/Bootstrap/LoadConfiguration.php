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
            error_log(sprintf('[JANKX DEBUG] app.php exists: %s', file_exists($configPath . '/app.php') ? 'yes' : 'no'));
        }

        // Load all config files
        $configFiles = [
            'app.php',
            'providers.php',
            'error.php',
            'layout.php'
        ];

        foreach ($configFiles as $configFile) {
            $filePath = $configPath . '/' . $configFile;

            if (file_exists($filePath)) {
                if (Environment::isDebugLog()) {
                    error_log(sprintf('[JANKX DEBUG] Loading %s configuration', $configFile));
                }

                $configData = require $filePath;
                $configKey = str_replace('.php', '', $configFile);
                $config->set($configKey, $configData);

                if (Environment::isDebugLog()) {
                    error_log(sprintf('[JANKX DEBUG] %s loaded with keys: %s', $configFile, implode(', ', array_keys($configData))));
                }
            } else {
                if (Environment::isDebugLog()) {
                    error_log(sprintf('[JANKX DEBUG] %s not found at: %s', $configFile, $filePath));
                }
            }
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
