<?php

/**
 * Module Manager for Jankx Theme Framework
 *
 * @package Jankx\Framework\Modules
 */

namespace Jankx\Modules;

use Jankx\Contracts\ModuleManager as ModuleManagerContract;
use Jankx\Contracts\Module;

class ModuleManager implements ModuleManagerContract
{
    private static $instance = null;
    private $modules = [];
    private $active_modules = [];
    private $module_ids = [];

    private function __construct()
    {
        $this->init();
    }

    public static function getInstance(): self
    {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Initialize module manager
     */
    private function init()
    {
        add_action('init', [$this, 'load_modules']);
        add_action('jankx/gutenberg/register-blocks', [$this, 'register_module_blocks']);
    }

    /**
     * Load all modules
     */
    public function load_modules()
    {
        // Load modules from parent theme
        $this->load_modules_from_directory(get_template_directory() . '/includes/modules');

        // Load modules from child theme (if exists)
        if (is_child_theme()) {
            $this->load_modules_from_directory(get_stylesheet_directory() . '/includes/modules');
        }
    }

    /**
     * Load modules from specific directory
     */
    public function load_modules_from_directory(string $modulesDir): void
    {
        if (!is_dir($modulesDir)) {
            return;
        }

        $module_dirs = glob($modulesDir . '/*', GLOB_ONLYDIR);
        foreach ($module_dirs as $module_dir) {
            $module_name = basename($module_dir);
            $manifest_file = $module_dir . '/manifest.json';

            // Only load modules that have manifest.json
            if (file_exists($manifest_file)) {
                $this->load_module_from_manifest($module_name, $manifest_file, $modulesDir);
            }
        }
    }

    /**
     * Load a specific module from manifest
     */
    public function load_module_from_manifest(string $moduleName, string $manifestFile, string $modulesDir): bool
    {
        // Load and parse manifest
        $manifest_data = json_decode(file_get_contents($manifestFile), true);
        if (!$manifest_data || !isset($manifest_data['caller'])) {
            return false;
        }

        // Check for module_id to prevent duplicates
        $module_id = $manifest_data['module_id'] ?? $moduleName;

        // If module with this ID already exists, skip loading
        if (isset($this->module_ids[$module_id])) {
            error_log("Module with ID '{$module_id}' already loaded from '{$this->module_ids[$module_id]}', skipping '{$moduleName}' from '{$modulesDir}'");
            return false;
        }

        $caller = $manifest_data['caller'];
        $module_dir = dirname($manifestFile);

        // Determine if this is a child theme module
        $is_child_theme_module = strpos($modulesDir, get_stylesheet_directory()) === 0;

        // Load the caller file
        $caller_file = $module_dir . '/' . $caller['file'];
        if (!file_exists($caller_file)) {
            error_log("Module caller file not found: {$caller_file}");
            return false;
        }

        require_once $caller_file;

        // Get the class name from manifest
        $class_name = $caller['class'];

        // Adjust namespace for child theme modules
        if ($is_child_theme_module) {
            $class_name = str_replace('Jankx\\Modules', 'Jankx\\Child\\Modules', $class_name);
        }

        if (class_exists($class_name)) {
            $module = new $class_name();
            if ($module instanceof Module) {
                // Set module path and URL
                $module->set_module_path($module_dir);
                $module->set_module_url($this->get_module_url($module_dir));

                // Store module
                $this->modules[$moduleName] = $module;
                $this->module_ids[$module_id] = $module_dir;

                // Auto-activate if specified in manifest
                if (isset($manifest_data['auto_activate']) && $manifest_data['auto_activate']) {
                    $this->activate_module($moduleName);
                }

                do_action('jankx/module/loaded', $moduleName, $module);
                return true;
            }
        }

        return false;
    }

    /**
     * Get module URL
     */
    public function get_module_url(string $modulePath): string
    {
        $moduleName = basename($modulePath);
        $parentPath = get_template_directory() . '/includes/modules/' . $moduleName;
        $childPath = get_stylesheet_directory() . '/includes/modules/' . $moduleName;

        if (is_child_theme() && is_dir($childPath)) {
            return get_stylesheet_directory_uri() . '/includes/modules/' . $moduleName;
        }

        return get_template_directory_uri() . '/includes/modules/' . $moduleName;
    }

    /**
     * Register blocks from all modules
     */
    public function register_module_blocks($blocks)
    {
        foreach ($this->active_modules as $module) {
            if (method_exists($module, 'register_gutenberg_blocks')) {
                $blocks = $module->register_gutenberg_blocks($blocks);
            }
        }

        return $blocks;
    }

    /**
     * Get all modules
     */
    public function get_modules(): array
    {
        return $this->modules;
    }

    /**
     * Get active modules
     */
    public function get_active_modules(): array
    {
        return $this->active_modules;
    }

    /**
     * Get inactive modules
     */
    public function get_inactive_modules(): array
    {
        return array_diff_key($this->modules, $this->active_modules);
    }

    /**
     * Get a specific module
     */
    public function get_module(string $name): ?Module
    {
        return $this->modules[$name] ?? null;
    }

    /**
     * Get module by ID
     */
    public function get_module_by_id(string $moduleId): ?Module
    {
        if (!isset($this->module_ids[$moduleId])) {
            return null;
        }

        $modulePath = $this->module_ids[$moduleId];
        $moduleName = basename($modulePath);

        return $this->get_module($moduleName);
    }

    /**
     * Check if module exists
     */
    public function has_module(string $name): bool
    {
        return isset($this->modules[$name]);
    }

    /**
     * Check if module ID exists
     */
    public function has_module_id(string $moduleId): bool
    {
        return isset($this->module_ids[$moduleId]);
    }

    /**
     * Check if module is active
     */
    public function is_module_active(string $module_name): bool
    {
        return isset($this->active_modules[$module_name]);
    }

    /**
     * Activate a module
     */
    public function activate_module(string $name): bool
    {
        if (isset($this->modules[$name])) {
            $module = $this->modules[$name];
            $module->activate();
            $this->active_modules[$name] = $module;
            do_action('jankx/module/activated', $name);
            return true;
        }

        return false;
    }

    /**
     * Deactivate a module
     */
    public function deactivate_module(string $name): bool
    {
        if (isset($this->active_modules[$name])) {
            $module = $this->active_modules[$name];
            $module->deactivate();
            unset($this->active_modules[$name]);
            do_action('jankx/module/deactivated', $name);
            return true;
        }

        return false;
    }

    /**
     * Install module
     */
    public function install_module(string $name): bool
    {
        if (isset($this->modules[$name])) {
            $module = $this->modules[$name];
            if (method_exists($module, 'install')) {
                return $module->install();
            }
        }
        return false;
    }

    /**
     * Uninstall module
     */
    public function uninstall_module(string $name): bool
    {
        if (isset($this->modules[$name])) {
            $module = $this->modules[$name];
            if (method_exists($module, 'uninstall')) {
                return $module->uninstall();
            }
        }
        return false;
    }

    /**
     * Get module IDs mapping
     */
    public function get_module_ids(): array
    {
        return $this->module_ids;
    }

    /**
     * Get module path by ID
     */
    public function get_module_path_by_id(string $moduleId): ?string
    {
        return $this->module_ids[$moduleId] ?? null;
    }

    /**
     * Get module statistics
     */
    public function get_statistics(): array
    {
        return [
            'total' => count($this->modules),
            'active' => count($this->active_modules),
            'inactive' => count($this->modules) - count($this->active_modules),
            'unique_ids' => count($this->module_ids),
        ];
    }

    /**
     * Validate all modules
     */
    public function validate_modules(): array
    {
        $errors = [];
        foreach ($this->modules as $name => $module) {
            if (method_exists($module, 'validate')) {
                $validation = $module->validate();
                if (!empty($validation)) {
                    $errors[$name] = $validation;
                }
            }
        }
        return $errors;
    }

    /**
     * Check for module updates
     */
    public function check_updates(): array
    {
        $updates = [];
        foreach ($this->modules as $name => $module) {
            if (method_exists($module, 'check_update')) {
                $update = $module->check_update();
                if ($update) {
                    $updates[$name] = $update;
                }
            }
        }
        return $updates;
    }

    /**
     * Get available module locations
     */
    public function get_module_locations()
    {
        $locations = [
            'parent' => get_template_directory() . '/includes/modules',
        ];
        if (is_child_theme()) {
            $locations['child'] = get_stylesheet_directory() . '/includes/modules';
        }

        return $locations;
    }

    /**
     * Check if module can be installed to child theme
     */
    public function can_install_to_child_theme()
    {
        return is_child_theme() && is_writable(get_stylesheet_directory() . '/includes');
    }

    /**
     * Install module to child theme
     */
    public function install_module_to_child_theme($module_name, $source_path = null)
    {
        if (!$this->can_install_to_child_theme()) {
            return false;
        }

        $child_modules_dir = get_stylesheet_directory() . '/includes/modules';

        // Create modules directory if not exists
        if (!is_dir($child_modules_dir)) {
            wp_mkdir_p($child_modules_dir);
        }

        // If source path is provided, copy from there
        if ($source_path && is_dir($source_path)) {
            $destination = $child_modules_dir . '/' . $module_name;
            return $this->copy_directory($source_path, $destination);
        }

        // If module exists in parent theme, copy from there
        $parent_module_path = get_template_directory() . '/includes/modules/' . $module_name;
        if (is_dir($parent_module_path)) {
            $destination = $child_modules_dir . '/' . $module_name;
            return $this->copy_directory($parent_module_path, $destination);
        }

        return false;
    }

    /**
     * Copy directory recursively
     */
    private function copy_directory($source, $destination)
    {
        if (!is_dir($source)) {
            return false;
        }

        if (!is_dir($destination)) {
            wp_mkdir_p($destination);
        }

        $files = scandir($source);
        foreach ($files as $file) {
            if ($file === '.' || $file === '..') {
                continue;
            }

            $source_path = $source . '/' . $file;
            $dest_path = $destination . '/' . $file;

            if (is_dir($source_path)) {
                if (!$this->copy_directory($source_path, $dest_path)) {
                    return false;
                }
            } else {
                if (!copy($source_path, $dest_path)) {
                    return false;
                }
            }
        }

        return true;
    }
}
