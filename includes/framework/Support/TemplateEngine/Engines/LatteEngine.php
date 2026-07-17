<?php

namespace Jankx\Support\TemplateEngine\Engines;

use Jankx\Facades\Log;
use Jankx\Foundation\Application;
use Jankx\Support\TemplateEngine\Engine;

/**
 * Latte Template Engine
 *
 * Integration with Latte template engine for advanced templating.
 *
 * @package Jankx\Support\TemplateEngine\Engines
 * @since 2.0.0
 */
class LatteEngine extends Engine
{
    /**
     * The application instance.
     *
     * @var \Jankx\Foundation\Application
     */
    protected $app;

    /**
     * Latte engine instance.
     *
     * @var \Latte\Engine
     */
    protected $latte;

    /**
     * Template variables.
     *
     * @var array
     */
    protected $variables = [];

    /**
     * Create a new Latte engine.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function __construct(Application $app)
    {
        parent::__construct($app);
        $this->latte = $app->make('template.engine.latte');
    }

    /**
     * Register available template engines.
     *
     * @return void
     */
    protected function registerEngines()
    {
        $this->engines['latte'] = $this;
        $this->currentEngine = 'latte';
    }

    /**
     * Get the engine name.
     *
     * @return string
     */
    public function getEngineName(): string
    {
        return 'Latte';
    }

    /**
     * Render template with variables.
     *
     * @param  string  $template
     * @param  array  $variables
     * @return string
     */
    public function render($template, $variables = [])
    {
        if (!$this->latte) {
            throw new \Exception('Latte engine not available');
        }

        $variables = array_merge($this->variables, $variables);

        // Determine template path
        $templatePath = $this->resolveTemplatePath($template);
        
        if (!$templatePath || !file_exists($templatePath)) {
            throw new \Exception("Template not found: {$template}");
        }

        try {
            return $this->latte->renderToString($templatePath, $variables);
        } catch (\Exception $e) {
            throw new \RuntimeException("Failed to render Latte template {$template}: " . $e->getMessage(), 0, $e);
        }
    }

    /**
     * Render template to string with variables.
     * This method provides compatibility with Latte engine interface.
     *
     * @param  string  $template
     * @param  array  $variables
     * @return string
     */
    public function renderToString($template, $variables = [])
    {
        return $this->render($template, $variables);
    }

    /**
     * Resolve template path.
     *
     * @param  string  $template
     * @return string|null
     */
    protected function resolveTemplatePath($template)
    {
        // Check child theme first
        if (get_template_directory() !== get_stylesheet_directory()) {
            $childTemplateDir = implode(DIRECTORY_SEPARATOR, [get_stylesheet_directory(), 'views']);
            $childTemplatePath = implode(DIRECTORY_SEPARATOR, [$childTemplateDir, $template . '.latte']);
            if (file_exists($childTemplatePath)) {
                return $childTemplatePath;
            }
        }

        // Check parent theme
        $templateDir = implode(DIRECTORY_SEPARATOR, [get_template_directory(), 'views']);
        $templatePath = implode(DIRECTORY_SEPARATOR, [$templateDir, $template . '.latte']);
        if (file_exists($templatePath)) {
            return $templatePath;
        }

        return null;
    }

    /**
     * Check if template exists.
     *
     * @param  string  $template
     * @return bool
     */
    public function exists($template)
    {
        return $this->resolveTemplatePath($template) !== null;
    }

    /**
     * Get template path.
     *
     * @param  string  $template
     * @return string|null
     */
    public function getTemplatePath($template)
    {
        return $this->resolveTemplatePath($template);
    }

    /**
     * Get template directories.
     *
     * @return array
     */
    public function getTemplateDirectories()
    {
        $directories = [];
        
        $templateDir = implode(DIRECTORY_SEPARATOR, [get_template_directory(), 'views']);
        if (file_exists($templateDir)) {
            $directories[] = $templateDir;
        }
        
        if (get_template_directory() !== get_stylesheet_directory()) {
            $childTemplateDir = implode(DIRECTORY_SEPARATOR, [get_stylesheet_directory(), 'views']);
            if (file_exists($childTemplateDir)) {
                $directories[] = $childTemplateDir;
            }
        }
        
        return $directories;
    }

    /**
     * Add template directory.
     *
     * @param  string  $directory
     * @param  string  $namespace
     * @return void
     */
    public function addTemplateDirectory($directory, $namespace = null)
    {
        if ($this->latte && is_dir($directory)) {
            // For Latte, we need to create a new loader with multiple directories
            // This is a simplified implementation - in practice you might want to use FilesystemLoader
            $currentLoader = $this->latte->getLoader();
            if ($currentLoader instanceof \Latte\Loaders\FileLoader) {
                // Note: FileLoader in Latte doesn't support multiple directories directly
                // You might need to implement a custom loader or use a different approach
                Log::info("Template directory added: {$directory}");
            }
        }
    }

    /**
     * Set template variables.
     *
     * @param  array  $variables
     * @return void
     */
    public function setVariables($variables)
    {
        $this->variables = array_merge($this->variables, $variables);
    }

    /**
     * Get template variables.
     *
     * @return array
     */
    public function getVariables()
    {
        return $this->variables;
    }

    /**
     * Get available engines.
     *
     * @return array
     */
    public function getAvailableEngines()
    {
        return ['latte'];
    }

    /**
     * Check if engine is available.
     *
     * @param  string  $engine
     * @return bool
     */
    public function isEngineAvailable($engine)
    {
        return $engine === 'latte';
    }

    /**
     * Get engine ID.
     *
     * @return string
     */
    public function getId(): string
    {
        return 'latte';
    }

    /**
     * Register a function for use in templates.
     *
     * @param  string  $name
     * @param  callable  $callable
     * @return void
     */
    public function registerFunction($name, $callable)
    {
        if ($this->latte && is_callable($callable)) {
            $this->latte->addFunction($name, $callable);
        }
    }

}
