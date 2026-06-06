<?php

namespace App\Services;

use Jankx\Facades\Log;
use Jankx\Facades\Config;

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
        'link_color' => '--jankx-link-color',
        'link_hover_color' => '--jankx-link-hover-color',

        // Header & Footer
        'header_background' => '--jankx-header-bg-color',
        'header_text_color' => '--jankx-header-text-color',
        'sticky_header_background' => '--jankx-sticky-header-bg-color',
        'sticky_header_text_color' => '--jankx-sticky-header-text-color',
        'footer_background' => '--jankx-footer-bg-color',
        'footer_text_color' => '--jankx-footer-text-color',

        // Layout
        'container_width' => '--jankx-container-width',
        'sidebar_width' => '--jankx-sidebar-width',
        'sidebar_position' => '--jankx-sidebar-position',

        // Typography
        'body_typography' => [
            'font-family' => '--jankx-body-font-family',
            'font-size' => '--jankx-body-font-size',
            'font-weight' => '--jankx-body-font-weight',
            'line-height' => '--jankx-body-line-height',
            'color' => '--jankx-body-text-color',
        ],
        'heading_typography' => [
            'font-family' => '--jankx-heading-font-family',
            'font-weight' => '--jankx-heading-font-weight',
            'color' => '--jankx-heading-text-color',
            'text-transform' => '--jankx-heading-transform',
        ],

        // Buttons
        'button_bg_color' => '--jankx-button-bg-color',
        'button_text_color' => '--jankx-button-text-color',
        'button_border_radius' => '--jankx-button-border-radius',
    ];

    /**
     * Default values for theme options
     *
     * @var array
     */
    protected $defaults = [
        'primary_color' => '#3b82f6',
        'secondary_color' => '#10b981',
        'link_color' => '#3b82f6',
        'link_hover_color' => '#2563eb',
        'header_background' => '#ffffff',
        'header_text_color' => '#1e293b',
        'sticky_header_background' => '#184962',
        'sticky_header_text_color' => '#ffffff',
        'footer_background' => '#0f172a',
        'footer_text_color' => '#f8fafc',
        'container_width' => '1200px',
        'sidebar_width' => '300px',
        'sidebar_position' => 'right',
        'body_typography' => [
            'font-family' => 'Inter, sans-serif',
            'font-size' => '16px',
            'font-weight' => '400',
            'line-height' => '1.6',
            'color' => '#334155',
        ],
        'heading_typography' => [
            'font-family' => 'Montserrat, sans-serif',
            'font-weight' => '700',
            'color' => '#0f172a',
            'text-transform' => 'none',
        ],
        'button_bg_color' => '#3b82f6',
        'button_text_color' => '#ffffff',
        'button_border_radius' => '8px',
    ];

    public function __construct(ThemeOptionsService $themeOptions)
    {
        $this->themeOptions = $themeOptions;

        // Load dynamic defaults from config to avoid hardcoding
        $configOptions = Config::get('app.theme_defaults.options', []);
        if (!empty($configOptions)) {
            foreach ($configOptions as $key => $value) {
                if (isset($this->defaults[$key]) && is_array($this->defaults[$key]) && is_array($value)) {
                    $this->defaults[$key] = array_merge($this->defaults[$key], $value);
                } else {
                    $this->defaults[$key] = $value;
                }
            }
        }
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
        $this->enqueueCSS($this->handle);
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

        $this->enqueueCSS($this->handle . '-admin');
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

        // For block editor iframe, we need to use a different approach
        if (wp_script_is('wp-block-editor', 'enqueued')) {
            $this->enqueueCSS($this->handle . '-blocks', ['wp-edit-blocks']);
        }
    }

    /**
     * Helper method to enqueue CSS with given handle
     *
     * @param string $handle Style handle
     * @param array $deps Dependencies
     * @return void
     */
    private function enqueueCSS(string $handle, array $deps = []): void
    {
        $css = $this->generateCSS();

        if (empty($css)) {
            return;
        }

        wp_register_style($handle, false, $deps, '1.0.0');
        wp_enqueue_style($handle);
        wp_add_inline_style($handle, $css);
    }

    /**
     * Generate CSS from theme options
     *
     * @return string
     */
    public function generateCSS(): string
    {
        $css = [];
        // Global Styles
        $css[] = '';
        
        if (!is_admin()) {
           
            $css[] = 'header.site-header { background-color: var(--jankx-header-bg-color); color: var(--jankx-header-text-color); }';
            if ($this->themeOptions->getOption('enable_sticky_header')) {
                $css[] = 'header.is-sticky, .main-header.scrolled { background-color: var(--jankx-sticky-header-bg-color, #184962) !important; color: var(--jankx-sticky-header-text-color, #ffffff) !important; position: fixed !important; left: 0 !important; right: 0 !important; width: 100% !important; z-index: 9999 !important; }';
                $css[] = 'header.is-sticky header a, .main-header.scrolled a, header.is-sticky header .wp-block-navigation-item > a, header.is-sticky header .wp-block-navigation .wp-block-navigation__submenu-icon, .main-header.scrolled .wp-block-navigation-item > a { color: var(--jankx-sticky-header-text-color, #ffffff) !important; }';

                // .icon-container: chỉ set color để SVG dùng currentColor tự kế thừa.
                // Không dùng border-color vì mỗi icon có thể có background/border tùy chỉnh.
                $css[] = 'header.is-sticky .wp-block-jankx-svg-icon .icon-container,';
                $css[] = '.main-header.scrolled .wp-block-jankx-svg-icon .icon-container {';
                $css[] = '  color: var(--jankx-sticky-header-text-color, #ffffff) !important;';
                $css[] = '  transition: color 0.3s ease;';
                $css[] = '}';

                // SVG fill — build fully-qualified selectors (Cartesian: base × svg tag)
                // để tránh match unrelated SVG elements ngoài sticky header.
                $stickyBases = [
                    'header.is-sticky .wp-block-jankx-svg-icon .icon-container',
                    '.main-header.scrolled .wp-block-jankx-svg-icon .icon-container',
                ];
                $svgTags = [
                    'svg', 'svg path', 'svg g', 'svg rect', 'svg circle',
                    'svg polygon', 'svg polyline', 'svg line', 'svg ellipse', 'svg text',
                ];
                $svgSelectors = [];
                foreach ($stickyBases as $base) {
                    foreach ($svgTags as $tag) {
                        $svgSelectors[] = $base . ' ' . $tag;
                    }
                }
                $css[] = implode(",\n", $svgSelectors) . ' {';
                $css[] = '  fill: var(--jankx-sticky-header-text-color, #ffffff) !important;';
                $css[] = '  transition: fill 0.3s ease;';
                $css[] = '}';
            }
            $css[] = 'footer.site-footer { background-color: var(--jankx-footer-bg-color); color: var(--jankx-footer-text-color); }';
        }

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
        $variables = [
            'cssVarPrefix' => '--jankx-',
        ];

        foreach ($this->cssVarMapping as $optionKey => $varName) {
            if (is_array($varName)) {
                $variables[$optionKey] = $this->getOption($optionKey, $this->defaults[$optionKey] ?? []);
            } else {
                $value = $this->getOption($optionKey, $this->defaults[$optionKey] ?? '');
                // Handle numeric values that need px
                if (in_array($optionKey, ['container_width', 'sidebar_width', 'button_border_radius']) && is_numeric($value)) {
                    $value .= 'px';
                }
                $variables[$optionKey] = $value;
            }
        }

        return $variables;
    }
}
