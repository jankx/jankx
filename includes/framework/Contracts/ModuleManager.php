<?php

namespace Jankx\Contracts;

/**
 * Module Manager Interface
 *
 * Contract cho module manager trong Jankx framework
 */
interface ModuleManager
{
    /**
     * Get singleton instance
     *
     * @return static
     */
    public static function getInstance(): self;

    /**
     * Load module from manifest
     *
     * @param string $moduleName
     * @param string $manifestFile
     * @param string $modulesDir
     * @return bool
     */
    public function load_module_from_manifest(string $moduleName, string $manifestFile, string $modulesDir): bool;

    /**
     * Load modules from directory
     *
     * @param string $modulesDir
     * @return void
     */
    public function load_modules_from_directory(string $modulesDir): void;

    /**
     * Get module by name
     *
     * @param string $name
     * @return Module|null
     */
    public function get_module(string $name): ?Module;

    /**
     * Check if module exists
     *
     * @param string $name
     * @return bool
     */
    public function has_module(string $name): bool;

    /**
     * Get all modules
     *
     * @return array
     */
    public function get_modules(): array;

    /**
     * Get active modules
     *
     * @return array
     */
    public function get_active_modules(): array;

    /**
     * Get inactive modules
     *
     * @return array
     */
    public function get_inactive_modules(): array;

    /**
     * Get module by ID
     *
     * @param string $moduleId
     * @return Module|null
     */
    public function get_module_by_id(string $moduleId): ?Module;

    /**
     * Check if module ID exists
     *
     * @param string $moduleId
     * @return bool
     */
    public function has_module_id(string $moduleId): bool;

    /**
     * Get all module IDs
     *
     * @return array
     */
    public function get_module_ids(): array;

    /**
     * Get module path by ID
     *
     * @param string $moduleId
     * @return string|null
     */
    public function get_module_path_by_id(string $moduleId): ?string;

    /**
     * Get module URL
     *
     * @param string $modulePath
     * @return string
     */
    public function get_module_url(string $modulePath): string;

    /**
     * Activate module
     *
     * @param string $name
     * @return bool
     */
    public function activate_module(string $name): bool;

    /**
     * Deactivate module
     *
     * @param string $name
     * @return bool
     */
    public function deactivate_module(string $name): bool;

    /**
     * Install module
     *
     * @param string $name
     * @return bool
     */
    public function install_module(string $name): bool;

    /**
     * Uninstall module
     *
     * @param string $name
     * @return bool
     */
    public function uninstall_module(string $name): bool;

    /**
     * Get module statistics
     *
     * @return array
     */
    public function get_statistics(): array;

    /**
     * Validate all modules
     *
     * @return array
     */
    public function validate_modules(): array;

    /**
     * Check for module updates
     *
     * @return array
     */
    public function check_updates(): array;
}
