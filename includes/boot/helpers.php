<?php

use Jankx\Helper\TemplateHelper;

/**
 * Check if the current page supports Gutenberg templates.
 *
 * @return bool
 */
if (!function_exists('jankx_is_support_block_template')) {
    function jankx_is_support_block_template()
    {
        return TemplateHelper::isSupportBlockTemplate();
    }
}

/**
 * Get the Jankx application container instance.
 *
 * @return \Jankx\Foundation\Application
 */
if (!function_exists('jankx_app')) {
    function jankx_app()
    {
        return \Jankx\Foundation\Application::getInstance();
    }
}

/**
 * Render a page with the given context and templates.
 *
 * @param string $context The page context (single, archive, etc.)
 * @param array|string $templates Optional templates to use
 * @return void
 */
if (!function_exists('jankx')) {
    function jankx($context = null, $templates = null)
    {
        TemplateHelper::render($context, $templates);
    }
}

/**
 * Render a Latte template with data.
 *
 * @param string $template Path to template
 * @param array $data Data to pass to template
 * @return string|void
 */
if (!function_exists('jankx_render')) {
    function jankx_render($template, $data = [], $echo = true)
    {
        $engine = \Jankx\Facades\Template::getEngine();
        if ($echo) {
            echo $engine->render($template, $data);
            return;
        }
        return $engine->render($template, $data);
    }
}

/**
 * Get option value from theme options.
 *
 * @param string $option_name Name of the option
 * @param mixed $default Default value
 * @return mixed
 */
if (!function_exists('jankx_get_option')) {
    function jankx_get_option($option_name, $default = null)
    {
        return \Jankx\Facades\Option::get($option_name, $default);
    }
}

/**
 * Get block template HTML for current page.
 *
 * @return string|null
 */
if (!function_exists('jankx_get_the_block_template_html')) {
    function jankx_get_the_block_template_html()
    {
        return TemplateHelper::getTheBlockTemplateHtml();
    }
}

/**
 * Render Extension Icon from Jankx Hub (SVG mandatory)
 *
 * @param array|object $extension The extension data from Hub
 */
if (!function_exists('jankx_render_hub_icon')) {
    function jankx_render_hub_icon($extension) {
        $extension = (array) $extension;
        if (!empty($extension['icon_svg'])) {
            // Internal Hub SVGs are trusted but we wrap them for styling
            echo '<span class="jankx-hub-icon">' . $extension['icon_svg'] . '</span>';
        } elseif (!empty($extension['icon'])) {
            // Fallback for older formats
            echo '<img src="' . esc_url($extension['icon']) . '" alt="' . esc_attr($extension['name'] ?? '') . '" class="jankx-hub-icon-img" />';
        }
    }
}

/**
 * Render font icon
 *
 * @param string $iconName The name of the icon
 * @param string $type The icon set (default: fontawesome)
 * @param array $attributes Additional HTML attributes
 * @return string The rendered icon HTML
 */
if (!function_exists('jankx_icon')) {
    function jankx_icon($iconName, $type = 'fontawesome', $attributes = [])
    {
        return \Jankx\Facades\Icon::render($iconName, $type, $attributes);
    }
}

/**
 * Theme Options Helpers
 */
$themeOptionsHelpers = dirname(__FILE__, 2) . '/app/helpers/theme-options.php';
if (file_exists($themeOptionsHelpers)) {
    require $themeOptionsHelpers;
}

