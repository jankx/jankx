<?php

use Jankx\Foundation\Application;
use Jankx\Helper\Environment;

/**
 * Initialize Jankx Application
 *
 * This file initializes the Jankx application with Laravel-style architecture
 * for WordPress theme development.
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Get the Jankx application instance.
 *
 * @return \Jankx\Foundation\Application
 */
function jankx_app()
{
    static $app = null;

    if ($app === null) {
        if (Environment::isDebugLog()) {
            error_log('[JANKX DEBUG] Initializing Jankx Application...');
        }

        $app = new Application(get_template_directory());

        if (Environment::isDebugLog()) {
            error_log('[JANKX DEBUG] Jankx Application initialized successfully');
        }
    }

    return $app;
}

// Initialize the application
$app = jankx_app();

// Return the application instance
return $app;
