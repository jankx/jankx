<?php

/**
 * Extension Manager for Jankx Theme Framework
 *
 * @package Jankx\Framework\Extensions
 */

namespace Jankx\Extensions;

use Jankx\Contracts\ExtensionManager as ExtensionManagerContract;
use Jankx\Contracts\Extension;

class ExtensionManager implements ExtensionManagerContract
{
    private static $instance = null;
    private $extensions = [];
    private $active_extensions = [];
    private $extension_ids = [];

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
     * Initialize extension manager
     */
    private function init()
    {
        add_action('init', [$this, 'load_extensions']);
        add_action('jankx/gutenberg/register-blocks', [$this, 'register_extension_blocks']);
    }

    /**
     * Load all extensions
     */
    public function load_extensions()
    {
        // Load extensions from parent theme
        $this->load_extensions_from_directory(get_template_directory() . '/includes/extensions');

        // Load extensions from child theme (if exists)
        if (is_child_theme()) {
            $this->load_extensions_from_directory(get_stylesheet_directory() . '/includes/extensions');
        }
    }

    /**
     * Load extensions from specific directory
     */
    public function load_extensions_from_directory(string $extensionsDir): void
    {
        if (!is_dir($extensionsDir)) {
            return;
        }

        $extension_dirs = glob($extensionsDir . '/*', GLOB_ONLYDIR);
        foreach ($extension_dirs as $extension_dir) {
            $extension_name = basename($extension_dir);
            $manifest_file = $extension_dir . '/manifest.json';

            // Only load extensions that have manifest.json
            if (file_exists($manifest_file)) {
                $this->load_extension_from_manifest($extension_name, $manifest_file, $extensionsDir);
            }
        }
    }

    /**
     * Load a specific extension from manifest
     */
    public function load_extension_from_manifest(string $extensionName, string $manifestFile, string $extensionsDir): bool
    {
        // Load and parse manifest
        $manifest_data = json_decode(file_get_contents($manifestFile), true);
        if (!$manifest_data || !isset($manifest_data['caller'])) {
            return false;
        }

        // Check for extension_id to prevent duplicates
        $extension_id = $manifest_data['extension_id'] ?? $extensionName;

        // If extension with this ID already exists, skip loading
        if (isset($this->extension_ids[$extension_id])) {
            error_log("Extension with ID '{$extension_id}' already loaded from '{$this->extension_ids[$extension_id]}', skipping '{$extensionName}' from '{$extensionsDir}'");
            return false;
        }

        $caller = $manifest_data['caller'];
        $extension_dir = dirname($manifestFile);

        // Determine if this is a child theme extension
        $is_child_theme_extension = strpos($extensionsDir, get_stylesheet_directory()) === 0;

        // Load the caller file
        $caller_file = $extension_dir . '/' . $caller['file'];
        if (!file_exists($caller_file)) {
            error_log("Extension caller file not found: {$caller_file}");
            return false;
        }

        require_once $caller_file;

        // Get the class name from manifest
        $class_name = $caller['class'];

        // Adjust namespace for child theme extensions
        if ($is_child_theme_extension) {
            $class_name = str_replace('Jankx\\Extensions', 'Jankx\\Child\\Extensions', $class_name);
        }

        if (class_exists($class_name)) {
            $extension = new $class_name();
            if ($extension instanceof Extension) {
                // Set extension path and URL
                $extension->set_extension_path($extension_dir);
                $extension->set_extension_url($this->get_extension_url($extension_dir));

                // Store extension
                $this->extensions[$extensionName] = $extension;
                $this->extension_ids[$extension_id] = $extension_dir;

                // Auto-activate if specified in manifest
                if (isset($manifest_data['auto_activate']) && $manifest_data['auto_activate']) {
                    $this->activate_extension($extensionName);
                }

                do_action('jankx/extension/loaded', $extensionName, $extension);
                return true;
            }
        }

        return false;
    }

    /**
     * Get extension URL
     */
    public function get_extension_url(string $extensionPath): string
    {
        $extensionName = basename($extensionPath);
        $parentPath = get_template_directory() . '/includes/extensions/' . $extensionName;
        $childPath = get_stylesheet_directory() . '/includes/extensions/' . $extensionName;

        if (is_child_theme() && is_dir($childPath)) {
            return get_stylesheet_directory_uri() . '/includes/extensions/' . $extensionName;
        }

        return get_template_directory_uri() . '/includes/extensions/' . $extensionName;
    }

    /**
     * Register blocks from all extensions
     */
    public function register_extension_blocks($blocks)
    {
        foreach ($this->active_extensions as $extension) {
            if (method_exists($extension, 'register_gutenberg_blocks')) {
                $blocks = $extension->register_gutenberg_blocks($blocks);
            }
        }

        return $blocks;
    }

    /**
     * Get all extensions
     */
    public function get_extensions(): array
    {
        return $this->extensions;
    }

    /**
     * Get active extensions
     */
    public function get_active_extensions(): array
    {
        return $this->active_extensions;
    }

    /**
     * Get inactive extensions
     */
    public function get_inactive_extensions(): array
    {
        return array_diff_key($this->extensions, $this->active_extensions);
    }

    /**
     * Get a specific extension
     */
    public function get_extension(string $name): ?Extension
    {
        return $this->extensions[$name] ?? null;
    }

    /**
     * Get extension by ID
     */
    public function get_extension_by_id(string $extensionId): ?Extension
    {
        if (!isset($this->extension_ids[$extensionId])) {
            return null;
        }

        $extensionPath = $this->extension_ids[$extensionId];
        $extensionName = basename($extensionPath);

        return $this->get_extension($extensionName);
    }

    /**
     * Check if extension exists
     */
    public function has_extension(string $name): bool
    {
        return isset($this->extensions[$name]);
    }

    /**
     * Check if extension ID exists
     */
    public function has_extension_id(string $extensionId): bool
    {
        return isset($this->extension_ids[$extensionId]);
    }

    /**
     * Check if extension is active
     */
    public function is_extension_active(string $extension_name): bool
    {
        return isset($this->active_extensions[$extension_name]);
    }

    /**
     * Activate a extension
     */
    public function activate_extension(string $name): bool
    {
        if (isset($this->extensions[$name])) {
            $extension = $this->extensions[$name];
            $extension->activate();
            $this->active_extensions[$name] = $extension;
            do_action('jankx/extension/activated', $name);
            return true;
        }

        return false;
    }

    /**
     * Deactivate a extension
     */
    public function deactivate_extension(string $name): bool
    {
        if (isset($this->active_extensions[$name])) {
            $extension = $this->active_extensions[$name];
            $extension->deactivate();
            unset($this->active_extensions[$name]);
            do_action('jankx/extension/deactivated', $name);
            return true;
        }

        return false;
    }

    /**
     * Install extension
     */
    public function install_extension(string $name): bool
    {
        if (isset($this->extensions[$name])) {
            $extension = $this->extensions[$name];
            if (method_exists($extension, 'install')) {
                return $extension->install();
            }
        }
        return false;
    }

    /**
     * Uninstall extension
     */
    public function uninstall_extension(string $name): bool
    {
        if (isset($this->extensions[$name])) {
            $extension = $this->extensions[$name];
            if (method_exists($extension, 'uninstall')) {
                return $extension->uninstall();
            }
        }
        return false;
    }

    /**
     * Get extension IDs mapping
     */
    public function get_extension_ids(): array
    {
        return $this->extension_ids;
    }

    /**
     * Get extension path by ID
     */
    public function get_extension_path_by_id(string $extensionId): ?string
    {
        return $this->extension_ids[$extensionId] ?? null;
    }

    /**
     * Get extension statistics
     */
    public function get_statistics(): array
    {
        return [
            'total' => count($this->extensions),
            'active' => count($this->active_extensions),
            'inactive' => count($this->extensions) - count($this->active_extensions),
            'unique_ids' => count($this->extension_ids),
        ];
    }

    /**
     * Validate all extensions
     */
    public function validate_extensions(): array
    {
        $errors = [];
        foreach ($this->extensions as $name => $extension) {
            if (method_exists($extension, 'validate')) {
                $validation = $extension->validate();
                if (!empty($validation)) {
                    $errors[$name] = $validation;
                }
            }
        }
        return $errors;
    }

    /**
     * Check for extension updates
     */
    public function check_updates(): array
    {
        $updates = [];
        foreach ($this->extensions as $name => $extension) {
            if (method_exists($extension, 'check_update')) {
                $update = $extension->check_update();
                if ($update) {
                    $updates[$name] = $update;
                }
            }
        }
        return $updates;
    }

    /**
     * Get available extension locations
     */
    public function get_extension_locations()
    {
        $locations = [
            'parent' => get_template_directory() . '/includes/extensions',
        ];
        if (is_child_theme()) {
            $locations['child'] = get_stylesheet_directory() . '/includes/extensions';
        }

        return $locations;
    }

    /**
     * Check if extension can be installed to child theme
     */
    public function can_install_to_child_theme()
    {
        return is_child_theme() && is_writable(get_stylesheet_directory() . '/includes');
    }

    /**
     * Install extension to child theme
     */
    public function install_extension_to_child_theme($extension_name, $source_path = null)
    {
        if (!$this->can_install_to_child_theme()) {
            return false;
        }

        $child_extensions_dir = get_stylesheet_directory() . '/includes/extensions';

        // Create extensions directory if not exists
        if (!is_dir($child_extensions_dir)) {
            wp_mkdir_p($child_extensions_dir);
        }

        // If source path is provided, copy from there
        if ($source_path && is_dir($source_path)) {
            $destination = $child_extensions_dir . '/' . $extension_name;
            return $this->copy_directory($source_path, $destination);
        }

        // If extension exists in parent theme, copy from there
        $parent_extension_path = get_template_directory() . '/includes/extensions/' . $extension_name;
        if (is_dir($parent_extension_path)) {
            $destination = $child_extensions_dir . '/' . $extension_name;
            return $this->copy_directory($parent_extension_path, $destination);
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
