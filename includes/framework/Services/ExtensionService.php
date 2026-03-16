<?php

/**
 * Extension Service for Jankx Theme Framework
 *
 * @package Jankx\Extensions
 */

namespace Jankx\Services;

use Jankx\Contracts\Extension\ExtensionServiceInterface;
use Jankx\Extensions\ExtensionManager;
use Jankx\Extensions\AbstractExtension;

class ExtensionService implements ExtensionServiceInterface
{
    /**
     * @var ExtensionManager
     */
    private $extensionManager;

    /**
     * @var array
     */
    private $enabledExtensions = [];

    /**
     * @var array
     */
    private $disabledExtensions = [];

    /**
     * @var array
     */
    private $extensionFilters = [];

    /**
     * @var array
     */
    private $extensionSettings = [];

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->extensionManager = ExtensionManager::getInstance();
        $this->loadExtensionSettings();
        $this->init();
    }

         /**
      * Initialize the service
      */
    private function init()
    {
        add_action('init', [$this, 'applyExtensionFilters'], 1);
        add_action('admin_init', [$this, 'registerAdminHooks']);
        add_action('wp_ajax_jankx_toggle_extension', [$this, 'handleToggleExtension']);
        add_action('wp_ajax_jankx_delete_extension', [$this, 'handleDeleteExtension']);
        add_action('wp_ajax_jankx_get_extension_manifest', [$this, 'handleGetExtensionManifest']);
        add_action('wp_ajax_jankx_get_extension_settings', [$this, 'handleGetExtensionSettings']);
        add_action('wp_ajax_jankx_save_extension_settings', [$this, 'handleSaveExtensionSettings']);
    }

    /**
     * Load extension settings from database
     */
    private function loadExtensionSettings()
    {
        $this->enabledExtensions = get_option('jankx_enabled_extensions', []);
        $this->disabledExtensions = get_option('jankx_disabled_extensions', []);
        $this->extensionFilters = get_option('jankx_extension_filters', []);
        $this->extensionSettings = get_option('jankx_extension_settings', []);
    }

    /**
     * Apply extension filters
     */
    public function applyExtensionFilters()
    {
        $extensions = $this->extensionManager->get_extensions();

        foreach ($extensions as $extensionName => $extension) {
            // Respect the manifest-based 'enabled' flag
            $manifest = $extension->get_manifest_data();
            if (!empty($manifest)) {
                if (isset($manifest['enabled'])) {
                    $manifest['enabled'] ? $extension->activate() : $extension->deactivate();
                } else {
                    // Fallback: use auto_activate
                    $autoActivate = isset($manifest['auto_activate']) ? (bool)$manifest['auto_activate'] : false;
                    $autoActivate ? $extension->activate() : $extension->deactivate();
                }
                continue;
            }

            // No manifest: apply custom filters
            if (!$this->shouldLoadExtension($extensionName, $extension)) {
                $extension->deactivate();
                continue;
            }

            // Default: enable extension
            $extension->activate();
        }
    }

    /**
     * Check if extension should be loaded based on filters
     */
    private function shouldLoadExtension(string $extensionName, AbstractExtension $extension): bool
    {
        // Apply global filters
        $shouldLoad = apply_filters('jankx/extension/should_load', true, $extensionName, $extension);

        // Apply specific extension filters
        $shouldLoad = apply_filters("jankx/extension/{$extensionName}/should_load", $shouldLoad, $extension);

        // Check custom filters
        if (isset($this->extensionFilters[$extensionName])) {
            $filter = $this->extensionFilters[$extensionName];

            if (isset($filter['enabled']) && !$filter['enabled']) {
                return false;
            }

            if (isset($filter['conditions'])) {
                foreach ($filter['conditions'] as $condition) {
                    if (!$this->evaluateCondition($condition)) {
                        return false;
                    }
                }
            }
        }

        return $shouldLoad;
    }

    /**
     * Evaluate a condition
     */
    private function evaluateCondition(array $condition): bool
    {
        $type = $condition['type'] ?? '';
        $value = $condition['value'] ?? '';

        switch ($type) {
            case 'user_role':
                return current_user_can($value);

            case 'user_capability':
                return current_user_can($value);

            case 'is_admin':
                return is_admin() === (bool) $value;

            case 'is_frontend':
                return !is_admin() === (bool) $value;

            case 'is_ajax':
                return wp_doing_ajax() === (bool) $value;

            case 'is_rest':
                return defined('REST_REQUEST') && REST_REQUEST === (bool) $value;

            case 'post_type':
                return is_singular($value);

            case 'page_template':
                return is_page_template($value);

            case 'taxonomy':
                return is_tax($value);

            case 'plugin_active':
                return is_plugin_active($value);

            case 'theme':
                return get_template() === $value;

            case 'child_theme':
                return is_child_theme() === (bool) $value;

            case 'php_version':
                return version_compare(PHP_VERSION, $value, '>=');

            case 'wp_version':
                return version_compare(get_bloginfo('version'), $value, '>=');

            case 'custom':
                return apply_filters('jankx/extension/condition/custom', true, $condition);

            default:
                return true;
        }
    }

    /**
     * Enable a extension
     */
    public function enableExtension(string $extensionName): bool
    {
        return $this->updateAutoActivate($extensionName, true);
    }

    /**
     * Disable a extension
     */
    public function disableExtension(string $extensionName): bool
    {
        return $this->updateAutoActivate($extensionName, false);
    }

    /**
     * Toggle extension status
     */
    public function toggleExtension(string $extensionName): bool
    {
        $extension = $this->extensionManager->get_extension($extensionName);
        if (!$extension) {
            return false;
        }

        $isActive = $extension->is_active();
        return $this->updateAutoActivate($extensionName, !$isActive);
    }

    /**
     * Update auto_activate in manifest.json
     */
    protected function updateAutoActivate(string $extensionName, bool $value): bool
    {
        $extension = $this->extensionManager->get_extension($extensionName);
        $manifestPath = null;

        if ($extension) {
            $manifestPath = $extension->get_extension_path() . '/manifest.json';
        } else {
            // Extension might be disabled (not instantiated) — check disabledManifests
            try {
                $themeExtManager = \Jankx\Facades\App::make('theme_extension.manager');
                $disabledManifests = $themeExtManager->getDisabledManifests();
                if (isset($disabledManifests[$extensionName])) {
                    $manifestPath = $disabledManifests[$extensionName]['path'];
                }
            } catch (\Exception $e) {
                // ignore
            }
        }

        if (!$manifestPath || !file_exists($manifestPath)) {
            return false;
        }

        $manifest = json_decode(file_get_contents($manifestPath), true);
        $manifest['enabled'] = $value;

        $json  = json_encode($manifest, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        $saved = file_put_contents($manifestPath, $json);

        if ($saved !== false) {
            if ($extension) {
                $value ? $extension->activate() : $extension->deactivate();
            }
            return true;
        }

        return false;
    }

    /**
     * Set extension filter
     */
    public function setExtensionFilter(string $extensionName, string $filter, $value): bool
    {
        if (!isset($this->extensionFilters[$extensionName])) {
            $this->extensionFilters[$extensionName] = [];
        }
        $this->extensionFilters[$extensionName][$filter] = $value;
        $this->saveExtensionSettings();

        do_action('jankx/extension/filter_set', $extensionName, $filter, $value);

        return true;
    }

    /**
     * Remove extension filter
     */
    public function removeExtensionFilter(string $extensionName): bool
    {
        if (isset($this->extensionFilters[$extensionName])) {
            unset($this->extensionFilters[$extensionName]);
            $this->saveExtensionSettings();

            do_action('jankx/extension/filter_removed', $extensionName);

            return true;
        }

        return false;
    }

    /**
     * Get extension filter
     */
    public function getExtensionFilter(string $extensionName, string $filter, $default = null)
    {
        return $this->extensionFilters[$extensionName][$filter] ?? $default;
    }

    /**
     * Save extension settings to database
     */
    private function saveExtensionSettings()
    {
        update_option('jankx_enabled_extensions', $this->enabledExtensions);
        update_option('jankx_disabled_extensions', $this->disabledExtensions);
        update_option('jankx_extension_filters', $this->extensionFilters);
        update_option('jankx_extension_settings', $this->extensionSettings);
    }

    /**
     * Get enabled extensions
     */
    public function getEnabledExtensions(): array
    {
        return $this->enabledExtensions;
    }

    /**
     * Get disabled extensions
     */
    public function getDisabledExtensions(): array
    {
        return $this->disabledExtensions;
    }

    /**
     * Get all extension filters
     */
    public function getExtensionFilters(): array
    {
        return $this->extensionFilters;
    }

    public function isExtensionEnabled(string $extensionName): bool
    {
        $extension = $this->extensionManager->get_extension($extensionName);
        return $extension && $extension->is_active();
    }

    /**
     * Check if extension is disabled
     */
    public function isExtensionDisabled(string $extensionName): bool
    {
        $extension = $this->extensionManager->get_extension($extensionName);
        return $extension && !$extension->is_active();
    }

    /**
     * Get extension status
     */
    public function getExtensionStatus(string $extensionName): string
    {
        return $this->isExtensionEnabled($extensionName) ? 'enabled' : 'disabled';
    }

    /**
     * Register admin hooks
     */
    public function registerAdminHooks()
    {
        add_action('admin_menu', [$this, 'addAdminMenu']);
        add_action('admin_enqueue_scripts', [$this, 'enqueueAdminAssets']);
    }

    /**
     * Add admin menu
     */
    public function addAdminMenu()
    {
        add_submenu_page(
            'themes.php',
            'Extension Manager',
            'Extension Manager',
            'manage_options',
            'jankx-extension-manager',
            [$this, 'renderAdminPage']
        );
    }

    /**
     * Enqueue admin assets
     */
    public function enqueueAdminAssets($hook)
    {
        if ($hook !== 'appearance_page_jankx-extension-manager') {
            return;
        }

        wp_enqueue_script(
            'jankx-extension-manager',
            get_template_directory_uri() . '/assets/js/extension-manager.js',
            ['jquery'],
            '1.0.0',
            true
        );

        wp_localize_script('jankx-extension-manager', 'jankxExtensionManager', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('jankx_extension_manager_nonce'),
        ]);
    }

    /**
     * Render admin page
     */
    public function renderAdminPage()
    {
        $extensions = $this->extensionManager->get_extensions();
        $stats = $this->extensionManager->get_stats();

        include get_template_directory() . '/includes/framework/Extensions/views/admin-page.php';
    }

         /**
      * Handle AJAX toggle extension
      */
    public function handleToggleExtension()
    {
        check_ajax_referer('jankx_extension_manager_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Unauthorized'], 403);
            return;
        }

        $extensionName = sanitize_text_field($_POST['extension'] ?? '');

        if (empty($extensionName)) {
            wp_send_json_error(['message' => 'Extension name is required']);
            return;
        }

        $extension = $this->extensionManager->get_extension($extensionName);
        if (!$extension) {
            $allExtensions = array_keys($this->extensionManager->get_extensions());
            wp_send_json_error([
                'message' => sprintf('Extension "%s" not found. Available: %s', $extensionName, implode(', ', $allExtensions))
            ]);
            return;
        }

        $success = $this->toggleExtension($extensionName);

        if ($success) {
            wp_send_json_success([
                'message' => 'Extension toggled successfully',
                'status'  => $this->getExtensionStatus($extensionName),
            ]);
        } else {
            $manifestPath = $extension->get_extension_path() . '/manifest.json';
            $writable = is_writable($manifestPath);
            wp_send_json_error([
                'message'   => 'Failed to toggle extension',
                'manifest'  => $manifestPath,
                'writable'  => $writable,
            ]);
        }
    }

     /**
     * Handle AJAX delete extension
     */
    public function handleDeleteExtension()
    {
        check_ajax_referer('jankx_extension_manager_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(['message' => 'Unauthorized'], 403);
            return;
        }

        $extensionName = sanitize_text_field($_POST['extension'] ?? '');
        if (empty($extensionName)) {
            wp_send_json_error(['message' => 'Extension name is required']);
            return;
        }

        $extensionPath = null;
        $extension = $this->extensionManager->get_extension($extensionName);

        if ($extension) {
            $extensionPath = $extension->get_extension_path();
        } else {
            // Check disabled ones
            try {
                $themeExtManager = \Jankx\Facades\App::make('theme_extension.manager');
                $disabled = $themeExtManager->getDisabledManifests();
                if (isset($disabled[$extensionName])) {
                    $extensionPath = $disabled[$extensionName]['dir'];
                }
            } catch (\Exception $e) {}
        }

        if (!$extensionPath || !is_dir($extensionPath)) {
            wp_send_json_error(['message' => 'Extension directory not found']);
            return;
        }

        // Safety check: ensure it's inside an /extensions/ directory
        if (strpos($extensionPath, '/extensions/') === false) {
             wp_send_json_error(['message' => 'Security: Invalid extension path']);
             return;
        }

        $this->recursiveDelete($extensionPath);

        wp_send_json_success(['message' => 'Extension deleted successfully']);
    }

    /**
     * Recursively delete a directory
     */
    private function recursiveDelete($dir)
    {
        if (!is_dir($dir)) {
            return;
        }

        $files = array_diff(scandir($dir), ['.', '..']);
        foreach ($files as $file) {
            (is_dir("$dir/$file")) ? $this->recursiveDelete("$dir/$file") : unlink("$dir/$file");
        }
        return rmdir($dir);
    }

     /**
      * Handle AJAX get extension manifest
      */
    public function handleGetExtensionManifest()
    {
        check_ajax_referer('jankx_extension_manager_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }

        $extensionName = sanitize_text_field($_POST['extension'] ?? '');

        if (empty($extensionName)) {
            wp_send_json_error('Extension name is required');
        }

        $extension = $this->extensionManager->get_extension($extensionName);

        if (!$extension) {
            wp_send_json_error('Extension not found');
        }

        $manifest = $extension->get_manifest_data();

        if ($manifest) {
            wp_send_json_success($manifest);
        } else {
            wp_send_json_error('No manifest data found');
        }
    }

     /**
      * Handle AJAX get extension settings
      */
    public function handleGetExtensionSettings()
    {
        check_ajax_referer('jankx_extension_manager_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }

        $extensionName = sanitize_text_field($_POST['extension'] ?? '');

        if (empty($extensionName)) {
            wp_send_json_error('Extension name is required');
        }

        $settings = $this->getExtensionSettings($extensionName);
        wp_send_json_success($settings);
    }

     /**
      * Handle AJAX save extension settings
      */
    public function handleSaveExtensionSettings()
    {
        check_ajax_referer('jankx_extension_manager_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }

        $extensionName = sanitize_text_field($_POST['extension'] ?? '');
        $settings = $_POST['settings'] ?? [];

        if (empty($extensionName)) {
            wp_send_json_error('Extension name is required');
        }

        // Sanitize settings
        $sanitizedSettings = [];
        foreach ($settings as $key => $value) {
            $sanitizedSettings[sanitize_text_field($key)] = sanitize_text_field($value);
        }

        $success = $this->setExtensionSettings($extensionName, $sanitizedSettings);

        if ($success) {
            wp_send_json_success('Settings saved successfully');
        } else {
            wp_send_json_error('Failed to save settings');
        }
    }

        /**
     * Get extension statistics
     */
    public function getStats(): array
    {
        $extensionStats = $this->extensionManager->get_stats();

        return array_merge($extensionStats, [
            'enabled' => count($this->enabledExtensions),
            'disabled' => count($this->disabledExtensions),
            'auto' => $extensionStats['total'] - count($this->enabledExtensions) - count($this->disabledExtensions),
            'enabled_extensions' => $this->enabledExtensions,
            'disabled_extensions' => $this->disabledExtensions,
        ]);
    }

    /**
     * Get extension setting
     */
    public function getExtensionSetting(string $extensionName, string $key, $default = null)
    {
        return $this->extensionSettings[$extensionName][$key] ?? $default;
    }

    /**
     * Set extension setting
     */
    public function setExtensionSetting(string $extensionName, string $key, $value): bool
    {
        if (!isset($this->extensionSettings[$extensionName])) {
            $this->extensionSettings[$extensionName] = [];
        }

        $this->extensionSettings[$extensionName][$key] = $value;
        $this->saveExtensionSettings();

        do_action('jankx/extension/setting_updated', $extensionName, $key, $value);

        return true;
    }

    /**
     * Get all extension settings
     */
    public function getExtensionSettings(string $extensionName): array
    {
        return $this->extensionSettings[$extensionName] ?? [];
    }

    /**
     * Set multiple extension settings
     */
    public function setExtensionSettings(string $extensionName, array $settings): bool
    {
        if (!isset($this->extensionSettings[$extensionName])) {
            $this->extensionSettings[$extensionName] = [];
        }

        $this->extensionSettings[$extensionName] = array_merge($this->extensionSettings[$extensionName], $settings);
        $this->saveExtensionSettings();

        do_action('jankx/extension/settings_updated', $extensionName, $settings);

        return true;
    }

    /**
     * Delete extension setting
     */
    public function deleteExtensionSetting(string $extensionName, string $key): bool
    {
        if (isset($this->extensionSettings[$extensionName][$key])) {
            unset($this->extensionSettings[$extensionName][$key]);
            $this->saveExtensionSettings();

            do_action('jankx/extension/setting_deleted', $extensionName, $key);

            return true;
        }

        return false;
    }

    /**
     * Delete all extension settings
     */
    public function deleteExtensionSettings(string $extensionName): bool
    {
        if (isset($this->extensionSettings[$extensionName])) {
            unset($this->extensionSettings[$extensionName]);
            $this->saveExtensionSettings();

            do_action('jankx/extension/settings_deleted', $extensionName);

            return true;
        }

        return false;
    }

    /**
     * Get all extension settings for all extensions
     */
    public function getAllExtensionSettings(): array
    {
        return $this->extensionSettings;
    }

    /**
     * Clear all extension settings
     */
    public function clearExtensionSettings(string $extensionName): bool
    {
        return $this->deleteExtensionSettings($extensionName);
    }

    /**
     * Get extension statistics
     */
    public function getStatistics(): array
    {
        return $this->getExtensionStats();
    }

    /**
     * Get extension dependencies
     */
    public function getExtensionDependencies(string $extensionName): array
    {
        // TODO: Implement extension dependencies logic
        return [];
    }

    /**
     * Check extension compatibility
     */
    public function checkExtensionCompatibility(string $extensionName): bool
    {
        // TODO: Implement compatibility check logic
        return true;
    }

    /**
     * Validate extension settings
     */
    public function validateExtensionSettings(string $extensionName, array $settings): array
    {
        // TODO: Implement validation logic
        return [];
    }

    /**
     * Export extension settings
     */
    public function exportExtensionSettings(string $extensionName): array
    {
        return $this->getExtensionSettings($extensionName);
    }

    /**
     * Import extension settings
     */
    public function importExtensionSettings(string $extensionName, array $settings): bool
    {
        return $this->setExtensionSettings($extensionName, $settings);
    }

    /**
     * Get extension logs
     */
    public function getExtensionLogs(string $extensionName, int $limit = 100): array
    {
        // TODO: Implement logging system
        return [];
    }

    /**
     * Clear extension logs
     */
    public function clearExtensionLogs(string $extensionName): bool
    {
        // TODO: Implement logging system
        return true;
    }
}
