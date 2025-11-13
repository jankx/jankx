<?php

namespace Jankx\Support\TemplateEngine\Engines;

use Jankx\Facades\Log;
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
        parent::__construct($app);
        $this->setupPlates();
    }

    /**
     * Register available template engines.
     *
     * @return void
     */
    protected function registerEngines()
    {
        $this->engines['plates'] = $this;
        $this->currentEngine = 'plates';
    }

    /**
     * Get the engine name.
     *
     * @return string
     */
    public function getEngineName(): string
    {
        return 'Plates';
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

            // Add child theme directory for template override
            if (get_template_directory() !== get_stylesheet_directory()) {
                $childTemplateDir = implode(DIRECTORY_SEPARATOR, [get_stylesheet_directory(), 'views']);
                if (file_exists($childTemplateDir)) {
                    // Add child theme directory as override (higher priority)
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

        // Check child theme first
        if (get_template_directory() !== get_stylesheet_directory()) {
            $childTemplateDir = implode(DIRECTORY_SEPARATOR, [get_stylesheet_directory(), 'views']);
            if (file_exists($childTemplateDir)) {
                $childTemplatePath = implode(DIRECTORY_SEPARATOR, [$childTemplateDir, $template . '.php']);
                if (file_exists($childTemplatePath)) {

                    // Extract variables for template
                    extract($variables);

                    // Start output buffering
                    ob_start();
                    include $childTemplatePath;
                    $result = ob_get_clean();

                    return $result;
                }
            }
        }

        // Fallback to parent theme
        if (defined('WP_DEBUG') && WP_DEBUG) {
            // Get actual file path being loaded
            try {
                $templatePath = $this->plates->path($template);
            } catch (\Exception $e) {
                Log::debug("[PlatesEngine Debug] Could not resolve template path: " . $e->getMessage());
            }
        }

        $result = $this->plates->render($template, $variables);

        return $result;
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

        // Check child theme first if it exists
        if (get_template_directory() !== get_stylesheet_directory()) {
            $childTemplateDir = implode(DIRECTORY_SEPARATOR, [get_stylesheet_directory(), 'views']);
            if (file_exists($childTemplateDir)) {
                $childTemplatePath = implode(DIRECTORY_SEPARATOR, [$childTemplateDir, $template . '.php']);
                if (file_exists($childTemplatePath)) {
                    return true;
                }
            }
        }

        $exists = $this->plates->exists($template);

        if (defined('WP_DEBUG') && WP_DEBUG) {
            if ($exists) {
                try {
                    $templatePath = $this->plates->path($template);
                } catch (\Exception $e) {
                    Log::error("[PlatesEngine Debug] Error getting template path: " . $e->getMessage());
                }
            }
        }

        return $exists;
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

        $folders = $this->plates->getFolders();
        return is_array($folders) ? $folders : [];
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

    /**
     * Get available engines.
     *
     * @return array
     */
    public function getAvailableEngines()
    {
        return ['plates'];
    }

    /**
     * Check if engine is available.
     *
     * @param  string  $engine
     * @return bool
     */
    public function isEngineAvailable($engine)
    {
        return $engine === 'plates';
    }

    /**
     * Get engine ID.
     *
     * @return string
     */
    public function getId(): string
    {
        return 'plates';
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
        if ($this->plates && is_callable($callable)) {
            $this->plates->registerFunction($name, $callable);
        }
    }
}
