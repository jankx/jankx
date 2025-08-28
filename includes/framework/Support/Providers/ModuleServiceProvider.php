<?php

namespace Jankx\Support\Providers;

use Jankx\Modules\ModuleService;
use Jankx\Modules\ModuleManager;
use Jankx\Modules\ModuleManifest;
use Jankx\Modules\Module;

class ModuleServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param \Jankx\Foundation\Application $app
     * @return void
     */
    public function register(\Jankx\Foundation\Application $app)
    {
        // Register module system services
        $this->registerModuleServices();
    }

    /**
     * Bootstrap any application services.
     *
     * @param \Jankx\Foundation\Application $app
     * @return void
     */
    public function boot(\Jankx\Foundation\Application $app)
    {
        // Initialize module system
        $this->initializeModuleSystem();
    }



    /**
     * Register module system services
     */
    protected function registerModuleServices()
    {
        // Register Module Manager as singleton
        $this->app->singleton('module.manager', function ($app) {
            return ModuleManager::getInstance();
        });



        // Register Module Service
        $this->app->singleton('module.service', function ($app) {
            return new ModuleService();
        });



        $this->app->singleton('jankx_module_service', function ($app) {
            return $app->make('module.service');
        });
    }

    /**
     * Initialize module system
     */
    protected function initializeModuleSystem()
    {
        // Get module manager instance
        $moduleManager = $this->app->make('module.manager');

        // Load modules from parent theme
        $this->loadModulesFromDirectory(
            $moduleManager,
            $this->app->basePath('includes/modules')
        );

        // Load modules from child theme (if exists)
        if (is_child_theme()) {
            $this->loadModulesFromDirectory(
                $moduleManager,
                get_stylesheet_directory() . '/includes/modules'
            );
        }
    }

    /**
     * Load modules from specific directory
     */
    protected function loadModulesFromDirectory($moduleManager, $modulesDir)
    {
        if (!is_dir($modulesDir)) {
            return;
        }

        $moduleDirs = glob($modulesDir . '/*', GLOB_ONLYDIR);

        foreach ($moduleDirs as $moduleDir) {
            $moduleName = basename($moduleDir);
            $manifestFile = $moduleDir . '/manifest.json';

                    // Only load modules that have manifest.json
            if (file_exists($manifestFile)) {
                error_log("Loading module: {$moduleName} from {$modulesDir}");
                $this->loadModuleFromManifest($moduleManager, $moduleName, $manifestFile, $modulesDir);
            }
        }
    }

    /**
     * Load a specific module from manifest
     */
    protected function loadModuleFromManifest($moduleManager, $moduleName, $manifestFile, $modulesDir)
    {
        // Load and parse manifest
        $manifestData = json_decode(file_get_contents($manifestFile), true);

        if (!$manifestData || !isset($manifestData['caller'])) {
            return;
        }

        // Check for module_id to prevent duplicates
        $moduleId = $manifestData['module_id'] ?? $moduleName;

        // If module with this ID already exists, skip loading
        if ($moduleManager->has_module_id($moduleId)) {
            error_log("Module with ID '{$moduleId}' already loaded, skipping '{$moduleName}' from '{$modulesDir}'");
            return;
        }

        error_log("Loading module with ID '{$moduleId}' from '{$modulesDir}/{$moduleName}'");

        $caller = $manifestData['caller'];
        $moduleDir = dirname($manifestFile);

        // Determine if this is a child theme module
        $isChildThemeModule = strpos($modulesDir, get_stylesheet_directory()) === 0;

        // Load vendor/autoload.php if exists
        $vendorAutoload = $moduleDir . '/vendor/autoload.php';
        if (file_exists($vendorAutoload)) {
            require_once $vendorAutoload;
        }

        // Load the caller file
        $callerFile = $moduleDir . '/' . $caller['file'];

        if (!file_exists($callerFile)) {
            error_log("Module caller file not found: {$callerFile}");
            return;
        }

        require_once $callerFile;

        // Get the class name from manifest
        $className = $caller['class'];

        // Adjust namespace for child theme modules
        if ($isChildThemeModule) {
            $className = str_replace('Jankx\\Modules', 'Jankx\\Child\\Modules', $className);
        }

        if (class_exists($className)) {
            error_log("Module class found: {$className}");
            $module = new $className();

            if ($module instanceof Module) {
                error_log("Module instance created successfully: {$moduleName}");
                // Set module path and URL
                $module->set_module_path($moduleDir);
                $module->set_module_url($this->getModuleUrl($moduleDir, $isChildThemeModule));

                // Set manifest data
                $module->set_manifest_data($manifestData);

                // Call initialization method if specified
                if (isset($caller['method']) && method_exists($module, $caller['method'])) {
                    error_log("Calling module method: {$caller['method']} for module: {$moduleName}");
                    $args = $caller['args'] ?? [];
                    if (is_array($args)) {
                        call_user_func_array([$module, $caller['method']], $args);
                    } else {
                        $module->{$caller['method']}($args);
                    }
                } else {
                    error_log("Method not found or not specified: " . ($caller['method'] ?? 'none') . " for module: {$moduleName}");
                }

                // Track module ID to prevent duplicates
                $moduleManager->get_module_ids()[$moduleId] = $modulesDir . '/' . $moduleName;

                // Child theme modules override parent theme modules
                $moduleManager->get_modules()[$moduleName] = $module;

                if ($module->is_active() && $module->check_dependencies()) {
                    $moduleManager->get_active_modules()[$moduleName] = $module;
                }
            }
        }
    }

    /**
     * Get module URL
     */
    protected function getModuleUrl($moduleDir, $isChildThemeModule)
    {
        if ($isChildThemeModule) {
            return get_stylesheet_directory_uri() . '/includes/modules/' . basename($moduleDir);
        }

        return get_template_directory_uri() . '/includes/modules/' . basename($moduleDir);
    }
}
