<?php

namespace Jankx\Support\ThemeSystem;

use Jankx\Foundation\Application;
use Jankx\Helper\Environment;

/**
 * Jankx Theme System Loader
 *
 * Overrides WordPress theme loading mechanism to provide full control
 * over template rendering and theme system.
 *
 * @package Jankx\Support\ThemeSystem
 * @since 2.0.0
 */
class Loader
{
    /**
     * The application instance.
     *
     * @var \Jankx\Foundation\Application
     */
    protected $app;

    /**
     * Template hierarchy cache.
     *
     * @var array
     */
    protected $templateHierarchy = [];

    /**
     * Create a new theme system loader.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
    }

    /**
     * Initialize the theme system.
     *
     * @return void
     */
    public function init()
    {
        // Disable WordPress theme loading
        $this->disableWordPressThemeLoading();

        // Setup Jankx theme system
        $this->setupJankxThemeSystem();
    }

    /**
     * Disable WordPress theme loading mechanism.
     *
     * @return void
     */
    protected function disableWordPressThemeLoading()
    {
        // Override wp_using_themes
        if (!defined('WP_USE_THEMES')) {
            define('WP_USE_THEMES', false);
        }

        // Remove WordPress default template actions
        remove_action('template_redirect', 'wp_old_slug_redirect');
        remove_action('template_redirect', 'redirect_canonical');

        // Override template loading
        add_action('template_redirect', [$this, 'handleTemplateRedirect'], 1);
    }

    /**
     * Setup Jankx theme system.
     *
     * @return void
     */
    protected function setupJankxThemeSystem()
    {
        // Register theme system hooks
        add_action('wp_head', [$this, 'renderHead'], 1);
        add_action('wp_footer', [$this, 'renderFooter'], 999);

        // Override content rendering
        add_filter('the_content', [$this, 'renderContent'], 1);
    }

    /**
     * Handle template redirect.
     *
     * @return void
     */
    public function handleTemplateRedirect()
    {
        // Prevent WordPress from loading default templates
        if (WP_USE_THEMES) {
            return;
        }

        // Load Jankx template
        $this->loadJankxTemplate();
    }

    /**
     * Load Jankx template.
     *
     * @return void
     */
    protected function loadJankxTemplate()
    {
        $template = $this->determineTemplate();

        if ($template) {
            $this->renderTemplate($template);
        }
    }

    /**
     * Determine which template to load.
     *
     * @return string|null
     */
    protected function determineTemplate()
    {
        // Get template hierarchy
        $templates = $this->getTemplateHierarchy();

        // Find the first existing template
        foreach ($templates as $template) {
            if ($this->templateExists($template)) {
                return $template;
            }
        }

        return null;
    }

    /**
     * Get template hierarchy.
     *
     * @param  array  $templates
     * @return array
     */
    public function getTemplateHierarchy($templates = [])
    {
        if (empty($templates)) {
            $templates = $this->buildTemplateHierarchy();
        }

        return apply_filters('jankx_template_hierarchy', $templates);
    }

    /**
     * Build template hierarchy based on current request.
     *
     * @return array
     */
    protected function buildTemplateHierarchy()
    {
        $templates = [];

        if (is_home() || is_front_page()) {
            $templates[] = 'home.php';
            $templates[] = 'index.php';
        } elseif (is_single()) {
            $templates[] = 'single-' . get_post_type() . '.php';
            $templates[] = 'single.php';
            $templates[] = 'index.php';
        } elseif (is_page()) {
            $templates[] = 'page-' . get_page_template_slug() . '.php';
            $templates[] = 'page-' . get_the_ID() . '.php';
            $templates[] = 'page.php';
            $templates[] = 'index.php';
        } elseif (is_category()) {
            $templates[] = 'category-' . get_queried_object()->slug . '.php';
            $templates[] = 'category-' . get_queried_object_id() . '.php';
            $templates[] = 'category.php';
            $templates[] = 'archive.php';
            $templates[] = 'index.php';
        } elseif (is_tag()) {
            $templates[] = 'tag-' . get_queried_object()->slug . '.php';
            $templates[] = 'tag-' . get_queried_object_id() . '.php';
            $templates[] = 'tag.php';
            $templates[] = 'archive.php';
            $templates[] = 'index.php';
        } elseif (is_archive()) {
            $templates[] = get_post_type() . '.php';
            $templates[] = 'archive.php';
            $templates[] = 'index.php';
        } elseif (is_search()) {
            $templates[] = 'search.php';
            $templates[] = 'index.php';
        } elseif (is_404()) {
            $templates[] = '404.php';
            $templates[] = 'index.php';
        } else {
            $templates[] = 'index.php';
        }

        return $templates;
    }

    /**
     * Check if template exists.
     *
     * @param  string  $template
     * @return bool
     */
    protected function templateExists($template)
    {
        $template_path = get_template_directory() . '/' . $template;
        return file_exists($template_path);
    }

    /**
     * Render template.
     *
     * @param  string  $template
     * @return void
     */
    protected function renderTemplate($template)
    {
        $template_path = get_template_directory() . '/' . $template;

        if (file_exists($template_path)) {
            // Set global variables for template
            global $wp_query, $post;

            // Include template
            include $template_path;
        }
    }

    /**
     * Load template with Jankx system.
     *
     * @param  string  $template
     * @return string
     */
    public function loadTemplate($template)
    {
        // Use Jankx template system
        $jankxTemplate = $this->determineTemplate();

        if ($jankxTemplate) {
            return get_template_directory() . '/' . $jankxTemplate;
        }

        return $template;
    }

    /**
     * Locate template with Jankx system.
     *
     * @param  string  $template
     * @param  array  $template_names
     * @param  bool  $load
     * @param  bool  $require_once
     * @return string
     */
    public function locateTemplate($template, $template_names, $load, $require_once)
    {
        // Use Jankx template location logic
        foreach ($template_names as $template_name) {
            $template_path = get_template_directory() . '/' . $template_name;

            if (file_exists($template_path)) {
                if ($load) {
                    if ($require_once) {
                        require_once $template_path;
                    } else {
                        require $template_path;
                    }
                }
                return $template_path;
            }
        }

        return $template;
    }

    /**
     * Get body classes with Jankx system.
     *
     * @param  array  $classes
     * @return array
     */
    public function getBodyClasses($classes)
    {
        // Add Jankx specific body classes
        $classes[] = 'jankx-theme';
        $classes[] = 'jankx-override';

        return apply_filters('jankx_body_classes', $classes);
    }

    /**
     * Render header.
     *
     * @param  string|null  $name
     * @return void
     */
    public function getHeader($name = null)
    {
        $template = 'header';
        if ($name) {
            $template .= '-' . $name;
        }
        $template .= '.php';

        $template_path = get_template_directory() . '/' . $template;

        if (file_exists($template_path)) {
            include $template_path;
        }
    }

    /**
     * Render footer.
     *
     * @param  string|null  $name
     * @return void
     */
    public function getFooter($name = null)
    {
        $template = 'footer';
        if ($name) {
            $template .= '-' . $name;
        }
        $template .= '.php';

        $template_path = get_template_directory() . '/' . $template;

        if (file_exists($template_path)) {
            include $template_path;
        }
    }

    /**
     * Render sidebar.
     *
     * @param  string|null  $name
     * @return void
     */
    public function getSidebar($name = null)
    {
        $template = 'sidebar';
        if ($name) {
            $template .= '-' . $name;
        }
        $template .= '.php';

        $template_path = get_template_directory() . '/' . $template;

        if (file_exists($template_path)) {
            include $template_path;
        }
    }

    /**
     * Render head content.
     *
     * @return void
     */
    public function renderHead()
    {
        // Jankx specific head content
        echo '<!-- Jankx Theme System Active -->' . "\n";
    }

    /**
     * Render footer content.
     *
     * @return void
     */
    public function renderFooter()
    {
        // Jankx specific footer content
        echo '<!-- Jankx Theme System Footer -->' . "\n";
    }

    /**
     * Render content with Jankx system.
     *
     * @param  string  $content
     * @return string
     */
    public function renderContent($content)
    {
        // Apply Jankx content filters
        return apply_filters('jankx_the_content', $content);
    }
}
