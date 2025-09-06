<?php

namespace Jankx\Support\TemplateEngine\Contracts;

/**
 * Template Engine Interface
 *
 * Defines the contract for template engines in Jankx framework.
 *
 * @package Jankx\Support\TemplateEngine\Contracts
 * @since 2.0.0
 */
interface EngineInterface
{
    /**
     * Render template with variables.
     *
     * @param  string  $template
     * @param  array  $variables
     * @return string
     */
    public function render($template, $variables = []);

    /**
     * Check if template exists.
     *
     * @param  string  $template
     * @return bool
     */
    public function exists($template);

    /**
     * Get template path.
     *
     * @param  string  $template
     * @return string|null
     */
    public function getTemplatePath($template);

    /**
     * Get template directories.
     *
     * @return array
     */
    public function getTemplateDirectories();

    /**
     * Add template directory.
     *
     * @param  string  $directory
     * @param  string  $namespace
     * @return void
     */
    public function addTemplateDirectory($directory, $namespace = null);

    /**
     * Set template variables.
     *
     * @param  array  $variables
     * @return void
     */
    public function setVariables($variables);

    /**
     * Get template variables.
     *
     * @return array
     */
    public function getVariables();
}
