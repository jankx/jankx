<?php

namespace Jankx\Support\TemplateEngine;

use Jankx\Foundation\Application;

/**
 * Concrete Template Engine Manager
 *
 * Manages multiple template engines and provides a unified interface
 * for template rendering with caching and WordPress integration.
 *
 * @package Jankx\Support\TemplateEngine
 * @since 2.0.0
 */
class TemplateEngineManager extends Engine
{
    /**
     * Create a new template engine manager.
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
        // Get engines from container instead of creating new instances
        $this->engines['jankx'] = $this->app->make('template.engine.jankx');
        $this->engines['plates'] = $this->app->make('template.engine.plates');
    }

    /**
     * Get the engine name.
     *
     * @return string
     */
    public function getEngineName(): string
    {
        return 'TemplateEngineManager';
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

    /**
     * Get engine ID.
     *
     * @return string
     */
    public function getId(): string
    {
        return 'template-engine-manager';
    }
}
