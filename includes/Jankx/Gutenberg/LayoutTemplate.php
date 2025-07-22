<?php

namespace Jankx\Gutenberg;

use Illuminate\Container\Container;
use Jankx\Facades\Logger;
use Jankx\Facades\Options;

/**
 * Jankx Gutenberg Layout Template
 *
 * Manages layout template rendering and customization.
 * Provides a flexible system for creating and rendering layout templates.
 */
class LayoutTemplate
{
    /**
     * @var array Registered templates
     */
    protected static $templates = [];

    /**
     * @var array Template variables
     */
    protected static $variables = [];

    /**
     * @var Container
     */
    protected static $container;

    /**
     * Initialize with container
     */
    public static function init(Container $container)
    {
        self::$container = $container;
        self::registerDefaultTemplates();
    }

    /**
     * Register default templates
     */
    protected static function registerDefaultTemplates()
    {
        // Hero Section Template
        self::registerTemplate('hero-section', [
            'name' => 'Hero Section',
            'description' => 'A prominent hero section with title, description, and call-to-action',
            'template' => 'hero-section.html',
            'variables' => [
                'title' => '',
                'description' => '',
                'buttonText' => 'Learn More',
                'buttonUrl' => '#',
                'backgroundImage' => '',
                'overlay' => false
            ],
            'blocks' => [
                'hero-title' => [
                    'required' => true,
                    'order' => 1,
                    'template' => 'blocks/hero-title.html'
                ],
                'hero-description' => [
                    'required' => false,
                    'order' => 2,
                    'template' => 'blocks/hero-description.html'
                ],
                'hero-button' => [
                    'required' => false,
                    'order' => 3,
                    'template' => 'blocks/hero-button.html'
                ]
            ]
        ]);

        // Testimonial Template
        self::registerTemplate('testimonial', [
            'name' => 'Testimonial',
            'description' => 'A testimonial section with quote, author, and image',
            'template' => 'testimonial.html',
            'variables' => [
                'quote' => '',
                'author' => '',
                'position' => '',
                'company' => '',
                'avatar' => '',
                'rating' => 5
            ],
            'blocks' => [
                'testimonial-quote' => [
                    'required' => true,
                    'order' => 1,
                    'template' => 'blocks/testimonial-quote.html'
                ],
                'testimonial-author' => [
                    'required' => true,
                    'order' => 2,
                    'template' => 'blocks/testimonial-author.html'
                ],
                'testimonial-rating' => [
                    'required' => false,
                    'order' => 3,
                    'template' => 'blocks/testimonial-rating.html'
                ]
            ]
        ]);

        // Feature Grid Template
        self::registerTemplate('feature-grid', [
            'name' => 'Feature Grid',
            'description' => 'A grid of feature items with icons and descriptions',
            'template' => 'feature-grid.html',
            'variables' => [
                'title' => 'Our Features',
                'description' => 'Discover what makes us special',
                'columns' => 3,
                'features' => []
            ],
            'blocks' => [
                'feature-grid-title' => [
                    'required' => false,
                    'order' => 1,
                    'template' => 'blocks/feature-grid-title.html'
                ],
                'feature-item' => [
                    'required' => false,
                    'order' => 2,
                    'template' => 'blocks/feature-item.html'
                ]
            ]
        ]);

        // Contact Form Template
        self::registerTemplate('contact-form', [
            'name' => 'Contact Form',
            'description' => 'A contact form with validation and email integration',
            'template' => 'contact-form.html',
            'variables' => [
                'title' => 'Contact Us',
                'description' => 'Get in touch with us',
                'email' => '',
                'phone' => '',
                'address' => '',
                'successMessage' => 'Thank you for your message!'
            ],
            'blocks' => [
                'contact-title' => [
                    'required' => true,
                    'order' => 1,
                    'template' => 'blocks/contact-title.html'
                ],
                'contact-description' => [
                    'required' => false,
                    'order' => 2,
                    'template' => 'blocks/contact-description.html'
                ],
                'contact-fields' => [
                    'required' => true,
                    'order' => 3,
                    'template' => 'blocks/contact-fields.html'
                ],
                'contact-submit' => [
                    'required' => true,
                    'order' => 4,
                    'template' => 'blocks/contact-submit.html'
                ]
            ]
        ]);
    }

    /**
     * Register a template
     *
     * @param string $name Template name
     * @param array $config Template configuration
     */
    public static function registerTemplate($name, array $config)
    {
        $defaultConfig = [
            'name' => $name,
            'description' => '',
            'template' => "{$name}.html",
            'variables' => [],
            'blocks' => [],
            'styles' => [],
            'scripts' => []
        ];

        self::$templates[$name] = array_merge($defaultConfig, $config);
    }

    /**
     * Get a registered template
     *
     * @param string $name Template name
     * @return array|null Template configuration
     */
    public static function getTemplate($name)
    {
        return self::$templates[$name] ?? null;
    }

    /**
     * Get all registered templates
     *
     * @return array All templates
     */
    public static function getTemplates()
    {
        return self::$templates;
    }

    /**
     * Check if template exists
     *
     * @param string $name Template name
     * @return bool
     */
    public static function hasTemplate($name)
    {
        return isset(self::$templates[$name]);
    }

    /**
     * Render a layout template
     *
     * @param string $layoutName Layout name
     * @param array $attributes Block attributes
     * @param string $content Block content
     * @return string Rendered HTML
     */
    public static function render($layoutName, $attributes = [], $content = '')
    {
        $template = self::getTemplate($layoutName);
        if (!$template) {
            Logger::warning("Template not found: {$layoutName}");
            return $content;
        }

        // Get option values for this layout
        $optionValues = Options::getValues($layoutName, $attributes);

        // Merge template variables with option values
        $variables = array_merge($template['variables'], $optionValues, $attributes);

        // Generate CSS classes and styles
        $classes = Options::generateClasses($optionValues);
        $styles = Options::generateStyles($optionValues);

        // Add layout-specific classes
        $classes .= " jankx-layout jankx-layout-{$layoutName}";

        // Render the template
        $html = self::renderTemplate($template['template'], $variables, $content);

        // Wrap with layout container
        return sprintf(
            '<div class="%s" style="%s">%s</div>',
            esc_attr(trim($classes)),
            esc_attr($styles),
            $html
        );
    }

    /**
     * Render a template file
     *
     * @param string $templateFile Template file path
     * @param array $variables Template variables
     * @param string $content Block content
     * @return string Rendered HTML
     */
    protected static function renderTemplate($templateFile, $variables = [], $content = '')
    {
        $templatePath = self::getTemplatePath($templateFile);

        if (!file_exists($templatePath)) {
            Logger::warning("Template file not found: {$templatePath}");
            return self::renderDefaultTemplate($variables, $content);
        }

        // Extract variables for template
        extract($variables);

        // Start output buffering
        ob_start();

        // Include template file
        include $templatePath;

        // Get rendered content
        $html = ob_get_clean();

        return $html;
    }

    /**
     * Get template file path
     *
     * @param string $templateFile Template file name
     * @return string Full template path
     */
    protected static function getTemplatePath($templateFile)
    {
        $templateDir = get_template_directory() . '/templates/layouts/';
        return $templateDir . $templateFile;
    }

    /**
     * Render default template when file doesn't exist
     *
     * @param array $variables Template variables
     * @param string $content Block content
     * @return string Default HTML
     */
    protected static function renderDefaultTemplate($variables = [], $content = '')
    {
        $html = '<div class="jankx-layout-default">';

        // Render title if available
        if (!empty($variables['title'])) {
            $html .= sprintf('<h2 class="jankx-layout-title">%s</h2>', esc_html($variables['title']));
        }

        // Render description if available
        if (!empty($variables['description'])) {
            $html .= sprintf('<p class="jankx-layout-description">%s</p>', esc_html($variables['description']));
        }

        // Render content
        if (!empty($content)) {
            $html .= '<div class="jankx-layout-content">' . $content . '</div>';
        }

        $html .= '</div>';

        return $html;
    }

    /**
     * Render a block within a layout
     *
     * @param string $blockName Block name
     * @param array $blockConfig Block configuration
     * @param array $variables Template variables
     * @return string Rendered block HTML
     */
    public static function renderBlock($blockName, $blockConfig, $variables = [])
    {
        $templateFile = $blockConfig['template'] ?? "blocks/{$blockName}.html";
        $templatePath = self::getTemplatePath($templateFile);

        if (!file_exists($templatePath)) {
            Logger::warning("Block template not found: {$templatePath}");
            return self::renderDefaultBlock($blockName, $variables);
        }

        // Extract variables for template
        extract($variables);

        // Start output buffering
        ob_start();

        // Include block template
        include $templatePath;

        // Get rendered content
        $html = ob_get_clean();

        return $html;
    }

    /**
     * Render default block when template doesn't exist
     *
     * @param string $blockName Block name
     * @param array $variables Template variables
     * @return string Default block HTML
     */
    protected static function renderDefaultBlock($blockName, $variables = [])
    {
        $html = sprintf('<div class="jankx-block jankx-block-%s">', esc_attr($blockName));

        // Render block content based on block name
        switch ($blockName) {
            case 'hero-title':
                if (!empty($variables['title'])) {
                    $html .= sprintf('<h1 class="jankx-hero-title">%s</h1>', esc_html($variables['title']));
                }
                break;

            case 'hero-description':
                if (!empty($variables['description'])) {
                    $html .= sprintf('<p class="jankx-hero-description">%s</p>', esc_html($variables['description']));
                }
                break;

            case 'hero-button':
                if (!empty($variables['buttonText'])) {
                    $html .= sprintf(
                        '<a href="%s" class="jankx-hero-button">%s</a>',
                        esc_url($variables['buttonUrl'] ?? '#'),
                        esc_html($variables['buttonText'])
                    );
                }
                break;

            case 'testimonial-quote':
                if (!empty($variables['quote'])) {
                    $html .= sprintf('<blockquote class="jankx-testimonial-quote">%s</blockquote>', esc_html($variables['quote']));
                }
                break;

            case 'testimonial-author':
                $author = $variables['author'] ?? '';
                $position = $variables['position'] ?? '';
                $company = $variables['company'] ?? '';

                if (!empty($author)) {
                    $html .= '<div class="jankx-testimonial-author">';
                    $html .= sprintf('<strong>%s</strong>', esc_html($author));

                    if (!empty($position) || !empty($company)) {
                        $html .= '<span class="jankx-testimonial-meta">';
                        if (!empty($position)) {
                            $html .= esc_html($position);
                        }
                        if (!empty($position) && !empty($company)) {
                            $html .= ' at ';
                        }
                        if (!empty($company)) {
                            $html .= esc_html($company);
                        }
                        $html .= '</span>';
                    }

                    $html .= '</div>';
                }
                break;

            default:
                $html .= sprintf('<div class="jankx-block-content">%s</div>', esc_html($blockName));
                break;
        }

        $html .= '</div>';

        return $html;
    }

    /**
     * Get template variables for a layout
     *
     * @param string $layoutName Layout name
     * @param array $attributes Block attributes
     * @return array Template variables
     */
    public static function getTemplateVariables($layoutName, $attributes = [])
    {
        $template = self::getTemplate($layoutName);
        if (!$template) {
            return [];
        }

        // Get option values
        $optionValues = Options::getValues($layoutName, $attributes);

        // Merge with template variables and attributes
        return array_merge($template['variables'], $optionValues, $attributes);
    }

    /**
     * Get blocks for a template
     *
     * @param string $layoutName Layout name
     * @return array Template blocks
     */
    public static function getTemplateBlocks($layoutName)
    {
        $template = self::getTemplate($layoutName);
        return $template['blocks'] ?? [];
    }

    /**
     * Check if template has a specific block
     *
     * @param string $layoutName Layout name
     * @param string $blockName Block name
     * @return bool
     */
    public static function hasBlock($layoutName, $blockName)
    {
        $blocks = self::getTemplateBlocks($layoutName);
        return isset($blocks[$blockName]);
    }

    /**
     * Get block configuration
     *
     * @param string $layoutName Layout name
     * @param string $blockName Block name
     * @return array|null Block configuration
     */
    public static function getBlock($layoutName, $blockName)
    {
        $blocks = self::getTemplateBlocks($layoutName);
        return $blocks[$blockName] ?? null;
    }

    /**
     * Render all blocks for a layout
     *
     * @param string $layoutName Layout name
     * @param array $variables Template variables
     * @return string Rendered blocks HTML
     */
    public static function renderBlocks($layoutName, $variables = [])
    {
        $blocks = self::getTemplateBlocks($layoutName);
        $html = '';

        // Sort blocks by order
        uasort($blocks, function($a, $b) {
            return ($a['order'] ?? 0) - ($b['order'] ?? 0);
        });

        foreach ($blocks as $blockName => $blockConfig) {
            $html .= self::renderBlock($blockName, $blockConfig, $variables);
        }

        return $html;
    }

    /**
     * Get container instance
     *
     * @return Container
     */
    public static function getContainer()
    {
        return self::$container;
    }
}