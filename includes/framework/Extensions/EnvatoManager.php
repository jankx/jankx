<?php
/**
 * Envato Purchase Code Verification Manager
 * 
 * This class handles purchase code verification with Envato API.
 * 
 * @package Jankx\Extensions
 * @since 1.0.0
 */

namespace Jankx\Extensions;

use Jankx\Foundation\Application;
use Jankx\Facades\Log;

class EnvatoManager
{
    const OPTION_KEY = 'jankx_license_data';
    
    /**
     * @var Application
     */
    protected $app;

    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    /**
     * Get active license data
     * 
     * @return array|false
     */
    public function getLicenseData()
    {
        return get_option(self::OPTION_KEY, false);
    }

    /**
     * Check if theme is activated
     * 
     * @return bool
     */
    public function isActivated()
    {
        $data = $this->getLicenseData();
        return !empty($data['activated']) && !empty($data['purchase_code']);
    }

    /**
     * Verify Purchase Code via Envato API
     * 
     * @param string $purchaseCode
     * @return bool|\WP_Error
     */
    public function activate($purchaseCode)
    {
        $purchaseCode = sanitize_text_field($purchaseCode);
        if (empty($purchaseCode)) {
            return new \WP_Error('invalid_code', __('Purchase code cannot be empty.', 'jankx'));
        }

        // Prepare API call to Envato (or proxy server)
        // For security, it's better to verify via author's proxy to hide API key
        $hubUrl = apply_filters('jankx/envato/hub_url', 'https://optilarity.top/api/license/verify');
        
        $response = wp_remote_post($hubUrl, [
            'timeout' => 20,
            'body'    => [
                'purchase_code' => $purchaseCode,
                'domain'        => home_url(),
                'item_id'       => apply_filters('jankx/envato/item_id', ''), // To be filled with ThemeForest Item ID
                'theme'         => 'jankx-pro'
            ]
        ]);

        if (is_wp_error($response)) {
            return $response;
        }

        $body = json_decode(wp_remote_retrieve_body($response), true);
        
        if (isset($body['success']) && $body['success']) {
            $licenseData = [
                'purchase_code' => $purchaseCode,
                'activated'     => true,
                'activation_date' => time(),
                'buyer'         => $body['buyer'] ?? '',
                'license_type'  => $body['license'] ?? '',
                'supported_until' => $body['supported_until'] ?? ''
            ];
            
            update_option(self::OPTION_KEY, $licenseData);
            delete_transient('jankx_license_check_failed');
            
            return true;
        }

        return new \WP_Error('activation_failed', $body['message'] ?? __('Invalid purchase code or activation failed.', 'jankx'));
    }

    /**
     * Deactivate the license
     * 
     * @return void
     */
    public function deactivate()
    {
        delete_option(self::OPTION_KEY);
    }
}
