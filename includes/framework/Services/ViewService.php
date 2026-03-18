<?php

namespace Jankx\Services;

use Jankx\Foundation\Application;
use Exception;

/**
 * View Service
 * 
 * Handles template rendering with support for child theme overrides.
 * Replaces manual ob_start() / include logic with a clean object-oriented API.
 */
class ViewService
{
    /**
     * @var Application
     */
    protected $app;

    /**
     * @var array
     */
    protected $searchPaths = [];

    /**
     * Constructor
     * 
     * @param Application $app
     */
    public function __construct(Application $app)
    {
        $this->app = $app;
        $this->initDefaultPaths();
    }

    /**
     * Initialize default template search paths
     * 
     * Priority: Child Theme > Parent Theme > Framework
     */
    protected function initDefaultPaths(): void
    {
        // 1. Child Theme (if active)
        if (is_child_theme()) {
            $this->addPath(get_stylesheet_directory() . '/views');
            $this->addPath(get_stylesheet_directory() . '/templates');
        }

        // 2. Parent Theme
        $this->addPath(get_template_directory() . '/views');
        $this->addPath(get_template_directory() . '/templates');

        // 3. Framework defaults
        $this->addPath($this->app->basePath('includes/framework/Layouts/templates'));
    }

    /**
     * Add a custom search path
     * 
     * @param string $path
     * @param bool $prepend
     */
    public function addPath(string $path, bool $prepend = false): void
    {
        if (!is_dir($path)) {
            return;
        }

        if ($prepend) {
            array_unshift($this->searchPaths, $path);
        } else {
            $this->searchPaths[] = $path;
        }
    }

    /**
     * Render a view/template
     * 
     * @param string $view View name (e.g., 'post-layout/grid')
     * @param array $data Data to extract into the template
     * @param bool $echo Whether to output or return the HTML
     * @return string
     */
    public function render(string $view, array $data = [], bool $echo = false): string
    {
        $templateFile = $this->findTemplate($view);

        if (!$templateFile) {
            $error = sprintf('View template "%s" not found in search paths.', $view);
            if (defined('WP_DEBUG') && WP_DEBUG) {
                return "<!-- {$error} -->";
            }
            return '';
        }

        ob_start();
        extract($data, EXTR_SKIP);
        include $templateFile;
        $output = ob_get_clean();

        if ($echo) {
            echo $output;
        }

        return $output;
    }

    /**
     * Find the first matching template file in search paths
     * 
     * @param string $view
     * @return string|false
     */
    protected function findTemplate(string $view): ?string
    {
        $filename = ltrim($view, '/') . '.php';

        foreach ($this->searchPaths as $path) {
            $file = rtrim($path, '/') . '/' . $filename;
            if (file_exists($file)) {
                return $file;
            }
        }

        return null;
    }

    /**
     * Check if a view exists
     * 
     * @param string $view
     * @return bool
     */
    public function exists(string $view): bool
    {
        return $this->findTemplate($view) !== null;
    }
}
