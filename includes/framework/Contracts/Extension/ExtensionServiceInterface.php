<?php

namespace Jankx\Contracts\Extension;

/**
 * Extension Service Interface
 *
 * Contract cho extension service trong Jankx framework
 */
interface ExtensionServiceInterface
{
    /**
     * Enable extension
     *
     * @param string $extensionName
     * @return bool
     */
    public function enableExtension(string $extensionName): bool;

    /**
     * Disable extension
     *
     * @param string $extensionName
     * @return bool
     */
    public function disableExtension(string $extensionName): bool;

    /**
     * Toggle extension status
     *
     * @param string $extensionName
     * @return bool
     */
    public function toggleExtension(string $extensionName): bool;

    /**
     * Set extension filter
     *
     * @param string $extensionName
     * @param string $filter
     * @param mixed $value
     * @return bool
     */
    public function setExtensionFilter(string $extensionName, string $filter, $value): bool;

    /**
     * Get extension filter
     *
     * @param string $extensionName
     * @param string $filter
     * @param mixed $default
     * @return mixed
     */
    public function getExtensionFilter(string $extensionName, string $filter, $default = null);

    /**
     * Get extension setting
     *
     * @param string $extensionName
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function getExtensionSetting(string $extensionName, string $key, $default = null);

    /**
     * Set extension setting
     *
     * @param string $extensionName
     * @param string $key
     * @param mixed $value
     * @return bool
     */
    public function setExtensionSetting(string $extensionName, string $key, $value): bool;

    /**
     * Get all extension settings
     *
     * @param string $extensionName
     * @return array
     */
    public function getExtensionSettings(string $extensionName): array;

    /**
     * Set multiple extension settings
     *
     * @param string $extensionName
     * @param array $settings
     * @return bool
     */
    public function setExtensionSettings(string $extensionName, array $settings): bool;

    /**
     * Delete extension setting
     *
     * @param string $extensionName
     * @param string $key
     * @return bool
     */
    public function deleteExtensionSetting(string $extensionName, string $key): bool;

    /**
     * Clear all extension settings
     *
     * @param string $extensionName
     * @return bool
     */
    public function clearExtensionSettings(string $extensionName): bool;

    /**
     * Get extension statistics
     *
     * @return array
     */
    public function getStatistics(): array;

    /**
     * Get extension dependencies
     *
     * @param string $extensionName
     * @return array
     */
    public function getExtensionDependencies(string $extensionName): array;

    /**
     * Check extension compatibility
     *
     * @param string $extensionName
     * @return bool
     */
    public function checkExtensionCompatibility(string $extensionName): bool;

    /**
     * Validate extension settings
     *
     * @param string $extensionName
     * @param array $settings
     * @return array
     */
    public function validateExtensionSettings(string $extensionName, array $settings): array;

    /**
     * Export extension settings
     *
     * @param string $extensionName
     * @return array
     */
    public function exportExtensionSettings(string $extensionName): array;

    /**
     * Import extension settings
     *
     * @param string $extensionName
     * @param array $settings
     * @return bool
     */
    public function importExtensionSettings(string $extensionName, array $settings): bool;

    /**
     * Get extension logs
     *
     * @param string $extensionName
     * @param int $limit
     * @return array
     */
    public function getExtensionLogs(string $extensionName, int $limit = 100): array;

    /**
     * Clear extension logs
     *
     * @param string $extensionName
     * @return bool
     */
    public function clearExtensionLogs(string $extensionName): bool;
}
