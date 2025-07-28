<?php

namespace Jankx\Kernel;

use Jankx\Contracts\KernelInterface;
use Jankx\Bootstrappers\CLI\CLIBootstrapper;
use Jankx\Bootstrappers\Global\ThemeBootstrapper;
use Jankx\Facades\Logger;

/**
 * CLI Kernel
 *
 * Handles CLI-specific features and commands
 *
 * @package Jankx\Kernel
 */
class CLIKernel extends Kernel implements KernelInterface
{
    /**
     * Get kernel type
     */
    public function getKernelType(): string
    {
        return 'cli';
    }

    /**
     * Check if this kernel should run
     */
    public function shouldRun(): bool
    {
        return defined('WP_CLI') && WP_CLI;
    }

    /**
     * Bootstrap the kernel (alias for boot method)
     */
    public function bootstrap(): void
    {
        $this->boot();
    }

    /**
     * Register bootstrappers
     */
    protected function registerBootstrappers(): void
    {
        // Theme bootstrapper (highest priority)
        $this->addBootstrapper(ThemeBootstrapper::class);

        // CLI bootstrapper
        $this->addBootstrapper(CLIBootstrapper::class);

        // Allow child themes to add custom bootstrappers
        $customBootstrappers = apply_filters('jankx/cli/bootstrappers', []);
        foreach ($customBootstrappers as $bootstrapper) {
            $this->addBootstrapper($bootstrapper);
        }
    }

    /**
     * Register services
     */
    protected function registerServices(): void
    {
        // CLI services will be registered by CLIBootstrapper
        // No immediate services needed for CLI kernel
    }

    /**
     * Register hooks
     */
    protected function registerHooks(): void
    {
        // CLI initialization
        $this->addHook('cli_init', [$this, 'initializeCLI']);

        // WP-CLI commands (if WP-CLI is available)
        if (defined('WP_CLI') && WP_CLI) {
            $this->addHook('cli_init', [$this, 'registerWPCLICommands']);
        }
    }

    /**
     * Register filters
     */
    protected function registerFilters(): void
    {
        // CLI output formatting
        $this->addFilter('jankx/cli/output', [$this, 'formatCLIOutput']);
    }

    /**
     * Initialize CLI environment
     */
    public function initializeCLI(): void
    {
        // Check CLI requirements
        if (!$this->checkRequirements()) {
            $this->logError('CLI requirements not met');
            return;
        }

        // Log CLI initialization
        $this->logInfo('CLI Kernel initialized successfully');

        // Allow child themes to hook into CLI initialization
        do_action('jankx/cli/initialized');
    }

    /**
     * Register WP-CLI commands
     */
    public function registerWPCLICommands(): void
    {
        if (!class_exists('WP_CLI')) {
            return;
        }

        // Register Jankx CLI commands
        \Jankx\CLI\CLICommands::register();

        // Basic Jankx commands
        \WP_CLI::add_command('jankx info', [$this, 'showFrameworkInfo']);
        \WP_CLI::add_command('jankx version', [$this, 'showVersion']);

        // Allow child themes to register custom WP-CLI commands
        do_action('jankx/wpcli/register_commands');
    }

        /**
     * Show framework information
     */
    public function showFrameworkInfo(): void
    {
        $info = $this->getEnvironmentInfo();

        \WP_CLI::line('🎯 Jankx Framework Information');
        \WP_CLI::line('================================');
        \WP_CLI::line('');

        // System Information
        \WP_CLI::line('🖥️  System Information:');
        \WP_CLI::line("   • PHP Version: {$info['php_version']}");
        \WP_CLI::line("   • WordPress Version: {$info['wordpress_version']}");
        \WP_CLI::line("   • Jankx Version: {$info['jankx_version']}");
        \WP_CLI::line('');

        // Performance Information
        \WP_CLI::line('⚡ Performance Settings:');
        \WP_CLI::line("   • Memory Limit: {$info['memory_limit']}");
        \WP_CLI::line("   • Max Execution Time: {$info['max_execution_time']}s");
        \WP_CLI::line("   • Upload Max Filesize: {$info['upload_max_filesize']}");
        \WP_CLI::line("   • Post Max Size: {$info['post_max_size']}");
        \WP_CLI::line('');

        // Show active plugins
        $this->showActivePlugins();
    }

    /**
     * Show version information
     */
    public function showVersion(): void
    {
        \WP_CLI::line("Jankx Framework Version: " . \Jankx\Jankx::getFrameworkVersion());
    }

        /**
     * Show active plugins information
     */
    public function showActivePlugins(): void
    {
        if (!function_exists('get_plugins')) {
            require_once ABSPATH . 'wp-admin/includes/plugin.php';
        }

        $active_plugins = get_option('active_plugins');
        $all_plugins = get_plugins();

        if (empty($active_plugins)) {
            \WP_CLI::line('🔌 Active Plugins: None');
            return;
        }

        \WP_CLI::line('🔌 Active Plugins (' . count($active_plugins) . '):');

        foreach ($active_plugins as $index => $plugin_file) {
            $number = $index + 1;

            if (isset($all_plugins[$plugin_file])) {
                $plugin_data = $all_plugins[$plugin_file];
                $plugin_name = $plugin_data['Name'] ?? basename($plugin_file, '.php');
                $plugin_version = $plugin_data['Version'] ?? 'Unknown';
                $plugin_author = $plugin_data['Author'] ?? 'Unknown';
                $plugin_description = $plugin_data['Description'] ?? '';

                \WP_CLI::line("   {$number}. {$plugin_name} v{$plugin_version}");
                \WP_CLI::line("      👤 Author: {$plugin_author}");
                if (!empty($plugin_description)) {
                    \WP_CLI::line("      📝 Description: {$plugin_description}");
                }
                \WP_CLI::line('');
            } else {
                \WP_CLI::line("   {$number}. " . basename($plugin_file, '.php') . " (Plugin data not found)");
                \WP_CLI::line('');
            }
        }
    }

    /**
     * Format CLI output
     */
    public function formatCLIOutput(string $output): string
    {
        // Add timestamp
        $timestamp = date('Y-m-d H:i:s');
        $output = "[{$timestamp}] {$output}";

        // Add color coding for different message types
        if (strpos($output, 'ERROR') !== false) {
            $output = "\033[31m{$output}\033[0m"; // Red
        } elseif (strpos($output, 'SUCCESS') !== false) {
            $output = "\033[32m{$output}\033[0m"; // Green
        } elseif (strpos($output, 'WARNING') !== false) {
            $output = "\033[33m{$output}\033[0m"; // Yellow
        } elseif (strpos($output, 'INFO') !== false) {
            $output = "\033[36m{$output}\033[0m"; // Cyan
        }

        return $output;
    }

    /**
     * Get CLI environment info
     */
    public function getEnvironmentInfo(): array
    {
        return [
            'php_version' => PHP_VERSION,
            'wordpress_version' => get_bloginfo('version'),
            'jankx_version' => \Jankx\Jankx::getFrameworkVersion(),
            'memory_limit' => ini_get('memory_limit'),
            'max_execution_time' => ini_get('max_execution_time'),
            'upload_max_filesize' => ini_get('upload_max_filesize'),
            'post_max_size' => ini_get('post_max_size'),
        ];
    }

    /**
     * Check CLI requirements
     */
    public function checkRequirements(): bool
    {
        $requirements = [
            'php_version' => version_compare(PHP_VERSION, '7.4', '>='),
            'memory_limit' => $this->checkMemoryLimit(),
            'execution_time' => $this->checkExecutionTime(),
        ];

        $failed_requirements = array_filter($requirements, function ($met) {
            return !$met;
        });

        if (!empty($failed_requirements)) {
            $this->logError('CLI requirements not met: ' . implode(', ', array_keys($failed_requirements)));
            return false;
        }

        return true;
    }

    /**
     * Check memory limit
     */
    protected function checkMemoryLimit(): bool
    {
        $memory_limit = ini_get('memory_limit');
        $memory_limit_bytes = $this->convertToBytes($memory_limit);
        return $memory_limit_bytes >= 128 * 1024 * 1024; // 128MB minimum
    }

    /**
     * Check execution time
     */
    protected function checkExecutionTime(): bool
    {
        $max_execution_time = ini_get('max_execution_time');
        return $max_execution_time == 0 || $max_execution_time >= 30; // 30 seconds minimum
    }

    /**
     * Convert memory string to bytes
     */
    protected function convertToBytes(string $memory_string): int
    {
        $memory_string = trim($memory_string);
        $last = strtolower($memory_string[strlen($memory_string) - 1]);
        $value = (int) $memory_string;

        switch ($last) {
            case 'g':
                $value *= 1024;
            case 'm':
                $value *= 1024;
            case 'k':
                $value *= 1024;
        }

        return $value;
    }

    /**
     * Log error message
     */
    protected function logError(string $message): void
    {
        Logger::error("Jankx CLI Error: {$message}");
    }

    /**
     * Log info message
     */
    protected function logInfo(string $message): void
    {
        Logger::info("Jankx CLI Info: {$message}");
    }

    /**
     * Log success message
     */
    protected function logSuccess(string $message): void
    {
        Logger::success("Jankx CLI Success: {$message}");
    }

    /**
     * Log warning message
     */
    protected function logWarning(string $message): void
    {
        Logger::warning("Jankx CLI Warning: {$message}");
    }
}
