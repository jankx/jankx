<?php

namespace Jankx\Bootstrappers\Global;

use Jankx\Contracts\BootstrapperInterface;
use Jankx\Facades\Config;
use Jankx\Facades\Logger;
use Jankx\Jankx;
use Jankx\Kernel\KernelManager;

/**
 * Config Bootstrapper
 *
 * Loads configuration files and fills Config Repository
 *
 * @package Jankx\Bootstrappers\Global
 */
class ConfigBootstrapper implements BootstrapperInterface
{
    /**
     * Bootstrap the application
     */
    public function bootstrap(\Illuminate\Container\Container $container): void
    {
        // Create repository instance
        $repository = new \Jankx\Config\Repository();
        $repository->loadFromBootstrapper();

        // Load configuration files
        $this->loadConfigurationFiles($repository);

        // Set current context to Repository (directly)
        $this->setCurrentContext($repository);

        Config::setContainer($container);

        // Register in container (after fill data)
        $container->instance(\Jankx\Config\Repository::class, $repository);
        $container->singleton(
            \Jankx\Contracts\ConfigRepositoryInterface::class,
            \Jankx\Config\Repository::class
        );
    }

    /**
     * Check if bootstrapper should run
     */
    public function shouldRun(): bool
    {
        return true; // Always run
    }

    /**
     * Load all configuration files
     */
    protected function loadConfigurationFiles($repository): void
    {
        $configPath = $this->getConfigPath();

        if (!is_dir($configPath)) {
            Logger::warning("Config directory not found: {$configPath}");
            return;
        }

        $configFiles = $this->getConfigFiles($configPath);

        foreach ($configFiles as $file) {
            $this->loadConfigFile($file, $repository);
        }
    }

    /**
     * Get config directory path
     */
    protected function getConfigPath(): string
    {
        // Check for environment variable
        $envConfigPath = getenv('JANKX_CONFIG_PATH');
        if ($envConfigPath && is_dir($envConfigPath)) {
            return $envConfigPath;
        }

        // Use theme config directory
        $themeDir = defined('JANKX_ABSPATH') ? JANKX_ABSPATH : get_template_directory();
        return $themeDir . '/config';
    }

    /**
     * Get list of config files
     */
    protected function getConfigFiles(string $configPath): array
    {
        $files = [];
        $pattern = $configPath . '/*.php';

        foreach (glob($pattern) as $file) {
            $filename = basename($file, '.php');
            $files[$filename] = $file;
        }

        return $files;
    }

    /**
     * Load individual config file
     */
    protected function loadConfigFile(string $file, $repository): void
    {
        try {
            if (!file_exists($file)) {
                Logger::warning("Config file not found: {$file}");
                return;
            }

            $config = require $file;

            if (!is_array($config)) {
                Logger::warning("Config file must return array: {$file}");
                return;
            }

            $filename = basename($file, '.php');
            $repository->set($filename, $config);

            Logger::info("Loaded config file: {$filename}");
        } catch (\Exception $e) {
            Logger::error("Error loading config file {$file}: " . $e->getMessage());
        }
    }

    /**
     * Get bootstrapper priority
     */
    public function getPriority(): int
    {
        return 1; // Highest priority to load config first
    }

    /**
     * Set current context to Repository (directly)
     */
    protected function setCurrentContext($repository): void
    {
        $kernelManager = Jankx::getInstance()->get(KernelManager::class);
        $context = $kernelManager->getCurrentContext();
        $repository->set('context', $context);
        Logger::info("Set current context: {$context}");
    }

    /**
     * Get bootstrapper dependencies
     */
    public function getDependencies(): array
    {
        return []; // No dependencies
    }
}
