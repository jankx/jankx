<?php

namespace Jankx\Foundation\Cli\Commands;

use WP_CLI;
use WP_CLI_Command;
use Jankx\Helper\Environment;
use Jankx\Facades\Log;

/**
 * Jankx Config Management Commands
 *
 * @package Jankx\Foundation\Cli\Commands
 * @since 2.0.0
 */
class ConfigCommand extends WP_CLI_Command
{
    /**
     * Clone config from parent theme to child theme
     *
     * ## DESCRIPTION
     *
     * Clones configuration files from parent theme to child theme.
     * Only works when active theme is a child theme and config files don't exist in child theme.
     *
     * ## EXAMPLES
     *
     *     wp jankx config clone
     *     wp jankx config clone --force
     *
     * ## OPTIONS
     *
     * [--force]
     * : Force clone even if config files already exist in child theme
     *
     * @when after_wp_load
     */
    public function clone($args, $assoc_args)
    {
        // Check if current theme is child theme
        if (!$this->isChildTheme()) {
            WP_CLI::error('This command only works with child themes.');
            return;
        }

        $force = isset($assoc_args['force']) && $assoc_args['force'];

        WP_CLI::log('Cloning config from parent theme to child theme...');

        $parentConfigPath = get_template_directory() . '/config';
        $childConfigPath = get_stylesheet_directory() . '/config';

        // Check if parent config directory exists
        if (!is_dir($parentConfigPath)) {
            WP_CLI::error('Parent theme config directory not found: ' . $parentConfigPath);
            return;
        }

        // Create child config directory if it doesn't exist
        if (!is_dir($childConfigPath)) {
            if (!mkdir($childConfigPath, 0755, true)) {
                WP_CLI::error('Failed to create child config directory: ' . $childConfigPath);
                return;
            }
            WP_CLI::log('Created child config directory: ' . $childConfigPath);
        }

        // List of config files to clone
        $configFiles = [
            'app.php',
            'providers.php',
            'error.php',
            'layout.php'
        ];

        $clonedCount = 0;
        $skippedCount = 0;

        // Clone config files
        foreach ($configFiles as $configFile) {
            $parentFile = $parentConfigPath . '/' . $configFile;
            $childFile = $childConfigPath . '/' . $configFile;

            // Check if parent file exists
            if (!file_exists($parentFile)) {
                WP_CLI::warning("Parent config file not found: {$configFile}");
                continue;
            }

            // Check if child file already exists
            if (file_exists($childFile) && !$force) {
                WP_CLI::log("Skipping {$configFile} (already exists in child theme)");
                $skippedCount++;
                continue;
            }

            // Clone the file
            if ($this->cloneConfigFile($parentFile, $childFile, $configFile)) {
                WP_CLI::log("Cloned {$configFile}");
                $clonedCount++;
            } else {
                WP_CLI::error("Failed to clone {$configFile}");
            }
        }

        // Clone build files
        $buildFiles = [
            'package.json',
            'webpack.mix.js'
        ];

        $parentBuildPath = get_template_directory();
        $childBuildPath = get_stylesheet_directory();

        foreach ($buildFiles as $buildFile) {
            $parentFile = $parentBuildPath . '/' . $buildFile;
            $childFile = $childBuildPath . '/' . $buildFile;

            // Check if parent file exists
            if (!file_exists($parentFile)) {
                WP_CLI::warning("Parent build file not found: {$buildFile}");
                continue;
            }

            // Check if child file already exists
            if (file_exists($childFile) && !$force) {
                WP_CLI::log("Skipping {$buildFile} (already exists in child theme)");
                $skippedCount++;
                continue;
            }

            // Clone the file
            if ($this->cloneBuildFile($parentFile, $childFile, $buildFile)) {
                WP_CLI::log("Cloned {$buildFile}");
                $clonedCount++;
            } else {
                WP_CLI::error("Failed to clone {$buildFile}");
            }
        }

        // Summary
        WP_CLI::log('');
        WP_CLI::log('Clone Summary:');
        WP_CLI::log("  Cloned: {$clonedCount} files");
        WP_CLI::log("  Skipped: {$skippedCount} files");

        if ($clonedCount > 0) {
            WP_CLI::success('Config files cloned successfully!');

            // Clear config cache
            $this->clearConfigCache();
            WP_CLI::log('Config cache cleared.');

            // Show next steps
            $this->showNextSteps();
        } else {
            WP_CLI::warning('No files were cloned. Use --force to overwrite existing files.');
        }
    }

    /**
     * Check if current theme is a child theme
     *
     * @return bool
     */
    protected function isChildTheme()
    {
        $theme = wp_get_theme();
        return $theme->get_stylesheet() !== $theme->get_template();
    }

    /**
     * Clone a single config file
     *
     * @param string $parentFile
     * @param string $childFile
     * @param string $configFile
     * @return bool
     */
    protected function cloneConfigFile($parentFile, $childFile, $configFile)
    {
        try {
            // Read parent file content
            $content = file_get_contents($parentFile);
            if ($content === false) {
                return false;
            }

            // Remove opening PHP tag from content if it exists
            $content = preg_replace('/^<\?php\s*/', '', $content);

            // Add header comment to child file
            $header = "<?php\n\n";
            $header .= "/**\n";
            $header .= " * {$configFile} - Cloned from parent theme\n";
            $header .= " * \n";
            $header .= " * This file was automatically generated by 'wp jankx config clone'\n";
            $header .= " * You can modify this file to customize your child theme configuration.\n";
            $header .= " * \n";
            $header .= " * Parent theme: " . wp_get_theme(get_template())->get('Name') . "\n";
            $header .= " * Child theme: " . wp_get_theme()->get('Name') . "\n";
            $header .= " * Generated: " . date('Y-m-d H:i:s') . "\n";
            $header .= " */\n\n";

            // Write to child file
            $result = file_put_contents($childFile, $header . $content);

            if ($result === false) {
                return false;
            }

            // Log the action
            if (Environment::isDebugLog()) {
                                    'parent_file' => $parentFile,
                    'child_file' => $childFile,
                    'config_file' => $configFile
                ]);
            }

            return true;
        } catch (\Exception $e) {
            if (Environment::isDebugLog()) {
                Log::error("Failed to clone config file", [
                    'parent_file' => $parentFile,
                    'child_file' => $childFile,
                    'error' => $e->getMessage()
                ]);
            }
            return false;
        }
    }

    /**
     * Clone a single build file
     *
     * @param string $parentFile
     * @param string $childFile
     * @param string $buildFile
     * @return bool
     */
    protected function cloneBuildFile($parentFile, $childFile, $buildFile)
    {
        try {
            // Read parent file content
            $content = file_get_contents($parentFile);
            if ($content === false) {
                return false;
            }

            // Add header comment to child file based on file type
            $header = '';
            if ($buildFile === 'package.json') {
                $header = "// package.json - Cloned from parent theme\n";
                $header .= "// This file was automatically generated by 'wp jankx config clone'\n";
                $header .= "// You can modify this file to customize your child theme build configuration.\n";
                $header .= "// Parent theme: " . wp_get_theme(get_template())->get('Name') . "\n";
                $header .= "// Child theme: " . wp_get_theme()->get('Name') . "\n";
                $header .= "// Generated: " . date('Y-m-d H:i:s') . "\n\n";
            } elseif ($buildFile === 'webpack.mix.js') {
                $header = "// webpack.mix.js - Cloned from parent theme\n";
                $header .= "// This file was automatically generated by 'wp jankx config clone'\n";
                $header .= "// You can modify this file to customize your child theme build configuration.\n";
                $header .= "// Parent theme: " . wp_get_theme(get_template())->get('Name') . "\n";
                $header .= "// Child theme: " . wp_get_theme()->get('Name') . "\n";
                $header .= "// Generated: " . date('Y-m-d H:i:s') . "\n\n";
            }

            // Write to child file
            $result = file_put_contents($childFile, $header . $content);

            if ($result === false) {
                return false;
            }

            // Log the action
            if (Environment::isDebugLog()) {
                                    'parent_file' => $parentFile,
                    'child_file' => $childFile,
                    'build_file' => $buildFile
                ]);
            }

            return true;
        } catch (\Exception $e) {
            if (Environment::isDebugLog()) {
                Log::error("Failed to clone build file", [
                    'parent_file' => $parentFile,
                    'child_file' => $childFile,
                    'error' => $e->getMessage()
                ]);
            }
            return false;
        }
    }

    /**
     * Clear config cache
     *
     * @return void
     */
    protected function clearConfigCache()
    {
        // Clear all config cache
        wp_cache_flush_group('jankx_config');

        if (Environment::isDebugLog()) {
        }
    }

    /**
     * Show next steps after cloning
     *
     * @return void
     */
    protected function showNextSteps()
    {
        WP_CLI::log('');
        WP_CLI::log('Next Steps:');
        WP_CLI::log('  1. Review the cloned config files in your child theme');
        WP_CLI::log('  2. Review the cloned build files (package.json, webpack.mix.js)');
        WP_CLI::log('  3. Modify the config files as needed for your child theme');
        WP_CLI::log('  4. Install npm dependencies: cd wp-content/themes/your-child-theme && npm install');
        WP_CLI::log('  5. Test your child theme configuration');
        WP_CLI::log('  6. Clear cache if needed: wp jankx cache clear');
        WP_CLI::log('');
        WP_CLI::log('Important:');
        WP_CLI::log('  - Child theme configs will override parent theme configs');
        WP_CLI::log('  - Build files allow you to customize asset compilation');
        WP_CLI::log('  - Be careful when modifying providers to avoid breaking the framework');
        WP_CLI::log('  - Test thoroughly after making changes');
    }
}
