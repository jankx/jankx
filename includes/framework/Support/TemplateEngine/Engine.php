<?php

namespace Jankx\Support\TemplateEngine;

use Jankx\Foundation\Application;
use Jankx\Helper\Environment;
use Jankx\Support\TemplateEngine\Engines\JankxEngine;
use Jankx\Support\TemplateEngine\Engines\TwigEngine;
use Jankx\Support\TemplateEngine\Engines\BladeEngine;
use Jankx\Support\TemplateEngine\Engines\PlatesEngine;

/**
 * Jankx Template Engine
 *
 * Advanced template engine that overrides WordPress template system
 * with support for multiple template engines, caching, and custom rendering.
 *
 * @package Jankx\Support\TemplateEngine
 * @since 2.0.0
 */
class Engine
{
    /**
     * The application instance.
     *
     * @var \Jankx\Foundation\Application
     */
    protected $app;

    /**
     * Template engine instances.
     *
     * @var array
     */
    protected $engines = [];

    /**
     * Current template engine.
     *
     * @var string
     */
    protected $currentEngine = 'jankx';

    /**
     * Template cache.
     *
     * @var array
     */
    protected $templateCache = [];

    /**
     * Template variables.
     *
     * @var array
     */
    protected $variables = [];

    /**
     * Create a new template engine.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->registerEngines();
    }

    /**
     * Register available template engines.
     *
     * @return void
     */
    protected function registerEngines()
    {
        // Register Jankx native engine
        $this->engines['jankx'] = new PlatesEngine($this->app);


        // Register Plates engine
        $this->engines['plates'] = new PlatesEngine($this->app);
    }

    /**
     * Set current template engine.
     *
     * @param  string  $engine
     * @return void
     */
    public function setEngine($engine)
    {
        if (isset($this->engines[$engine])) {
            $this->currentEngine = $engine;
        }
    }

    /**
     * Get current template engine.
     *
     * @return \Jankx\Support\TemplateEngine\Contracts\EngineInterface
     */
    public function getCurrentEngine()
    {
        return $this->engines[$this->currentEngine];
    }

    /**
     * Render template.
     *
     * @param  string  $template
     * @param  array  $variables
     * @return string
     */
    public function render($template, $variables = [])
    {
        $engine = $this->getCurrentEngine();

        // Merge global variables
        $variables = array_merge($this->variables, $variables);

        // Check cache first
        $cacheKey = $this->getCacheKey($template, $variables);
        if ($this->isCacheEnabled() && isset($this->templateCache[$cacheKey])) {
            return $this->templateCache[$cacheKey];
        }

        // Render template
        $output = $engine->render($template, $variables);

        // Cache result
        if ($this->isCacheEnabled()) {
            $this->templateCache[$cacheKey] = $output;
        }

        return $output;
    }

    /**
     * Render template and output directly.
     *
     * @param  string  $template
     * @param  array  $variables
     * @return void
     */
    public function display($template, $variables = [])
    {
        echo $this->render($template, $variables);
    }

    /**
     * Set global template variable.
     *
     * @param  string  $key
     * @param  mixed  $value
     * @return void
     */
    public function setVariable($key, $value)
    {
        $this->variables[$key] = $value;
    }

    /**
     * Set multiple template variables.
     *
     * @param  array  $variables
     * @return void
     */
    public function setVariables($variables)
    {
        $this->variables = array_merge($this->variables, $variables);
    }

    /**
     * Get template variable.
     *
     * @param  string  $key
     * @param  mixed  $default
     * @return mixed
     */
    public function getVariable($key, $default = null)
    {
        return $this->variables[$key] ?? $default;
    }

    /**
     * Check if template exists.
     *
     * @param  string  $template
     * @return bool
     */
    public function exists($template)
    {
        $engine = $this->getCurrentEngine();
        return $engine->exists($template);
    }

    /**
     * Get template path.
     *
     * @param  string  $template
     * @return string|null
     */
    public function getTemplatePath($template)
    {
        $engine = $this->getCurrentEngine();
        return $engine->getTemplatePath($template);
    }

    /**
     * Override WordPress template system.
     *
     * @return void
     */
    public function overrideWordPressTemplates()
    {
        // Override template_include filter
        add_filter('template_include', [$this, 'handleTemplateInclude'], 1);

        // Override template hierarchy
        add_filter('template_hierarchy', [$this, 'handleTemplateHierarchy'], 1);

        // Override locate_template
        add_filter('locate_template', [$this, 'handleLocateTemplate'], 1, 4);

        // Override get_template_part
        add_action('get_template_part', [$this, 'handleGetTemplatePart'], 1, 2);

        // Override body classes
        add_filter('body_class', [$this, 'handleBodyClasses'], 1);
    }

    /**
     * Handle template include.
     *
     * @param  string  $template
     * @return string
     */
    public function handleTemplateInclude($template)
    {
        // Use Jankx template engine
        $jankxTemplate = $this->determineTemplate();

        if ($jankxTemplate) {
            return $this->getTemplatePath($jankxTemplate);
        }

        return $template;
    }

    /**
     * Handle template hierarchy.
     *
     * @param  array  $templates
     * @return array
     */
    public function handleTemplateHierarchy($templates)
    {
        return $this->buildTemplateHierarchy($templates);
    }

    /**
     * Handle locate template.
     *
     * @param  string  $template
     * @param  array  $template_names
     * @param  bool  $load
     * @param  bool  $require_once
     * @return string
     */
    public function handleLocateTemplate($template, $template_names, $load, $require_once)
    {
        foreach ($template_names as $template_name) {
            if ($this->exists($template_name)) {
                $template_path = $this->getTemplatePath($template_name);

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
     * Handle get template part.
     *
     * @param  string  $slug
     * @param  string  $name
     * @return void
     */
    public function handleGetTemplatePart($slug, $name = null)
    {
        $template = $slug;
        if ($name) {
            $template .= '-' . $name;
        }

        if ($this->exists($template)) {
            $this->display($template);
        }
    }

    /**
     * Handle body classes.
     *
     * @param  array  $classes
     * @return array
     */
    public function handleBodyClasses($classes)
    {
        $classes[] = 'jankx-template-engine';
        $classes[] = 'jankx-engine-' . $this->currentEngine;

        return apply_filters('jankx_template_engine_body_classes', $classes);
    }

    /**
     * Determine which template to load.
     *
     * @return string|null
     */
    protected function determineTemplate()
    {
        $templates = $this->buildTemplateHierarchy();

        foreach ($templates as $template) {
            if ($this->exists($template)) {
                return $template;
            }
        }

        return null;
    }

    /**
     * Build template hierarchy.
     *
     * @param  array  $templates
     * @return array
     */
    protected function buildTemplateHierarchy($templates = [])
    {
        if (empty($templates)) {
            $templates = $this->getDefaultTemplateHierarchy();
        }

        return apply_filters('jankx_template_hierarchy', $templates);
    }

    /**
     * Get default template hierarchy.
     *
     * @return array
     */
    protected function getDefaultTemplateHierarchy()
    {
        $templates = [];

        if (is_home() || is_front_page()) {
            $templates[] = 'home';
            $templates[] = 'index';
        } elseif (is_single()) {
            $templates[] = 'single-' . get_post_type();
            $templates[] = 'single';
            $templates[] = 'index';
        } elseif (is_page()) {
            $templates[] = 'page-' . get_page_template_slug();
            $templates[] = 'page-' . get_the_ID();
            $templates[] = 'page';
            $templates[] = 'index';
        } elseif (is_category()) {
            $templates[] = 'category-' . get_queried_object()->slug;
            $templates[] = 'category-' . get_queried_object_id();
            $templates[] = 'category';
            $templates[] = 'archive';
            $templates[] = 'index';
        } elseif (is_tag()) {
            $templates[] = 'tag-' . get_queried_object()->slug;
            $templates[] = 'tag-' . get_queried_object_id();
            $templates[] = 'tag';
            $templates[] = 'archive';
            $templates[] = 'index';
        } elseif (is_archive()) {
            $templates[] = get_post_type();
            $templates[] = 'archive';
            $templates[] = 'index';
        } elseif (is_search()) {
            $templates[] = 'search';
            $templates[] = 'index';
        } elseif (is_404()) {
            $templates[] = '404';
            $templates[] = 'index';
        } else {
            $templates[] = 'index';
        }

        return $templates;
    }

    /**
     * Get cache key for template.
     *
     * @param  string  $template
     * @param  array  $variables
     * @return string
     */
    protected function getCacheKey($template, $variables)
    {
        return md5($template . serialize($variables) . $this->currentEngine);
    }

    /**
     * Check if cache is enabled.
     *
     * @return bool
     */
    protected function isCacheEnabled()
    {
        return defined('JANKX_TEMPLATE_CACHE') && JANKX_TEMPLATE_CACHE;
    }

    /**
     * Clear template cache.
     *
     * @return void
     */
    public function clearCache()
    {
        $this->templateCache = [];
    }

    /**
     * Get available engines.
     *
     * @return array
     */
    public function getAvailableEngines()
    {
        return array_keys($this->engines);
    }

    /**
     * Check if engine is available.
     *
     * @param  string  $engine
     * @return bool
     */
    public function isEngineAvailable($engine)
    {
        return isset($this->engines[$engine]);
    }
}
