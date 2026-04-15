<?php

namespace App\Services;

use Jankx\Facades\Log;

/**
 * Theme Options CSS Generator
 *
 * Generates dynamic CSS from theme options and injects it into the site.
 * Creates CSS variables that can be used by both blocks and global styles.
 *
 * @package App\Services
 */
class ThemeOptionsCSSGenerator
{
    /**
     * @var ThemeOptionsService
     */
    protected $themeOptions;

    /**
     * @var string
     */
    protected $handle = 'jankx-theme-options-css';

    /**
     * CSS variables mapping
     * Maps theme option keys to CSS variable names
     *
     * @var array
     */
    protected $cssVarMapping = [
        // Colors
        'primary_color' => '--jankx-primary-color',
        'secondary_color' => '--jankx-secondary-color',

        // Layout
        'container_width' => '--jankx-container-width',

        // Typography
        'body_typography' => [
            'font-family' => '--jankx-body-font-family',
            'font-size' => '--jankx-body-font-size',
            'font-weight' => '--jankx-body-font-weight',
            'line-height' => '--jankx-body-line-height',
            'color' => '--jankx-body-text-color',
        ],

        // Sidebar
        'sidebar_position' => '--jankx-sidebar-position',
    ];

    /**
     * Default values for theme options
     *
     * @var array
     */
    protected $defaults = [
        'primary_color' => '#ff5722',
        'secondary_color' => '#009688',
        'container_width' => '1200px',
        'body_typography' => [
            'font-family' => 'Inter',
            'font-size' => '16px',
            'font-weight' => '400',
            'line-height' => '1.6',
            'color' => '#222222',
        ],
        'sidebar_position' => 'right',
    ];

    public function __construct(ThemeOptionsService $themeOptions)
    {
        $this->themeOptions = $themeOptions;
    }

    /**
     * Initialize the CSS generator
     *
     * @return void
     */
    public function init(): void
    {
        // Enqueue CSS in frontend
        add_action('wp_enqueue_scripts', [$this, 'enqueueDynamicCSS'], 20);

        // Enqueue CSS in admin (for block editor)
        add_action('admin_enqueue_scripts', [$this, 'enqueueAdminCSS'], 20);

        // Add CSS for block editor iframe
        add_action('enqueue_block_assets', [$this, 'enqueueBlockEditorCSS'], 20);
    }

    /**
     * Enqueue dynamic CSS for frontend
     *
     * @return void
     */
    public function enqueueDynamicCSS(): void
    {
        $css = $this->generateCSS();

        if (empty($css)) {
            return;
        }

        // Register a dummy handle and add inline CSS
        wp_register_style($this->handle, false, [], '1.0.0');
        wp_enqueue_style($this->handle);
        wp_add_inline_style($this->handle, $css);
    }

    /**
     * Enqueue CSS for admin
     *
     * @return void
     */
    public function enqueueAdminCSS(): void
    {
        $screen = get_current_screen();

        // Only on block editor pages or theme options pages
        if (!$screen || (!in_array($screen->base, ['post', 'page', 'widgets', 'site-editor']) && strpos($screen->id, 'jankx') === false)) {
            return;
        }

        $css = $this->generateCSS();

        if (empty($css)) {
            return;
        }

        wp_register_style($this->handle . '-admin', false, [], '1.0.0');
        wp_enqueue_style($this->handle . '-admin');
        wp_add_inline_style($this->handle . '-admin', $css);
    }

    /**
     * Enqueue CSS for block editor
     *
     * @return void
     */
    public function enqueueBlockEditorCSS(): void
    {
        // Only in block editor context
        if (!is_admin() && !defined('REST_REQUEST')) {
            return;
        }

        $css = $this->generateCSS();

        if (empty($css)) {
            return;
        }

        // For block editor iframe, we need to use a different approach
        if (wp_script_is('wp-block-editor', 'enqueued')) {
            wp_register_style($this->handle . '-blocks', false, ['wp-edit-blocks'], '1.0.0');
            wp_enqueue_style($this->handle . '-blocks');
            wp_add_inline_style($this->handle . '-blocks', $css);
        }
    }

    /**
     * Generate CSS from theme options
     *
     * @return string
     */
    public function generateCSS(): string
    {
        $css = [];
        $css[] = ':root {';

        // Generate color variables
        $primaryColor = $this->getOption('primary_color', $this->defaults['primary_color']);
        $css[] = sprintf('  %s: %s;', $this->cssVarMapping['primary_color'], $primaryColor);

        $secondaryColor = $this->getOption('secondary_color', $this->defaults['secondary_color']);
        $css[] = sprintf('  %s: %s;', $this->cssVarMapping['secondary_color'], $secondaryColor);

        // Generate layout variables
        $containerWidth = $this->getOption('container_width', 1200);
        // Ensure container_width has px unit
        $containerWidth = is_numeric($containerWidth) ? $containerWidth . 'px' : $containerWidth;
        $css[] = sprintf('  %s: %s;', $this->cssVarMapping['container_width'], $containerWidth);

        // Generate typography variables
        $bodyTypography = $this->getOption('body_typography', $this->defaults['body_typography']);

        if (is_array($bodyTypography)) {
            foreach ($this->cssVarMapping['body_typography'] as $key => $varName) {
                $value = $bodyTypography[$key] ?? $this->defaults['body_typography'][$key];
                if (!empty($value)) {
                    $css[] = sprintf('  %s: %s;', $varName, $value);
                }
            }
        }

        // Sidebar position
        $sidebarPosition = $this->getOption('sidebar_position', $this->defaults['sidebar_position']);
        $css[] = sprintf('  %s: %s;', $this->cssVarMapping['sidebar_position'], $sidebarPosition);

        // Add utility variables derived from primary/secondary colors
        $css[] = sprintf('  --jankx-primary-color-rgb: %s;', $this->hexToRgb($primaryColor));
        $css[] = sprintf('  --jankx-secondary-color-rgb: %s;', $this->hexToRgb($secondaryColor));

        $css[] = '}';

        // Add body styles using the variables
        $css[] = '';
        $css[] = 'body, .editor-styles-wrapper {';
        $css[] = '  font-family: var(--jankx-body-font-family, inherit);';
        $css[] = '  font-size: var(--jankx-body-font-size, inherit);';
        $css[] = '  font-weight: var(--jankx-body-font-weight, inherit);';
        $css[] = '  line-height: var(--jankx-body-line-height, inherit);';
        $css[] = '  color: var(--jankx-body-text-color, inherit);';
        $css[] = '}';

        // Add container styles
        $css[] = '';
        $css[] = '.jankx-container, .wp-block-group .alignfull > .wp-block-group__inner-container {';
        $css[] = '  max-width: var(--jankx-container-width, 1200px);';
        $css[] = '  margin-left: auto;';
        $css[] = '  margin-right: auto;';
        $css[] = '}';

        return implode("\n", $css);
    }

    /**
     * Get option value from theme options service
     *
     * @param string $key
     * @param mixed $default
     * @return mixed
     */
    protected function getOption($key, $default = null)
    {
        return $this->themeOptions->getOption($key, $default);
    }

    /**
     * Convert hex color to RGB
     *
     * @param string $hex
     * @return string
     */
    protected function hexToRgb(string $hex): string
    {
        $hex = ltrim($hex, '#');

        if (strlen($hex) === 3) {
            $r = hexdec(substr($hex, 0, 1) . substr($hex, 0, 1));
            $g = hexdec(substr($hex, 1, 1) . substr($hex, 1, 1));
            $b = hexdec(substr($hex, 2, 1) . substr($hex, 2, 1));
        } else {
            $r = hexdec(substr($hex, 0, 2));
            $g = hexdec(substr($hex, 2, 2));
            $b = hexdec(substr($hex, 4, 2));
        }

        return sprintf('%d, %d, %d', $r, $g, $b);
    }

    /**
     * Get all CSS variables as array
     * Useful for passing to JavaScript
     *
     * @return array
     */
    public function getCSSVariables(): array
    {
        $primaryColor = $this->getOption('primary_color', $this->defaults['primary_color']);
        $secondaryColor = $this->getOption('secondary_color', $this->defaults['secondary_color']);
        $containerWidth = $this->getOption('container_width', 1200);
        $bodyTypography = $this->getOption('body_typography', $this->defaults['body_typography']);
        $sidebarPosition = $this->getOption('sidebar_position', $this->defaults['sidebar_position']);

        return [
            'primaryColor' => $primaryColor,
            'secondaryColor' => $secondaryColor,
            'containerWidth' => is_numeric($containerWidth) ? $containerWidth . 'px' : $containerWidth,
            'bodyTypography' => $bodyTypography,
            'sidebarPosition' => $sidebarPosition,
            'cssVarPrefix' => '--jankx-',
        ];
    }
}
