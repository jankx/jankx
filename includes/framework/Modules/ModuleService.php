<?php

/**
 * Module Service for Jankx Theme Framework
 *
 * @package Jankx\Framework\Modules
 */

namespace Jankx\Modules;

class ModuleService implements \Jankx\Contracts\ModuleService
{
    /**
     * @var ModuleManager
     */
    private $moduleManager;

    /**
     * @var array
     */
    private $enabledModules = [];

    /**
     * @var array
     */
    private $disabledModules = [];

    /**
     * @var array
     */
    private $moduleFilters = [];

    /**
     * @var array
     */
    private $moduleSettings = [];

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->moduleManager = ModuleManager::getInstance();
        $this->loadModuleSettings();
        $this->init();
    }

         /**
      * Initialize the service
      */
    private function init()
    {
        add_action('init', [$this, 'applyModuleFilters'], 1);
        add_action('admin_init', [$this, 'registerAdminHooks']);
        add_action('wp_ajax_jankx_toggle_module', [$this, 'handleToggleModule']);
        add_action('wp_ajax_jankx_get_module_manifest', [$this, 'handleGetModuleManifest']);
        add_action('wp_ajax_jankx_get_module_settings', [$this, 'handleGetModuleSettings']);
        add_action('wp_ajax_jankx_save_module_settings', [$this, 'handleSaveModuleSettings']);
    }

    /**
     * Load module settings from database
     */
    private function loadModuleSettings()
    {
        $this->enabledModules = get_option('jankx_enabled_modules', []);
        $this->disabledModules = get_option('jankx_disabled_modules', []);
        $this->moduleFilters = get_option('jankx_module_filters', []);
        $this->moduleSettings = get_option('jankx_module_settings', []);
    }

    /**
     * Apply module filters
     */
    public function applyModuleFilters()
    {
        $modules = $this->moduleManager->get_modules();

        foreach ($modules as $moduleName => $module) {
            // Check if module is explicitly disabled
            if (in_array($moduleName, $this->disabledModules)) {
                $module->deactivate();
                continue;
            }

            // Check if module is explicitly enabled
            if (in_array($moduleName, $this->enabledModules)) {
                $module->activate();
                continue;
            }

            // Apply custom filters
            if (!$this->shouldLoadModule($moduleName, $module)) {
                $module->deactivate();
                continue;
            }

            // Default: enable module
            $module->activate();
        }
    }

    /**
     * Check if module should be loaded based on filters
     */
    private function shouldLoadModule(string $moduleName, Module $module): bool
    {
        // Apply global filters
        $shouldLoad = apply_filters('jankx/module/should_load', true, $moduleName, $module);

        // Apply specific module filters
        $shouldLoad = apply_filters("jankx/module/{$moduleName}/should_load", $shouldLoad, $module);

        // Check custom filters
        if (isset($this->moduleFilters[$moduleName])) {
            $filter = $this->moduleFilters[$moduleName];

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
                return apply_filters('jankx/module/condition/custom', true, $condition);

            default:
                return true;
        }
    }

    /**
     * Enable a module
     */
    public function enableModule(string $moduleName): bool
    {
        $module = $this->moduleManager->get_module($moduleName);

        if (!$module) {
            return false;
        }

        // Remove from disabled list
        $this->disabledModules = array_diff($this->disabledModules, [$moduleName]);

        // Add to enabled list
        if (!in_array($moduleName, $this->enabledModules)) {
            $this->enabledModules[] = $moduleName;
        }

        // Update database
        $this->saveModuleSettings();

        // Activate module
        $module->activate();

        do_action('jankx/module/enabled', $moduleName, $module);

        return true;
    }

    /**
     * Disable a module
     */
    public function disableModule(string $moduleName): bool
    {
        $module = $this->moduleManager->get_module($moduleName);

        if (!$module) {
            return false;
        }

        // Remove from enabled list
        $this->enabledModules = array_diff($this->enabledModules, [$moduleName]);

        // Add to disabled list
        if (!in_array($moduleName, $this->disabledModules)) {
            $this->disabledModules[] = $moduleName;
        }

        // Update database
        $this->saveModuleSettings();

        // Deactivate module
        $module->deactivate();

        do_action('jankx/module/disabled', $moduleName, $module);

        return true;
    }

    /**
     * Toggle module status
     */
    public function toggleModule(string $moduleName): bool
    {
        if (in_array($moduleName, $this->enabledModules)) {
            return $this->disableModule($moduleName);
        } else {
            return $this->enableModule($moduleName);
        }
    }

    /**
     * Set module filter
     */
    public function setModuleFilter(string $moduleName, string $filter, $value): bool
    {
        if (!isset($this->moduleFilters[$moduleName])) {
            $this->moduleFilters[$moduleName] = [];
        }
        $this->moduleFilters[$moduleName][$filter] = $value;
        $this->saveModuleSettings();

        do_action('jankx/module/filter_set', $moduleName, $filter, $value);

        return true;
    }

    /**
     * Remove module filter
     */
    public function removeModuleFilter(string $moduleName): bool
    {
        if (isset($this->moduleFilters[$moduleName])) {
            unset($this->moduleFilters[$moduleName]);
            $this->saveModuleSettings();

            do_action('jankx/module/filter_removed', $moduleName);

            return true;
        }

        return false;
    }

    /**
     * Get module filter
     */
    public function getModuleFilter(string $moduleName, string $filter, $default = null)
    {
        return $this->moduleFilters[$moduleName][$filter] ?? $default;
    }

    /**
     * Save module settings to database
     */
    private function saveModuleSettings()
    {
        update_option('jankx_enabled_modules', $this->enabledModules);
        update_option('jankx_disabled_modules', $this->disabledModules);
        update_option('jankx_module_filters', $this->moduleFilters);
        update_option('jankx_module_settings', $this->moduleSettings);
    }

    /**
     * Get enabled modules
     */
    public function getEnabledModules(): array
    {
        return $this->enabledModules;
    }

    /**
     * Get disabled modules
     */
    public function getDisabledModules(): array
    {
        return $this->disabledModules;
    }

    /**
     * Get all module filters
     */
    public function getModuleFilters(): array
    {
        return $this->moduleFilters;
    }

    /**
     * Check if module is enabled
     */
    public function isModuleEnabled(string $moduleName): bool
    {
        return in_array($moduleName, $this->enabledModules);
    }

    /**
     * Check if module is disabled
     */
    public function isModuleDisabled(string $moduleName): bool
    {
        return in_array($moduleName, $this->disabledModules);
    }

    /**
     * Get module status
     */
    public function getModuleStatus(string $moduleName): string
    {
        if ($this->isModuleEnabled($moduleName)) {
            return 'enabled';
        }

        if ($this->isModuleDisabled($moduleName)) {
            return 'disabled';
        }

        return 'auto';
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
            'Module Manager',
            'Module Manager',
            'manage_options',
            'jankx-module-manager',
            [$this, 'renderAdminPage']
        );
    }

    /**
     * Enqueue admin assets
     */
    public function enqueueAdminAssets($hook)
    {
        if ($hook !== 'appearance_page_jankx-module-manager') {
            return;
        }

        wp_enqueue_script(
            'jankx-module-manager',
            get_template_directory_uri() . '/assets/js/module-manager.js',
            ['jquery'],
            '1.0.0',
            true
        );

        wp_localize_script('jankx-module-manager', 'jankxModuleManager', [
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('jankx_module_manager_nonce'),
        ]);
    }

    /**
     * Render admin page
     */
    public function renderAdminPage()
    {
        $modules = $this->moduleManager->get_modules();
        $stats = $this->moduleManager->get_stats();

        include get_template_directory() . '/includes/framework/Modules/views/admin-page.php';
    }

         /**
      * Handle AJAX toggle module
      */
    public function handleToggleModule()
    {
        check_ajax_referer('jankx_module_manager_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }

        $moduleName = sanitize_text_field($_POST['module'] ?? '');

        if (empty($moduleName)) {
            wp_send_json_error('Module name is required');
        }

        $success = $this->toggleModule($moduleName);

        if ($success) {
            wp_send_json_success([
                'message' => 'Module toggled successfully',
                'status' => $this->getModuleStatus($moduleName),
            ]);
        } else {
            wp_send_json_error('Failed to toggle module');
        }
    }

     /**
      * Handle AJAX get module manifest
      */
    public function handleGetModuleManifest()
    {
        check_ajax_referer('jankx_module_manager_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }

        $moduleName = sanitize_text_field($_POST['module'] ?? '');

        if (empty($moduleName)) {
            wp_send_json_error('Module name is required');
        }

        $module = $this->moduleManager->get_module($moduleName);

        if (!$module) {
            wp_send_json_error('Module not found');
        }

        $manifest = $module->get_manifest_data();

        if ($manifest) {
            wp_send_json_success($manifest);
        } else {
            wp_send_json_error('No manifest data found');
        }
    }

     /**
      * Handle AJAX get module settings
      */
    public function handleGetModuleSettings()
    {
        check_ajax_referer('jankx_module_manager_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }

        $moduleName = sanitize_text_field($_POST['module'] ?? '');

        if (empty($moduleName)) {
            wp_send_json_error('Module name is required');
        }

        $settings = $this->getModuleSettings($moduleName);
        wp_send_json_success($settings);
    }

     /**
      * Handle AJAX save module settings
      */
    public function handleSaveModuleSettings()
    {
        check_ajax_referer('jankx_module_manager_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_die('Unauthorized');
        }

        $moduleName = sanitize_text_field($_POST['module'] ?? '');
        $settings = $_POST['settings'] ?? [];

        if (empty($moduleName)) {
            wp_send_json_error('Module name is required');
        }

        // Sanitize settings
        $sanitizedSettings = [];
        foreach ($settings as $key => $value) {
            $sanitizedSettings[sanitize_text_field($key)] = sanitize_text_field($value);
        }

        $success = $this->setModuleSettings($moduleName, $sanitizedSettings);

        if ($success) {
            wp_send_json_success('Settings saved successfully');
        } else {
            wp_send_json_error('Failed to save settings');
        }
    }

        /**
     * Get module statistics
     */
    public function getStats(): array
    {
        $moduleStats = $this->moduleManager->get_stats();

        return array_merge($moduleStats, [
            'enabled' => count($this->enabledModules),
            'disabled' => count($this->disabledModules),
            'auto' => $moduleStats['total'] - count($this->enabledModules) - count($this->disabledModules),
            'enabled_modules' => $this->enabledModules,
            'disabled_modules' => $this->disabledModules,
        ]);
    }

    /**
     * Get module setting
     */
    public function getModuleSetting(string $moduleName, string $key, $default = null)
    {
        return $this->moduleSettings[$moduleName][$key] ?? $default;
    }

    /**
     * Set module setting
     */
    public function setModuleSetting(string $moduleName, string $key, $value): bool
    {
        if (!isset($this->moduleSettings[$moduleName])) {
            $this->moduleSettings[$moduleName] = [];
        }

        $this->moduleSettings[$moduleName][$key] = $value;
        $this->saveModuleSettings();

        do_action('jankx/module/setting_updated', $moduleName, $key, $value);

        return true;
    }

    /**
     * Get all module settings
     */
    public function getModuleSettings(string $moduleName): array
    {
        return $this->moduleSettings[$moduleName] ?? [];
    }

    /**
     * Set multiple module settings
     */
    public function setModuleSettings(string $moduleName, array $settings): bool
    {
        if (!isset($this->moduleSettings[$moduleName])) {
            $this->moduleSettings[$moduleName] = [];
        }

        $this->moduleSettings[$moduleName] = array_merge($this->moduleSettings[$moduleName], $settings);
        $this->saveModuleSettings();

        do_action('jankx/module/settings_updated', $moduleName, $settings);

        return true;
    }

    /**
     * Delete module setting
     */
    public function deleteModuleSetting(string $moduleName, string $key): bool
    {
        if (isset($this->moduleSettings[$moduleName][$key])) {
            unset($this->moduleSettings[$moduleName][$key]);
            $this->saveModuleSettings();

            do_action('jankx/module/setting_deleted', $moduleName, $key);

            return true;
        }

        return false;
    }

    /**
     * Delete all module settings
     */
    public function deleteModuleSettings(string $moduleName): bool
    {
        if (isset($this->moduleSettings[$moduleName])) {
            unset($this->moduleSettings[$moduleName]);
            $this->saveModuleSettings();

            do_action('jankx/module/settings_deleted', $moduleName);

            return true;
        }

        return false;
    }

    /**
     * Get all module settings for all modules
     */
    public function getAllModuleSettings(): array
    {
        return $this->moduleSettings;
    }

    /**
     * Clear all module settings
     */
    public function clearModuleSettings(string $moduleName): bool
    {
        return $this->deleteModuleSettings($moduleName);
    }

    /**
     * Get module statistics
     */
    public function getStatistics(): array
    {
        return $this->getModuleStats();
    }

    /**
     * Get module dependencies
     */
    public function getModuleDependencies(string $moduleName): array
    {
        // TODO: Implement module dependencies logic
        return [];
    }

    /**
     * Check module compatibility
     */
    public function checkModuleCompatibility(string $moduleName): bool
    {
        // TODO: Implement compatibility check logic
        return true;
    }

    /**
     * Validate module settings
     */
    public function validateModuleSettings(string $moduleName, array $settings): array
    {
        // TODO: Implement validation logic
        return [];
    }

    /**
     * Export module settings
     */
    public function exportModuleSettings(string $moduleName): array
    {
        return $this->getModuleSettings($moduleName);
    }

    /**
     * Import module settings
     */
    public function importModuleSettings(string $moduleName, array $settings): bool
    {
        return $this->setModuleSettings($moduleName, $settings);
    }

    /**
     * Get module logs
     */
    public function getModuleLogs(string $moduleName, int $limit = 100): array
    {
        // TODO: Implement logging system
        return [];
    }

    /**
     * Clear module logs
     */
    public function clearModuleLogs(string $moduleName): bool
    {
        // TODO: Implement logging system
        return true;
    }
}
