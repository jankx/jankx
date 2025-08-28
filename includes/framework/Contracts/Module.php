<?php

namespace Jankx\Contracts;

/**
 * Module Interface
 *
 * Contract cho tất cả modules trong Jankx framework
 */
interface Module
{
    /**
     * Initialize module
     *
     * @return void
     */
    public function init(): void;

    /**
     * Register WordPress hooks
     *
     * @return void
     */
    public function register_hooks(): void;

    /**
     * Check if module is active
     *
     * @return bool
     */
    public function is_active(): bool;

    /**
     * Check module dependencies
     *
     * @return bool
     */
    public function check_dependencies(): bool;

    /**
     * Get module information
     *
     * @return array
     */
    public function get_info(): array;

    /**
     * Get module name
     *
     * @return string
     */
    public function get_module_name(): string;

    /**
     * Get module path
     *
     * @return string
     */
    public function get_module_path(): string;

    /**
     * Get module URL
     *
     * @return string
     */
    public function get_module_url(): string;

    /**
     * Set module path
     *
     * @param string $path
     * @return void
     */
    public function set_module_path(string $path): void;

    /**
     * Set module URL
     *
     * @param string $url
     * @return void
     */
    public function set_module_url(string $url): void;

    /**
     * Get manifest data
     *
     * @return array|null
     */
    public function get_manifest_data(): ?array;

    /**
     * Set manifest data
     *
     * @param array $data
     * @return void
     */
    public function set_manifest_data(array $data): void;

    /**
     * Get module setting
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function get_setting(string $key, $default = null);

    /**
     * Set module setting
     *
     * @param string $key
     * @param mixed $value
     * @return void
     */
    public function set_setting(string $key, $value): void;

    /**
     * Get all module settings
     *
     * @return array
     */
    public function get_settings(): array;

    /**
     * Set multiple module settings
     *
     * @param array $settings
     * @return void
     */
    public function set_settings(array $settings): void;

    /**
     * Activate module
     *
     * @return bool
     */
    public function activate(): bool;

    /**
     * Deactivate module
     *
     * @return bool
     */
    public function deactivate(): bool;

    /**
     * Install module
     *
     * @return bool
     */
    public function install(): bool;

    /**
     * Uninstall module
     *
     * @return bool
     */
    public function uninstall(): bool;

    /**
     * Get module version
     *
     * @return string
     */
    public function get_version(): string;

    /**
     * Check if module has update
     *
     * @return bool
     */
    public function has_update(): bool;

    /**
     * Get module dependencies
     *
     * @return array
     */
    public function get_dependencies(): array;

    /**
     * Get module requirements
     *
     * @return array
     */
    public function get_requirements(): array;

    /**
     * Validate module
     *
     * @return bool
     */
    public function validate(): bool;
}
