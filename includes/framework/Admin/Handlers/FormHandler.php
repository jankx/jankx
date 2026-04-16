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
        $action = sanitize_key($_POST['jankx_action']);
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

                case 'activate_license':
                    $this->handleActivateLicense($data);
                    break;

                case 'deactivate_license':
                    $this->handleDeactivateLicense($data);
                    break;

                case 'disconnect_membership':
                    $this->handleDisconnectMembership($data);
                    break;
                
                // Allow other components to add their own handlers via action
                default:
                    do_action("jankx/admin/handle_action/{$action}", $data, $this->app);
                    break;
            }
        } catch (\Exception $e) {
            Log::error("Admin Form Handler: Action '{$action}' failed - " . $e->getMessage());
            wp_die('An error occurred while processing your request.');
        }
    }

    /**
     * Handle license activation
     */
    protected function handleActivateLicense(array $data): void
    {
        if (!wp_verify_nonce($data['jankx_license_nonce'] ?? '', 'jankx_activate_license')) {
            wp_die(__('Security check failed', 'jankx'));
        }

        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have permission to perform this action.', 'jankx'));
        }

        $licenseKey = $data['license_key'] ?? '';
        $email = $data['email'] ?? '';
        
        $licenseService = $this->app->make('license');
        $result = $licenseService->verify($licenseKey, $email);

        if (!$result['success']) {
            $message = $result['message'] ?? __('Activation failed.', 'jankx');
            add_action('admin_notices', function () use ($message) {
                printf(
                    '<div class="notice notice-error is-dismissible"><p>%s</p></div>',
                    esc_html($message)
                );
            });
        } else {
            add_action('admin_notices', function () {
                printf(
                    '<div class="notice notice-success is-dismissible"><p>%s</p></div>',
                    esc_html__('Theme JANKX PRO activated successfully via Optilarity!', 'jankx')
                );
            });
        }
    }

    /**
     * Handle license deactivation
     */
    protected function handleDeactivateLicense(array $data): void
    {
        if (!wp_verify_nonce($data['jankx_license_nonce'] ?? '', 'jankx_deactivate_license')) {
            wp_die(__('Security check failed', 'jankx'));
        }

        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have permission to perform this action.', 'jankx'));
        }

        $licenseService = $this->app->make('license');
        $result = $licenseService->deactivate();

        add_action('admin_notices', function () {
            printf(
                '<div class="notice notice-info is-dismissible"><p>%s</p></div>',
                esc_html__('License deactivated.', 'jankx')
            );
        });
    }

    /**
     * Handle membership disconnection
     */
    protected function handleDisconnectMembership(array $data): void
    {
        if (!wp_verify_nonce($data['jankx_membership_nonce'] ?? '', 'jankx_disconnect_membership')) {
            wp_die(__('Security check failed', 'jankx'));
        }

        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have permission to perform this action.', 'jankx'));
        }

        $membershipService = $this->app->make('membership');
        $membershipService->disconnect();

        add_action('admin_notices', function () {
            printf(
                '<div class="notice notice-info is-dismissible"><p>%s</p></div>',
                esc_html__('Membership disconnected.', 'jankx')
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
        return map_deep($data, function ($value) {
            return is_string($value) ? sanitize_text_field($value) : $value;
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
        if (!wp_verify_nonce($data['jankx_utilities_nonce'] ?? '', 'jankx_save_utilities')) {
            wp_die(__('Security check failed', 'jankx'));
        }

        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have permission to perform this action.', 'jankx'));
        }

        $enabled_sizes = $data['enabled_sizes'] ?? [];
        update_option('jankx_enabled_image_sizes', $enabled_sizes);

        add_action('admin_notices', function () {
            printf(
                '<div class="notice notice-success is-dismissible"><p>%s</p></div>',
                esc_html__('Image size settings saved.', 'jankx')
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
        if (!wp_verify_nonce($data['jankx_debug_nonce'] ?? '', 'jankx_clear_log')) {
            wp_die(__('Security check failed', 'jankx'));
        }

        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have permission to perform this action.', 'jankx'));
        }

        $log_file = WP_CONTENT_DIR . '/debug.log';
        if (file_exists($log_file)) {
            file_put_contents($log_file, '');
        }

        add_action('admin_notices', function () {
            printf(
                '<div class="notice notice-success is-dismissible"><p>%s</p></div>',
                esc_html__('Debug log cleared.', 'jankx')
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
        if (!wp_verify_nonce($data['jankx_performance_nonce'] ?? '', 'jankx_save_performance')) {
            wp_die(__('Security check failed', 'jankx'));
        }

        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have permission to perform this action.', 'jankx'));
        }

        // Set options with fallback value "no" for unchecked checkboxes
        update_option('jankx_perf_optimize_html', isset($data['perf_html']) && $data['perf_html'] === 'yes' ? 'yes' : 'no');
        update_option('jankx_perf_remove_emojis', isset($data['perf_emojis']) && $data['perf_emojis'] === 'yes' ? 'yes' : 'no');
        update_option('jankx_perf_optimize_dashicons', isset($data['perf_dashicons']) && $data['perf_dashicons'] === 'yes' ? 'yes' : 'no');
        update_option('jankx_perf_defer_scripts', isset($data['perf_defer']) && $data['perf_defer'] === 'yes' ? 'yes' : 'no');

        add_action('admin_notices', function () {
            printf(
                '<div class="notice notice-success is-dismissible"><p>%s</p></div>',
                esc_html__('Performance settings saved.', 'jankx')
            );
        });
    }
}
