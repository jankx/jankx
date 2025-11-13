<?php

namespace Jankx\Contracts\Extension;

/**
 * Extension Manager Interface
 *
 * Contract cho extension manager trong Jankx framework
 */
interface ExtensionManagerInterface
{
    /**
     * Get singleton instance
     *
     * @return static
     */
    public static function getInstance(): self;

    /**
     * Load extension from manifest
     *
     * @param string $extensionName
     * @param string $manifestFile
     * @param string $extensionsDir
     * @return bool
     */
    public function load_extension_from_manifest(string $extensionName, string $manifestFile, string $extensionsDir): bool;

    /**
     * Load extensions from directory
     *
     * @param string $extensionsDir
     * @return void
     */
    public function load_extensions_from_directory(string $extensionsDir): void;

    /**
     * Get extension by name
     *
     * @param string $name
     * @return Extension|null
     */
    public function get_extension(string $name): ?ExtensionInterface;

    /**
     * Check if extension exists
     *
     * @param string $name
     * @return bool
     */
    public function has_extension(string $name): bool;

    /**
     * Get all extensions
     *
     * @return array
     */
    public function get_extensions(): array;

    /**
     * Get active extensions
     *
     * @return array
     */
    public function get_active_extensions(): array;

    /**
     * Get inactive extensions
     *
     * @return array
     */
    public function get_inactive_extensions(): array;

    /**
     * Get extension by ID
     *
     * @param string $extensionId
     * @return Extension|null
     */
    public function get_extension_by_id(string $extensionId): ?ExtensionInterface;

    /**
     * Check if extension ID exists
     *
     * @param string $extensionId
     * @return bool
     */
    public function has_extension_id(string $extensionId): bool;

    /**
     * Get all extension IDs
     *
     * @return array
     */
    public function get_extension_ids(): array;

    /**
     * Get extension path by ID
     *
     * @param string $extensionId
     * @return string|null
     */
    public function get_extension_path_by_id(string $extensionId): ?string;

    /**
     * Get extension URL
     *
     * @param string $extensionPath
     * @return string
     */
    public function get_extension_url(string $extensionPath): string;

    /**
     * Activate extension
     *
     * @param string $name
     * @return bool
     */
    public function activate_extension(string $name): bool;

    /**
     * Deactivate extension
     *
     * @param string $name
     * @return bool
     */
    public function deactivate_extension(string $name): bool;

    /**
     * Install extension
     *
     * @param string $name
     * @return bool
     */
    public function install_extension(string $name): bool;

    /**
     * Uninstall extension
     *
     * @param string $name
     * @return bool
     */
    public function uninstall_extension(string $name): bool;

    /**
     * Get extension statistics
     *
     * @return array
     */
    public function get_statistics(): array;

    /**
     * Validate all extensions
     *
     * @return array
     */
    public function validate_extensions(): array;

    /**
     * Check for extension updates
     *
     * @return array
     */
    public function check_updates(): array;
}
