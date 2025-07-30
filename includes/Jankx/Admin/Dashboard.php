<?php

namespace Jankx\Admin;

use Jankx\Facades\Logger;
use Jankx\Config\Repository;

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
     * @var Repository|null
     */
    protected $config;

    /**
     * Get theme name from config
     *
     * @return string
     */
    protected function getThemeName(): string
    {
        try {
            if (!$this->config) {
                $this->config = new Repository();
            }
            return $this->config->get('theme.template.info.name', 'Jankx');
        } catch (\Exception $e) {
            Logger::error('Failed to get theme name from config', ['exception' => $e->getMessage()]);
            return 'Jankx';
        }
    }

    /**
     * Get theme version from config
     *
     * @return string
     */
    protected function getThemeVersion(): string
    {
        try {
            if (!$this->config) {
                $this->config = new Repository();
            }
            return $this->config->get('theme.template.info.version', '2.0.0');
        } catch (\Exception $e) {
            Logger::error('Failed to get theme version from config', ['exception' => $e->getMessage()]);
            return '2.0.0';
        }
    }

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
        $themeName = $this->getThemeName();

        // Add main theme menu page
        add_menu_page(
            $themeName . ' Dashboard',
            $themeName,
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
        $themeName = $this->getThemeName();
        $themeVersion = $this->getThemeVersion();
        ?>
        <div class="wrap">
            <h1><?php echo esc_html($themeName); ?> Dashboard</h1>
            <div class="jankx-dashboard-content">
                <h2>Welcome to <?php echo esc_html($themeName); ?> Framework</h2>
                <p>Version: <?php echo esc_html($themeVersion); ?></p>
                <p>This is the main dashboard page for <?php echo esc_html($themeName); ?> framework.</p>
            </div>
        </div>
        <?php
    }

    /**
     * Render settings page
     */
    public function renderSettingsPage(): void
    {
        $themeName = $this->getThemeName();
        ?>
        <div class="wrap">
            <h1><?php echo esc_html($themeName); ?> Settings</h1>
            <div class="jankx-settings-content">
                <h2>Framework Settings</h2>
                <p>Configure your <?php echo esc_html($themeName); ?> framework settings here.</p>
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