<?php

namespace Jankx\Admin;

use Jankx\Facades\Logger;

/**
 * Admin Dashboard
 *
 * Handles admin dashboard functionality
 *
 * @package Jankx\Admin
 */
class Dashboard
{
    /**
     * @var bool
     */
    protected $initialized = false;

    /**
     * Initialize dashboard
     */
    public function initialize(): void
    {
        if ($this->initialized) {
            return;
        }

        $this->initialized = true;

        // Add dashboard widgets
        add_action('wp_dashboard_setup', [$this, 'addDashboardWidgets']);

        Logger::debug('Admin Dashboard initialized');
    }

    /**
     * Add dashboard widgets
     */
    public function addDashboardWidgets(): void
    {
        // Add Jankx dashboard widget
        wp_add_dashboard_widget(
            'jankx/dashboard/widget',
            'Jankx Dashboard',
            [$this, 'renderDashboardWidget']
        );
    }

    /**
     * Render dashboard widget
     */
    public function renderDashboardWidget(): void
    {
        ?>
        <div class="jankx-dashboard-widget">
            <h3>Welcome to Jankx!</h3>
            <p>Jankx is a powerful WordPress theme framework.</p>
            <ul>
                <li><strong>Version:</strong> <?php echo JANKX_VERSION; ?></li>
                <li><strong>Theme:</strong> <?php echo get_template(); ?></li>
                <li><strong>PHP Version:</strong> <?php echo PHP_VERSION; ?></li>
            </ul>
        </div>
        <?php
    }

    /**
     * Check if dashboard is initialized
     */
    public function isInitialized(): bool
    {
        return $this->initialized;
    }
}