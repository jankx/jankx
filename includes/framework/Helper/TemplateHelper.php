<?php

namespace Jankx\Helper;

use Jankx\Foundation\PageRenderer;

/**
 * Jankx Framework Template Helper
 *
 * Template-related helper functions for the Jankx framework
 *
 * @package Jankx\Helper
 * @version 2.0.0
 * @author Puleeno Nguyen <puleeno@gmail.com>
 */
class TemplateHelper
{
    /**
     * Check if the current page supports Gutenberg templates.
     *
     * @return bool
     */
    public static function isSupportBlockTemplate()
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

    /**
     * Render a page with the given context and templates.
     *
     * @param string $context The page context (single, archive, etc.)
     * @param array|string $templates Optional templates to use
     * @return void
     */
    public static function render($context = null, $templates = null)
    {
        $renderer = PageRenderer::getInstance();
        $renderer->setContext($context);

        if ($templates) {
            $renderer->setTemplates($templates);
        }

        $renderer->render();
    }

    /**
     * Get block template HTML for current page.
     *
     * @return string|null
     */
    public static function getTheBlockTemplateHtml()
    {
        if (!function_exists('get_the_block_template_html')) {
            return null;
        }

        return get_the_block_template_html();
    }

    /**
     * Get template directory path
     *
     * @param string $template Optional template name
     * @return string
     */
    public static function getTemplateDirectory($template = '')
    {
        return get_template_directory() . ($template ? '/' . ltrim($template, '/') : '');
    }

    /**
     * Get template directory URI
     *
     * @param string $template Optional template name
     * @return string
     */
    public static function getTemplateDirectoryUri($template = '')
    {
        return get_template_directory_uri() . ($template ? '/' . ltrim($template, '/') : '');
    }

    /**
     * Locate template file
     *
     * @param array $templateNames Template names to search for
     * @param bool $load Whether to load the template
     * @param bool $require_once Whether to require once
     * @return string
     */
    public static function locateTemplate($templateNames, $load = false, $require_once = true)
    {
        return locate_template($templateNames, $load, $require_once);
    }

    /**
     * Load template part
     *
     * @param string $slug Template slug
     * @param string $name Optional template name
     * @param array $args Optional arguments
     * @return void
     */
    public static function getTemplatePart($slug, $name = null, $args = [])
    {
        get_template_part($slug, $name, $args);
    }

    /**
     * Check if template exists
     *
     * @param string $template Template file path
     * @return bool
     */
    public static function templateExists($template)
    {
        return file_exists($template);
    }

    /**
     * Get template content
     *
     * @param string $template Template file path
     * @return string
     */
    public static function getTemplateContent($template)
    {
        if (!self::templateExists($template)) {
            return '';
        }

        ob_start();
        include $template;
        return ob_get_clean();
    }
}
