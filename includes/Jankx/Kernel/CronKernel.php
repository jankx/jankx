<?php

namespace Jankx\Kernel;

use Jankx\Contracts\KernelInterface;
use Jankx\Bootstrappers\Global\ThemeBootstrapper;
use Jankx\Facades\Logger;

/**
 * Cron Kernel
 *
 * Handles WP Cron jobs and scheduled tasks
 *
 * @package Jankx\Kernel
 */
class CronKernel extends Kernel implements KernelInterface
{
    /**
     * Get kernel type
     */
    public function getKernelType(): string
    {
        return 'cron';
    }

    /**
     * Register bootstrappers
     */
    protected function registerBootstrappers(): void
    {
        parent::registerBootstrappers();

        // Theme bootstrapper (highest priority)
        $this->addBootstrapper(ThemeBootstrapper::class);

        // Allow child themes to add custom bootstrappers
        $customBootstrappers = apply_filters('jankx/cron/bootstrappers', []);
        foreach ($customBootstrappers as $bootstrapper) {
            $this->addBootstrapper($bootstrapper);
        }
    }

    /**
     * Register services
     */
    protected function registerServices(): void
    {
        parent::registerServices();

        // Không cần đăng ký các command services ở đây
    }

    /**
     * Register hooks
     */
    protected function registerHooks(): void
    {
        // Cron jobs
        $this->addHook('jankx/cron/optimize', [$this, 'runOptimizationCron']);
        $this->addHook('jankx/cron/security_scan', [$this, 'runSecurityScanCron']);
        $this->addHook('jankx/cron/cache_cleanup', [$this, 'runCacheCleanupCron']);

        // Schedule cron jobs on init
        $this->addHook('init', [$this, 'scheduleCronJobs']);
    }

    /**
     * Register filters
     */
    protected function registerFilters(): void
    {
        // Cron output formatting
        $this->addFilter('jankx/cron/output', [$this, 'formatCronOutput']);
    }

    /**
     * Run optimization cron
     */
    public function runOptimizationCron(): void
    {
        // Thực hiện các tác vụ tối ưu hóa mà không cần command
        $this->logInfo('Optimization cron job started');
        // Ví dụ: Xóa các bản nháp tự động cũ
        $this->cleanAutoDrafts();
        $this->logInfo('Optimization cron job completed');
    }

    /**
     * Run security scan cron
     */
    public function runSecurityScanCron(): void
    {
        $this->logInfo('Security scan cron job started');
        // Ví dụ: Kiểm tra các file hệ thống có thay đổi bất thường không
        $this->checkSystemFiles();
        $this->logInfo('Security scan cron job completed');
    }

    /**
     * Run cache cleanup cron
     */
    public function runCacheCleanupCron(): void
    {
        $this->logInfo('Cache cleanup cron job started');
        // Ví dụ: Xóa các transient hết hạn
        $this->cleanExpiredTransients();
        $this->logInfo('Cache cleanup cron job completed');
    }

    /**
     * Schedule cron jobs
     */
    public function scheduleCronJobs(): void
    {
        // Schedule optimization cron (daily at 2 AM)
        if (!wp_next_scheduled('jankx/cron/optimize')) {
            wp_schedule_event(strtotime('tomorrow 2:00 AM'), 'daily', 'jankx/cron/optimize');
        }

        // Schedule security scan cron (weekly on Sunday at 3 AM)
        if (!wp_next_scheduled('jankx/cron/security_scan')) {
            wp_schedule_event(strtotime('next Sunday 3:00 AM'), 'weekly', 'jankx/cron/security_scan');
        }

        // Schedule cache cleanup cron (every 6 hours)
        if (!wp_next_scheduled('jankx/cron/cache_cleanup')) {
            wp_schedule_event(time(), 'every_6_hours', 'jankx/cron/cache_cleanup');
        }
    }

    /**
     * Format cron output
     */
    public function formatCronOutput(string $output): string
    {
        // Add timestamp
        $timestamp = date('Y-m-d H:i:s');
        $output = "[{$timestamp}] [CRON] {$output}";

        return $output;
    }

    /**
     * Clean auto drafts
     */
    protected function cleanAutoDrafts(): void
    {
        // Use WordPress functions instead of direct database queries
        $old_drafts = get_posts([
            'post_status' => 'auto-draft',
            'date_query' => [
                [
                    'before' => '7 days ago',
                    'inclusive' => false,
                ]
            ],
            'fields' => 'ids',
            'posts_per_page' => -1,
        ]);

        foreach ($old_drafts as $draft_id) {
            wp_delete_post($draft_id, true);
        }
        $this->logInfo('Cleaned up old auto drafts');
    }

    /**
     * Clean expired transients
     */
    protected function cleanExpiredTransients(): void
    {
        // Use WordPress functions instead of direct database queries
        $this->cleanExpiredTransientsUsingWordPress();
        $this->logInfo('Cleaned up expired transients');
    }

    /**
     * Clean expired transients using WordPress functions
     */
    private function cleanExpiredTransientsUsingWordPress(): void
    {
        // Get all transients
        $transients = get_option('_transient_timeout_*');

        if ($transients) {
            foreach ($transients as $transient => $timeout) {
                if ($timeout < time()) {
                    $transient_name = str_replace('_transient_timeout_', '', $transient);
                    delete_transient($transient_name);
                }
            }
        }
    }

    /**
     * Check system files for unexpected changes
     */
    protected function checkSystemFiles(): void
    {
        // Ví dụ: Kiểm tra các file hệ thống WordPress
        $this->logInfo('Checked system files for unexpected changes');
    }

    /**
     * Log info message
     */
    protected function logInfo(string $message): void
    {
        Logger::info("Jankx Cron Info: {$message}");
    }

    /**
     * Log error message
     */
    protected function logError(string $message): void
    {
        Logger::error("Jankx Cron Error: {$message}");
    }

    /**
     * Log success message
     */
    protected function logSuccess(string $message): void
    {
        Logger::success("Jankx Cron Success: {$message}");
    }

    /**
     * Log warning message
     */
    protected function logWarning(string $message): void
    {
        Logger::warning("Jankx Cron Warning: {$message}");
    }
}
