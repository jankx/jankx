<?php
/**
 * Theme Options Helper Functions
 *
 * Provides easy access to theme option values and CSS variables
 * for use in blocks and templates.
 *
 * @package App\Helpers
 */

use Jankx\Foundation\Application;

if (!function_exists('jankx_get_theme_option')) {
    /**
     * Get a theme option value
     *
     * @param string $key The option key
     * @param mixed $default Default value if option not found
     * @return mixed The option value
     */
    function jankx_get_theme_option(string $key, $default = null)
    {
        $app = Application::getInstance();

        if (!$app || !$app->bound('theme-options')) {
            return $default;
        }

        $themeOptions = $app->make('theme-options');
        return $themeOptions->getOption($key, $default);
    }
}

if (!function_exists('jankx_get_theme_color')) {
    /**
     * Get a theme color
     *
     * @param string $colorType 'primary' or 'secondary'
     * @param string $format 'hex', 'rgb', or 'css-var'
     * @return string The color value
     */
    function jankx_get_theme_color(string $colorType = 'primary', string $format = 'hex'): string
    {
        $key = $colorType === 'primary' ? 'primary_color' : 'secondary_color';
        $default = $colorType === 'primary' ? '#ff5722' : '#009688';

        $color = jankx_get_theme_option($key, $default);

        switch ($format) {
            case 'css-var':
                return $colorType === 'primary'
                    ? 'var(--jankx-primary-color)'
                    : 'var(--jankx-secondary-color)';

            case 'rgb':
                $hex = ltrim($color, '#');
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

            case 'hex':
            default:
                return $color;
        }
    }
}

if (!function_exists('jankx_get_container_width')) {
    /**
     * Get container width from theme options
     *
     * @param bool $withUnit Whether to include unit
     * @return string|int Container width value
     */
    function jankx_get_container_width(bool $withUnit = true)
    {
        $width = jankx_get_theme_option('container_width', 1200);

        if ($withUnit && is_numeric($width)) {
            return $width . 'px';
        }

        return $width;
    }
}

if (!function_exists('jankx_get_body_typography')) {
    /**
     * Get body typography settings
     *
     * @param string|null $property Specific property or all
     * @return mixed Typography value(s)
     */
    function jankx_get_body_typography(?string $property = null)
    {
        $defaults = [
            'font-family' => 'Inter',
            'font-size' => '16px',
            'font-weight' => '400',
            'line-height' => '1.6',
            'color' => '#222222',
        ];

        $typography = jankx_get_theme_option('body_typography', $defaults);

        if ($property !== null) {
            return $typography[$property] ?? $defaults[$property] ?? null;
        }

        return $typography;
    }
}

if (!function_exists('jankx_get_css_var')) {
    /**
     * Get CSS variable value or name
     *
     * @param string $varName Variable name without prefix
     * @param bool $returnValue Whether to return computed value or var() string
     * @return string CSS variable or value
     */
    function jankx_get_css_var(string $varName, bool $returnValue = false): string
    {
        $fullVarName = '--jankx-' . $varName;

        if ($returnValue) {
            // Try to get computed value
            $app = Application::getInstance();
            if ($app && $app->bound('theme-options.css-generator')) {
                $cssGenerator = $app->make('theme-options.css-generator');
                $vars = $cssGenerator->getCSSVariables();

                // Map variable names to values
                $mapping = [
                    'primary-color' => $vars['primaryColor'] ?? '#ff5722',
                    'secondary-color' => $vars['secondaryColor'] ?? '#009688',
                    'container-width' => $vars['containerWidth'] ?? '1200px',
                    'body-font-family' => $vars['bodyTypography']['font-family'] ?? 'Inter',
                    'body-font-size' => $vars['bodyTypography']['font-size'] ?? '16px',
                    'body-font-weight' => $vars['bodyTypography']['font-weight'] ?? '400',
                    'body-line-height' => $vars['bodyTypography']['line-height'] ?? '1.6',
                    'body-text-color' => $vars['bodyTypography']['color'] ?? '#222222',
                ];

                return $mapping[$varName] ?? '';
            }

            return '';
        }

        return 'var(' . $fullVarName . ')';
    }
}

if (!function_exists('jankx_get_theme_options_data')) {
    /**
     * Get all theme options data for JavaScript
     *
     * @return array Theme options data
     */
    function jankx_get_theme_options_data(): array
    {
        $app = Application::getInstance();

        if (!$app || !$app->bound('theme-options.bridge')) {
            return [];
        }

        $bridge = $app->make('theme-options.bridge');
        return $bridge->getThemeOptionsData();
    }
}

if (!function_exists('jankx_render_inline_theme_css')) {
    /**
     * Render inline theme CSS (useful for templates)
     *
     * @return void
     */
    function jankx_render_inline_theme_css(): void
    {
        $app = Application::getInstance();

        if (!$app || !$app->bound('theme-options.css-generator')) {
            return;
        }

        $cssGenerator = $app->make('theme-options.css-generator');
        $css = $cssGenerator->generateCSS();

        if (!empty($css)) {
            echo '<style id="jankx-theme-options-css-inline">' . "\n";
            echo $css . "\n";
            echo '</style>' . "\n";
        }
    }
}
