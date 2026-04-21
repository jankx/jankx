<?php

namespace Jankx\Admin\Handlers;

use Jankx\Foundation\Application;
use Jankx\Facades\Log;

/**
 * Admin Form Handler
 * 
 * Handles form submissions from Jankx admin pages
 */
class FormHandler
{
    /**
     * @var \Jankx\Foundation\Application
     */
    protected $app;

    /**
     * Constructor
     * 
     * @param Application $app
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    /**
     * Handle admin page requests
     * 
     * @return void
     */
    public function handleRequests(): void
    {
        if (strtoupper($_SERVER['REQUEST_METHOD']) !== 'POST') {
            return;
        }

        if (empty($_POST['jankx_action'])) {
            return;
        }

        // Sanitize action and inputs
        $action = \sanitize_key($_POST['jankx_action']);
        $data   = $this->sanitizeRequestData($_POST);

        try {
            switch ($action) {
                case 'save_image_sizes':
                    $this->handleSaveImageSizes($data);
                    break;
                
                case 'save_performance_settings':
                    $this->handleSavePerformanceSettings($data);
                    break;
                
                case 'clear_debug_log':
                    $this->handleClearDebugLog($data);
                    break;
                    
                case 'clear_image_cache':
                    $this->handleClearImageCache($data);
                    break;
                    
                case 'export_settings':
                    $this->handleExportSettings($data);
                    break;

                case 'activate_license':
                    $this->handleActivateLicense($data);
                    break;

                case 'deactivate_license':
                    $this->handleDeactivateLicense($data);
                    break;

                case 'disconnect_membership':
                    $this->handleDisconnectMembership($data);
                    break;
                
                case 'bulk_extensions':
                    $this->handleBulkExtensions($data);
                    break;
                
                // Allow other components to add their own handlers via action
                default:
                    \do_action("jankx/admin/handle_action/{$action}", $data, $this->app);
                    break;
            }
        } catch (\Exception $e) {
            Log::error("Admin Form Handler: Action '{$action}' failed - " . $e->getMessage());
            \wp_die('An error occurred while processing your request.');
        }
    }

    /**
     * Handle license activation
     */
    protected function handleActivateLicense(array $data): void
    {
        if (!\wp_verify_nonce($data['jankx_license_nonce'] ?? '', 'jankx_activate_license')) {
            \wp_die(\__('Security check failed', 'jankx'));
        }

        if (!\current_user_can('manage_options')) {
            \wp_die(\__('You do not have permission to perform this action.', 'jankx'));
        }

        $licenseKey = $data['license_key'] ?? '';
        $email = $data['email'] ?? '';
        
        $licenseService = $this->app->make('license');
        $result = $licenseService->verify($licenseKey, $email);

        if (!$result['success']) {
            $message = $result['message'] ?? \__('Activation failed.', 'jankx');
            \add_action('admin_notices', function () use ($message) {
                \printf(
                    '<div class="notice notice-error is-dismissible"><p>%s</p></div>',
                    \esc_html($message)
                );
            });
        } else {
            \add_action('admin_notices', function () {
                \printf(
                    '<div class="notice notice-success is-dismissible"><p>%s</p></div>',
                    \esc_html__('Theme JANKX PRO activated successfully via Optilarity!', 'jankx')
                );
            });
        }
    }

    /**
     * Handle license deactivation
     */
    protected function handleDeactivateLicense(array $data): void
    {
        if (!\wp_verify_nonce($data['jankx_license_nonce'] ?? '', 'jankx_deactivate_license')) {
            \wp_die(\__('Security check failed', 'jankx'));
        }

        if (!\current_user_can('manage_options')) {
            \wp_die(\__('You do not have permission to perform this action.', 'jankx'));
        }

        $licenseService = $this->app->make('license');
        $result = $licenseService->deactivate();

        \add_action('admin_notices', function () {
            \printf(
                '<div class="notice notice-info is-dismissible"><p>%s</p></div>',
                \esc_html__('License deactivated.', 'jankx')
            );
        });
    }

    /**
     * Handle membership disconnection
     */
    protected function handleDisconnectMembership(array $data): void
    {
        if (!\wp_verify_nonce($data['jankx_membership_nonce'] ?? '', 'jankx_disconnect_membership')) {
            \wp_die(\__('Security check failed', 'jankx'));
        }

        if (!\current_user_can('manage_options')) {
            \wp_die(\__('You do not have permission to perform this action.', 'jankx'));
        }

        $membershipService = $this->app->make('membership');
        $membershipService->disconnect();

        \add_action('admin_notices', function () {
            \printf(
                '<div class="notice notice-info is-dismissible"><p>%s</p></div>',
                \esc_html__('Membership disconnected.', 'jankx')
            );
        });
    }

    /**
     * Sanitize input data recursively
     * 
     * @param array $data
     * @return array
     */
    protected function sanitizeRequestData(array $data): array
    {
        return \map_deep($data, function ($value) {
            return \is_string($value) ? \sanitize_text_field($value) : $value;
        });
    }

    /**
     * Handle saving enabled image sizes
     * 
     * @param array $data Form data
     * @return void
     */
    protected function handleSaveImageSizes(array $data): void
    {
        if (!\wp_verify_nonce($data['jankx_utilities_nonce'] ?? '', 'jankx_save_utilities')) {
            \wp_die(\__('Security check failed', 'jankx'));
        }

        if (!\current_user_can('manage_options')) {
            \wp_die(\__('You do not have permission to perform this action.', 'jankx'));
        }

        $enabled_sizes = $data['enabled_sizes'] ?? [];
        \update_option('jankx_enabled_image_sizes', $enabled_sizes);

        \add_action('admin_notices', function () {
            \printf(
                '<div class="notice notice-success is-dismissible"><p>%s</p></div>',
                \esc_html__('Image size settings saved.', 'jankx')
            );
        });
    }

    /**
     * Handle clearing the debug log file
     * 
     * @param array $data Form data
     * @return void
     */
    protected function handleClearDebugLog(array $data): void
    {
        if (!\wp_verify_nonce($data['jankx_debug_nonce'] ?? '', 'jankx_clear_log')) {
            \wp_die(\__('Security check failed', 'jankx'));
        }

        if (!\current_user_can('manage_options')) {
            \wp_die(\__('You do not have permission to perform this action.', 'jankx'));
        }

        $log_file = WP_CONTENT_DIR . '/debug.log';
        if (\file_exists($log_file)) {
            \file_put_contents($log_file, '');
        }

        \add_action('admin_notices', function () {
            \printf(
                '<div class="notice notice-success is-dismissible"><p>%s</p></div>',
                \esc_html__('Debug log cleared.', 'jankx')
            );
        });
    }

    /**
     * Handle saving frontend performance settings
     * 
     * @param array $data Form data
     * @return void
     */
    protected function handleSavePerformanceSettings(array $data): void
    {
        if (!\wp_verify_nonce($data['jankx_performance_nonce'] ?? '', 'jankx_save_performance')) {
            \wp_die(\__('Security check failed', 'jankx'));
        }

        if (!\current_user_can('manage_options')) {
            \wp_die(\__('You do not have permission to perform this action.', 'jankx'));
        }

        // Set options with fallback value "no" for unchecked checkboxes
        \update_option('jankx_perf_optimize_html', isset($data['perf_html']) && $data['perf_html'] === 'yes' ? 'yes' : 'no');
        \update_option('jankx_perf_remove_emojis', isset($data['perf_emojis']) && $data['perf_emojis'] === 'yes' ? 'yes' : 'no');
        \update_option('jankx_perf_optimize_dashicons', isset($data['perf_dashicons']) && $data['perf_dashicons'] === 'yes' ? 'yes' : 'no');
        \update_option('jankx_perf_defer_scripts', isset($data['perf_defer']) && $data['perf_defer'] === 'yes' ? 'yes' : 'no');

        \add_action('admin_notices', function () {
            \printf(
                '<div class="notice notice-success is-dismissible"><p>%s</p></div>',
                \esc_html__('Performance settings saved.', 'jankx')
            );
        });
    }

    /**
     * Handle clearing image cache (transients)
     */
    protected function handleClearImageCache(array $data): void
    {
        if (!\wp_verify_nonce($data['jankx_utilities_nonce'] ?? '', 'jankx_utilities_actions')) {
            \wp_die(\__('Security check failed', 'jankx'));
        }

        if (!\current_user_can('manage_options')) {
            \wp_die(\__('You do not have permission to perform this action.', 'jankx'));
        }

        global $wpdb;
        // Clear all transients related to jankx images or just all transients if necessary.
        // Let's clear transients that have 'jankx' in name to be safe
        $wpdb->query("DELETE FROM {$wpdb->options} WHERE option_name LIKE '\_transient\_jankx\_%' OR option_name LIKE '\_transient\_timeout\_jankx\_%'");

        \add_action('admin_notices', function () {
            \printf(
                '<div class="notice notice-success is-dismissible"><p>%s</p></div>',
                \esc_html__('Image cache and Jankx transients cleared successfully.', 'jankx')
            );
        });
    }

    /**
     * Handle exporting settings
     */
    protected function handleExportSettings(array $data): void
    {
        if (!wp_verify_nonce($data['jankx_utilities_nonce'] ?? '', 'jankx_utilities_actions')) {
            wp_die(__('Security check failed', 'jankx'));
        }

        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have permission to perform this action.', 'jankx'));
        }

        global $wpdb;
        $options = $wpdb->get_results("SELECT option_name, option_value FROM {$wpdb->options} WHERE option_name LIKE 'jankx\_%'");
        
        $export_data = [];
        foreach ($options as $opt) {
            $export_data[$opt->option_name] = \maybe_unserialize($opt->option_value);
        }

        $json = \wp_json_encode($export_data);

        $this->setHeader('Content-Description: File Transfer');
        $this->setHeader('Content-Type: application/json');
        $this->setHeader('Content-Disposition: attachment; filename="jankx-settings-export-' . date('Y-m-d') . '.json"');
        $this->setHeader('Expires: 0');
        $this->setHeader('Cache-Control: must-revalidate');
        $this->setHeader('Pragma: public');
        $this->setHeader('Content-Length: ' . strlen($json));
        
        echo $json;
        $this->terminate();
    }

    /**
     * Handle bulk actions for extensions
     */
    protected function handleBulkExtensions(array $data): void
    {
        if (!wp_verify_nonce($data['jankx_bulk_nonce'] ?? '', 'jankx_bulk_extensions')) {
            wp_die(__('Security check failed', 'jankx'));
        }
    
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have permission to perform this action.', 'jankx'));
        }
    
        $action = $data['action'] !== '-1' ? $data['action'] : ($data['action2'] ?? '-1');
        $extensions = $data['checked'] ?? [];
    
        if ($action === '-1' || empty($extensions)) {
            return;
        }
    
        $extensionService = $this->app->make('extension.service');
        $successCount = 0;
        $errorCount = 0;
    
        foreach ($extensions as $extensionName) {
            $extensionName = sanitize_text_field($extensionName);
            $result = false;
    
            switch ($action) {
                case 'activate-selected':
                    $result = $extensionService->enableExtension($extensionName);
                    break;
                case 'deactivate-selected':
                    $result = $extensionService->disableExtension($extensionName);
                    break;
                case 'delete-selected':
                    // Deletion logic similar to ExtensionService::handleDeleteExtension
                    $extensionManager = $this->app->make('extension.manager');
                    $extension = $extensionManager->get_extension($extensionName);
                    $path = null;
                    if ($extension) {
                        $path = $extension->get_extension_path();
                    } else {
                        try {
                            $themeExtManager = $this->app->make('theme_extension.manager');
                            $disabled = $themeExtManager->getDisabledManifests();
                            if (isset($disabled[$extensionName])) {
                                $path = $disabled[$extensionName]['dir'];
                            }
                        } catch (\Exception $e) {}
                    }
    
                    if ($path && is_dir($path) && strpos($path, '/extensions/') !== false) {
                        require_once ABSPATH . 'wp-admin/includes/file.php';
                        WP_Filesystem();
                        global $wp_filesystem;
                        if ($wp_filesystem->delete($path, true)) {
                            delete_transient('jankx_extensions_dirs_' . get_stylesheet());
                            $result = true;
                        }
                    }
                    break;
            }
    
            if ($result) {
                $successCount++;
            } else {
                $errorCount++;
            }
        }
    
        $this->terminateWithRedirect($successCount, $errorCount, $action);
    }

    /**
     * Terminate with redirect to show results
     */
    protected function terminateWithRedirect(int $success, int $error, string $action): void
    {
        $url = \add_query_arg([
            'jankx_bulk_success' => $success,
            'jankx_bulk_error'   => $error,
            'jankx_bulk_action'  => $action
        ], \wp_get_referer() ?: \admin_url('admin.php?page=jankx-extensions'));

        \wp_safe_redirect($url);
        $this->terminate();
    }

    /**
     * Set HTTP header (wrapped for testability)
     * 
     * @param string $header Header string
     * @return void
     */
    protected function setHeader(string $header): void
    {
        if (!headers_sent()) {
            header($header);
        }
    }
 
    /**
     * Terminate execution (wrapped for testability)
     * 
     * @return void
     */
    protected function terminate(): void
    {
        exit;
    }
}
