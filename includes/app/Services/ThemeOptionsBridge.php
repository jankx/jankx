<?php

namespace App\Services;

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
        $primaryColor = $this->themeOptions->getOption('primary_color', '#ff5722');
        $secondaryColor = $this->themeOptions->getOption('secondary_color', '#009688');
        $containerWidth = $this->themeOptions->getOption('container_width', 1200);

        // Convert numeric container width to px
        if (is_numeric($containerWidth)) {
            $containerWidth .= 'px';
        }

        // Update color palette if it exists
        if (isset($data['settings']['color']['palette'])) {
            foreach ($data['settings']['color']['palette'] as &$color) {
                if ($color['slug'] === 'primary') {
                    $color['color'] = $primaryColor;
                } elseif ($color['slug'] === 'secondary') {
                    $color['color'] = $secondaryColor;
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
        $primaryColor = $this->themeOptions->getOption('primary_color', '#ff5722');
        $colorScheme = $this->detectColorScheme($primaryColor);
        if ($colorScheme) {
            $classes[] = 'jankx-color-scheme-' . $colorScheme;
        }

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

        // Apply color defaults to specific blocks if not set
        switch ($blockName) {
            case 'jankx/typography':
                $blockContent = $this->applyTypographyDefaults($blockContent, $block);
                break;

            case 'jankx/advanced-button':
                $blockContent = $this->applyButtonDefaults($blockContent, $block);
                break;

            case 'core/button':
            case 'core/buttons':
                $blockContent = $this->applyCoreButtonDefaults($blockContent, $block);
                break;
        }

        return $blockContent;
    }

    /**
     * Apply typography defaults from theme options
     *
     * @param string $content
     * @param array $block
     * @return string
     */
    protected function applyTypographyDefaults(string $content, array $block): string
    {
        $bodyTypography = $this->themeOptions->getOption('body_typography', []);

        // If typography block doesn't have explicit color, apply body color
        if (!empty($bodyTypography['color'])) {
            $attrs = $block['attrs'] ?? [];

            // Only apply if textColor is not explicitly set
            if (empty($attrs['textColor']) && empty($attrs['style']['color']['text'])) {
                // Add CSS variable for color inheritance
                $content = str_replace(
                    'class="has-jankx-typography"',
                    'class="has-jankx-typography jankx-inherit-body-color"',
                    $content
                );
            }
        }

        return $content;
    }

    /**
     * Apply button defaults from theme options
     *
     * @param string $content
     * @param array $block
     * @return string
     */
    protected function applyButtonDefaults(string $content, array $block): string
    {
        $primaryColor = $this->themeOptions->getOption('primary_color', '#ff5722');
        $attrs = $block['attrs'] ?? [];

        // If button doesn't have explicit background color, apply primary color
        if (empty($attrs['backgroundColor']) && empty($attrs['style']['color']['background'])) {
            // Add inline style for background color
            $style = sprintf('background-color: %s;', esc_attr($primaryColor));

            // Try to inject into the button element
            if (preg_match('/<a[^>]*class="[^"]*jankx-button[^"]*"[^>]*>/', $content, $matches)) {
                $tag = $matches[0];
                if (strpos($tag, 'style=') === false) {
                    $newTag = str_replace('>', sprintf(' style="%s">', $style), $tag);
                    $content = str_replace($tag, $newTag, $content);
                }
            }
        }

        return $content;
    }

    /**
     * Apply defaults to core button blocks
     *
     * @param string $content
     * @param array $block
     * @return string
     */
    protected function applyCoreButtonDefaults(string $content, array $block): string
    {
        $primaryColor = $this->themeOptions->getOption('primary_color', '#ff5722');
        $attrs = $block['attrs'] ?? [];

        // Check if button has background color set via theme palette
        $backgroundColor = $attrs['backgroundColor'] ?? '';

        // If it uses 'primary' from palette, ensure it matches our primary color
        if ($backgroundColor === 'primary') {
            // WordPress should already handle this via theme.json palette
            // But we can add inline style as fallback
            if (strpos($content, 'style=') === false) {
                $style = sprintf('background-color: %s;', esc_attr($primaryColor));
                $content = preg_replace(
                    '/<a([^>]*)>/',
                    sprintf('<a$1 style="%s">', $style),
                    $content,
                    1
                );
            }
        }

        return $content;
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

        $primaryColor = $this->themeOptions->getOption('primary_color', '#ff5722');
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
