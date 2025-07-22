<?php

namespace Jankx\Gutenberg;

use Jankx\Facades\Logger;
use Jankx\Facades\Template;
use Jankx\Facades\Options;

/**
 * Jankx Gutenberg AJAX Handler
 *
 * Handles AJAX requests for partial hydration and layout loading.
 */
class AjaxHandler
{
    /**
     * Initialize AJAX handlers
     */
    public static function init()
    {
        // Load layout via AJAX
        add_action('wp_ajax_jankx_load_layout', [self::class, 'loadLayout']);
        add_action('wp_ajax_nopriv_jankx_load_layout', [self::class, 'loadLayout']);

        // Get layout options
        add_action('wp_ajax_jankx_get_layout_options', [self::class, 'getLayoutOptions']);
        add_action('wp_ajax_nopriv_jankx_get_layout_options', [self::class, 'getLayoutOptions']);

        // Validate layout settings
        add_action('wp_ajax_jankx_validate_layout', [self::class, 'validateLayout']);
        add_action('wp_ajax_nopriv_jankx_validate_layout', [self::class, 'validateLayout']);

        // Get layout statistics
        add_action('wp_ajax_jankx_get_layout_stats', [self::class, 'getLayoutStats']);
        add_action('wp_ajax_nopriv_jankx_get_layout_stats', [self::class, 'getLayoutStats']);
    }

    /**
     * Load layout via AJAX
     */
    public static function loadLayout()
    {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'] ?? '', 'jankx_partial_hydration')) {
            wp_send_json_error(['message' => 'Invalid nonce']);
            return;
        }

        // Get request data
        $layoutName = sanitize_text_field($_POST['layout'] ?? '');
        $settings = json_decode(stripslashes($_POST['settings'] ?? '{}'), true);
        $postId = intval($_POST['post_id'] ?? 0);

        if (empty($layoutName)) {
            wp_send_json_error(['message' => 'Layout name is required']);
            return;
        }

        try {
            // Validate layout exists
            if (!Template::has($layoutName)) {
                wp_send_json_error(['message' => 'Layout not found']);
                return;
            }

            // Get template variables
            $variables = Template::getVariables($layoutName, $settings);

            // Render layout
            $html = Template::render($layoutName, $settings, '');

            // Get additional assets
            $styles = self::getLayoutStyles($layoutName, $variables);
            $scripts = self::getLayoutScripts($layoutName, $variables);

            // Prepare response
            $response = [
                'html' => $html,
                'styles' => $styles,
                'scripts' => $scripts,
                'variables' => $variables,
                'layout' => $layoutName,
                'timestamp' => current_time('timestamp')
            ];

            // Log successful load
            Logger::info('Layout loaded via AJAX', [
                'layout' => $layoutName,
                'post_id' => $postId,
                'variables_count' => count($variables)
            ]);

            wp_send_json_success($response);

        } catch (\Exception $e) {
            Logger::error('Error loading layout via AJAX', [
                'layout' => $layoutName,
                'error' => $e->getMessage()
            ]);

            wp_send_json_error([
                'message' => 'Failed to load layout: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Get layout options
     */
    public static function getLayoutOptions()
    {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'] ?? '', 'jankx_layout_options')) {
            wp_send_json_error(['message' => 'Invalid nonce']);
            return;
        }

        $layoutName = sanitize_text_field($_POST['layout'] ?? '');

        if (empty($layoutName)) {
            wp_send_json_error(['message' => 'Layout name is required']);
            return;
        }

        try {
            // Get options for layout
            $options = Options::getForLayout($layoutName);
            $groups = Options::getGroups();

            $response = [
                'options' => $options,
                'groups' => $groups,
                'layout' => $layoutName
            ];

            wp_send_json_success($response);

        } catch (\Exception $e) {
            Logger::error('Error getting layout options', [
                'layout' => $layoutName,
                'error' => $e->getMessage()
            ]);

            wp_send_json_error([
                'message' => 'Failed to get layout options: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Validate layout settings
     */
    public static function validateLayout()
    {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'] ?? '', 'jankx_layout_options')) {
            wp_send_json_error(['message' => 'Invalid nonce']);
            return;
        }

        $layoutName = sanitize_text_field($_POST['layout'] ?? '');
        $settings = json_decode(stripslashes($_POST['settings'] ?? '{}'), true);

        if (empty($layoutName)) {
            wp_send_json_error(['message' => 'Layout name is required']);
            return;
        }

        try {
            $errors = [];
            $warnings = [];

            // Validate each setting
            foreach ($settings as $optionName => $value) {
                if (!Options::has($optionName)) {
                    $warnings[] = "Unknown option: {$optionName}";
                    continue;
                }

                if (!Options::validate($optionName, $value)) {
                    $errors[] = "Invalid value for option: {$optionName}";
                }
            }

            // Check required options
            $requiredOptions = self::getRequiredOptions($layoutName);
            foreach ($requiredOptions as $optionName) {
                if (!isset($settings[$optionName]) || empty($settings[$optionName])) {
                    $errors[] = "Required option missing: {$optionName}";
                }
            }

            $response = [
                'valid' => empty($errors),
                'errors' => $errors,
                'warnings' => $warnings,
                'layout' => $layoutName
            ];

            wp_send_json_success($response);

        } catch (\Exception $e) {
            Logger::error('Error validating layout', [
                'layout' => $layoutName,
                'error' => $e->getMessage()
            ]);

            wp_send_json_error([
                'message' => 'Failed to validate layout: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Get layout statistics
     */
    public static function getLayoutStats()
    {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'] ?? '', 'jankx_partial_hydration')) {
            wp_send_json_error(['message' => 'Invalid nonce']);
            return;
        }

        try {
            $stats = [
                'total_layouts' => count(Template::all()),
                'total_options' => count(Options::all()),
                'total_groups' => count(Options::getGroups()),
                'loaded_layouts' => self::getLoadedLayoutsCount(),
                'cached_layouts' => self::getCachedLayoutsCount(),
                'performance_metrics' => self::getPerformanceMetrics()
            ];

            wp_send_json_success($stats);

        } catch (\Exception $e) {
            Logger::error('Error getting layout stats', [
                'error' => $e->getMessage()
            ]);

            wp_send_json_error([
                'message' => 'Failed to get layout stats: ' . $e->getMessage()
            ]);
        }
    }

    /**
     * Get layout styles
     */
    protected static function getLayoutStyles($layoutName, $variables)
    {
        $styles = [];

        // Get layout-specific styles
        $template = Template::get($layoutName);
        if ($template && isset($template['styles'])) {
            foreach ($template['styles'] as $style) {
                if (is_string($style)) {
                    $styles[] = [
                        'type' => 'external',
                        'href' => $style
                    ];
                } elseif (is_array($style)) {
                    $styles[] = $style;
                }
            }
        }

        // Generate dynamic styles based on variables
        $dynamicStyles = self::generateDynamicStyles($layoutName, $variables);
        if (!empty($dynamicStyles)) {
            $styles[] = [
                'type' => 'inline',
                'content' => $dynamicStyles
            ];
        }

        return $styles;
    }

    /**
     * Get layout scripts
     */
    protected static function getLayoutScripts($layoutName, $variables)
    {
        $scripts = [];

        // Get layout-specific scripts
        $template = Template::get($layoutName);
        if ($template && isset($template['scripts'])) {
            foreach ($template['scripts'] as $script) {
                if (is_string($script)) {
                    $scripts[] = [
                        'type' => 'external',
                        'src' => $script
                    ];
                } elseif (is_array($script)) {
                    $scripts[] = $script;
                }
            }
        }

        // Generate dynamic scripts based on variables
        $dynamicScripts = self::generateDynamicScripts($layoutName, $variables);
        if (!empty($dynamicScripts)) {
            $scripts[] = [
                'type' => 'inline',
                'content' => $dynamicScripts
            ];
        }

        return $scripts;
    }

    /**
     * Generate dynamic styles based on variables
     */
    protected static function generateDynamicStyles($layoutName, $variables)
    {
        $css = '';

        // Generate CSS based on option values
        foreach ($variables as $optionName => $value) {
            if (Options::has($optionName)) {
                $option = Options::get($optionName);

                switch ($option['type']) {
                    case 'color':
                        if (!empty($value)) {
                            $css .= ".jankx-layout-{$layoutName} .jankx-option-{$optionName} { color: {$value}; }\n";
                        }
                        break;

                    case 'range':
                        if (is_numeric($value)) {
                            $unit = $option['unit'] ?? 'px';
                            $css .= ".jankx-layout-{$layoutName} .jankx-option-{$optionName} { padding: {$value}{$unit}; }\n";
                        }
                        break;

                    case 'select':
                        if (!empty($value)) {
                            $css .= ".jankx-layout-{$layoutName} .jankx-option-{$optionName} { background: var(--jankx-{$optionName}-{$value}); }\n";
                        }
                        break;
                }
            }
        }

        return $css;
    }

    /**
     * Generate dynamic scripts based on variables
     */
    protected static function generateDynamicScripts($layoutName, $variables)
    {
        $js = '';

        // Generate JavaScript based on variables
        foreach ($variables as $optionName => $value) {
            if (Options::has($optionName)) {
                $option = Options::get($optionName);

                switch ($option['type']) {
                    case 'toggle':
                        if ($value) {
                            $js .= "document.querySelector('.jankx-layout-{$layoutName}').classList.add('jankx-option-{$optionName}-enabled');\n";
                        }
                        break;

                    case 'select':
                        if (!empty($value)) {
                            $js .= "document.querySelector('.jankx-layout-{$layoutName}').setAttribute('data-{$optionName}', '{$value}');\n";
                        }
                        break;
                }
            }
        }

        return $js;
    }

    /**
     * Get required options for a layout
     */
    protected static function getRequiredOptions($layoutName)
    {
        $requiredOptions = [];
        $template = Template::get($layoutName);

        if ($template && isset($template['blocks'])) {
            foreach ($template['blocks'] as $blockName => $blockConfig) {
                if (isset($blockConfig['required']) && $blockConfig['required']) {
                    $requiredOptions[] = $blockName;
                }
            }
        }

        return $requiredOptions;
    }

    /**
     * Get count of loaded layouts
     */
    protected static function getLoadedLayoutsCount()
    {
        // This would typically come from a database or cache
        // For now, return a placeholder
        return 0;
    }

    /**
     * Get count of cached layouts
     */
    protected static function getCachedLayoutsCount()
    {
        // This would typically come from cache statistics
        // For now, return a placeholder
        return 0;
    }

    /**
     * Get performance metrics
     */
    protected static function getPerformanceMetrics()
    {
        // This would typically come from performance monitoring
        // For now, return placeholder metrics
        return [
            'average_load_time' => 0,
            'total_requests' => 0,
            'cache_hit_rate' => 0,
            'error_rate' => 0
        ];
    }
}