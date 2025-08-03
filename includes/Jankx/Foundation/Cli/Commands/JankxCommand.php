<?php

namespace Jankx\Foundation\Cli\Commands;

use WP_CLI;
use WP_CLI_Command;

/**
 * Jankx Framework Management Commands
 *
 * @package Jankx\Foundation\Cli\Commands
 * @since 1.0.0
 */
class JankxCommand extends WP_CLI_Command
{
    /**
     * Show Jankx Framework information
     *
     * ## EXAMPLES
     *
     *     wp jankx info
     *
     * @when after_wp_load
     */
    public function info()
    {
        $theme = wp_get_theme();

        WP_CLI::log('Jankx Framework Information:');
        WP_CLI::log('');
        WP_CLI::log(sprintf('  Theme Name: %s', $theme->get('Name')));
        WP_CLI::log(sprintf('  Theme Version: %s', $theme->get('Version')));
        WP_CLI::log(sprintf('  Text Domain: %s', $theme->get('TextDomain')));
        WP_CLI::log(sprintf('  Template Directory: %s', get_template_directory()));
        WP_CLI::log(sprintf('  Stylesheet Directory: %s', get_stylesheet_directory()));
        WP_CLI::log('');

        // Check if Jankx classes exist
        $classes = [
            'Application' => 'Jankx\Foundation\Application',
            'Config Repository' => 'Jankx\Config\Repository',
            'Gutenberg Repository' => 'Jankx\Support\Blocks\GutenbergRepository',
            'Cache Service' => 'Jankx\Services\CacheService',
            'User Service' => 'Jankx\Services\UserService'
        ];

        WP_CLI::log('Framework Components:');
        foreach ($classes as $name => $class) {
            $status = class_exists($class) ? '✓ Available' : '✗ Missing';
            WP_CLI::log(sprintf('  %s: %s', $name, $status));
        }
        WP_CLI::log('');

        // Check cache status
        $this->showCacheStatus();
    }

    /**
     * Build Gutenberg blocks
     *
     * ## EXAMPLES
     *
     *     wp jankx build-blocks
     *
     * @when after_wp_load
     */
    public function build_blocks()
    {
        WP_CLI::log('Building Gutenberg blocks...');

        $blocksPath = get_template_directory() . '/resources/blocks';

        if (!is_dir($blocksPath)) {
            WP_CLI::error('Blocks directory not found: ' . $blocksPath);
            return;
        }

        $blockDirs = glob($blocksPath . '/*', GLOB_ONLYDIR);
        $builtCount = 0;

        foreach ($blockDirs as $blockDir) {
            $blockName = basename($blockDir);
            $packageJson = $blockDir . '/package.json';

            if (file_exists($packageJson)) {
                WP_CLI::log(sprintf('Building block: %s', $blockName));

                // Change to block directory
                $currentDir = getcwd();
                chdir($blockDir);

                // Run npm build
                $output = [];
                $returnCode = 0;
                exec('npm run build 2>&1', $output, $returnCode);

                if ($returnCode === 0) {
                    WP_CLI::success(sprintf('Block %s built successfully', $blockName));
                    $builtCount++;
                } else {
                    WP_CLI::warning(sprintf('Failed to build block %s: %s', $blockName, implode("\n", $output)));
                }

                // Return to original directory
                chdir($currentDir);
            }
        }

        if ($builtCount > 0) {
            WP_CLI::success(sprintf('%d blocks built successfully', $builtCount));

            // Clear block cache after building
            $this->clearBlockCache();
            WP_CLI::log('Block cache cleared');
        } else {
            WP_CLI::warning('No blocks found to build');
        }
    }

    /**
     * Clear all caches
     *
     * ## EXAMPLES
     *
     *     wp jankx clear-cache
     *
     * @when after_wp_load
     */
    public function clear_cache()
    {
        WP_CLI::log('Clearing all Jankx caches...');

        $this->clearConfigCache();
        $this->clearBlockCache();
        $this->clearWidgetCache();
        $this->clearUserCache();

        WP_CLI::success('All caches cleared successfully!');
    }

    /**
     * Show cache status
     *
     * ## EXAMPLES
     *
     *     wp jankx cache-status
     *
     * @when after_wp_load
     */
    public function cache_status()
    {
        $this->showCacheStatus();
    }

    /**
     * Show cache status
     */
    protected function showCacheStatus()
    {
        $status = [
            'config' => $this->getCacheStatus('jankx_config'),
            'blocks' => $this->getCacheStatus('jankx_blocks'),
            'widgets' => $this->getCacheStatus('jankx_widgets'),
            'users' => $this->getCacheStatus('jankx_users')
        ];

        WP_CLI::log('Cache Status:');
        WP_CLI::log('');

        foreach ($status as $type => $info) {
            $statusText = $info['count'] > 0 ? 'Active' : 'Empty';
            $sizeText = $info['size'] > 0 ? sprintf(' (%.2f KB)', $info['size'] / 1024) : '';
            WP_CLI::log(sprintf('  %s: %s (%d items)%s', ucfirst($type), $statusText, $info['count'], $sizeText));
        }
    }

    /**
     * Clear config cache
     */
    protected function clearConfigCache()
    {
        if (class_exists('Jankx\Foundation\Bootstrap\LoadConfiguration')) {
            \Jankx\Foundation\Bootstrap\LoadConfiguration::clearConfigCache();
        } else {
            wp_cache_flush_group('jankx_config');
        }
    }

    /**
     * Clear block cache
     */
    protected function clearBlockCache()
    {
        if (class_exists('Jankx\Support\Providers\GutenbergServiceProvider')) {
            \Jankx\Support\Providers\GutenbergServiceProvider::clearBlockCache();
        } else {
            wp_cache_flush_group('jankx_blocks');
        }
    }

    /**
     * Clear widget cache
     */
    protected function clearWidgetCache()
    {
        if (class_exists('Jankx\Support\Blocks\WidgetRendererBlock')) {
            \Jankx\Support\Blocks\WidgetRendererBlock::clearWidgetCache();
        } else {
            wp_cache_flush_group('jankx_widgets');
        }
    }

    /**
     * Clear user cache
     */
    protected function clearUserCache()
    {
        wp_cache_flush_group('jankx_users');
    }

    /**
     * Get cache status for a group
     *
     * @param string $group Cache group
     * @return array
     */
    protected function getCacheStatus($group)
    {
        global $wp_object_cache;

        $count = 0;
        $size = 0;

        if (isset($wp_object_cache->cache) && is_array($wp_object_cache->cache)) {
            foreach ($wp_object_cache->cache as $key => $value) {
                if (strpos($key, $group) === 0) {
                    $count++;
                    $size += strlen(serialize($value));
                }
            }
        }

        return [
            'count' => $count,
            'size' => $size
        ];
    }
}
