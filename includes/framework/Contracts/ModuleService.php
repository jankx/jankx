<?php

namespace Jankx\Contracts;

/**
 * Module Service Interface
 *
 * Contract cho module service trong Jankx framework
 */
interface ModuleService
{
    /**
     * Enable module
     *
     * @param string $moduleName
     * @return bool
     */
    public function enableModule(string $moduleName): bool;

    /**
     * Disable module
     *
     * @param string $moduleName
     * @return bool
     */
    public function disableModule(string $moduleName): bool;

    /**
     * Toggle module status
     *
     * @param string $moduleName
     * @return bool
     */
    public function toggleModule(string $moduleName): bool;

    /**
     * Set module filter
     *
     * @param string $moduleName
     * @param string $filter
     * @param mixed $value
     * @return bool
     */
    public function setModuleFilter(string $moduleName, string $filter, $value): bool;

    /**
     * Get module filter
     *
     * @param string $moduleName
     * @param string $filter
     * @param mixed $default
     * @return mixed
     */
    public function getModuleFilter(string $moduleName, string $filter, $default = null);

    /**
     * Get module setting
     *
     * @param string $moduleName
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function getModuleSetting(string $moduleName, string $key, $default = null);

    /**
     * Set module setting
     *
     * @param string $moduleName
     * @param string $key
     * @param mixed $value
     * @return bool
     */
    public function setModuleSetting(string $moduleName, string $key, $value): bool;

    /**
     * Get all module settings
     *
     * @param string $moduleName
     * @return array
     */
    public function getModuleSettings(string $moduleName): array;

    /**
     * Set multiple module settings
     *
     * @param string $moduleName
     * @param array $settings
     * @return bool
     */
    public function setModuleSettings(string $moduleName, array $settings): bool;

    /**
     * Delete module setting
     *
     * @param string $moduleName
     * @param string $key
     * @return bool
     */
    public function deleteModuleSetting(string $moduleName, string $key): bool;

    /**
     * Clear all module settings
     *
     * @param string $moduleName
     * @return bool
     */
    public function clearModuleSettings(string $moduleName): bool;

    /**
     * Get module statistics
     *
     * @return array
     */
    public function getStatistics(): array;

    /**
     * Get module dependencies
     *
     * @param string $moduleName
     * @return array
     */
    public function getModuleDependencies(string $moduleName): array;

    /**
     * Check module compatibility
     *
     * @param string $moduleName
     * @return bool
     */
    public function checkModuleCompatibility(string $moduleName): bool;

    /**
     * Validate module settings
     *
     * @param string $moduleName
     * @param array $settings
     * @return array
     */
    public function validateModuleSettings(string $moduleName, array $settings): array;

    /**
     * Export module settings
     *
     * @param string $moduleName
     * @return array
     */
    public function exportModuleSettings(string $moduleName): array;

    /**
     * Import module settings
     *
     * @param string $moduleName
     * @param array $settings
     * @return bool
     */
    public function importModuleSettings(string $moduleName, array $settings): bool;

    /**
     * Get module logs
     *
     * @param string $moduleName
     * @param int $limit
     * @return array
     */
    public function getModuleLogs(string $moduleName, int $limit = 100): array;

    /**
     * Clear module logs
     *
     * @param string $moduleName
     * @return bool
     */
    public function clearModuleLogs(string $moduleName): bool;
}
