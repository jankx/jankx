<?php

namespace Jankx\Support\Providers;

use Jankx\Extensions\ExtensionService;
use Jankx\Extensions\ExtensionManager;
use Jankx\Extensions\ExtensionManifest;
use Jankx\Extensions\Extension;
use Jankx\Facades\Log;

class ExtensionServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param \Jankx\Foundation\Application $app
     * @return void
     */
    public function register(\Jankx\Foundation\Application $app)
    {
        // Register extension system services
        $this->registerExtensionServices();
    }

    /**
     * Bootstrap any application services.
     *
     * @param \Jankx\Foundation\Application $app
     * @return void
     */
    public function boot(\Jankx\Foundation\Application $app)
    {
        // Initialize extension system
        $this->initializeExtensionSystem();
    }



    /**
     * Register extension system services
     */
    protected function registerExtensionServices()
    {
        // Register Extension Manager as singleton
        $this->app->singleton('extension.manager', function ($app) {
            return ExtensionManager::getInstance();
        });



        // Register Extension Service
        $this->app->singleton('extension.service', function ($app) {
            return new ExtensionService();
        });



        $this->app->singleton('jankx_extension_service', function ($app) {
            return $app->make('extension.service');
        });
    }

    /**
     * Initialize extension system
     */
    protected function initializeExtensionSystem()
    {
        // Get extension manager instance
        $extensionManager = $this->app->make('extension.manager');

        // Check cache for extension data
        $cacheKey = 'jankx_extensions_' . ($this->isChildThemeActive() ? 'child' : 'parent');
        $cachedData = wp_cache_get($cacheKey, 'jankx_framework');

        if ($cachedData !== false && is_array($cachedData)) {
            $this->loadExtensionsFromCache($extensionManager, $cachedData);
            return;
        }

        $extensionData = [];

        // Load extensions from parent theme
        $parentExtensions = $this->findExtensionsInDirectory($this->app->basePath('/extensions'));
        $extensionData['parent'] = $parentExtensions;

        // Load extensions from child theme (if exists)
        if ($this->isChildThemeActive()) {
            $childExtensions = $this->findExtensionsInDirectory(get_stylesheet_directory() . '/extensions');
            $extensionData['child'] = $childExtensions;
        }

        // Cache the found extension data
        wp_cache_set($cacheKey, $extensionData, 'jankx_framework', 3600);

        // Process found extensions
        $this->processExtensions($extensionManager, $extensionData);
    }

    protected function findExtensionsInDirectory($extensionsDir)
    {
        if (!is_dir($extensionsDir)) {
            return [];
        }

        $extensions = [];
        $extensionDirs = glob($extensionsDir . '/*', GLOB_ONLYDIR);

        foreach ($extensionDirs as $extensionDir) {
            $manifestFile = $extensionDir . '/manifest.json';
            if (file_exists($manifestFile)) {
                $extensions[basename($extensionDir)] = [
                    'path' => $extensionDir,
                    'manifest' => $manifestFile
                ];
            }
        }
        return $extensions;
    }

    protected function processExtensions($extensionManager, $data)
    {
        // Parent extensions
        foreach ($data['parent'] ?? [] as $name => $info) {
            $this->loadExtensionFromManifest($extensionManager, $name, $info['manifest'], dirname($info['path']));
        }

        // Child extensions (overriding parent)
        foreach ($data['child'] ?? [] as $name => $info) {
            $this->loadExtensionFromManifest($extensionManager, $name, $info['manifest'], dirname($info['path']));
        }
    }

    protected function loadExtensionsFromCache($extensionManager, $data)
    {
        $this->processExtensions($extensionManager, $data);
    }


    /**
     * Load a specific extension from manifest
     */
    protected function loadExtensionFromManifest($extensionManager, $extensionName, $manifestFile, $extensionsDir)
    {
        // Load and parse manifest
        $manifestData = json_decode(file_get_contents($manifestFile), true);

        if (!$manifestData || !isset($manifestData['caller'])) {
            return;
        }

        // Check for extension_id to prevent duplicates
        $extensionId = $manifestData['extension_id'] ?? $extensionName;

        // If extension with this ID already exists, skip loading
        if ($extensionManager->has_extension_id($extensionId)) {
            return;
        }

        $caller = $manifestData['caller'];
        $extensionDir = dirname($manifestFile);

        // Determine if this is a child theme extension
        $isChildThemeExtension = strpos($extensionsDir, get_stylesheet_directory()) === 0;

        // Load vendor/autoload.php if exists
        $vendorAutoload = $extensionDir . '/vendor/autoload.php';
        if (file_exists($vendorAutoload)) {
            require_once $vendorAutoload;
        }

        // Load the caller file
        $callerFile = $extensionDir . '/' . $caller['file'];

        if (!file_exists($callerFile)) {
            return;
        }

        require_once $callerFile;

        // Get the class name from manifest
        $className = $caller['class'];

        // Adjust namespace for child theme extensions
        if ($isChildThemeExtension) {
            $className = str_replace('Jankx\\Extensions', 'Jankx\\Child\\Extensions', $className);
        }

        if (class_exists($className)) {
            $extension = new $className();

            if ($extension instanceof Extension) {
                // Set extension path and URL
                $extension->set_extension_path($extensionDir);
                $extension->set_extension_url($this->getExtensionUrl($extensionDir, $isChildThemeExtension));

                // Set manifest data
                $extension->set_manifest_data($manifestData);

                // Call initialization method if specified
                if (isset($caller['method']) && method_exists($extension, $caller['method'])) {
                    $args = $caller['args'] ?? [];
                    if (is_array($args)) {
                        call_user_func_array([$extension, $caller['method']], $args);
                    } else {
                        $extension->{$caller['method']}($args);
                    }
                }

                // Track extension ID to prevent duplicates
                $extensionManager->get_extension_ids()[$extensionId] = $extensionsDir . '/' . $extensionName;

                // Child theme extensions override parent theme extensions
                $extensionManager->get_extensions()[$extensionName] = $extension;

                if ($extension->is_active() && $extension->check_dependencies()) {
                    $extensionManager->get_active_extensions()[$extensionName] = $extension;
                }
            }
        }
    }

    /**
     * Get extension URL
     */
    protected function getExtensionUrl($extensionDir, $isChildThemeExtension)
    {
        if ($isChildThemeExtension) {
            return get_stylesheet_directory_uri() . '/includes/extensions/' . basename($extensionDir);
        }

        return get_template_directory_uri() . '/includes/extensions/' . basename($extensionDir);
    }
}
