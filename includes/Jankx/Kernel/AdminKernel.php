<?php

namespace Jankx\Kernel;

use Jankx\Contracts\KernelInterface;
use Jankx\Bootstrappers\Dashboard\AdminBootstrapper;
use Jankx\Bootstrappers\Global\ThemeBootstrapper;
use Jankx\Bootstrappers\Gutenberg\GutenbergBootstrapper;
use Jankx\Jankx;

/**
 * Admin Kernel
 *
 * Handles admin-specific features (excluding Gutenberg editor)
 * Gutenberg editor is handled by GutenbergBackendKernel
 *
 * @package Jankx\Kernel
 */
class AdminKernel extends Kernel implements KernelInterface
{
    /**
     * Get kernel type
     */
    public function getKernelType(): string
    {
        return 'admin';
    }

    /**
     * Check if this kernel should be loaded
     */
    public function shouldLoad(): bool
    {
        return is_admin() && !$this->isGutenbergEditor();
    }

    /**
     * Check if current page is Gutenberg editor
     */
    protected function isGutenbergEditor(): bool
    {
        global $pagenow;

        // Check if we're in post editor
        if (!in_array($pagenow, ['post.php', 'post-new.php'])) {
            return false;
        }

        // Check if Gutenberg is active
        if (!function_exists('use_block_editor_for_post')) {
            return false;
        }

        // Get current post type
        $post_type = $this->getCurrentPostType();
        if (!$post_type) {
            return false;
        }

        // Check if Gutenberg is enabled for this post type
        return use_block_editor_for_post_type($post_type);
    }

    /**
     * Get current post type
     */
    protected function getCurrentPostType(): ?string
    {
        global $post;

        if ($post) {
            return $post->post_type;
        }

        // Try to get from URL
        if (isset($_GET['post_type'])) {
            return sanitize_text_field($_GET['post_type']);
        }

        // Default to post
        return 'post';
    }

    /**
     * Register bootstrappers
     */
    protected function registerBootstrappers(): void
    {
        // Theme bootstrapper (highest priority)
        $this->addBootstrapper(ThemeBootstrapper::class);

        // Admin bootstrapper (excluding Gutenberg)
        $this->addBootstrapper(AdminBootstrapper::class);

        // Debug bootstrapper (when JANKX_DEBUG is enabled)
        if (defined('JANKX_DEBUG') && JANKX_DEBUG) {
            $this->addBootstrapper(\Jankx\Bootstrappers\Global\DebugBootstrapper::class);
        }

        // Gutenberg bootstrapper (only when in Gutenberg editor)
        if ($this->isGutenbergEditor()) {
            $this->addBootstrapper(GutenbergBootstrapper::class);
        }

        // Allow child themes to add custom bootstrappers
        $customBootstrappers = apply_filters('jankx/admin/bootstrappers', []);
        foreach ($customBootstrappers as $bootstrapper) {
            $this->addBootstrapper($bootstrapper);
        }
    }

    /**
     * Register services
     */
    protected function registerServices(): void
    {
        // Admin-specific services (excluding Gutenberg)
        $this->addService('admin.dashboard', [
            'class' => \Jankx\Admin\Dashboard::class,
            'params' => []
        ]);
    }

    /**
     * Register hooks
     */
    protected function registerHooks(): void
    {
        // Admin-specific hooks (excluding Gutenberg)
        add_action('admin_menu', [$this, 'registerAdminMenu']);
        add_action('admin_init', [$this, 'initializeAdmin']);
        add_action('admin_enqueue_scripts', [$this, 'enqueueAdminAssets']);
    }

    /**
     * Register filters
     */
    protected function registerFilters(): void
    {
        // Admin-specific filters (excluding Gutenberg)
        add_filter('jankx/admin/menu_items', [$this, 'filterAdminMenuItems']);
        add_filter('jankx/admin/dashboard_widgets', [$this, 'filterDashboardWidgets']);
    }

    /**
     * Register admin menu
     */
    public function registerAdminMenu(): void
    {
        $container = $this->getContainer();

        if ($container->has('admin.dashboard')) {
            $dashboard = $container->get('admin.dashboard');
            $dashboard->initialize();
        }
    }

    /**
     * Initialize admin
     */
    public function initializeAdmin(): void
    {
        $container = $this->getContainer();

        if ($container->has('admin.dashboard')) {
            $dashboard = $container->get('admin.dashboard');
            $dashboard->initialize();
        }
    }

    /**
     * Enqueue admin assets
     */
    public function enqueueAdminAssets(): void
    {
        // Only load admin assets, not Gutenberg assets
        wp_enqueue_style(
            'jankx-admin',
            get_template_directory_uri() . '/assets/css/admin.css',
            [],
            Jankx::getFrameworkVersion()
        );

        wp_enqueue_script(
            'jankx-admin',
            get_template_directory_uri() . '/assets/js/admin.js',
            ['jquery'],
            Jankx::getFrameworkVersion(),
            true
        );
    }

    /**
     * Filter admin menu items
     */
    public function filterAdminMenuItems($items): array
    {
        return apply_filters('jankx/admin/menu_items', $items);
    }

    /**
     * Filter dashboard widgets
     */
    public function filterDashboardWidgets($widgets): array
    {
        return apply_filters('jankx/admin/dashboard_widgets', $widgets);
    }

    /**
     * Boot the kernel
     */
    public function boot(): void
    {
        if (!$this->shouldLoad()) {
            return;
        }

        parent::boot();

        // Additional boot logic for admin (excluding Gutenberg)
        do_action('jankx/admin/booted', $this);
    }

    /**
     * Check if kernel is booted
     */
    public function isBooted(): bool
    {
        return parent::isBooted();
    }
}
