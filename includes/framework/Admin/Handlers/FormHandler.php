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

        $action = $_POST['jankx_action'];

        try {
            switch ($action) {
                case 'save_image_sizes':
                    $this->handleSaveImageSizes($_POST);
                    break;
                
                // Allow other components to add their own handlers via action
                default:
                    do_action("jankx/admin/handle_action/{$action}", $_POST, $this->app);
                    break;
            }
        } catch (\Exception $e) {
            Log::error("Admin Form Handler: Action '{$action}' failed - " . $e->getMessage());
            wp_die('An error occurred while processing your request.');
        }
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
}
