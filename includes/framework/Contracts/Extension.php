<?php

namespace Jankx\Contracts;

/**
 * Extension Interface
 *
 * Contract cho tất cả extensions trong Jankx framework
 */
interface Extension
{
    /**
     * Initialize extension
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
     * Check if extension is active
     *
     * @return bool
     */
    public function is_active(): bool;

    /**
     * Check extension dependencies
     *
     * @return bool
     */
    public function check_dependencies(): bool;

    /**
     * Get extension information
     *
     * @return array
     */
    public function get_info(): array;

    /**
     * Get extension name
     *
     * @return string
     */
    public function get_extension_name(): string;

    /**
     * Get extension path
     *
     * @return string
     */
    public function get_extension_path(): string;

    /**
     * Get extension URL
     *
     * @return string
     */
    public function get_extension_url(): string;

    /**
     * Set extension path
     *
     * @param string $path
     * @return void
     */
    public function set_extension_path(string $path): void;

    /**
     * Set extension URL
     *
     * @param string $url
     * @return void
     */
    public function set_extension_url(string $url): void;

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
     * Get extension setting
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    public function get_setting(string $key, $default = null);

    /**
     * Set extension setting
     *
     * @param string $key
     * @param mixed $value
     * @return void
     */
    public function set_setting(string $key, $value): void;

    /**
     * Get all extension settings
     *
     * @return array
     */
    public function get_settings(): array;

    /**
     * Set multiple extension settings
     *
     * @param array $settings
     * @return void
     */
    public function set_settings(array $settings): void;

    /**
     * Activate extension
     *
     * @return bool
     */
    public function activate(): bool;

    /**
     * Deactivate extension
     *
     * @return bool
     */
    public function deactivate(): bool;

    /**
     * Install extension
     *
     * @return bool
     */
    public function install(): bool;

    /**
     * Uninstall extension
     *
     * @return bool
     */
    public function uninstall(): bool;

    /**
     * Get extension version
     *
     * @return string
     */
    public function get_version(): string;

    /**
     * Check if extension has update
     *
     * @return bool
     */
    public function has_update(): bool;

    /**
     * Get extension dependencies
     *
     * @return array
     */
    public function get_dependencies(): array;

    /**
     * Get extension requirements
     *
     * @return array
     */
    public function get_requirements(): array;

    /**
     * Validate extension
     *
     * @return bool
     */
    public function validate(): bool;
}
