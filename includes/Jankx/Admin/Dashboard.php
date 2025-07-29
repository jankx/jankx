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
            Logger::debug('Admin Dashboard already initialized, skipping');
            return;
        }

        $this->initialized = true;

        // Register hooks
        $this->registerHooks();

        Logger::debug('Admin Dashboard initialized successfully');
    }

    /**
     * Register hooks
     */
    public function registerHooks(): void
    {
        // Register admin menu
        add_action('admin_menu', [$this, 'addMenuPages']);

        // Register admin scripts and styles
        add_action('admin_enqueue_scripts', [$this, 'enqueueAdminAssets']);
    }

    /**
     * Add menu pages
     */
    public function addMenuPages(): void
    {
        // Add main Jankx menu page
        add_menu_page(
            'Jankx Dashboard',
            'Jankx',
            'manage_options',
            'jankx-dashboard',
            [$this, 'renderDashboardPage'],
            'dashicons-admin-generic',
            30
        );

        // Add submenu pages
        add_submenu_page(
            'jankx-dashboard',
            'Settings',
            'Settings',
            'manage_options',
            'jankx-settings',
            [$this, 'renderSettingsPage']
        );
    }

    /**
     * Enqueue admin assets
     */
    public function enqueueAdminAssets(): void
    {
        // Enqueue admin CSS and JS
        wp_enqueue_style(
            'jankx-admin',
            get_template_directory_uri() . '/assets/css/admin.css',
            [],
            \Jankx\Jankx::getFrameworkVersion()
        );

        wp_enqueue_script(
            'jankx-admin',
            get_template_directory_uri() . '/assets/js/admin.js',
            ['jquery'],
            \Jankx\Jankx::getFrameworkVersion(),
            true
        );
    }

    /**
     * Render dashboard page
     */
    public function renderDashboardPage(): void
    {
        ?>
        <div class="wrap">
            <h1>Jankx Dashboard</h1>
            <div class="jankx-dashboard-content">
                <h2>Welcome to Jankx Framework</h2>
                <p>This is the main dashboard page for Jankx framework.</p>
            </div>
        </div>
        <?php
    }

    /**
     * Render settings page
     */
    public function renderSettingsPage(): void
    {
        ?>
        <div class="wrap">
            <h1>Jankx Settings</h1>
            <div class="jankx-settings-content">
                <h2>Framework Settings</h2>
                <p>Configure your Jankx framework settings here.</p>
            </div>
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