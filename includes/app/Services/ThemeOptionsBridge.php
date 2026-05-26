<?php

namespace App\Services;

use App\Services\ThemeOptions\BlockDefaultApplierRegistry;

/**
 * Theme Options Bridge
 *
 * Bridges theme options with Gutenberg blocks and theme.json.
 * Passes theme option values to blocks via JavaScript and
 * ensures consistency between theme options and block editor.
 *
 * @package App\Services
 */
class ThemeOptionsBridge
{
    /**
     * @var ThemeOptionsService
     */
    protected $themeOptions;

    /**
     * @var ThemeOptionsCSSGenerator
     */
    protected $cssGenerator;

    /**
     * Cached theme options data
     *
     * @var array|null
     */
    protected $cachedData = null;

    public function __construct(
        ThemeOptionsService $themeOptions,
        ThemeOptionsCSSGenerator $cssGenerator
    ) {
        $this->themeOptions = $themeOptions;
        $this->cssGenerator = $cssGenerator;
    }

    /**
     * Initialize the bridge
     *
     * @return void
     */
    public function init(): void
    {
        // Pass theme options to block editor
        add_action('enqueue_block_editor_assets', [$this, 'passOptionsToBlockEditor'], 20);

        // Pass theme options to frontend (for dynamic blocks)
        add_action('wp_enqueue_scripts', [$this, 'passOptionsToFrontend'], 20);

        // Filter theme.json data to sync with theme options
        add_filter('wp_theme_json_data_theme', [$this, 'filterThemeJsonData'], 10, 1);

        // Add body classes based on theme options
        add_filter('body_class', [$this, 'addBodyClasses']);

        // Filter block attributes to apply theme defaults
        add_filter('render_block', [$this, 'applyThemeDefaultsToBlock'], 10, 3);

        // Inject built-in header options
        add_filter('jankx/option/core_pages_config', [$this, 'injectHeaderPageConfig'], 10, 1);
        add_filter('jankx/option/core_sections_for_page', [$this, 'injectHeaderSectionsConfig'], 10, 2);
    }

    /**
     * Inject built-in header page config
     *
     * @param array $pages Existing pages
     * @return array
     */
    public function injectHeaderPageConfig(array $pages): array
    {
        // Use string key to avoid overwriting numeric index (General)
        $pages['header'] = [
            'id' => 'header',
            'name' => __('Header Settings', 'jankx'),
            'args' => [
                'description' => __('Configure header behavior and layout', 'jankx'),
                'priority' => 20,
                'icon' => 'dashicons-heading',
            ],
        ];

        return $pages;
    }

    /**
     * Inject built-in header sections config
     *
     * @param array $sections Existing sections
     * @param string $pageId Current page ID
     * @return array
     */
    public function injectHeaderSectionsConfig(array $sections, string $pageId): array
    {
        if ($pageId === 'header') {
            $sections['header_general'] = [
                'id' => 'header_general',
                'name' => __('General', 'jankx'),
                'fields' => [
                    [
                        'id' => 'enable_sticky_header',
                        'name' => __('Enable Sticky Header', 'jankx'),
                        'type' => 'switch',
                        'value' => 0,
                        'on' => __('On', 'jankx'),
                        'off' => __('Off', 'jankx'),
                        'description' => __('Make the header sticky when scrolling', 'jankx'),
                    ],
                    [
                        'id' => 'sticky_header_background',
                        'name' => __('Sticky Header Background', 'jankx'),
                        'type' => 'color',
                        'value' => '#184962',
                        'required' => ['enable_sticky_header', '==', 1],
                        'description' => __('Background color when header is sticky', 'jankx'),
                    ],
                    [
                        'id' => 'sticky_header_text_color',
                        'name' => __('Sticky Header Text Color', 'jankx'),
                        'type' => 'color',
                        'value' => '#ffffff',
                        'required' => ['enable_sticky_header', '==', 1],
                        'description' => __('Text and link color when header is sticky', 'jankx'),
                    ],
                    [
                        'id' => 'sticky_header_trigger',
                        'name' => __('Sticky Header Trigger', 'jankx'),
                        'type' => 'select',
                        'options' => [
                            'top' => __('Top of Page', 'jankx'),
                            'hero' => __('After Hero Carousel', 'jankx'),
                            'first_group' => __('After First Section', 'jankx'),
                        ],
                        'value' => 'top',
                        'description' => __('Define when the header should become sticky', 'jankx'),
                    ],
                    [
                        'id' => 'header_type',
                        'name' => __('Header Type', 'jankx'),
                        'type' => 'select',
                        'options' => [
                            'normal' => __('Normal (Static)', 'jankx'),
                            'overlay' => __('Overlay (Transparent/Above content)', 'jankx'),
                        ],
                        'value' => 'normal',
                        'description' => __('Choose if the header should sit on top of the content or push it down', 'jankx'),
                    ],
                ],
            ];
        }

        return $sections;
    }

    /**
     * Pass theme options to block editor via JavaScript
     *
     * @return void
     */
    public function passOptionsToBlockEditor(): void
    {
        $this->enqueueThemeData('jankx-theme-options-data', false, true);
    }

    /**
     * Pass theme options to frontend
     *
     * @return void
     */
    public function passOptionsToFrontend(): void
    {
        // Only enqueue if there are dynamic blocks that need this data
        if (!apply_filters('jankx/theme_options/enqueue_frontend', true)) {
            return;
        }

        $this->enqueueThemeData('jankx-theme-options-frontend', true, false);

        // Enqueue sticky header script if enabled in theme options
        $enableSticky = $this->themeOptions->getOption('enable_sticky_header');
        
        // Fallback to direct get_option if adapter failed
        if (is_null($enableSticky)) {
            $allOptions = get_option('jankx_options', []);
            $enableSticky = isset($allOptions['enable_sticky_header']) ? $allOptions['enable_sticky_header'] : 0;
        }

        if ($enableSticky) {
            $scriptUrl = get_template_directory_uri() . '/resources/assets/js/sticky-header.js';
            $scriptPath = get_template_directory() . '/resources/assets/js/sticky-header.js';
            $assetPath = get_template_directory() . '/resources/assets/js/sticky-header.asset.php';

            if (file_exists($scriptPath)) {
                $asset = file_exists($assetPath) ? require $assetPath : ['dependencies' => [], 'version' => filemtime($scriptPath)];
                wp_enqueue_script(
                    'jankx-sticky-header',
                    $scriptUrl,
                    $asset['dependencies'],
                    $asset['version'],
                    true
                );
            }
        }
    }

    /**
     * Helper method to enqueue theme data script
     *
     * @param string $handle Script handle
     * @param bool $inFooter Whether to load in footer
     * @param bool $addInline Whether to add inline script for window object
     * @return void
     */
    private function enqueueThemeData(string $handle, bool $inFooter = false, bool $addInline = false): void
    {
        wp_register_script($handle, '', [], '1.0.0', $inFooter);
        wp_enqueue_script($handle);

        $themeData = $this->getThemeOptionsData();
        wp_localize_script($handle, 'jankxThemeOptions', $themeData);

        if ($addInline) {
            wp_add_inline_script($handle, sprintf(
                'window.jankxThemeOptions = %s;',
                wp_json_encode($themeData)
            ), 'before');
        }
    }

    /**
     * Filter theme.json data to sync with theme options
     *
     * @param object $themeJson
     * @return object
     */
    public function filterThemeJsonData($themeJson)
    {
        $data = $themeJson->get_data();

        // Get theme option values
        $primaryColor = $this->themeOptions->getOption('primary_color', '#184962');
        $secondaryColor = $this->themeOptions->getOption('secondary_color', '#009688');
        $containerWidth = $this->themeOptions->getOption('container_width', 1200);

        // Convert numeric container width to px
        if (is_numeric($containerWidth)) {
            $containerWidth .= 'px';
        }

        // Update color palette if it exists
        if (isset($data['settings']['color']['palette'])) {
            $palettes = $data['settings']['color']['palette'];
            
            // Handle both flat array and nested palette structures (theme, default, user)
            if (isset($palettes['theme']) || isset($palettes['default'])) {
                foreach (['theme', 'default', 'user'] as $origin) {
                    if (isset($data['settings']['color']['palette'][$origin])) {
                        foreach ($data['settings']['color']['palette'][$origin] as &$color) {
                            if (is_array($color) && isset($color['slug'])) {
                                if ($color['slug'] === 'primary') {
                                    $color['color'] = $primaryColor;
                                } elseif ($color['slug'] === 'secondary') {
                                    $color['color'] = $secondaryColor;
                                }
                            }
                        }
                    }
                }
            } else {
                // Flat array structure
                foreach ($data['settings']['color']['palette'] as &$color) {
                    if (is_array($color) && isset($color['slug'])) {
                        if ($color['slug'] === 'primary') {
                            $color['color'] = $primaryColor;
                        } elseif ($color['slug'] === 'secondary') {
                            $color['color'] = $secondaryColor;
                        }
                    }
                }
            }
        }

        // Update layout sizes
        if (isset($data['settings']['layout'])) {
            $data['settings']['layout']['contentSize'] = $containerWidth;
            $data['settings']['layout']['wideSize'] = $this->calculateWideSize($containerWidth);
        }

        // Return updated theme json data
        return new \WP_Theme_JSON_Data($data, 'theme');
    }

    /**
     * Calculate wide size based on container width
     *
     * @param string $containerWidth
     * @return string
     */
    protected function calculateWideSize(string $containerWidth): string
    {
        // Extract numeric value
        $value = (int) preg_replace('/[^0-9]/', '', $containerWidth);
        $unit = preg_replace('/[0-9]/', '', $containerWidth);

        // Wide size is container width + 120px
        $wideValue = $value + 120;

        return $wideValue . $unit;
    }

    /**
     * Add body classes based on theme options
     *
     * @param array $classes
     * @return array
     */
    public function addBodyClasses(array $classes): array
    {
        $sidebarPosition = $this->themeOptions->getOption('sidebar_position', 'right');

        // Add sidebar position class
        $classes[] = 'jankx-sidebar-' . sanitize_html_class($sidebarPosition);

        // Add color scheme class
        $primaryColor = $this->themeOptions->getOption('primary_color', '#184962');
        $colorScheme = $this->detectColorScheme($primaryColor);
        if ($colorScheme) {
            $classes[] = 'jankx-color-scheme-' . $colorScheme;
        }

        // Add header type class
        $headerType = $this->themeOptions->getOption('header_type');
        if (is_null($headerType)) {
            $all = get_option('jankx_options', []);
            $headerType = isset($all['header_type']) ? $all['header_type'] : 'normal';
        }
        $classes[] = 'jankx-header-' . sanitize_html_class($headerType);

        return $classes;
    }

    /**
     * Color scheme hue ranges lookup
     *
     * @var array
     */
    protected $colorSchemeRanges = [
        ['min' => 350, 'max' => 360, 'name' => 'red'],
        ['min' => 0, 'max' => 10, 'name' => 'red'],
        ['min' => 10, 'max' => 45, 'name' => 'orange'],
        ['min' => 45, 'max' => 75, 'name' => 'yellow'],
        ['min' => 75, 'max' => 150, 'name' => 'green'],
        ['min' => 150, 'max' => 200, 'name' => 'teal'],
        ['min' => 200, 'max' => 260, 'name' => 'blue'],
        ['min' => 260, 'max' => 300, 'name' => 'purple'],
        ['min' => 300, 'max' => 350, 'name' => 'pink'],
    ];

    /**
     * Detect color scheme from primary color
     *
     * @param string $primaryColor
     * @return string|null
     */
    protected function detectColorScheme(string $primaryColor): ?string
    {
        $hue = $this->calculateHue($primaryColor);

        if ($hue === null) {
            return 'neutral';
        }

        foreach ($this->colorSchemeRanges as $range) {
            if ($hue >= $range['min'] && $hue < $range['max']) {
                return $range['name'];
            }
        }

        return null;
    }

    /**
     * Calculate hue from hex color
     *
     * @param string $hexColor
     * @return float|null
     */
    protected function calculateHue(string $hexColor): ?float
    {
        $hex = ltrim($hexColor, '#');
        $r = hexdec(substr($hex, 0, 2));
        $g = hexdec(substr($hex, 2, 2));
        $b = hexdec(substr($hex, 4, 2));

        $max = max($r, $g, $b);
        $min = min($r, $g, $b);

        if ($max === $min) {
            return null;
        }

        $d = $max - $min;

        if ($max === $r) {
            $hue = (($g - $b) / $d + ($g < $b ? 6 : 0)) / 6;
        } elseif ($max === $g) {
            $hue = (($b - $r) / $d + 2) / 6;
        } else {
            $hue = (($r - $g) / $d + 4) / 6;
        }

        return $hue * 360;
    }

    /**
     * Apply theme defaults to block rendering
     *
     * @param string $blockContent
     * @param array $block
     * @param object $instance
     * @return string
     */
    public function applyThemeDefaultsToBlock(string $blockContent, array $block, $instance): string
    {
        // Skip if no content
        if (empty($blockContent)) {
            return $blockContent;
        }

        $blockName = $block['blockName'] ?? '';

        // Use Strategy Pattern to apply defaults via registry
        BlockDefaultApplierRegistry::init();
        $applier = BlockDefaultApplierRegistry::resolve($blockName);

        if ($applier !== null) {
            return $applier->apply($blockContent, $block, $this->themeOptions);
        }

        return $blockContent;
    }

    /**
     * Get all theme options data for JavaScript
     *
     * @return array
     */
    public function getThemeOptionsData(): array
    {
        if ($this->cachedData !== null) {
            return $this->cachedData;
        }

        $primaryColor = $this->themeOptions->getOption('primary_color', '#184962');
        $secondaryColor = $this->themeOptions->getOption('secondary_color', '#009688');
        $containerWidth = $this->themeOptions->getOption('container_width', 1200);
        $bodyTypography = $this->themeOptions->getOption('body_typography', []);
        $sidebarPosition = $this->themeOptions->getOption('sidebar_position', 'right');

        $this->cachedData = [
            'version' => '1.0.0',
            'colors' => [
                'primary' => $primaryColor,
                'secondary' => $secondaryColor,
            ],
            'layout' => [
                'containerWidth' => is_numeric($containerWidth) ? (int) $containerWidth : (int) preg_replace('/[^0-9]/', '', $containerWidth),
                'containerWidthUnit' => is_numeric($containerWidth) ? 'px' : preg_replace('/[0-9]/', '', $containerWidth),
                'sidebarPosition' => $sidebarPosition,
            ],
            'typography' => [
                'body' => $bodyTypography,
            ],
            'header' => [
                'enable_sticky_header' => (function() {
                    $val = $this->themeOptions->getOption('enable_sticky_header');
                    if (is_null($val)) {
                        $all = get_option('jankx_options', []);
                        return isset($all['enable_sticky_header']) ? $all['enable_sticky_header'] : 0;
                    }
                    return $val;
                })(),
                'sticky_header_trigger' => (function() {
                    $val = $this->themeOptions->getOption('sticky_header_trigger');
                    if (is_null($val)) {
                        $all = get_option('jankx_options', []);
                        return isset($all['sticky_header_trigger']) ? $all['sticky_header_trigger'] : 'top';
                    }
                    return $val;
                })(),
                'header_type' => (function() {
                    $val = $this->themeOptions->getOption('header_type');
                    if (is_null($val)) {
                        $all = get_option('jankx_options', []);
                        return isset($all['header_type']) ? $all['header_type'] : 'normal';
                    }
                    return $val;
                })(),
            ],
            'cssVars' => $this->cssGenerator->getCSSVariables(),
        ];

        return $this->cachedData;
    }

    /**
     * Clear cached data (useful when options are updated)
     *
     * @return void
     */
    public function clearCache(): void
    {
        $this->cachedData = null;
    }
}
