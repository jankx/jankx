<?php

use Jankx\Foundation\Application;

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

$app = new Application(get_template_directory());

// Return the application instance
return $app;
