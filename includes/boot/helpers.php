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
