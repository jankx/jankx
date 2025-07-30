<?php

namespace Jankx\Kernel;

if (!defined('ABSPATH')) {
    exit('Cheating huh?');
}


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
     * Register hooks
     */
    protected function registerHooks(): void
    {
        $this->hooks = [
            'admin_init' => ['Jankx\Kernel\AdminKernel', 'initializeAdmin'],
            'admin_menu' => ['Jankx\Kernel\AdminKernel', 'setupAdminMenu'],
            'admin_enqueue_scripts' => ['Jankx\Kernel\AdminKernel', 'enqueueAdminAssets'],
        ];
    }

    /**
     * Register filters
     */
    protected function registerFilters(): void
    {
        $this->filters = [
            'jankx_admin_page_title' => ['Jankx\Kernel\AdminKernel', 'filterPageTitle'],
        ];
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
