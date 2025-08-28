<?php

/**
 * Base Module Class for Jankx Theme Framework
 *
 * @package Jankx\Framework\Modules
 */

namespace Jankx\Modules;

use Jankx\Facades\App;

abstract class Module implements \Jankx\Contracts\Module
{
    protected $name;
    protected $version;
    protected $description;
    protected $author;
    protected $module_path;
    protected $module_url;
    protected $is_active = true;
    protected $is_child_theme_module = false;
    protected $manifest_data = [];
    public function __construct()
    {
        $this->init();
        $this->register_hooks();
    }

    /**
     * Initialize the module
     */
    abstract public function init(): void;
    /**
     * Register WordPress hooks
     */
    abstract public function register_hooks(): void;
    /**
     * Get module information
     */
    public function get_info(): array
    {
        return [
            'name' => $this->name,
            'version' => $this->version,
            'description' => $this->description,
            'author' => $this->author,
            'path' => $this->module_path,
            'url' => $this->module_url,
            'active' => $this->is_active,
            'is_child_theme_module' => $this->is_child_theme_module,
        ];
    }

    /**
     * Check if module is active
     */
    public function is_active(): bool
    {
        return $this->is_active;
    }

    /**
     * Activate module
     */
    public function activate(): bool
    {
        $this->is_active = true;
        do_action('jankx/module/activated', $this->name);
        return true;
    }

    /**
     * Deactivate module
     */
    public function deactivate(): bool
    {
        $this->is_active = false;
        do_action('jankx/module/deactivated', $this->name);
        return true;
    }

    /**
     * Get module assets path
     */
    protected function get_assets_path(): string
    {
        return $this->module_path . '/assets';
    }

    /**
     * Get module assets URL
     */
    protected function get_assets_url(): string
    {
        return $this->module_url . '/assets';
    }

    /**
     * Check if module is from child theme
     */
    public function is_child_theme_module(): bool
    {
        return $this->is_child_theme_module;
    }

    /**
     * Set child theme module flag
     */
    protected function set_child_theme_module($is_child = true)
    {
        $this->is_child_theme_module = $is_child;
    }

    /**
     * Set module path
     */
    public function set_module_path(string $path): void
    {
        $this->module_path = $path;
    }

    /**
     * Set module URL
     */
    public function set_module_url(string $url): void
    {
        $this->module_url = $url;
    }

    /**
     * Set manifest data
     */
    public function set_manifest_data(array $data): void
    {
        $this->manifest_data = $data;
// Update module properties from manifest
        if (isset($data['name'])) {
            $this->name = $data['name'];
        }
        if (isset($data['version'])) {
            $this->version = $data['version'];
        }
        if (isset($data['description'])) {
            $this->description = $data['description'];
        }
        if (isset($data['author'])) {
            $this->author = $data['author'];
        }
    }

    /**
     * Get manifest data
     */
    public function get_manifest_data(): ?array
    {
        return $this->manifest_data;
    }

    /**
     * Get caller configuration
     */
    public function get_caller_config()
    {
        return $this->manifest_data['caller'] ?? null;
    }

    /**
     * Get blocks configuration
     */
    public function get_blocks_config()
    {
        return $this->manifest_data['blocks'] ?? [];
    }

    /**
     * Get assets configuration
     */
    public function get_assets_config()
    {
        return $this->manifest_data['assets'] ?? [];
    }

    /**
     * Get hooks configuration
     */
    public function get_hooks_config()
    {
        return $this->manifest_data['hooks'] ?? [];
    }

    /**
     * Get user setting for this module
     */
    public function get_setting(string $key, $default = null)
    {
        $moduleService = App::make('module.service');
        $moduleName = $this->get_module_name();
        return $moduleService->getModuleSetting($moduleName, $key, $default);
    }

    /**
     * Set user setting for this module
     */
    public function set_setting(string $key, $value): void
    {
        $moduleService = App::make('module.service');
        $moduleName = $this->get_module_name();
        $moduleService->setModuleSetting($moduleName, $key, $value);
    }

    /**
     * Get all user settings for this module
     */
    public function get_settings(): array
    {
        $moduleService = App::make('module.service');
        $moduleName = $this->get_module_name();
        return $moduleService->getModuleSettings($moduleName);
    }

    /**
     * Set multiple user settings for this module
     */
    public function set_settings(array $settings): void
    {
        $moduleService = App::make('module.service');
        $moduleName = $this->get_module_name();
        $moduleService->setModuleSettings($moduleName, $settings);
    }

    /**
     * Get module name (for settings)
     */
    public function get_module_name(): string
    {
        // Try to get from manifest first
        if (isset($this->manifest_data['name'])) {
            return strtolower(str_replace(' ', '-', $this->manifest_data['name']));
        }

        // Fallback to class name
        $className = get_class($this);
        $parts = explode('\\', $className);
        $moduleName = end($parts);
// Remove "Module" suffix
        return strtolower(str_replace('Module', '', $moduleName));
    }

    /**
     * Get module blocks path
     */
    protected function get_blocks_path()
    {
        return $this->module_path . '/blocks';
    }

    /**
     * Get module blocks URL
     */
    protected function get_blocks_url()
    {
        return $this->module_url . '/blocks';
    }

    /**
     * Enqueue module assets
     */
    protected function enqueue_assets()
    {
        // Override in child classes
    }

    /**
     * Register Gutenberg blocks
     */
    protected function register_blocks()
    {
        // Override in child classes
    }

    /**
     * Get module dependencies
     */
    public function get_dependencies(): array
    {
        return [];
    }

    /**
     * Check if module dependencies are met
     */
    public function check_dependencies(): bool
    {
        $dependencies = $this->get_dependencies();
        foreach ($dependencies as $dependency) {
            if (!class_exists($dependency)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Install module
     */
    public function install(): bool
    {
        // Override in child classes if needed
        do_action('jankx/module/installed', $this->name);
        return true;
    }

    /**
     * Uninstall module
     */
    public function uninstall(): bool
    {
        // Override in child classes if needed
        do_action('jankx/module/uninstalled', $this->name);
        return true;
    }
}
