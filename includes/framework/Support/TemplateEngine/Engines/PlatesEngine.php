<?php

namespace Jankx\Support\TemplateEngine\Engines;

use Jankx\Foundation\Application;
use Jankx\Support\TemplateEngine\Engine;

/**
 * Plates Template Engine
 *
 * Integration with Plates template engine for advanced templating.
 *
 * @package Jankx\Support\TemplateEngine\Engines
 * @since 2.0.0
 */
class PlatesEngine extends Engine
{
    /**
     * The application instance.
     *
     * @var \Jankx\Foundation\Application
     */
    protected $app;

    /**
     * Plates engine instance.
     *
     * @var \League\Plates\Engine
     */
    protected $plates;

    /**
     * Template variables.
     *
     * @var array
     */
    protected $variables = [];

    /**
     * Create a new Plates engine.
     *
     * @param  \Jankx\Foundation\Application  $app
     * @return void
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->setupPlates();
    }

    /**
     * Setup Plates engine.
     *
     * @return void
     */
    protected function setupPlates()
    {
        if (class_exists('\League\Plates\Engine')) {
            $templateDir = implode(DIRECTORY_SEPARATOR, [get_template_directory(), 'views']);
            if (file_exists($templateDir)) {
                $this->plates = new \League\Plates\Engine($templateDir);
            }

            // Add child theme directory if exists
            if (get_template_directory() !== get_stylesheet_directory()) {
                $childTemplateDir = implode(DIRECTORY_SEPARATOR, [get_stylesheet_directory(), 'views']);
                if (file_exists($childTemplateDir)) {
                    $this->plates->addFolder('child', $childTemplateDir);
                }
            }
        }
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
        if (!$this->plates) {
            throw new \Exception('Plates engine not available');
        }

        $variables = array_merge($this->variables, $variables);

        return $this->plates->render($template, $variables);
    }

    /**
     * Check if template exists.
     *
     * @param  string  $template
     * @return bool
     */
    public function exists($template)
    {
        if (!$this->plates) {
            return false;
        }

        return $this->plates->exists($template);
    }

    /**
     * Get template path.
     *
     * @param  string  $template
     * @return string|null
     */
    public function getTemplatePath($template)
    {
        if (!$this->plates) {
            return null;
        }

        try {
            return $this->plates->path($template);
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get template directories.
     *
     * @return array
     */
    public function getTemplateDirectories()
    {
        if (!$this->plates) {
            return [];
        }

        return $this->plates->getFolders();
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
        if ($this->plates && is_dir($directory)) {
            if ($namespace) {
                $this->plates->addFolder($namespace, $directory);
            } else {
                $this->plates->setDirectory($directory);
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
}
