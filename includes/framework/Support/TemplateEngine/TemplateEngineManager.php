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
        // Debug: Log engine registration
        error_log("[TemplateEngineManager Debug] Starting engine registration");

        try {
            // Get engines from container instead of creating new instances
            error_log("[TemplateEngineManager Debug] Attempting to resolve template.engine.jankx");
            $this->engines['jankx'] = $this->app->make('template.engine.jankx');
            error_log("[TemplateEngineManager Debug] Successfully resolved template.engine.jankx: " . get_class($this->engines['jankx']));

            error_log("[TemplateEngineManager Debug] Attempting to resolve template.engine.plates");
            $this->engines['plates'] = $this->app->make('template.engine.plates');
            error_log("[TemplateEngineManager Debug] Successfully resolved template.engine.plates: " . get_class($this->engines['plates']));

            error_log("[TemplateEngineManager Debug] Engine registration completed. Available engines: " . implode(', ', array_keys($this->engines)));
        } catch (Exception $e) {
            error_log("[TemplateEngineManager Debug] Error during engine registration: " . $e->getMessage());
            error_log("[TemplateEngineManager Debug] Error trace: " . $e->getTraceAsString());
        }
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
