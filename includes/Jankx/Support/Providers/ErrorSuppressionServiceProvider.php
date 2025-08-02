<?php

namespace Jankx\Support\Providers;

use Jankx\Foundation\Application;
use Jankx\Support\Providers\ServiceProvider;

/**
 * Error Suppression Service Provider
 *
 * Handles error suppression for Jankx Framework:
 *
 * - Suppress doing_it_wrong messages from plugins
 * - Filter error messages based on configuration
 * - Silent error handling for specific cases
 * - Plugin compatibility error suppression
 * - Custom error message filtering
 * - Error logging configuration
 * - Debug mode error handling
 * - Error suppression hooks
 * - Plugin conflict resolution
 * - Error message customization
 *
 * @package Jankx\Support\Providers
 * @since 2.0.0
 */
class ErrorSuppressionServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function register(Application $app)
    {
        // Register error suppression service
        $app->singleton('error.suppression', \Jankx\Services\ErrorSuppressionService::class);
    }

    /**
     * Bootstrap any application services.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function boot(Application $app)
    {
        $this->setupErrorSuppression();
    }

    /**
     * Setup error suppression hooks
     */
    protected function setupErrorSuppression()
    {
        // Suppress doing_it_wrong messages from plugins
        add_filter('doing_it_wrong_trigger_error', [$this, 'suppressDoingItWrong'], 10, 3);

        // Suppress specific error messages
        add_filter('wp_php_error_message', [$this, 'suppressPhpErrors'], 10, 2);

        // Suppress plugin conflicts
        add_action('admin_notices', [$this, 'suppressAdminNotices'], 1);
    }

    /**
     * Suppress doing_it_wrong messages
     *
     * @param bool $trigger_error
     * @param string $function
     * @param string $message
     * @return bool
     */
    public function suppressDoingItWrong($trigger_error, $function, $message)
    {
        // Get suppression config
        $suppression_config = \Jankx\Facades\Config::get('error.suppression', []);

        // Check if doing_it_wrong suppression is enabled
        if (!empty($suppression_config['doing_it_wrong']['enabled'])) {
            return false; // Don't trigger error
        }


        // Check specific function suppressions
        $suppressed_functions = $suppression_config['doing_it_wrong']['functions'] ?? [];
        if (in_array($function, $suppressed_functions)) {
            return false;
        }

        // Check message pattern suppressions
        $suppressed_patterns = $suppression_config['doing_it_wrong']['patterns'] ?? [];
        foreach ($suppressed_patterns as $pattern) {
            if (strpos($message, $pattern) !== false) {
                return false;
            }
        }

        return $trigger_error;
    }

    /**
     * Suppress PHP error messages
     *
     * @param string $message
     * @param array $error
     * @return string
     */
    public function suppressPhpErrors($message, $error)
    {
        $suppression_config = \Jankx\Facades\Config::get('error.suppression', []);

        // Check if PHP error suppression is enabled
        if (!empty($suppression_config['php_errors']['enabled'])) {
            return ''; // Return empty message
        }

        // Check specific error suppressions
        $suppressed_errors = $suppression_config['php_errors']['messages'] ?? [];
        foreach ($suppressed_errors as $suppressed_message) {
            if (strpos($message, $suppressed_message) !== false) {
                return '';
            }
        }

        return $message;
    }

    /**
     * Suppress admin notices
     */
    public function suppressAdminNotices()
    {
        $suppression_config = \Jankx\Facades\Config::get('error.suppression', []);

        // Check if admin notice suppression is enabled
        if (!empty($suppression_config['admin_notices']['enabled'])) {
            remove_all_actions('admin_notices');
        }

        // Check specific notice suppressions
        $suppressed_notices = $suppression_config['admin_notices']['notices'] ?? [];
        foreach ($suppressed_notices as $notice) {
            remove_action('admin_notices', $notice);
        }
    }
}