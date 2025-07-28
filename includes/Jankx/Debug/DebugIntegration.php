<?php

namespace Jankx\Debug;

use Illuminate\Container\Container;
use Jankx\Debug\DebugBootstrap;
use Jankx\Debug\Helpers\DebugHelper;

/**
 * Debug Integration
 *
 * Handles integration of debug system into Jankx theme
 *
 * @package Jankx\Debug
 * @since 2.0.0
 */
class DebugIntegration
{
    /**
     * Initialize debug integration
     *
     * @param Container $container
     * @since 2.0.0
     */
    public static function init(Container $container): void
    {
        // Initialize debug system
        DebugBootstrap::init($container);

        // Add theme-specific debug information
        add_action('jankx/debug/add_plugin_info', [self::class, 'addThemeDebugInfo'], 10, 1);

        // Add performance monitoring
        add_action('wp_footer', [self::class, 'addPerformanceInfo'], 999);
        add_action('admin_footer', [self::class, 'addPerformanceInfo'], 999);
    }

    /**
     * Add theme debug information
     *
     * @param $pluginDebugService
     * @since 2.0.0
     */
    public static function addThemeDebugInfo($pluginDebugService): void
    {
        // Add theme information
        $theme = wp_get_theme();
        $pluginDebugService->addDebugInfo(
            'Jankx Theme',
            sprintf('Version %s - %s', $theme->get('Version'), $theme->get('Name'))
        );

        // Add child theme information if exists
        if (is_child_theme()) {
            $childTheme = wp_get_theme();
            $pluginDebugService->addDebugInfo(
                'Child Theme',
                sprintf('Version %s - %s', $childTheme->get('Version'), $childTheme->get('Name'))
            );
        }

        // Add WordPress information
        $pluginDebugService->addDebugInfo(
            'WordPress',
            sprintf('Version %s - %s', get_bloginfo('version'), get_bloginfo('name'))
        );

        // Add PHP information
        $pluginDebugService->addDebugInfo(
            'PHP',
            sprintf('Version %s - Memory Limit: %s', PHP_VERSION, ini_get('memory_limit'))
        );

        // Add server information
        $pluginDebugService->addDebugInfo(
            'Server',
            sprintf('%s - %s', $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown', $_SERVER['SERVER_NAME'] ?? 'Unknown')
        );
    }

    /**
     * Add performance information
     *
     * @since 2.0.0
     */
    public static function addPerformanceInfo(): void
    {
        if (!DebugHelper::isEnabled()) {
            return;
        }

        // Log performance metrics
        $debugInfo = DebugHelper::getDebugInfo();

        if (!empty($debugInfo)) {
            $performanceData = [
                'response_time' => $debugInfo['response_time'] ?? 0,
                'memory_usage' => DebugHelper::formatBytes($debugInfo['memory_usage'] ?? 0),
                'query_count' => $debugInfo['query_count'] ?? 0,
                'url' => $_SERVER['REQUEST_URI'] ?? '',
                'method' => $_SERVER['REQUEST_METHOD'] ?? '',
                'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? ''
            ];

            DebugHelper::log('Page Performance', $performanceData);
        }
    }

    /**
     * Get debug panel HTML
     *
     * @return string
     * @since 2.0.0
     */
    public static function getDebugPanel(): string
    {
        if (!DebugHelper::isEnabled()) {
            return '';
        }

        $debugInfo = DebugHelper::getDebugInfo();

        if (empty($debugInfo)) {
            return '';
        }

        // Use the renderer to generate HTML
        $renderer = new \Jankx\Debug\Renderers\DebugInfoRenderer();
        return $renderer->render($debugInfo);
    }

    /**
     * Display debug panel
     *
     * @since 2.0.0
     */
    public static function displayDebugPanel(): void
    {
        if (!DebugHelper::isEnabled()) {
            return;
        }

        echo self::getDebugPanel();
    }

    /**
     * Add debug panel to footer
     *
     * @since 2.0.0
     */
    public static function addDebugPanelToFooter(): void
    {
        if (!DebugHelper::isEnabled()) {
            return;
        }

        add_action('wp_footer', [self::class, 'displayDebugPanel'], 999);
        add_action('admin_footer', [self::class, 'displayDebugPanel'], 999);
    }

    /**
     * Enable debug mode
     *
     * @since 2.0.0
     */
    public static function enableDebugMode(): void
    {
        if (!defined('JANKX_DEBUG')) {
            define('JANKX_DEBUG', true);
        }
    }

    /**
     * Disable debug mode
     *
     * @since 2.0.0
     */
    public static function disableDebugMode(): void
    {
        if (defined('JANKX_DEBUG')) {
            define('JANKX_DEBUG', false);
        }
    }
}