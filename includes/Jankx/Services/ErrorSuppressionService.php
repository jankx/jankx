<?php

namespace Jankx\Services;

use Jankx\Foundation\Application;

/**
 * Error Suppression Service
 *
 * Handles error suppression and filtering for Jankx Framework
 *
 * @package Jankx\Services
 * @since 2.0.0
 */
class ErrorSuppressionService
{
    protected $app;
    protected $suppressed_errors = [];

    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    /**
     * Add error to suppression list
     *
     * @param string $error_type
     * @param string $error_message
     * @return void
     */
    public function suppressError($error_type, $error_message)
    {
        $this->suppressed_errors[$error_type][] = $error_message;
    }

    /**
     * Check if error should be suppressed
     *
     * @param string $error_type
     * @param string $error_message
     * @return bool
     */
    public function shouldSuppressError($error_type, $error_message)
    {
        if (!isset($this->suppressed_errors[$error_type])) {
            return false;
        }

        foreach ($this->suppressed_errors[$error_type] as $suppressed_message) {
            if (strpos($error_message, $suppressed_message) !== false) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get suppression configuration
     *
     * @return array
     */
    public function getSuppressionConfig()
    {
        $config = $this->app->make('config');
        return $config->get('error.suppression', []);
    }

    /**
     * Clear suppression list
     *
     * @return void
     */
    public function clearSuppressions()
    {
        $this->suppressed_errors = [];
    }
}