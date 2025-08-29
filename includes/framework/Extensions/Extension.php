<?php

/**
 * Base Extension Class for Jankx Theme Framework
 *
 * @package Jankx\Framework\Extensions
 */

namespace Jankx\Extensions;

use Jankx\Facades\App;

abstract class Extension implements \Jankx\Contracts\Extension
{
    protected $name;
    protected $version;
    protected $description;
    protected $author;
    protected $extension_path;
    protected $extension_url;
    protected $is_active = true;
    protected $is_child_theme_extension = false;
    protected $manifest_data = [];
    public function __construct()
    {
        $this->init();
        $this->register_hooks();
    }

    /**
     * Initialize the extension
     */
    abstract public function init(): void;
    /**
     * Register WordPress hooks
     */
    abstract public function register_hooks(): void;
    /**
     * Get extension information
     */
    public function get_info(): array
    {
        return [
            'name' => $this->name,
            'version' => $this->version,
            'description' => $this->description,
            'author' => $this->author,
            'path' => $this->extension_path,
            'url' => $this->extension_url,
            'active' => $this->is_active,
            'is_child_theme_extension' => $this->is_child_theme_extension,
        ];
    }

    /**
     * Check if extension is active
     */
    public function is_active(): bool
    {
        return $this->is_active;
    }

    /**
     * Activate extension
     */
    public function activate(): bool
    {
        $this->is_active = true;
        do_action('jankx/extension/activated', $this->name);
        return true;
    }

    /**
     * Deactivate extension
     */
    public function deactivate(): bool
    {
        $this->is_active = false;
        do_action('jankx/extension/deactivated', $this->name);
        return true;
    }

    /**
     * Get extension assets path
     */
    protected function get_assets_path(): string
    {
        return $this->extension_path . '/assets';
    }

    /**
     * Get extension assets URL
     */
    protected function get_assets_url(): string
    {
        return $this->extension_url . '/assets';
    }

    /**
     * Check if extension is from child theme
     */
    public function is_child_theme_extension(): bool
    {
        return $this->is_child_theme_extension;
    }

    /**
     * Set child theme extension flag
     */
    protected function set_child_theme_extension($is_child = true)
    {
        $this->is_child_theme_extension = $is_child;
    }

    /**
     * Set extension path
     */
    public function set_extension_path(string $path): void
    {
        $this->extension_path = $path;
    }

    /**
     * Set extension URL
     */
    public function set_extension_url(string $url): void
    {
        $this->extension_url = $url;
    }

    /**
     * Set manifest data
     */
    public function set_manifest_data(array $data): void
    {
        $this->manifest_data = $data;
// Update extension properties from manifest
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
     * Get user setting for this extension
     */
    public function get_setting(string $key, $default = null)
    {
        $extensionService = App::make('extension.service');
        $extensionName = $this->get_extension_name();
        return $extensionService->getExtensionSetting($extensionName, $key, $default);
    }

    /**
     * Set user setting for this extension
     */
    public function set_setting(string $key, $value): void
    {
        $extensionService = App::make('extension.service');
        $extensionName = $this->get_extension_name();
        $extensionService->setExtensionSetting($extensionName, $key, $value);
    }

    /**
     * Get all user settings for this extension
     */
    public function get_settings(): array
    {
        $extensionService = App::make('extension.service');
        $extensionName = $this->get_extension_name();
        return $extensionService->getExtensionSettings($extensionName);
    }

    /**
     * Set multiple user settings for this extension
     */
    public function set_settings(array $settings): void
    {
        $extensionService = App::make('extension.service');
        $extensionName = $this->get_extension_name();
        $extensionService->setExtensionSettings($extensionName, $settings);
    }

    /**
     * Get extension name (for settings)
     */
    public function get_extension_name(): string
    {
        // Try to get from manifest first
        if (isset($this->manifest_data['name'])) {
            return strtolower(str_replace(' ', '-', $this->manifest_data['name']));
        }

        // Fallback to class name
        $className = get_class($this);
        $parts = explode('\\', $className);
        $extensionName = end($parts);
// Remove "Extension" suffix
        return strtolower(str_replace('Extension', '', $extensionName));
    }

    /**
     * Get extension blocks path
     */
    protected function get_blocks_path()
    {
        return $this->extension_path . '/blocks';
    }

    /**
     * Get extension blocks URL
     */
    protected function get_blocks_url()
    {
        return $this->extension_url . '/blocks';
    }

    /**
     * Enqueue extension assets
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
     * Get extension dependencies
     */
    public function get_dependencies(): array
    {
        return [];
    }

    /**
     * Check if extension dependencies are met
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
     * Install extension
     */
    public function install(): bool
    {
        // Override in child classes if needed
        do_action('jankx/extension/installed', $this->name);
        return true;
    }

    /**
     * Uninstall extension
     */
    public function uninstall(): bool
    {
        // Override in child classes if needed
        do_action('jankx/extension/uninstalled', $this->name);
        return true;
    }
}
