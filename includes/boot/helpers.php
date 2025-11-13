<?php

use Jankx\Foundation\PageRenderer;

/**
 * Check if the current page supports Gutenberg templates.
 *
 * @return bool
 */
if (!function_exists('jankx_is_support_block_template')) {
function jankx_is_support_block_template()
{
    // Check if WordPress supports block templates
    if (!function_exists('wp_is_block_theme')) {
        return false;
    }

    // Check if current theme supports block templates
    if (!current_theme_supports('block-templates')) {
        return false;
    }

    // Check if current page type supports block templates
    $post_type = get_post_type();
    if ($post_type && !post_type_supports($post_type, 'block-templates')) {
        return false;
    }

    return true;
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
    $renderer = PageRenderer::getInstance();
    $renderer->setContext($context);

    if ($templates) {
        $renderer->setTemplates($templates);
    }

    $renderer->render();
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
    if (!function_exists('get_the_block_template_html')) {
        return null;
    }

    return get_the_block_template_html();
}
}
