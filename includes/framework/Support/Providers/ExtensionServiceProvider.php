<?php

namespace Jankx\Support\Providers;

use Jankx\Extensions\ExtensionService;
use Jankx\Extensions\ExtensionManager;
use Jankx\Extensions\ExtensionManifest;
use Jankx\Extensions\Extension;

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

        // Load extensions from parent theme
        $this->loadExtensionsFromDirectory(
            $extensionManager,
            $this->app->basePath('includes/extensions')
        );

        // Load extensions from child theme (if exists)
        if (is_child_theme()) {
            $this->loadExtensionsFromDirectory(
                $extensionManager,
                get_stylesheet_directory() . '/includes/extensions'
            );
        }
    }

    /**
     * Load extensions from specific directory
     */
    protected function loadExtensionsFromDirectory($extensionManager, $extensionsDir)
    {
        if (!is_dir($extensionsDir)) {
            return;
        }

        $extensionDirs = glob($extensionsDir . '/*', GLOB_ONLYDIR);

        foreach ($extensionDirs as $extensionDir) {
            $extensionName = basename($extensionDir);
            $manifestFile = $extensionDir . '/manifest.json';

                    // Only load extensions that have manifest.json
            if (file_exists($manifestFile)) {
                error_log("Loading extension: {$extensionName} from {$extensionsDir}");
                $this->loadExtensionFromManifest($extensionManager, $extensionName, $manifestFile, $extensionsDir);
            }
        }
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
            error_log("Extension with ID '{$extensionId}' already loaded, skipping '{$extensionName}' from '{$extensionsDir}'");
            return;
        }

        error_log("Loading extension with ID '{$extensionId}' from '{$extensionsDir}/{$extensionName}'");

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
            error_log("Extension caller file not found: {$callerFile}");
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
            error_log("Extension class found: {$className}");
            $extension = new $className();

            if ($extension instanceof Extension) {
                error_log("Extension instance created successfully: {$extensionName}");
                // Set extension path and URL
                $extension->set_extension_path($extensionDir);
                $extension->set_extension_url($this->getExtensionUrl($extensionDir, $isChildThemeExtension));

                // Set manifest data
                $extension->set_manifest_data($manifestData);

                // Call initialization method if specified
                if (isset($caller['method']) && method_exists($extension, $caller['method'])) {
                    error_log("Calling extension method: {$caller['method']} for extension: {$extensionName}");
                    $args = $caller['args'] ?? [];
                    if (is_array($args)) {
                        call_user_func_array([$extension, $caller['method']], $args);
                    } else {
                        $extension->{$caller['method']}($args);
                    }
                } else {
                    error_log("Method not found or not specified: " . ($caller['method'] ?? 'none') . " for extension: {$extensionName}");
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
